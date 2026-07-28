create table events (
	id    integer primary key autoincrement,
	draft bool not null,
	lat   real not null,
	lng   real not null,
	title text not null,
	date  text not null,
	year  integer not null,
	month integer check (month is null or (month between 1 and 12)),
	day   integer check (day is null or (day between 1 and 31)),
	text  text,
	url   text,
	image text
);

create index idx_events_year on events (year);
