package main

import backend "github.com/omar-polo/naon-timeline/apps/backend"

func main() {
	s := backend.NewServer()
	s.Run()
}
