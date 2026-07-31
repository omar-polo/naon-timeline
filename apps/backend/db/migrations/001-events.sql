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

create virtual table events_fts using fts5(title, text, content='events', content_rowid='id');

create trigger events_ai after insert on events begin
  insert into events_fts(rowid, title, text) values (new.id, new.title, new.text);
end;

create trigger events_ad after delete on events begin
  insert into events_fts(events_fts, rowid, title, text) values ('delete', old.id, old.title, old.text);
end;

create trigger events_au after update on events begin
  insert into events_fts(events_fts, rowid, title, text) values ('delete', old.id, old.title, old.text);
  insert into events_fts(rowid, title, text) values (new.id, new.title, new.text);
end;
