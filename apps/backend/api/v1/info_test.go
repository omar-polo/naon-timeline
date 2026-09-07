package api

import (
	"encoding/json"
	"net/http/httptest"
	"testing"

	"github.com/omar-polo/naon-timeline/apps/backend/services/users"
	"github.com/stretchr/testify/require"
)

func TestMe(t *testing.T) {
	server := newtestserver(t)
	defer server.Close()

	t.Run("no cookie", func(t *testing.T) {
		res := simulate(server, httptest.NewRequest("GET", "/api/v1/me", nil))
		require.Equal(t, 401, res.Code)
	})

	t.Run("valid session", func(t *testing.T) {
		session := newSession(t, server, users.RoleUser)
		res := simulate(server, authed(httptest.NewRequest("GET", "/api/v1/me", nil), session))
		require.Equal(t, 200, res.Code)
		require.NotContains(t, res.Body.String(), "password")

		var u User
		require.NoError(t, json.NewDecoder(res.Body).Decode(&u))
		require.Equal(t, "user-test@example.com", u.Email)
		require.Equal(t, users.RoleUser, u.Role)
	})
}
