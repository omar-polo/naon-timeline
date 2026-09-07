package api

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/omar-polo/naon-timeline/apps/backend/services/users"
	"github.com/stretchr/testify/require"
)

func TestUsersList(t *testing.T) {
	server := newtestserver(t)
	defer server.Close()
	admin := newSession(t, server, users.RoleAdmin)

	res := simulate(server, authed(httptest.NewRequest("GET", "/api/v1/users", nil), admin))
	require.Equal(t, 200, res.Code)

	require.NotContains(t, res.Body.String(), "password")

	var us []User
	require.NoError(t, json.NewDecoder(res.Body).Decode(&us))
	require.NotEmpty(t, us)
}

func TestUsersGet(t *testing.T) {
	server := newtestserver(t)
	defer server.Close()
	admin := newSession(t, server, users.RoleAdmin)

	t.Run("user exists", func(t *testing.T) {
		res := simulate(server, authed(httptest.NewRequest("GET", "/api/v1/users/1", nil), admin))
		require.Equal(t, 200, res.Code)
		require.NotContains(t, res.Body.String(), "password")

		var u User
		require.NoError(t, json.NewDecoder(res.Body).Decode(&u))
		require.Equal(t, int64(1), u.Id)
	})

	t.Run("non-existant id", func(t *testing.T) {
		res := simulate(server, authed(httptest.NewRequest("GET", "/api/v1/users/999", nil), admin))
		require.Equal(t, 404, res.Code)
	})

	t.Run("invalid id", func(t *testing.T) {
		res := simulate(server, authed(httptest.NewRequest("GET", "/api/v1/users/pizza", nil), admin))
		require.Equal(t, 404, res.Code)
	})
}

func TestUsersNew(t *testing.T) {
	server := newtestserver(t)
	defer server.Close()
	admin := newSession(t, server, users.RoleAdmin)

	t.Run("normal create", func(t *testing.T) {
		body, err := json.Marshal(NewUserRequest{
			Email:    "new-user@example.com",
			Name:     "New User",
			Role:     "user",
			Password: "hunter2",
		})
		require.NoError(t, err)

		req := authed(httptest.NewRequest("POST", "/api/v1/users", bytes.NewReader(body)), admin)
		res := simulate(server, req)
		require.Equal(t, 200, res.Code)
		require.NotContains(t, strings.ToLower(res.Body.String()), "password")

		var u User
		require.NoError(t, json.NewDecoder(res.Body).Decode(&u))
		require.NotZero(t, u.Id)
		require.Equal(t, "new-user@example.com", u.Email)
		require.Equal(t, "active", u.Status)

		getRes := simulate(server, authed(httptest.NewRequest("GET", fmt.Sprintf("/api/v1/users/%d", u.Id), nil), admin))
		require.Equal(t, 200, getRes.Code)
	})

	t.Run("duplicate email", func(t *testing.T) {
		body, err := json.Marshal(NewUserRequest{
			Email:    "dup@example.com",
			Name:     "First",
			Role:     "user",
			Password: "hunter2",
		})
		require.NoError(t, err)
		res := simulate(server, authed(httptest.NewRequest("POST", "/api/v1/users", bytes.NewReader(body)), admin))
		require.Equal(t, 200, res.Code)

		res = simulate(server, authed(httptest.NewRequest("POST", "/api/v1/users", bytes.NewReader(body)), admin))
		require.Equal(t, 400, res.Code)
	})

	t.Run("missing password", func(t *testing.T) {
		body, err := json.Marshal(NewUserRequest{
			Email: "nopassword@example.com",
			Name:  "No Password",
			Role:  "user",
		})
		require.NoError(t, err)
		res := simulate(server, authed(httptest.NewRequest("POST", "/api/v1/users", bytes.NewReader(body)), admin))
		require.Equal(t, 400, res.Code)
	})

	t.Run("invalid role", func(t *testing.T) {
		body, err := json.Marshal(NewUserRequest{
			Email:    "badrole@example.com",
			Name:     "Bad Role",
			Role:     "superuser",
			Password: "hunter2",
		})
		require.NoError(t, err)
		res := simulate(server, authed(httptest.NewRequest("POST", "/api/v1/users", bytes.NewReader(body)), admin))
		require.Equal(t, 400, res.Code)
	})
}

