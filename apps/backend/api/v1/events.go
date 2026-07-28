package api

import (
	"strconv"

	"github.com/go-fuego/fuego"
	"github.com/omar-polo/naon-timeline/apps/backend/services/events"
)

type Event = events.Event

func (s *Server) eventsList(fc NoBody) ([]Event, error) {
	var includeDrafts bool
	if id, err := fc.QueryParamBoolErr("include-drafts"); err != nil {
		return nil, err
	} else {
		includeDrafts = id
	}

	conn, err := s.pool.Take(fc)
	if err != nil {
		return nil, err
	}
	defer s.pool.Put(conn)

	return events.List(conn, events.ListFilter{IncludeDrafts: includeDrafts})
}

func (s *Server) eventsNew(fc WithBody[Event]) (*Event, error) {
	ev, err := fc.Body()
	if err != nil {
		return nil, err
	}

	conn, err := s.pool.Take(fc)
	if err != nil {
		return nil, err
	}
	defer s.pool.Put(conn)

	return events.New(conn, &ev)
}

func (s *Server) eventsUpdate(fc WithBody[Event]) (*Event, error) {
	idstr := fc.PathParam("event_id")
	id, err := strconv.ParseInt(idstr, 10, 64)
	if err != nil {
		return nil, fuego.NotFoundError{}
	}

	ev, err := fc.Body()
	if err != nil {
		return nil, err
	}

	// make sure we're editing the right event
	ev.Id = id

	conn, err := s.pool.Take(fc)
	if err != nil {
		return nil, err
	}
	defer s.pool.Put(conn)

	if err := events.Update(conn, &ev); err != nil {
		return nil, err
	}
	return &ev, nil
}

func (s *Server) eventsDelete(fc NoBody) (any, error) {
	idstr := fc.PathParam("event_id")
	id, err := strconv.ParseInt(idstr, 10, 64)
	if err != nil {
		return nil, fuego.NotFoundError{}
	}

	conn, err := s.pool.Take(fc)
	if err != nil {
		return nil, err
	}
	defer s.pool.Put(conn)

	return nil, events.Delete(conn, id)
}
