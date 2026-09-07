package api

import (
	"errors"
	"net/http"

	"github.com/go-fuego/fuego"
	"github.com/omar-polo/naon-timeline/apps/backend/services/sessions"
	"github.com/omar-polo/naon-timeline/apps/backend/services/users"
)

const sessionCookieName = "session"

func sessionCookie(token string, maxAge int) http.Cookie {
	return http.Cookie{
		Name:     sessionCookieName,
		Value:    token,
		Path:     "/",
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteLaxMode,
		MaxAge:   maxAge,
	}
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func (s *Server) login(fc WithBody[LoginRequest]) (*User, error) {
	body, err := fc.Body()
	if err != nil {
		return nil, err
	}

	conn, err := s.pool.Take(fc)
	if err != nil {
		return nil, err
	}
	defer s.pool.Put(conn)

	u, err := users.Authenticate(conn, body.Email, body.Password)
	if errors.Is(err, users.ErrInvalidCredentials) {
		return nil, fuego.UnauthorizedError{}
	}
	if err != nil {
		return nil, err
	}

	token, err := sessions.New(conn, u.Id)
	if err != nil {
		return nil, err
	}

	fc.SetCookie(sessionCookie(token, int(sessions.Duration.Seconds())))
	return u, nil
}

func (s *Server) logout(fc NoBody) (any, error) {
	conn, err := s.pool.Take(fc)
	if err != nil {
		return nil, err
	}
	defer s.pool.Put(conn)

	if cookie, err := fc.Cookie(sessionCookieName); err == nil {
		if err := sessions.Delete(conn, cookie.Value); err != nil {
			return nil, err
		}
	}

	fc.SetCookie(sessionCookie("", -1))
	return nil, nil
}
