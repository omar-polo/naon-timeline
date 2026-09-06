create table users (
	id            integer primary key autoincrement,
	email         text not null unique,
	name          text not null,
	password      text not null,
	role          text not null,
	status        text not null,
	created       text not null,
	last_login    text
);
