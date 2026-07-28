// genspec builds the same routes as cmd/server and writes the resulting
// OpenAPI spec to disk, without binding a listener - used by the
// "openapi" turbo task to feed the TypeScript codegen step.
package main

import (
	api "github.com/omar-polo/naon-timeline/apps/backend/api/v1"
)

func main() {
	// Route registration never touches the database, so genspec doesn't
	// need a real pool - it's only used inside request handlers, which
	// never run during spec generation.
	s := api.NewServer(nil)
	s.OutputOpenAPISpec()
}
