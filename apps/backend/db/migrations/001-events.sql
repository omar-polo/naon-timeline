create table events (
	id    integer primary key autoincrement,
	draft bool not null,
	lat   real not null,
	lng   real not null,
	title text not null,
	date  text not null,
	text  text,
	url   text,
	image text
);

create index idx_events_date on events (date);
