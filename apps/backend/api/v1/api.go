package api

import (
	"github.com/go-fuego/fuego"
	"zombiezen.com/go/sqlite/sqlitex"
)

type (
	NoBody          = fuego.ContextNoBody
	WithBody[T any] = fuego.ContextWithBody[T]
)

type Server struct {
	*fuego.Server

	pool *sqlitex.Pool
}

// NewServer builds the fuego server with all routes registered. Both
// cmd/server and cmd/genspec call this so the generated OpenAPI spec can
// never drift from what the real server actually serves.
func NewServer(pool *sqlitex.Pool) *Server {
	s := fuego.NewServer(
		fuego.WithAddr("localhost:8080"),
		fuego.WithEngineOptions(
			fuego.WithOpenAPIConfig(fuego.OpenAPIConfig{
				JSONFilePath: "openapi.json",
			}),
		),
	)

	server := &Server{
		Server: s,
		pool:   pool,
	}

	prefix := "/api/v1"

	public := fuego.Group(s, prefix)

	fuego.Get(public, "/{$}", server.status)

	fuego.Get(public, "/info", server.info,
		fuego.OptionDescription("Retrieve some stats"))

	fuego.Get(public, "/events", server.eventsList,
		fuego.OptionQuery("include-drafts", "Include drafts events",
			fuego.ParamBool()),
		fuego.OptionDescription("List events, optionally filter for drafts."))
	fuego.Post(public, "/events", server.eventsNew,
		fuego.OptionDescription("Create a new event.  The ID field in the"+
			" payload is ignored."))
	fuego.Get(public, "/events/{event_id}", server.eventsGet,
		fuego.OptionDescription("Update in-place an event."))
	fuego.Put(public, "/events/{event_id}", server.eventsUpdate,
		fuego.OptionDescription("Update in-place an event."))
	fuego.Delete(public, "/events/{event_id}", server.eventsDelete,
		fuego.OptionDescription("Delete an event given its ID."))

	return server
}

func (s *Server) Close() error {
	if s.pool != nil {
		return s.pool.Close()
	}
	return nil
}

type StatusResponse struct {
	Ok bool `json:"ok"`
}

func (*Server) status(ctx NoBody) (StatusResponse, error) {
	return StatusResponse{Ok: true}, nil
}
