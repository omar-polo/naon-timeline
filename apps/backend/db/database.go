package db

import (
	"embed"
	"fmt"
	"io/fs"

	"zombiezen.com/go/sqlite"
	"zombiezen.com/go/sqlite/sqlitex"
)

//go:embed migrations/*.sql
var migrations embed.FS

// Open opens the SQLite database at dsn and applies any pending
// migrations from the `migrations` directory before returning.
func Open(dsn string) (*sqlitex.Pool, error) {
	return openpool(dsn, migrations)
}

func openpool(dsn string, vfs fs.ReadDirFS) (*sqlitex.Pool, error) {
	conn, err := sqlite.OpenConn(dsn, sqlite.OpenReadWrite, sqlite.OpenCreate)
	if err != nil {
		return nil, fmt.Errorf("open %s: %w", dsn, err)
	}

	if err := migrate(conn, vfs); err != nil {
		conn.Close()
		return nil, fmt.Errorf("migrate: %w", err)
	}

	if err := conn.Close(); err != nil {
		return nil, fmt.Errorf("failed to close connection: %w", err)
	}

	dbpool, err := sqlitex.NewPool(dsn, sqlitex.PoolOptions{})
	if err != nil {
		return nil, fmt.Errorf("failed to open pool: %w", err)
	}

	return dbpool, nil
}
