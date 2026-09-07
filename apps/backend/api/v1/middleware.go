package api

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/omar-polo/naon-timeline/apps/backend/services/sessions"
	"github.com/omar-polo/naon-timeline/apps/backend/services/users"
)

type contextKey int

const userContextKey contextKey = 0

// contextUser returns the user attached by requireAuth, or nil.
func contextUser(ctx context.Context) *users.User {
	u, _ := ctx.Value(userContextKey).(*users.User)
	return u
}

func writeError(w http.ResponseWriter, status int, msg string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(map[string]string{"error": msg})
}

// requireAuth rejects requests without a valid session cookie, otherwise
// attaches the session's user to the request context.
func (s *Server) requireAuth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		cookie, err := r.Cookie(sessionCookieName)
		if err != nil {
			writeError(w, http.StatusUnauthorized, "unauthorized")
			return
		}

		conn, err := s.pool.Take(r.Context())
		if err != nil {
			writeError(w, http.StatusInternalServerError, "internal error")
			return
		}
		u, err := sessions.Validate(conn, cookie.Value)
		s.pool.Put(conn)
		if err != nil {
			writeError(w, http.StatusInternalServerError, "internal error")
			return
		}
		if u == nil {
			writeError(w, http.StatusUnauthorized, "unauthorized")
			return
		}

		ctx := context.WithValue(r.Context(), userContextKey, u)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

// requireAdmin rejects requests whose user (attached by requireAuth,
// which must run first) isn't an admin.
func (s *Server) requireAdmin(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if u := contextUser(r.Context()); u == nil || u.Role != users.RoleAdmin {
			writeError(w, http.StatusForbidden, "forbidden")
			return
		}
		next.ServeHTTP(w, r)
	})
}
