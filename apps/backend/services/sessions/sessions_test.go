package sessions

import (
	"testing"
	"time"

	"github.com/omar-polo/naon-timeline/apps/backend/services/users"
	bt "github.com/omar-polo/naon-timeline/apps/backend/testing"
	"github.com/stretchr/testify/require"
	"zombiezen.com/go/sqlite"
	"zombiezen.com/go/sqlite/sqlitex"
)

func newTestUser(t *testing.T, conn *sqlite.Conn, email string) *users.User {
	t.Helper()

	u, err := users.New(conn, &users.User{
		Email:  email,
		Name:   "Test User",
		Role:   users.RoleUser,
		Status: users.StatusActive,
	}, "hunter2")
	require.NoError(t, err)
	return u
}

func TestSessions(t *testing.T) {
	pool := bt.NewPool(t)
	defer func() { require.NoError(t, pool.Close(), "closing pool") }()

	t.Run("TestNewValidate", func(t *testing.T) {
		conn := bt.Conn(t, pool)
		defer pool.Put(conn)
		defer bt.AutoRolloutSavepoint(t, conn)()

		u := newTestUser(t, conn, "session@example.com")

		token, err := New(conn, u.Id)
		require.NoError(t, err)
		require.NotEmpty(t, token)

		validated, err := Validate(conn, token)
		require.NoError(t, err)
		require.NotNil(t, validated)
		require.Equal(t, u.Id, validated.Id)
	})

	t.Run("TestValidateUnknown", func(t *testing.T) {
		conn := bt.Conn(t, pool)
		defer pool.Put(conn)
		defer bt.AutoRolloutSavepoint(t, conn)()

		validated, err := Validate(conn, "not-a-real-token")
		require.NoError(t, err)
		require.Nil(t, validated)
	})

	t.Run("TestValidateExpired", func(t *testing.T) {
		conn := bt.Conn(t, pool)
		defer pool.Put(conn)
		defer bt.AutoRolloutSavepoint(t, conn)()

		u := newTestUser(t, conn, "expired@example.com")

		token, err := New(conn, u.Id)
		require.NoError(t, err)

		// force expiry into the past directly, bypassing New's fixed duration
		err = sqlitex.Execute(conn, `update sessions set expires = $expires where token_hash = $token_hash`, &sqlitex.ExecOptions{
			Named: map[string]any{
				"$expires":    time.Now().UTC().Add(-time.Hour).Format(timeLayout),
				"$token_hash": hashToken(token),
			},
		})
		require.NoError(t, err)

		validated, err := Validate(conn, token)
		require.NoError(t, err)
		require.Nil(t, validated)
	})

	t.Run("TestDelete", func(t *testing.T) {
		conn := bt.Conn(t, pool)
		defer pool.Put(conn)
		defer bt.AutoRolloutSavepoint(t, conn)()

		u := newTestUser(t, conn, "delete-session@example.com")

		token, err := New(conn, u.Id)
		require.NoError(t, err)

		require.NoError(t, Delete(conn, token))

		validated, err := Validate(conn, token)
		require.NoError(t, err)
		require.Nil(t, validated)
	})
}
