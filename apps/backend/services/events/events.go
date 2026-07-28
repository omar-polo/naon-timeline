package events

import (
	"time"

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

type ListFilter struct {
	IncludeDrafts bool
}

func List(conn *sqlite.Conn, f ListFilter) (es []Event, err error) {
	query := `
select id, draft, lat, lng, title, date, text, url, image
  from events
 where ? or not draft
`

	err = sqlitex.Execute(conn, query, &sqlitex.ExecOptions{
		Args: []any{f.IncludeDrafts},
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
