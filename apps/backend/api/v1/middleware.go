package api

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"

	"github.com/omar-polo/naon-timeline/apps/backend/services/sessions"
	"github.com/omar-polo/naon-timeline/apps/backend/services/users"
)

type contextKey int

const userContextKey contextKey = 0

var (
	ErrNoAuth = errors.New("not authenticated")
)

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

func (s *Server) authenticated(r *http.Request) (*users.User, error) {
	cookie, err := r.Cookie(sessionCookieName)
	if err != nil {
		return nil, ErrNoAuth
	}

	conn, err := s.pool.Take(r.Context())
	if err != nil {
		return nil, err
	}

	u, err := sessions.Validate(conn, cookie.Value)
	s.pool.Put(conn)
	if err != nil {
		return nil, err
	}

	return u, nil
}

// optionalAuth sets the context user if the user is logged but
// doesn't prevent the controller to run.
func (s *Server) optionalAuth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		u, err := s.authenticated(r)
		if errors.Is(err, ErrNoAuth) {
			err = nil
		}
		if err != nil {
			writeError(w, http.StatusInternalServerError, "internal error")
			return
		}
		if u != nil {
			r = r.WithContext(context.WithValue(r.Context(), userContextKey, u))
		}
		next.ServeHTTP(w, r)
	})
}

// requireAuth rejects requests without a valid session cookie, otherwise
// attaches the session's user to the request context.
func (s *Server) requireAuth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		u, err := s.authenticated(r)
		if err != nil {
			if errors.Is(err, ErrNoAuth) {
				writeError(w, http.StatusUnauthorized, "unauthorized")
				return
			}
			writeError(w, http.StatusInternalServerError, "internal error")
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
