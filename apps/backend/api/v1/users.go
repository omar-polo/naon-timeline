package api

import (
	"errors"
	"strconv"

	"github.com/go-fuego/fuego"
	"github.com/omar-polo/naon-timeline/apps/backend/services/users"
)

type User = users.User

type NewUserRequest struct {
	Email    string       `json:"email"`
	Name     string       `json:"name"`
	Role     users.Role   `json:"role"`
	Status   users.Status `json:"status,omitempty"`
	Password string       `json:"password"`
}

type SetPasswordRequest struct {
	Password string `json:"password"`
}

func (s *Server) usersList(fc NoBody) ([]User, error) {
	conn, err := s.pool.Take(fc)
	if err != nil {
		return nil, err
	}
	defer s.pool.Put(conn)

	return users.List(conn)
}

func (s *Server) usersNew(fc WithBody[NewUserRequest]) (*User, error) {
	body, err := fc.Body()
	if err != nil {
		return nil, err
	}

	role, ok := users.ValidateRole(body.Role)
	if !ok {
		return nil, fuego.BadRequestError{}
	}

	status := body.Status
	if status == "" {
		status = users.StatusActive
	}
	status, ok = users.ValidateStatus(status)
	if !ok {
		return nil, fuego.BadRequestError{}
	}

	if body.Password == "" {
		return nil, fuego.BadRequestError{}
	}

	conn, err := s.pool.Take(fc)
	if err != nil {
		return nil, err
	}
	defer s.pool.Put(conn)

	u := &users.User{
		Email:  body.Email,
		Name:   body.Name,
		Role:   role,
		Status: status,
	}
	u, err = users.New(conn, u, body.Password)
	if errors.Is(err, users.ErrEmailTaken) {
		return nil, fuego.BadRequestError{}
	}
	if err != nil {
		return nil, err
	}
	return u, nil
}

func (s *Server) usersGet(fc NoBody) (*User, error) {
	idstr := fc.PathParam("user_id")
	id, err := strconv.ParseInt(idstr, 10, 64)
	if err != nil {
		return nil, fuego.NotFoundError{}
	}

	conn, err := s.pool.Take(fc)
	if err != nil {
		return nil, err
	}
	defer s.pool.Put(conn)

	u, err := users.Get(conn, id)
	if err != nil {
		return nil, err
	}
	if u == nil {
		return nil, fuego.NotFoundError{}
	}
	return u, nil
}

func (s *Server) usersUpdate(fc WithBody[User]) (*User, error) {
	idstr := fc.PathParam("user_id")
	id, err := strconv.ParseInt(idstr, 10, 64)
	if err != nil {
		return nil, fuego.NotFoundError{}
	}

	u, err := fc.Body()
	if err != nil {
		return nil, err
	}

	if _, ok := users.ValidateRole(u.Role); !ok {
		return nil, fuego.BadRequestError{}
	}
	if _, ok := users.ValidateStatus(u.Status); !ok {
		return nil, fuego.BadRequestError{}
	}

	// make sure we're editing the right user
	u.Id = id

	// an user cannot change their permissions level, nor disable
	// themself.
	cu := contextUser(fc)
	if cu == nil {
		return nil, fuego.InternalServerError{}
	}
	if cu.Id == u.Id {
		if cu.Role != u.Role || u.Status == users.StatusDisabled {
			return nil, fuego.BadRequestError{}
		}
	}

	conn, err := s.pool.Take(fc)
	if err != nil {
		return nil, err
	}
	defer s.pool.Put(conn)

	if err := users.Update(conn, &u); errors.Is(err, users.ErrEmailTaken) {
		return nil, fuego.BadRequestError{}
	} else if err != nil {
		return nil, err
	}
	return &u, nil
}

func (s *Server) usersSetPassword(fc WithBody[SetPasswordRequest]) (any, error) {
	idstr := fc.PathParam("user_id")
	id, err := strconv.ParseInt(idstr, 10, 64)
	if err != nil {
		return nil, fuego.NotFoundError{}
	}

	body, err := fc.Body()
	if err != nil {
		return nil, err
	}
	if body.Password == "" {
		return nil, fuego.BadRequestError{}
	}

	conn, err := s.pool.Take(fc)
	if err != nil {
		return nil, err
	}
	defer s.pool.Put(conn)

	return nil, users.SetPassword(conn, id, body.Password)
}

func (s *Server) usersDelete(fc NoBody) (any, error) {
	idstr := fc.PathParam("user_id")
	id, err := strconv.ParseInt(idstr, 10, 64)
	if err != nil {
		return nil, fuego.NotFoundError{}
	}

	// a user should not be able to delete themselves
	if u := contextUser(fc); u == nil || u.Id == id {
		return nil, fuego.BadRequestError{}
	}

	conn, err := s.pool.Take(fc)
	if err != nil {
		return nil, err
	}
	defer s.pool.Put(conn)

	return nil, users.Delete(conn, id)
}
