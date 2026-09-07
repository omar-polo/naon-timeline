package api

import (
	"github.com/go-fuego/fuego"
	"github.com/omar-polo/naon-timeline/apps/backend/services/info"
)

func (s *Server) me(fc NoBody) (*User, error) {
	u := contextUser(fc)
	if u == nil {
		return nil, fuego.InternalServerError{}
	}
	return u, nil
}

func (s *Server) info(fc NoBody) (*info.Info, error) {
	conn, err := s.pool.Take(fc)
	if err != nil {
		return nil, err
	}
	defer s.pool.Put(conn)

	return info.Stats(conn)
}
