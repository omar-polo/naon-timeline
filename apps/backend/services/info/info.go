package info

import (
	"zombiezen.com/go/sqlite"
	"zombiezen.com/go/sqlite/sqlitex"
)

type Info struct {
	Users  int `json:"users"`
	Events int `json:"events"`
	Drafts int `json:"drafts"`
}

func Stats(conn *sqlite.Conn) (*Info, error) {
	var (
		info Info
		err  error
	)

	err = sqlitex.Execute(conn, `select count(*) as t from events`, &sqlitex.ExecOptions{
		ResultFunc: func(stmt *sqlite.Stmt) error {
			info.Events = int(stmt.GetInt64("t"))
			return nil
		},
	})
	if err != nil {
		return nil, err
	}

	err = sqlitex.Execute(conn, `select count(*) as t from events where draft`, &sqlitex.ExecOptions{
		ResultFunc: func(stmt *sqlite.Stmt) error {
			info.Drafts = int(stmt.GetInt64("t"))
			return nil
		},
	})
	if err != nil {
		return nil, err
	}

	return &info, nil
}
