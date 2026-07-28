package db

import (
	"path/filepath"
	"testing"
	"testing/fstest"

	"github.com/stretchr/testify/require"
	"zombiezen.com/go/sqlite/sqlitex"
)

func TestOpenAppliesMigrationsInOrder(t *testing.T) {
	fsys := &fstest.MapFS{
		"migrations/002-add-title.sql": &fstest.MapFile{
			Data: []byte("alter table widgets add column title text;"),
			Mode: 0644,
		},
		"migrations/001-add-widgets.sql": &fstest.MapFile{
			Data: []byte("create table widgets (id integer primary key);"),
			Mode: 0644,
		},
	}

	pool, err := openpool(filepath.Join(t.TempDir(), "test.db"), fsys)
	require.NoError(t, err)
	require.NotNil(t, pool)
	defer func() { require.NoError(t, pool.Close()) }()

	conn, err := pool.Take(t.Context())
	require.NoError(t, err)
	require.NotNil(t, conn)
	defer pool.Put(conn)

	// check that the version is expected
	version, err := curv(conn)
	require.NoError(t, err)
	require.Equal(t, 2, version, "unexpected PRAGMA user_version")

	// check that the table is actually there
	err = sqlitex.ExecuteTransient(conn, `INSERT INTO widgets (id, title) VALUES (1, 'hello')`, nil)
	require.NoError(t, err)
}

func TestOpenSkipsAlreadyAppliedMigrations(t *testing.T) {
	fsys := &fstest.MapFS{
		"migrations/001-add-widgets.sql": &fstest.MapFile{
			Data: []byte("create table widgets (id integer primary key);"),
			Mode: 0644,
		},
	}

	dbPath := filepath.Join(t.TempDir(), "test.db")

	open := func() *sqlitex.Pool {
		pool, err := openpool(dbPath, fsys)
		require.NoError(t, err)
		require.NotNil(t, pool)
		return pool
	}

	// open the pool once, this should run the migrations
	pool := open()
	require.NoError(t, pool.Close())

	// A migration that would fail if re-applied (table already exists) -
	// proves re-opening doesn't try to run it again.
	pool = open()
	defer func() { require.NoError(t, pool.Close()) }()

	conn, err := pool.Take(t.Context())
	require.NoError(t, err)
	require.NotNil(t, conn)
	defer pool.Put(conn)

	version, err := curv(conn)
	require.NoError(t, err)
	require.Equal(t, 1, version, "unexpected PRAGMA user_version")
}

func TestOpenRejectsDuplicateVersions(t *testing.T) {
	fsys := &fstest.MapFS{
		"migrations/001-add-table-a.sql": &fstest.MapFile{
			Data: []byte("create table a (id integer primary key);"),
			Mode: 0644,
		},
		"migrations/001-add-table-b.sql": &fstest.MapFile{
			Data: []byte("create table b (id integer primary key);"),
			Mode: 0644,
		},
	}

	pool, err := openpool(filepath.Join(t.TempDir(), "test.db"), fsys)
	require.Nil(t, pool)
	require.Error(t, err)
	require.Contains(t, err.Error(), "duplicate")
}
