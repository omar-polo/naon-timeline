package api

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/omar-polo/naon-timeline/apps/backend/services/events"
	"github.com/stretchr/testify/require"
)

func TestEventsList(t *testing.T) {
	server := newtestserver(t)
	defer server.Close()

	t.Run("list non-drafts events by default", func(t *testing.T) {
		res := simulate(server, httptest.NewRequest("GET", "/api/v1/events", nil))
		require.Equal(t, 200, res.Code)

		var evs []Event
		err := json.NewDecoder(res.Body).Decode(&evs)
		require.NoError(t, err)

		for _, ev := range evs {
			require.False(t, ev.Draft, "found a draft event %d (%v)", ev.Id, ev.Title)
		}
	})

	t.Run("can exclude drafts if told so", func(t *testing.T) {
		res := simulate(server, httptest.NewRequest("GET", "/api/v1/events?include-drafts=true", nil))
		require.Equal(t, 200, res.Code)

		var evs []Event
		err := json.NewDecoder(res.Body).Decode(&evs)
		require.NoError(t, err)

		var drafts, published int
		for _, ev := range evs {
			if ev.Draft {
				drafts++
			} else {
				published++
			}
		}
		require.NotZero(t, drafts, "does not contains draft events")
		require.NotZero(t, published, "does not contains published events")
	})

	t.Run("fails with a bad value for include-drafts", func(t *testing.T) {
		res := simulate(server, httptest.NewRequest("GET", "/api/v1/events?include-drafts=notabool", nil))
		require.Equal(t, 400, res.Code)
	})
}

func TestEventsGet(t *testing.T) {
	server := newtestserver(t)
	defer server.Close()

	t.Run("event exists", func(t *testing.T) {
		res := simulate(server, httptest.NewRequest("GET", "/api/v1/events/1", nil))
		require.Equal(t, 200, res.Code)

		var ev Event
		err := json.NewDecoder(res.Body).Decode(&ev)
		require.NoError(t, err)
		require.Equal(t, int64(1), ev.Id, "event id mismatch")
	})

	t.Run("non-existant id", func(t *testing.T) {
		res := simulate(server, httptest.NewRequest("GET", "/api/v1/events/999", nil))
		require.Equal(t, 404, res.Code)
	})

	t.Run("invalid id", func(t *testing.T) {
		res := simulate(server, httptest.NewRequest("GET", "/api/v1/events/pizza", nil))
		require.Equal(t, 404, res.Code)
	})
}

func TestEventsNew(t *testing.T) {
	server := newtestserver(t)
	defer server.Close()

	newEv := Event{
		Draft: false,
		Coord: events.Coord{Lat: 45.95, Lng: 12.65},
		Title: "New event",
		Date:  time.Date(2020, time.January, 1, 0, 0, 0, 0, time.UTC),
		Text:  "some text",
		Url:   "https://example.com",
		Image: "https://example.com/img.png",
	}
	body, err := json.Marshal(newEv)
	require.NoError(t, err)

	req := httptest.NewRequest("POST", "/api/v1/events", bytes.NewReader(body))
	res := simulate(server, req)
	require.Equal(t, 200, res.Code)

	var ev Event
	require.NoError(t, json.NewDecoder(res.Body).Decode(&ev))
	require.NotZero(t, ev.Id)
	require.Equal(t, "New event", ev.Title)

	getRes := simulate(server, httptest.NewRequest("GET", fmt.Sprintf("/api/v1/events/%d", ev.Id), nil))
	require.Equal(t, 200, getRes.Code)

	var ev2 Event
	require.NoError(t, json.NewDecoder(getRes.Body).Decode(&ev2))
	require.Equal(t, ev, ev2)
}

func TestEventsUpdate(t *testing.T) {
	server := newtestserver(t)
	defer server.Close()

	t.Run("normal update", func(t *testing.T) {
		updatedEv := Event{
			Draft: true,
			Coord: events.Coord{Lat: 1, Lng: 2},
			Title: "Updated title",
			Date:  time.Date(1999, time.December, 31, 0, 0, 0, 0, time.UTC),
			Text:  "updated text",
			Url:   "https://example.com/updated",
			Image: "https://example.com/updated.png",
		}
		body, err := json.Marshal(updatedEv)
		require.NoError(t, err)

		req := httptest.NewRequest("PUT", "/api/v1/events/1", bytes.NewReader(body))
		res := simulate(server, req)
		require.Equal(t, 200, res.Code)

		var ev Event
		require.NoError(t, json.NewDecoder(res.Body).Decode(&ev))
		require.Equal(t, int64(1), ev.Id)
		require.Equal(t, "Updated title", ev.Title)

		getRes := simulate(server, httptest.NewRequest("GET", "/api/v1/events/1", nil))
		require.Equal(t, 200, getRes.Code)

		var got Event
		require.NoError(t, json.NewDecoder(getRes.Body).Decode(&got))
		require.Equal(t, "Updated title", got.Title)
	})

	t.Run("bad id", func(t *testing.T) {
		res := simulate(server, httptest.NewRequest("PUT", "/api/v1/events/notanumber", nil))
		require.Equal(t, 404, res.Code)
	})
}

func TestEventsDelete(t *testing.T) {
	server := newtestserver(t)
	defer server.Close()

	t.Run("normal delete", func(t *testing.T) {
		res := simulate(server, httptest.NewRequest("DELETE", "/api/v1/events/1", nil))
		require.Equal(t, 200, res.Code)

		getRes := simulate(server, httptest.NewRequest("GET", "/api/v1/events/1", nil))
		require.Equal(t, 404, getRes.Code)
	})

	t.Run("bad id", func(t *testing.T) {
		res := simulate(server, httptest.NewRequest("DELETE", "/api/v1/events/notanumber", nil))
		require.Equal(t, 404, res.Code)
	})
}
