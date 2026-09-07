package sessions

import (
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"time"

	"github.com/omar-polo/naon-timeline/apps/backend/services/users"
	"zombiezen.com/go/sqlite"
	"zombiezen.com/go/sqlite/sqlitex"
)

const (
	timeLayout = time.RFC3339

	// Duration is the fixed session lifetime.
	Duration = 7 * 24 * time.Hour
)

func hashToken(token string) string {
	sum := sha256.Sum256([]byte(token))
	return hex.EncodeToString(sum[:])
}

// New creates a session for userId and returns the raw token.
func New(conn *sqlite.Conn, userId int64) (string, error) {
	token := rand.Text()

	now := time.Now().UTC()
	query := `
insert into sessions ( token_hash,  user_id,  created,  expires)
              values ($token_hash, $user_id, $created, $expires)
`
	err := sqlitex.Execute(conn, query, &sqlitex.ExecOptions{
		Named: map[string]any{
			"$token_hash": hashToken(token),
			"$user_id":    userId,
			"$created":    now.Format(timeLayout),
			"$expires":    now.Add(Duration).Format(timeLayout),
		},
	})
	if err != nil {
		return "", err
	}

	return token, nil
}

// Validate returns the user owning token, or nil if missing or expired.
func Validate(conn *sqlite.Conn, token string) (*users.User, error) {
	query := `select user_id from sessions where token_hash = $token_hash and expires > $now`

	var userId int64
	var found bool
	err := sqlitex.Execute(conn, query, &sqlitex.ExecOptions{
		Named: map[string]any{
			"$token_hash": hashToken(token),
			"$now":        time.Now().UTC().Format(timeLayout),
		},
		ResultFunc: func(stmt *sqlite.Stmt) error {
			userId = stmt.GetInt64("user_id")
			found = true
			return nil
		},
	})
	if err != nil {
		return nil, err
	}
	if !found {
		return nil, nil
	}

	return users.Get(conn, userId)
}

// Delete removes the session for token, if any.
func Delete(conn *sqlite.Conn, token string) error {
	query := `delete from sessions where token_hash = $token_hash`
	return sqlitex.Execute(conn, query, &sqlitex.ExecOptions{
		Named: map[string]any{"$token_hash": hashToken(token)},
	})
}
