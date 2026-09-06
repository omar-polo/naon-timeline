-- password values are placeholders, not real bcrypt hashes - nothing in this
-- fixture is used to exercise a login flow yet.
insert into users (email, name, password, role, status, created, last_login)
values ('sofia.ricci@example.com', 'Sofia Ricci', 'placeholder', 'admin', 'active', '2024-01-15', '2026-07-27');

insert into users (email, name, password, role, status, created, last_login)
values ('marco.bianchi@example.com', 'Marco Bianchi', 'placeholder', 'admin', 'active', '2024-02-03', '2026-07-20');

insert into users (email, name, password, role, status, created, last_login)
values ('elena.conti@example.com', 'Elena Conti', 'placeholder', 'user', 'active', '2024-03-11', '2026-07-25');

insert into users (email, name, password, role, status, created, last_login)
values ('davide.romano@example.com', 'Davide Romano', 'placeholder', 'user', 'disabled', '2024-04-22', null);
