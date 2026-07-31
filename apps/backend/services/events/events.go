package events

import (
	"fmt"
	"time"

	sq "github.com/Masterminds/squirrel"
	"zombiezen.com/go/sqlite"
	"zombiezen.com/go/sqlite/sqlitex"
)

// dateLayout is the on-disk representation of the "date" column: plain
// yyyy-mm-dd, no time component. zombiezen.com/go/sqlite has no built-in
// time.Time support, so conversion to/from the TEXT column is manual -
// the API layer itself uses time.Time's standard JSON encoding (RFC 3339).
const dateLayout = "2006-01-02"

type Coord struct {
	Lat float64 `json:"lat"`
	Lng float64 `json:"lng"`
}

type Event struct {
	Id    int64     `json:"id"`
	Draft bool      `json:"draft,omitempty"`
	Coord Coord     `json:"coord"`
	Title string    `json:"title"`
	Date  time.Time `json:"date"`
	Text  string    `json:"text"`
	Url   string    `json:"url"`
	Image string    `json:"image"`
}

type Status = string

const (
	StatusAny       Status = "any"
	StatusPublished Status = "published"
	StatusDrafted   Status = "drafted"
)

func ValidateStatus(s string) (Status, bool) {
	switch s {
	case StatusAny:
		return StatusAny, true
	case StatusPublished:
		return StatusPublished, true
	case StatusDrafted:
		return StatusDrafted, true
	}
	return "", false
}

type ListFilter struct {
	Status   Status
	FromYear int
	ToYear   int
	Search   string
}

func List(conn *sqlite.Conn, f ListFilter) (es []Event, err error) {
	if f.Status == "" {
		f.Status = StatusAny
	}

	b := sq.Select("events.id", "events.draft", "events.lat", "events.lng",
		"events.title", "events.date", "events.text", "events.url",
		"events.image").
		From("events").
		OrderBy("events.date ASC")

	switch f.Status {
	case StatusPublished:
		b = b.Where(sq.Eq{"draft": false})
	case StatusDrafted:
		b = b.Where(sq.Eq{"draft": true})
	}

	if f.FromYear != 0 {
		b = b.Where(sq.GtOrEq{"date": fmt.Sprintf("%04d-01-01", f.FromYear)})
	}
	if f.ToYear != 0 {
		b = b.Where(sq.LtOrEq{"date": fmt.Sprintf("%04d-12-31", f.ToYear)})
	}

	if f.Search != "" {
		b = b.Join("events_fts on events_fts.rowid = events.id").
			Where(sq.Expr("events_fts match ?", f.Search))
	}

	query, args, err := b.ToSql()
	if err != nil {
		return nil, err
	}

	err = sqlitex.Execute(conn, query, &sqlitex.ExecOptions{
		Args: args,
		ResultFunc: func(stmt *sqlite.Stmt) error {
			date, err := time.Parse(dateLayout, stmt.GetText("date"))
			if err != nil {
				return err
			}
			es = append(es, Event{
				Id:    stmt.GetInt64("id"),
				Draft: stmt.GetBool("draft"),
				Coord: Coord{
					Lat: stmt.GetFloat("lat"),
					Lng: stmt.GetFloat("lng"),
				},
				Title: stmt.GetText("title"),
				Date:  date,
				Text:  stmt.GetText("text"),
				Url:   stmt.GetText("url"),
				Image: stmt.GetText("image"),
			})
			return nil
		},
	})
	return
}

func Get(conn *sqlite.Conn, evid int64) (*Event, error) {
	query := `
select id, draft, lat, lng, title, date, text, url, image
  from events
 where id = $id
`

	var ev Event
	var found bool
	err := sqlitex.Execute(conn, query, &sqlitex.ExecOptions{
		Named: map[string]any{"$id": evid},
		ResultFunc: func(stmt *sqlite.Stmt) error {
			date, err := time.Parse(dateLayout, stmt.GetText("date"))
			if err != nil {
				return err
			}
			found = true
			ev = Event{
				Id:    stmt.GetInt64("id"),
				Draft: stmt.GetBool("draft"),
				Coord: Coord{
					Lat: stmt.GetFloat("lat"),
					Lng: stmt.GetFloat("lng"),
				},
				Title: stmt.GetText("title"),
				Date:  date,
				Text:  stmt.GetText("text"),
				Url:   stmt.GetText("url"),
				Image: stmt.GetText("image"),
			}
			return nil
		},
	})
	if err != nil {
		return nil, err
	}
	if !found {
		return nil, nil
	}
	return &ev, nil
}

func New(conn *sqlite.Conn, ev *Event) (*Event, error) {
	query := `
insert into events ( draft,  lat,  lng,  title,  date,  text,  url,  image)
            values ($draft, $lat, $lng, $title, $date, $text, $url, $image)
         returning id
`

	err := sqlitex.Execute(conn, query, &sqlitex.ExecOptions{
		Named: map[string]any{
			"$draft": ev.Draft,
			"$lat":   ev.Coord.Lat,
			"$lng":   ev.Coord.Lng,
			"$title": ev.Title,
			"$date":  ev.Date.Format(dateLayout),
			"$text":  ev.Text,
			"$url":   ev.Url,
			"$image": ev.Image,
		},
		ResultFunc: func(stmt *sqlite.Stmt) error {
			ev.Id = stmt.GetInt64("id")
			return nil
		},
	})
	if err != nil {
		return nil, err
	}
	return ev, nil
}

func Update(conn *sqlite.Conn, ev *Event) error {
	query := `
update events
   set draft = $draft,
       lat   = $lat,
       lng   = $lng,
       title = $title,
       date  = $date,
       text  = $text,
       url   = $url,
       image = $image
 where id = $id
`
	return sqlitex.Execute(conn, query, &sqlitex.ExecOptions{
		Named: map[string]any{
			"$id":    ev.Id,
			"$draft": ev.Draft,
			"$lat":   ev.Coord.Lat,
			"$lng":   ev.Coord.Lng,
			"$title": ev.Title,
			"$date":  ev.Date.Format(dateLayout),
			"$text":  ev.Text,
			"$url":   ev.Url,
			"$image": ev.Image,
		},
	})
}

func Delete(conn *sqlite.Conn, evid int64) error {
	query := `delete from events where id = $id`
	return sqlitex.Execute(conn, query, &sqlitex.ExecOptions{
		Named: map[string]any{"$id": evid},
	})
}
