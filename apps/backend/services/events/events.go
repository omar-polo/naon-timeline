package events

import (
	"zombiezen.com/go/sqlite"
	"zombiezen.com/go/sqlite/sqlitex"
)

type Coord struct {
	Lat float64 `json:"lat"`
	Lng float64 `json:"lng"`
}

type Event struct {
	Id    int64  `json:"id"`
	Draft bool   `json:"draft,omitempty"`
	Coord Coord  `json:"coord"`
	Title string `json:"title"`
	Date  string `json:"date"`
	Year  int    `json:"year"`
	Month int    `json:"month"`
	Day   int    `json:"day"`
	Text  string `json:"text"`
	Url   string `json:"url"`
	Image string `json:"image"`
}

type ListFilter struct {
	IncludeDrafts bool
}

func List(conn *sqlite.Conn, f ListFilter) (es []Event, err error) {
	query := `
select id, draft, lat, lng, title, date, year, month, day, text, url, image
  from events
 where ? or not draft
`

	err = sqlitex.Execute(conn, query, &sqlitex.ExecOptions{
		Args: []any{f.IncludeDrafts},
		ResultFunc: func(stmt *sqlite.Stmt) error {
			es = append(es, Event{
				Id:    stmt.GetInt64("id"),
				Draft: stmt.GetBool("draft"),
				Coord: Coord{
					Lat: stmt.GetFloat("lat"),
					Lng: stmt.GetFloat("lng"),
				},
				Title: stmt.GetText("title"),
				Date:  stmt.GetText("date"),
				Year:  int(stmt.GetInt64("year")),
				Month: int(stmt.GetInt64("month")),
				Day:   int(stmt.GetInt64("day")),
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
select id, draft, lat, lng, title, date, year, month, day, text, url, image
  from events
 where id = $id
`

	var ev Event
	var found bool
	err := sqlitex.Execute(conn, query, &sqlitex.ExecOptions{
		Named: map[string]any{"$id": evid},
		ResultFunc: func(stmt *sqlite.Stmt) error {
			found = true
			ev = Event{
				Id:    stmt.GetInt64("id"),
				Draft: stmt.GetBool("draft"),
				Coord: Coord{
					Lat: stmt.GetFloat("lat"),
					Lng: stmt.GetFloat("lng"),
				},
				Title: stmt.GetText("title"),
				Date:  stmt.GetText("date"),
				Year:  int(stmt.GetInt64("year")),
				Month: int(stmt.GetInt64("month")),
				Day:   int(stmt.GetInt64("day")),
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
insert into events ( draft,  lat,  lng,  title,  date,  year,  month,  day,  text,  url,  image)
            values ($draft, $lat, $lng, $title, $date, $year, $month, $day, $text, $url, $image)
         returning id
`

	err := sqlitex.Execute(conn, query, &sqlitex.ExecOptions{
		Named: map[string]any{
			"$draft": ev.Draft,
			"$lat":   ev.Coord.Lat,
			"$lng":   ev.Coord.Lng,
			"$title": ev.Title,
			"$date":  ev.Date,
			"$year":  ev.Year,
			"$month": ev.Month,
			"$day":   ev.Day,
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
       year  = $year,
       month = $month,
       day   = $day,
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
			"$date":  ev.Date,
			"$year":  ev.Year,
			"$month": ev.Month,
			"$day":   ev.Day,
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
