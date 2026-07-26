package api

import "github.com/go-fuego/fuego"

type (
	NoBody = fuego.ContextNoBody
)

// NewServer builds the fuego server with all routes registered. Both
// cmd/server and cmd/genspec call this so the generated OpenAPI spec can
// never drift from what the real server actually serves.
func NewServer() *fuego.Server {
	s := fuego.NewServer(
		fuego.WithAddr("localhost:8080"),
		fuego.WithEngineOptions(
			fuego.WithOpenAPIConfig(fuego.OpenAPIConfig{
				JSONFilePath: "openapi.json",
			}),
		),
	)

	fuego.Get(s, "/", status)

	return s
}

type StatusResponse struct {
	Ok bool `json:"ok"`
}

func status(ctx NoBody) (StatusResponse, error) {
	return StatusResponse{Ok: true}, nil
}
