package main

import (
	"flag"
	"log"

	"github.com/omar-polo/naon-timeline/apps/backend/api/v1"
	"github.com/omar-polo/naon-timeline/apps/backend/db"
)

var (
	addr = ":8080"
	ldb  = "./naon.sqlite3"
)

func main() {
	flag.StringVar(&addr, "addr", addr, `address where to listen to`)
	flag.StringVar(&ldb, "db", ldb, `database to use`)
	flag.Parse()

	pool, err := db.Open(ldb)
	if err != nil {
		log.Fatalln("failed to open db pool:", err)
	}

	s := api.NewServer(pool)
	s.Addr = addr
	s.OpenAPI.Config.DisableLocalSave = true
	s.Run()
}
