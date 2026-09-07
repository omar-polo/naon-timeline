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

	authenticated := fuego.Group(s, prefix)
	fuego.Use(authenticated, server.requireAuth)

	admin := fuego.Group(s, prefix)
	fuego.Use(admin, server.requireAuth, server.requireAdmin)

	fuego.Get(public, "/{$}", server.status)

	fuego.Get(authenticated, "/me", server.me,
		fuego.OptionDescription("Retrieve current user info"))
	fuego.Get(authenticated, "/info", server.info,
		fuego.OptionDescription("Retrieve some stats"))

	fuego.Post(public, "/login", server.login,
		fuego.OptionDescription("Log in and receive a session cookie."))
	fuego.Post(public, "/logout", server.logout,
		fuego.OptionDescription("Log out and clear the session cookie."))

	fuego.Get(public, "/events", server.eventsList,
		fuego.OptionQuery("search", "filter by matching title and text",
			fuego.ParamString()),
		fuego.OptionQuery("status", "to filter the status,"+
			" possible values are 'any', 'published', 'drafted'.",
			fuego.ParamString()),
		fuego.OptionQuery("from-year", "filter events from than the given year",
			fuego.ParamInteger()),
		fuego.OptionQuery("to-year", "filter events until than the given year",
			fuego.ParamInteger()),
		fuego.OptionDescription("List events with filters"))
	fuego.Post(authenticated, "/events", server.eventsNew,
		fuego.OptionDescription("Create a new event.  The ID field in the"+
			" payload is ignored."))
	fuego.Get(public, "/events/{event_id}", server.eventsGet,
		fuego.OptionDescription("Update in-place an event."))
	fuego.Put(authenticated, "/events/{event_id}", server.eventsUpdate,
		fuego.OptionDescription("Update in-place an event."))
	fuego.Delete(authenticated, "/events/{event_id}", server.eventsDelete,
		fuego.OptionDescription("Delete an event given its ID."))

	fuego.Get(admin, "/users", server.usersList,
		fuego.OptionDescription("List users"))
	fuego.Post(admin, "/users", server.usersNew,
		fuego.OptionDescription("Create a new user."))
	fuego.Get(admin, "/users/{user_id}", server.usersGet,
		fuego.OptionDescription("Get a user by ID."))
	fuego.Put(admin, "/users/{user_id}", server.usersUpdate,
		fuego.OptionDescription("Update in-place a user, excluding its password."))
	fuego.Post(admin, "/users/{user_id}/password", server.usersSetPassword,
		fuego.OptionDescription("Set a user's password."))
	fuego.Delete(admin, "/users/{user_id}", server.usersDelete,
		fuego.OptionDescription("Delete a user given its ID."))

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
