package api

import "github.com/omar-polo/naon-timeline/apps/backend/services/info"

func (s *Server) info(fc NoBody) (*info.Info, error) {
	conn, err := s.pool.Take(fc)
	if err != nil {
		return nil, err
	}
	defer s.pool.Put(conn)

	return info.Stats(conn)
}
