package api

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/omar-polo/naon-timeline/apps/backend/services/sessions"
	"github.com/omar-polo/naon-timeline/apps/backend/services/users"
	"github.com/stretchr/testify/require"
)

func createTestUser(t *testing.T, server *Server, email, password string, status users.Status) *users.User {
	t.Helper()

	conn, err := server.pool.Take(context.Background())
	require.NoError(t, err)
	defer server.pool.Put(conn)

	u, err := users.New(conn, &users.User{
		Email:  email,
		Name:   "Test User",
		Role:   users.RoleUser,
		Status: status,
	}, password)
	require.NoError(t, err)
	return u
}

func findCookie(res *httptest.ResponseRecorder, name string) *http.Cookie {
	for _, c := range res.Result().Cookies() {
		if c.Name == name {
			return c
		}
	}
	return nil
}

func TestLogin(t *testing.T) {
	server := newtestserver(t)
	defer server.Close()

	createTestUser(t, server, "login@example.com", "hunter2", users.StatusActive)

	t.Run("correct credentials", func(t *testing.T) {
		body, err := json.Marshal(LoginRequest{Email: "login@example.com", Password: "hunter2"})
		require.NoError(t, err)

		res := simulate(server, httptest.NewRequest("POST", "/api/v1/login", bytes.NewReader(body)))
		require.Equal(t, 200, res.Code)

		cookie := findCookie(res, sessionCookieName)
		require.NotNil(t, cookie)
		require.True(t, cookie.HttpOnly)
		require.True(t, cookie.Secure)
		require.Equal(t, http.SameSiteLaxMode, cookie.SameSite)
		require.NotEmpty(t, cookie.Value)

		conn, err := server.pool.Take(context.Background())
		require.NoError(t, err)
		defer server.pool.Put(conn)

		u, err := sessions.Validate(conn, cookie.Value)
		require.NoError(t, err)
		require.NotNil(t, u)
		require.Equal(t, "login@example.com", u.Email)
	})

	t.Run("wrong password", func(t *testing.T) {
		body, err := json.Marshal(LoginRequest{Email: "login@example.com", Password: "wrong"})
		require.NoError(t, err)

		res := simulate(server, httptest.NewRequest("POST", "/api/v1/login", bytes.NewReader(body)))
		require.Equal(t, 401, res.Code)
	})

	t.Run("unknown email", func(t *testing.T) {
		body, err := json.Marshal(LoginRequest{Email: "nobody@example.com", Password: "hunter2"})
		require.NoError(t, err)

		res := simulate(server, httptest.NewRequest("POST", "/api/v1/login", bytes.NewReader(body)))
		require.Equal(t, 401, res.Code)
	})

	t.Run("disabled user", func(t *testing.T) {
		createTestUser(t, server, "disabled@example.com", "hunter2", users.StatusDisabled)

		body, err := json.Marshal(LoginRequest{Email: "disabled@example.com", Password: "hunter2"})
		require.NoError(t, err)

		res := simulate(server, httptest.NewRequest("POST", "/api/v1/login", bytes.NewReader(body)))
		require.Equal(t, 401, res.Code)
	})
}

func TestLogout(t *testing.T) {
	server := newtestserver(t)
	defer server.Close()

	t.Run("with a session", func(t *testing.T) {
		u := createTestUser(t, server, "logout@example.com", "hunter2", users.StatusActive)

		conn, err := server.pool.Take(context.Background())
		require.NoError(t, err)
		token, err := sessions.New(conn, u.Id)
		require.NoError(t, err)
		server.pool.Put(conn)

		req := httptest.NewRequest("POST", "/api/v1/logout", nil)
		req.AddCookie(&http.Cookie{Name: sessionCookieName, Value: token})
		res := simulate(server, req)
		require.Equal(t, 200, res.Code)

		cookie := findCookie(res, sessionCookieName)
		require.NotNil(t, cookie)
		require.Less(t, cookie.MaxAge, 0)

		conn, err = server.pool.Take(context.Background())
		require.NoError(t, err)
		defer server.pool.Put(conn)

		validated, err := sessions.Validate(conn, token)
		require.NoError(t, err)
		require.Nil(t, validated)
	})

	t.Run("without a session", func(t *testing.T) {
		res := simulate(server, httptest.NewRequest("POST", "/api/v1/logout", nil))
		require.Equal(t, 200, res.Code)
	})
}
