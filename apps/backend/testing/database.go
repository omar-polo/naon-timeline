package testing

import (
	_ "embed"
	"errors"
	"path/filepath"
	"testing"

	"github.com/omar-polo/naon-timeline/apps/backend/db"
	"github.com/stretchr/testify/require"
	"zombiezen.com/go/sqlite"
	"zombiezen.com/go/sqlite/sqlitex"
)

//go:embed events-fixture.sql
var eventsFixtures []byte

//go:embed users-fixture.sql
var usersFixtures []byte

func NewPool(t *testing.T) *sqlitex.Pool {
	pool, err := db.Open(filepath.Join(t.TempDir(), "db.sqlite3"))
	require.NoError(t, err)
	require.NotNil(t, pool)

	conn, err := pool.Take(t.Context())
	require.NoError(t, err)
	defer pool.Put(conn)

	err = sqlitex.ExecuteScript(conn, string(eventsFixtures), nil)
	require.NoError(t, err)

	err = sqlitex.ExecuteScript(conn, string(usersFixtures), nil)
	require.NoError(t, err)

	return pool
}

func Conn(t *testing.T, pool *sqlitex.Pool) *sqlite.Conn {
	conn, err := pool.Take(t.Context())
	require.NoError(t, err)
	require.NotNil(t, conn)
	return conn
}

// just for automatic rollback
var knownError = errors.New("known error")

func AutoRolloutSavepoint(t *testing.T, conn *sqlite.Conn) func() {
	endfn := sqlitex.Save(conn)
	return func() { endfn(&knownError) }
}
