package users

import (
	"testing"

	bt "github.com/omar-polo/naon-timeline/apps/backend/testing"
	"github.com/stretchr/testify/require"
	"golang.org/x/crypto/bcrypt"
	"zombiezen.com/go/sqlite"
	"zombiezen.com/go/sqlite/sqlitex"
)

func passwordHash(t *testing.T, conn *sqlite.Conn, id int64) string {
	t.Helper()

	var hash string
	err := sqlitex.Execute(conn, `select password from users where id = $id`, &sqlitex.ExecOptions{
		Named: map[string]any{"$id": id},
		ResultFunc: func(stmt *sqlite.Stmt) error {
			hash = stmt.GetText("password")
			return nil
		},
	})
	require.NoError(t, err)
	require.NotEmpty(t, hash)
	return hash
}

func TestUsers(t *testing.T) {
	pool := bt.NewPool(t)
	defer func() { require.NoError(t, pool.Close(), "closing pool") }()

	t.Run("TestAddGet", func(t *testing.T) {
		conn := bt.Conn(t, pool)
		defer pool.Put(conn)
		defer bt.AutoRolloutSavepoint(t, conn)()

		newuser := &User{
			Email:  "add-get@example.com",
			Name:   "Add Get",
			Role:   RoleUser,
			Status: StatusActive,
		}
		newuser, err := New(conn, newuser, "hunter2")
		require.NoError(t, err)
		require.NotNil(t, newuser)
		require.NotZero(t, newuser.Id)

		u, err := Get(conn, newuser.Id)
		require.NoError(t, err)
		require.NotNil(t, u)
		require.Equal(t, *newuser, *u)

		hash := passwordHash(t, conn, newuser.Id)
		require.NoError(t, bcrypt.CompareHashAndPassword([]byte(hash), []byte("hunter2")))
	})

	t.Run("TestGetMissing", func(t *testing.T) {
		conn := bt.Conn(t, pool)
		defer pool.Put(conn)
		defer bt.AutoRolloutSavepoint(t, conn)()

		u, err := Get(conn, 999)
		require.NoError(t, err)
		require.Nil(t, u)
	})

	t.Run("TestList", func(t *testing.T) {
		conn := bt.Conn(t, pool)
		defer pool.Put(conn)
		defer bt.AutoRolloutSavepoint(t, conn)()

		before, err := List(conn)
		require.NoError(t, err)

		newuser, err := New(conn, &User{
			Email:  "list@example.com",
			Name:   "List Me",
			Role:   RoleUser,
			Status: StatusActive,
		}, "hunter2")
		require.NoError(t, err)

		after, err := List(conn)
		require.NoError(t, err)
		require.Equal(t, len(before)+1, len(after))
		require.Contains(t, after, *newuser)
	})

	t.Run("TestDuplicateEmail", func(t *testing.T) {
		conn := bt.Conn(t, pool)
		defer pool.Put(conn)
		defer bt.AutoRolloutSavepoint(t, conn)()

		_, err := New(conn, &User{
			Email:  "dup@example.com",
			Name:   "First",
			Role:   RoleUser,
			Status: StatusActive,
		}, "hunter2")
		require.NoError(t, err)

		_, err = New(conn, &User{
			Email:  "dup@example.com",
			Name:   "Second",
			Role:   RoleUser,
			Status: StatusActive,
		}, "hunter2")
		require.ErrorIs(t, err, ErrEmailTaken)
	})

	t.Run("TestUpdate", func(t *testing.T) {
		conn := bt.Conn(t, pool)
		defer pool.Put(conn)
		defer bt.AutoRolloutSavepoint(t, conn)()

		newuser, err := New(conn, &User{
			Email:  "update@example.com",
			Name:   "Before Update",
			Role:   RoleUser,
			Status: StatusActive,
		}, "hunter2")
		require.NoError(t, err)

		updated := *newuser
		updated.Name = "After Update"
		updated.Role = RoleAdmin
		updated.Status = StatusDisabled
		require.NoError(t, Update(conn, &updated))

		u, err := Get(conn, newuser.Id)
		require.NoError(t, err)
		require.Equal(t, updated, *u)
	})

	t.Run("TestUpdateDuplicateEmail", func(t *testing.T) {
		conn := bt.Conn(t, pool)
		defer pool.Put(conn)
		defer bt.AutoRolloutSavepoint(t, conn)()

		first, err := New(conn, &User{
			Email:  "taken@example.com",
			Name:   "First",
			Role:   RoleUser,
			Status: StatusActive,
		}, "hunter2")
		require.NoError(t, err)

		second, err := New(conn, &User{
			Email:  "free@example.com",
			Name:   "Second",
			Role:   RoleUser,
			Status: StatusActive,
		}, "hunter2")
		require.NoError(t, err)

		updated := *second
		updated.Email = first.Email
		require.ErrorIs(t, Update(conn, &updated), ErrEmailTaken)
	})

	t.Run("TestSetPassword", func(t *testing.T) {
		conn := bt.Conn(t, pool)
		defer pool.Put(conn)
		defer bt.AutoRolloutSavepoint(t, conn)()

		newuser, err := New(conn, &User{
			Email:  "setpw@example.com",
			Name:   "Set Password",
			Role:   RoleUser,
			Status: StatusActive,
		}, "old-password")
		require.NoError(t, err)

		require.NoError(t, SetPassword(conn, newuser.Id, "new-password"))

		hash := passwordHash(t, conn, newuser.Id)
		require.NoError(t, bcrypt.CompareHashAndPassword([]byte(hash), []byte("new-password")))
		require.Error(t, bcrypt.CompareHashAndPassword([]byte(hash), []byte("old-password")))
	})

	t.Run("TestDelete", func(t *testing.T) {
		conn := bt.Conn(t, pool)
		defer pool.Put(conn)
		defer bt.AutoRolloutSavepoint(t, conn)()

		newuser, err := New(conn, &User{
			Email:  "delete@example.com",
			Name:   "Delete Me",
			Role:   RoleUser,
			Status: StatusActive,
		}, "hunter2")
		require.NoError(t, err)

		require.NoError(t, Delete(conn, newuser.Id))

		u, err := Get(conn, newuser.Id)
		require.NoError(t, err)
		require.Nil(t, u)
	})
}
