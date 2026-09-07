package api

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/omar-polo/naon-timeline/apps/backend/services/sessions"
	"github.com/omar-polo/naon-timeline/apps/backend/services/users"
	bt "github.com/omar-polo/naon-timeline/apps/backend/testing"
	"github.com/stretchr/testify/require"
)

func newtestserver(t *testing.T) *Server {
	pool := bt.NewPool(t)
	server := NewServer(pool)
	require.NotNil(t, server)
	return server
}

func simulate(s *Server, req *http.Request) *httptest.ResponseRecorder {
	w := httptest.NewRecorder()
	s.Mux.ServeHTTP(w, req)
	return w
}

func authed(req *http.Request, cookie *http.Cookie) *http.Request {
	req.AddCookie(cookie)
	return req
}

// newSession creates a user with the given role and returns a cookie
// logging them in, for tests exercising authenticated/admin routes.
func newSession(t *testing.T, server *Server, role users.Role) *http.Cookie {
	t.Helper()

	conn, err := server.pool.Take(t.Context())
	require.NoError(t, err)
	defer server.pool.Put(conn)

	u, err := users.New(conn, &users.User{
		Email:  role + "-test@example.com",
		Name:   "Test " + role,
		Role:   role,
		Status: users.StatusActive,
	}, "hunter2")
	require.NoError(t, err)

	token, err := sessions.New(conn, u.Id)
	require.NoError(t, err)

	return &http.Cookie{Name: sessionCookieName, Value: token}
}

func TestNewServer(t *testing.T) {
	pool := bt.NewPool(t)
	defer func() { require.NoError(t, pool.Close(), "closing pool") }()

	server := NewServer(pool)
	require.NotNil(t, server)
}

func TestNewServerNoPool(t *testing.T) {
	server := NewServer(nil)
	require.NotNil(t, server)
}