func TestUsersUpdate(t *testing.T) {
	server := newtestserver(t)
	defer server.Close()
	admin := newSession(t, server, users.RoleAdmin)

	t.Run("normal update", func(t *testing.T) {
		updated := User{
			Email:  "sofia.ricci@example.com",
			Name:   "Sofia R.",
			Role:   "admin",
			Status: "disabled",
		}
		body, err := json.Marshal(updated)
		require.NoError(t, err)

		req := authed(httptest.NewRequest("PUT", "/api/v1/users/1", bytes.NewReader(body)), admin)
		res := simulate(server, req)
		require.Equal(t, 200, res.Code)

		var u User
		require.NoError(t, json.NewDecoder(res.Body).Decode(&u))
		require.Equal(t, int64(1), u.Id)
		require.Equal(t, "Sofia R.", u.Name)
		require.Equal(t, "disabled", u.Status)

		getRes := simulate(server, authed(httptest.NewRequest("GET", "/api/v1/users/1", nil), admin))
		require.Equal(t, 200, getRes.Code)

		var got User
		require.NoError(t, json.NewDecoder(getRes.Body).Decode(&got))
		require.Equal(t, "Sofia R.", got.Name)
	})

	t.Run("bad id", func(t *testing.T) {
		res := simulate(server, authed(httptest.NewRequest("PUT", "/api/v1/users/notanumber", nil), admin))
		require.Equal(t, 404, res.Code)
	})

	t.Run("cannot change own role", func(t *testing.T) {
		me := getMe(t, server, admin)

		updated := User{Email: me.Email, Name: me.Name, Role: "user", Status: me.Status}
		body, err := json.Marshal(updated)
		require.NoError(t, err)

		req := authed(httptest.NewRequest("PUT", "/api/v1/users/"+fmt.Sprint(me.Id), bytes.NewReader(body)), admin)
		res := simulate(server, req)
		require.Equal(t, 400, res.Code)
	})

	t.Run("cannot disable self", func(t *testing.T) {
		me := getMe(t, server, admin)

		updated := User{Email: me.Email, Name: me.Name, Role: me.Role, Status: "disabled"}
		body, err := json.Marshal(updated)
		require.NoError(t, err)

		req := authed(httptest.NewRequest("PUT", "/api/v1/users/"+fmt.Sprint(me.Id), bytes.NewReader(body)), admin)
		res := simulate(server, req)
		require.Equal(t, 400, res.Code)
	})

	t.Run("can update self without touching role or status", func(t *testing.T) {
		me := getMe(t, server, admin)

		updated := User{Email: me.Email, Name: "Updated Self Name", Role: me.Role, Status: me.Status}
		body, err := json.Marshal(updated)
		require.NoError(t, err)

		req := authed(httptest.NewRequest("PUT", "/api/v1/users/"+fmt.Sprint(me.Id), bytes.NewReader(body)), admin)
		res := simulate(server, req)
		require.Equal(t, 200, res.Code)

		var u User
		require.NoError(t, json.NewDecoder(res.Body).Decode(&u))
		require.Equal(t, "Updated Self Name", u.Name)
	})
}

func TestUsersSetPassword(t *testing.T) {
	server := newtestserver(t)
	defer server.Close()
	admin := newSession(t, server, users.RoleAdmin)

	t.Run("normal set", func(t *testing.T) {
		body, err := json.Marshal(SetPasswordRequest{Password: "new-password"})
		require.NoError(t, err)

		req := authed(httptest.NewRequest("POST", "/api/v1/users/1/password", bytes.NewReader(body)), admin)
		res := simulate(server, req)
		require.Equal(t, 200, res.Code)
	})

	t.Run("empty password", func(t *testing.T) {
		body, err := json.Marshal(SetPasswordRequest{Password: ""})
		require.NoError(t, err)

		req := authed(httptest.NewRequest("POST", "/api/v1/users/1/password", bytes.NewReader(body)), admin)
		res := simulate(server, req)
		require.Equal(t, 400, res.Code)
	})

	t.Run("bad id", func(t *testing.T) {
		res := simulate(server, authed(httptest.NewRequest("POST", "/api/v1/users/notanumber/password", nil), admin))
		require.Equal(t, 404, res.Code)
	})
}

func TestUsersDelete(t *testing.T) {
	server := newtestserver(t)
	defer server.Close()
	admin := newSession(t, server, users.RoleAdmin)

	t.Run("normal delete", func(t *testing.T) {
		res := simulate(server, authed(httptest.NewRequest("DELETE", "/api/v1/users/1", nil), admin))
		require.Equal(t, 200, res.Code)

		getRes := simulate(server, authed(httptest.NewRequest("GET", "/api/v1/users/1", nil), admin))
		require.Equal(t, 404, getRes.Code)
	})

	t.Run("bad id", func(t *testing.T) {
		res := simulate(server, authed(httptest.NewRequest("DELETE", "/api/v1/users/notanumber", nil), admin))
		require.Equal(t, 404, res.Code)
	})

	t.Run("cannot delete yourself", func(t *testing.T) {
		me := getMe(t, server, admin)

		res := simulate(server, authed(httptest.NewRequest("DELETE", "/api/v1/users/"+fmt.Sprint(me.Id), nil), admin))
		require.Equal(t, 400, res.Code)
	})
}
