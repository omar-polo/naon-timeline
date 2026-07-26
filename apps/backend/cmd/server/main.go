package main

import (
	"flag"

	"github.com/omar-polo/naon-timeline/apps/backend/api/v1"
)

var (
	addr = ":8080"
)

func main() {
	flag.StringVar(&addr, "addr", addr, `address where to listen to`)

	s := api.NewServer()
	s.Addr = addr
	s.OpenAPI.Config.DisableLocalSave = true
	s.Run()
}
