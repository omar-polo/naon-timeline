package users

import (
	"errors"
	"time"

	"golang.org/x/crypto/bcrypt"
	"zombiezen.com/go/sqlite"
	"zombiezen.com/go/sqlite/sqlitex"
)

// dateLayout mirrors services/events' convention: plain yyyy-mm-dd, no time
// component, since that's the granularity the dashboard displays.
const dateLayout = "2006-01-02"

type Role = string

const (
	RoleAdmin Role = "admin"
	RoleUser  Role = "user"
)

func ValidateRole(s string) (Role, bool) {
	switch s {
	case RoleAdmin:
		return RoleAdmin, true
	case RoleUser:
		return RoleUser, true
	}
	return "", false
}

type Status = string

const (
	StatusActive   Status = "active"
	StatusDisabled Status = "disabled"
)

func ValidateStatus(s string) (Status, bool) {
	switch s {
	case StatusActive:
		return StatusActive, true
	case StatusDisabled:
		return StatusDisabled, true
	}
	return "", false
}

// ErrEmailTaken is returned by New when the requested email is already in
// use by another user.
var ErrEmailTaken = errors.New("email already in use")

// ErrInvalidCredentials is returned by Authenticate for an unknown email,
// wrong password, or disabled account alike, so callers can't tell which.
var ErrInvalidCredentials = errors.New("invalid credentials")

type User struct {
	Id        int64      `json:"id"`
	Email     string     `json:"email"`
	Name      string     `json:"name"`
	Role      Role       `json:"role"`
	Status    Status     `json:"status"`
	Created   time.Time  `json:"created"`
	LastLogin *time.Time `json:"lastLogin,omitempty"`
}

func scanUser(stmt *sqlite.Stmt) (User, error) {
	created, err := time.Parse(dateLayout, stmt.GetText("created"))
	if err != nil {
		return User{}, err
	}

	u := User{
		Id:      stmt.GetInt64("id"),
		Email:   stmt.GetText("email"),
		Name:    stmt.GetText("name"),
		Role:    stmt.GetText("role"),
		Status:  stmt.GetText("status"),
		Created: created,
	}

	if lastLogin := stmt.GetText("last_login"); lastLogin != "" {
		t, err := time.Parse(dateLayout, lastLogin)
		if err != nil {
			return User{}, err
		}
		u.LastLogin = &t
	}

	return u, nil
}

func List(conn *sqlite.Conn) (us []User, err error) {
	query := `
select id, email, name, role, status, created, last_login
  from users
 order by created desc, id desc
`

	err = sqlitex.Execute(conn, query, &sqlitex.ExecOptions{
		ResultFunc: func(stmt *sqlite.Stmt) error {
			u, err := scanUser(stmt)
			if err != nil {
				return err
			}
			us = append(us, u)
			return nil
		},
	})
	return
}

func Get(conn *sqlite.Conn, id int64) (*User, error) {
	query := `
select id, email, name, role, status, created, last_login
  from users
 where id = $id
`

	var u User
	var found bool
	err := sqlitex.Execute(conn, query, &sqlitex.ExecOptions{
		Named: map[string]any{"$id": id},
		ResultFunc: func(stmt *sqlite.Stmt) error {
			var err error
			u, err = scanUser(stmt)
			if err != nil {
				return err
			}
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
	return &u, nil
}

// Authenticate checks password against email's stored hash.
func Authenticate(conn *sqlite.Conn, email, password string) (*User, error) {
	query := `
select id, email, name, password, role, status, created, last_login
  from users
 where email = $email
`

	var u User
	var hash string
	var found bool
	err := sqlitex.Execute(conn, query, &sqlitex.ExecOptions{
		Named: map[string]any{"$email": email},
		ResultFunc: func(stmt *sqlite.Stmt) error {
			var err error
			u, err = scanUser(stmt)
			if err != nil {
				return err
			}
			hash = stmt.GetText("password")
			found = true
			return nil
		},
	})
	if err != nil {
		return nil, err
	}
	if !found || u.Status != StatusActive {
		return nil, ErrInvalidCredentials
	}

	if err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password)); err != nil {
		return nil, ErrInvalidCredentials
	}

	return &u, nil
}

func emailTaken(conn *sqlite.Conn, email string) (bool, error) {
	var taken bool
	err := sqlitex.Execute(conn, `select 1 from users where email = $email`, &sqlitex.ExecOptions{
		Named: map[string]any{"$email": email},
		ResultFunc: func(stmt *sqlite.Stmt) error {
			taken = true
			return nil
		},
	})
	return taken, err
}

func New(conn *sqlite.Conn, u *User, password string) (*User, error) {
	taken, err := emailTaken(conn, u.Email)
	if err != nil {
		return nil, err
	}
	if taken {
		return nil, ErrEmailTaken
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	// truncate to date-only precision, matching what's stored and read back
	created, err := time.Parse(dateLayout, time.Now().UTC().Format(dateLayout))
	if err != nil {
		return nil, err
	}

	query := `
insert into users ( email,  name,  password,  role,  status,  created)
           values ($email, $name, $password, $role, $status, $created)
         returning id
`

	err = sqlitex.Execute(conn, query, &sqlitex.ExecOptions{
		Named: map[string]any{
			"$email":    u.Email,
			"$name":     u.Name,
			"$password": string(hash),
			"$role":     u.Role,
			"$status":   u.Status,
			"$created":  created.Format(dateLayout),
		},
		ResultFunc: func(stmt *sqlite.Stmt) error {
			u.Id = stmt.GetInt64("id")
			return nil
		},
	})
	if err != nil {
		return nil, err
	}

	u.Created = created
	return u, nil
}

func Update(conn *sqlite.Conn, u *User) error {
	taken, err := emailTaken(conn, u.Email)
	if err != nil {
		return err
	}
	if taken {
		existing, err := Get(conn, u.Id)
		if err != nil {
			return err
		}
		if existing == nil || existing.Email != u.Email {
			return ErrEmailTaken
		}
	}

	query := `
update users
   set email  = $email,
       name   = $name,
       role   = $role,
       status = $status
 where id = $id
`
	return sqlitex.Execute(conn, query, &sqlitex.ExecOptions{
		Named: map[string]any{
			"$id":     u.Id,
			"$email":  u.Email,
			"$name":   u.Name,
			"$role":   u.Role,
			"$status": u.Status,
		},
	})
}

func SetPassword(conn *sqlite.Conn, id int64, password string) error {
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	query := `update users set password = $password where id = $id`
	return sqlitex.Execute(conn, query, &sqlitex.ExecOptions{
		Named: map[string]any{
			"$id":       id,
			"$password": string(hash),
		},
	})
}

func Delete(conn *sqlite.Conn, id int64) error {
	query := `delete from users where id = $id`
	return sqlitex.Execute(conn, query, &sqlitex.ExecOptions{
		Named: map[string]any{"$id": id},
	})
}
