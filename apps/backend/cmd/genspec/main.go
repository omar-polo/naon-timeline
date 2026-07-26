// genspec builds the same routes as cmd/server and writes the resulting
// OpenAPI spec to disk, without binding a listener - used by the
// "openapi" turbo task to feed the TypeScript codegen step.
package main

import backend "github.com/omar-polo/naon-timeline/apps/backend"

func main() {
	s := backend.NewServer()
	s.OutputOpenAPISpec()
}
