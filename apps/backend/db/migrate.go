package db

import (
	"fmt"
	"io/fs"
	"path"
	"regexp"
	"slices"
	"strconv"

	"zombiezen.com/go/sqlite"
	"zombiezen.com/go/sqlite/sqlitex"
)

// migrationFilePattern matches files like "001-init-users-table.sql" -
// the leading number is the version it migrates the database to.
var migrationFilePattern = regexp.MustCompile(`^(\d+)-.*\.sql$`)

type migration struct {
	version int
	path    string
}

func curv(conn *sqlite.Conn) (current int, err error) {
	err = sqlitex.ExecuteTransient(conn, "PRAGMA user_version", &sqlitex.ExecOptions{
		ResultFunc: func(stmt *sqlite.Stmt) error {
			current = stmt.ColumnInt(0)
			return nil
		},
	})
	return
}

func migrate(conn *sqlite.Conn, vfs fs.ReadDirFS) error {
	migrations, err := loadMigrations(vfs)
	if err != nil {
		return err
	}

	current, err := curv(conn)
	if err != nil {
		return err
	}

	for _, m := range migrations {
		if m.version <= current {
			continue
		}

		if err := applyMigration(conn, vfs, m); err != nil {
			return err
		}
	}

	return nil
}

func applyMigration(conn *sqlite.Conn, vfs fs.ReadDirFS, m migration) (err error) {
	defer sqlitex.Transaction(conn)(&err)
	err = sqlitex.ExecuteScriptFS(conn, vfs, m.path, nil)
	if err != nil {
		return
	}

	// bump pragma
	query := fmt.Sprintf("PRAGMA user_version = %d", m.version)
	err = sqlitex.ExecuteTransient(conn, query, nil)

	return
}

func loadMigrations(vfs fs.ReadDirFS) ([]migration, error) {
	entries, err := vfs.ReadDir("migrations")
	if err != nil {
		return nil, fmt.Errorf("reading migrations: %w", err)
	}

	ret := make([]migration, 0, len(entries))
	for _, entry := range entries {
		if !entry.Type().IsRegular() {
			continue
		}

		match := migrationFilePattern.FindStringSubmatch(entry.Name())
		if match == nil {
			continue
		}

		version, err := strconv.Atoi(match[1])
		if err != nil {
			return nil, fmt.Errorf("parse version from %s: %w", entry.Name(), err)
		}

		ret = append(ret, migration{
			version: version,
			path:    path.Join("migrations", entry.Name()),
		})
	}

	slices.SortFunc(ret, func(a, b migration) int { return a.version - b.version })

	for i := 1; i < len(ret); i++ {
		if ret[i].version == ret[i-1].version {
			return nil, fmt.Errorf("duplicate migration version %d: %s and %s", ret[i].version, ret[i-1].path, ret[i].path)
		}
	}

	return ret, nil
}
