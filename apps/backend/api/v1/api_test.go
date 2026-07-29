package api

import (
	"net/http"
	"net/http/httptest"
	"testing"

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
