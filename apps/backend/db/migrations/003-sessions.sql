-- unlike users' date-only columns, sessions need real timestamp
-- precision for expiry, so created/expires are stored as RFC3339 text.
create table sessions (
	token_hash text primary key,
	user_id    integer not null references users(id),
	created    text not null,
	expires    text not null
);
