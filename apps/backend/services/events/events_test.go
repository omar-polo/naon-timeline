package events

import (
	"testing"
	"time"

	bt "github.com/omar-polo/naon-timeline/apps/backend/testing"
	"github.com/stretchr/testify/require"
)

func TestEvents(t *testing.T) {
	pool := bt.NewPool(t)
	defer func() { require.NoError(t, pool.Close(), "closing pool") }()

	t.Run("TestAddGet", func(t *testing.T) {
		conn := bt.Conn(t, pool)
		defer pool.Put(conn)
		defer bt.AutoRolloutSavepoint(t, conn)()

		newevt := &Event{
			Draft: true,
			Title: "Test",
			Date:  time.Date(2001, time.January, 1, 0, 0, 0, 0, time.UTC),
			Text:  "content",
		}
		newevt, err := New(conn, newevt)
		require.NoError(t, err)
		require.NotNil(t, newevt)
		require.NotZero(t, newevt.Id)

		ev, err := Get(conn, newevt.Id)
		require.NoError(t, err)
		require.NotNil(t, ev)

		require.Equal(t, *ev, *newevt)
	})

	t.Run("TestList", func(t *testing.T) {
		conn := bt.Conn(t, pool)
		defer pool.Put(conn)
		defer bt.AutoRolloutSavepoint(t, conn)()

		ev1, err := List(conn, ListFilter{Status: StatusAny})
		require.NoError(t, err)
		require.NotEmpty(t, ev1)

		newevt := &Event{
			Draft: true,
			Title: "Test",
			Date:  time.Date(2001, time.January, 1, 0, 0, 0, 0, time.UTC),
			Text:  "content",
		}
		newevt, err = New(conn, newevt)
		require.NoError(t, err)
		require.NotNil(t, newevt)
		require.NotZero(t, newevt.Id)

		ev2, err := List(conn, ListFilter{Status: StatusAny})
		require.NoError(t, err)
		require.NotEmpty(t, ev1)
		require.Equal(t, len(ev1)+1, len(ev2))
		require.Contains(t, ev2, *newevt)

		ev3, err := List(conn, ListFilter{Status: StatusPublished})
		require.NoError(t, err)
		require.NotEmpty(t, ev3)
		require.NotContains(t, ev3, *newevt)
	})

	t.Run("TestListYearFilter", func(t *testing.T) {
		conn := bt.Conn(t, pool)
		defer pool.Put(conn)
		defer bt.AutoRolloutSavepoint(t, conn)()

		in2019, err := New(conn, &Event{
			Title: "in 2019",
			Date:  time.Date(2019, time.June, 1, 0, 0, 0, 0, time.UTC),
			Text:  "x",
		})
		require.NoError(t, err)
		in2021, err := New(conn, &Event{
			Title: "in 2021",
			Date:  time.Date(2021, time.June, 1, 0, 0, 0, 0, time.UTC),
			Text:  "x",
		})
		require.NoError(t, err)
		draft2021, err := New(conn, &Event{
			Draft: true,
			Title: "draft 2021",
			Date:  time.Date(2021, time.June, 1, 0, 0, 0, 0, time.UTC),
			Text:  "x",
		})
		require.NoError(t, err)

		es, err := List(conn, ListFilter{
			Status:   StatusPublished,
			FromYear: 2020,
			ToYear:   2022,
		})
		require.NoError(t, err)
		require.Contains(t, es, *in2021)
		require.NotContains(t, es, *in2019)
		require.NotContains(t, es, *draft2021)
	})

	t.Run("TestListSearchFilter", func(t *testing.T) {
		conn := bt.Conn(t, pool)
		defer pool.Put(conn)
		defer bt.AutoRolloutSavepoint(t, conn)()

		aboutDucks, err := New(conn, &Event{
			Title: "Ducks",
			Date:  time.Date(2001, time.January, 1, 0, 0, 0, 0, time.UTC),
			Text:  "a story about ducks",
		})
		require.NoError(t, err)
		aboutCats, err := New(conn, &Event{
			Title: "Cats",
			Date:  time.Date(2001, time.January, 1, 0, 0, 0, 0, time.UTC),
			Text:  "a story about cats",
		})
		require.NoError(t, err)

		es, err := List(conn, ListFilter{Status: StatusAny, Search: "ducks"})
		require.NoError(t, err)
		require.Contains(t, es, *aboutDucks)
		require.NotContains(t, es, *aboutCats)
	})

	t.Run("TestAddUpdateGet", func(t *testing.T) {
		conn := bt.Conn(t, pool)
		defer pool.Put(conn)
		defer bt.AutoRolloutSavepoint(t, conn)()

		newevt := &Event{
			Draft: true,
			Title: "Test",
			Date:  time.Date(2001, time.January, 1, 0, 0, 0, 0, time.UTC),
			Text:  "content",
		}
		newevt, err := New(conn, newevt)
		require.NoError(t, err)
		require.NotNil(t, newevt)
		require.NotZero(t, newevt.Id)

		updated := *newevt
		updated.Title = "Updated title"
		updated.Text = "updated content"
		err = Update(conn, &updated)
		require.NoError(t, err)

		ev, err := Get(conn, newevt.Id)
		require.NoError(t, err)
		require.NotNil(t, ev)
		require.Equal(t, updated, *ev)
	})

	t.Run("TestAddDeleteGet", func(t *testing.T) {
		conn := bt.Conn(t, pool)
		defer pool.Put(conn)
		defer bt.AutoRolloutSavepoint(t, conn)()

		newevt := &Event{
			Draft: true,
			Title: "Test",
			Date:  time.Date(2001, time.January, 1, 0, 0, 0, 0, time.UTC),
			Text:  "content",
		}
		newevt, err := New(conn, newevt)
		require.NoError(t, err)
		require.NotNil(t, newevt)
		require.NotZero(t, newevt.Id)

		err = Delete(conn, newevt.Id)
		require.NoError(t, err)

		ev, err := Get(conn, newevt.Id)
		require.NoError(t, err)
		require.Nil(t, ev)
	})
}
