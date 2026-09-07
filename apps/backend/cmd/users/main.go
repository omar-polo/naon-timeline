package main

import (
	"context"
	"flag"
	"fmt"
	"os"
	"strconv"

	"github.com/omar-polo/naon-timeline/apps/backend/db"
	"github.com/omar-polo/naon-timeline/apps/backend/services/users"
	"golang.org/x/term"
)

var ldb = "./naon.sqlite3"

func fatal(rest ...any) {
	fmt.Fprintln(os.Stderr, rest...)
	os.Exit(1)
}

func getpassphrase(prompt string) string {
	fmt.Print(prompt, ": ")
	pass, err := term.ReadPassword(int(os.Stdin.Fd()))
	fmt.Println()
	if err != nil {
		fatal("failed to read passphrase:", err)
	}

	return string(pass)
}

func readpassphrase() string {
	for {
		var (
			pass = getpassphrase("passphrase (will not echo)")
			rep  = getpassphrase("repeat     (will not echo)")
		)
		if pass == rep {
			return pass
		}

		fmt.Fprintln(os.Stderr, "passphrase mismatch")
	}
}

func main() {
	flag.StringVar(&ldb, "db", ldb, `database to use`)
	flag.Parse()

	args := flag.Args()

	var mode string
	if len(args) == 0 {
		mode = "list"
	} else {
		mode = args[0]
		args = args[1:]
	}

	ctx := context.Background()

	pool, err := db.Open(ldb)
	if err != nil {
		fatal("failed to open db pool:", err)
	}
	defer pool.Close()

	conn, err := pool.Take(ctx)
	if err != nil {
		fatal("failed to get a connection:", err)
	}
	defer pool.Put(conn)

	switch mode {
	case "list":
		if len(args) != 0 {
			fatal("bad usage for list")
		}

		users, err := users.List(conn)
		if err != nil {
			fatal("failed to list users:", err)
		}

		for _, user := range users {
			fmt.Printf("%3d %8s %5s %s <%s>\n",
				user.Id, user.Status, user.Role,
				user.Name, user.Email)
		}

	case "add":
		var (
			u      users.User
			role   string
			status string
			ok     bool
		)

		f := flag.NewFlagSet("users add", flag.ExitOnError)
		f.StringVar(&u.Email, "email", "", `user email`)
		f.StringVar(&u.Name, "name", "", `user name`)
		f.StringVar(&role, "role", "user", `user role`)
		f.StringVar(&status, "status", "active", `user status`)
		f.Parse(args)

		u.Role, ok = users.ValidateRole(role)
		if !ok {
			fatal("bad role:", role)
		}

		u.Status, ok = users.ValidateStatus(status)
		if !ok {
			fatal("bad status:", status)
		}

		if u.Email == "" || u.Name == "" {
			fatal("missing --email or --name")
		}

		password := readpassphrase()

		_, err := users.New(conn, &u, password)
		if err != nil {
			fatal("failed to create user:", err)
		}

	case "passwd":
		if len(args) != 1 {
			fatal("bad usage for disable, need user id")
		}
		id, err := strconv.ParseInt(args[0], 10, 64)
		if err != nil {
			fatal("user id", args[0], "is", err)
		}

		password := readpassphrase()

		if err := users.SetPassword(conn, id, password); err != nil {
			fatal("failed to set password:", err)
		}

	case "disable":
		if len(args) != 1 {
			fatal("bad usage for disable, need user id")
		}
		id, err := strconv.ParseInt(args[0], 10, 64)
		if err != nil {
			fatal("user id", args[0], "is", err)
		}

		u, err := users.Get(conn, id)
		if err != nil {
			fatal("failed to get user", id, "because", err)
		}

		if u.Status == users.StatusDisabled {
			fatal("user already disabled")
		}

		u.Status = users.StatusDisabled

		if err := users.Update(conn, u); err != nil {
			fatal("failed to update user:", err)
		}

	case "active":
		if len(args) != 1 {
			fatal("bad usage for active, need user id")
		}
		id, err := strconv.ParseInt(args[0], 10, 64)
		if err != nil {
			fatal("user id", args[0], "is", err)
		}

		u, err := users.Get(conn, id)
		if err != nil {
			fatal("failed to get user", id, "because", err)
		}

		if u.Status == users.StatusActive {
			fatal("user already active")
		}

		u.Status = users.StatusActive

		if err := users.Update(conn, u); err != nil {
			fatal("failed to update user:", err)
		}

	case "del":
		if len(args) != 1 {
			fatal("bad usage for active, need user id")
		}
		id, err := strconv.ParseInt(args[0], 10, 64)
		if err != nil {
			fatal("user id", args[0], "is", err)
		}

		if err := users.Delete(conn, id); err != nil {
			fatal("failed to delete user:", err)
		}

	default:
		fatal("bad action:", mode)
	}
}
