package api

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/omar-polo/naon-timeline/apps/backend/services/events"
	"github.com/omar-polo/naon-timeline/apps/backend/services/users"
	"github.com/stretchr/testify/require"
)

func newEventBody(t *testing.T) []byte {
	t.Helper()
	body, err := json.Marshal(Event{
		Draft: false,
		Coord: events.Coord{Lat: 1, Lng: 2},
		Title: "mw test event",
		Date:  time.Date(2020, time.January, 1, 0, 0, 0, 0, time.UTC),
		Text:  "text",
		Url:   "https://example.com",
		Image: "https://example.com/img.png",
	})
	require.NoError(t, err)
	return body
}

func TestRequireAuth(t *testing.T) {
	server := newtestserver(t)
	defer server.Close()

	t.Run("no cookie", func(t *testing.T) {
		req := httptest.NewRequest("POST", "/api/v1/events", bytes.NewReader(newEventBody(t)))
		res := simulate(server, req)
		require.Equal(t, 401, res.Code)
	})

	t.Run("unknown token", func(t *testing.T) {
		req := authed(
			httptest.NewRequest("POST", "/api/v1/events", bytes.NewReader(newEventBody(t))),
			&http.Cookie{Name: sessionCookieName, Value: "not-a-real-token"})
		res := simulate(server, req)
		require.Equal(t, 401, res.Code)
	})

	t.Run("valid session", func(t *testing.T) {
		session := newSession(t, server, users.RoleUser)
		req := authed(httptest.NewRequest("POST", "/api/v1/events", bytes.NewReader(newEventBody(t))), session)
		res := simulate(server, req)
		require.Equal(t, 200, res.Code)
	})
}

func TestRequireAdmin(t *testing.T) {
	server := newtestserver(t)
	defer server.Close()

	t.Run("no cookie", func(t *testing.T) {
		res := simulate(server, httptest.NewRequest("GET", "/api/v1/users", nil))
		require.Equal(t, 401, res.Code)
	})

	t.Run("non-admin session", func(t *testing.T) {
		session := newSession(t, server, users.RoleUser)
		res := simulate(server, authed(httptest.NewRequest("GET", "/api/v1/users", nil), session))
		require.Equal(t, 403, res.Code)
	})

	t.Run("admin session", func(t *testing.T) {
		admin := newSession(t, server, users.RoleAdmin)
		res := simulate(server, authed(httptest.NewRequest("GET", "/api/v1/users", nil), admin))
		require.Equal(t, 200, res.Code)
	})
}

func TestPublicRoutesUnaffected(t *testing.T) {
	server := newtestserver(t)
	defer server.Close()

	reqs := []*http.Request{
		httptest.NewRequest("GET", "/api/v1/", nil),
		httptest.NewRequest("GET", "/api/v1/events", nil),
		httptest.NewRequest("GET", "/api/v1/events/1", nil),
	}
	for _, req := range reqs {
		res := simulate(server, req)
		require.Equal(t, 200, res.Code, req.URL.Path)
	}
}
