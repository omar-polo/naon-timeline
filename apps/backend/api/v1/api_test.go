package api

import (
	"testing"

	bt "github.com/omar-polo/naon-timeline/apps/backend/testing"
	"github.com/stretchr/testify/require"
)

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
