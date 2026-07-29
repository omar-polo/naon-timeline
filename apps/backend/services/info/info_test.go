package info

import (
	"testing"

	bt "github.com/omar-polo/naon-timeline/apps/backend/testing"
	"github.com/stretchr/testify/require"
)

func TestStats(t *testing.T) {
	pool := bt.NewPool(t)
	defer func() { require.NoError(t, pool.Close(), "closing pool") }()

	conn := bt.Conn(t, pool)
	defer pool.Put(conn)

	info, err := Stats(conn)
	require.NoError(t, err)
	require.NotNil(t, info)
	require.NotZero(t, info.Events)
	require.NotZero(t, info.Drafts)
}
