insert into user_groups(name, password) values('Mikko ja Sara', '$2a$10$By7LeJRmUe0F4ieERHVMoeDDkdQ/hvcLhoK0314yi4.Ygd5mgFBFO');
insert into users(username, password,user_group_id) values ('eka','$2a$10$By7LeJRmUe0F4ieERHVMoeDDkdQ/hvcLhoK0314yi4.Ygd5mgFBFO',1);
insert into users(username, password,user_group_id) values ('toinen','$2a$10$By7LeJRmUe0F4ieERHVMoeDDkdQ/hvcLhoK0314yi4.Ygd5mgFBFO',1);
insert into categories(name) values ('Ruokaostokset');
insert into categories(name) values ('Sähkölasku');

insert into bills(user_id, category_id, amount, date) values (1, 1, 60, '2017-11-15');
insert into bills(user_id, category_id, amount, date) values (1, 1, 40, '2017-10-15');
insert into bills(user_id, category_id, amount, date) values (2, 1, 30, '2017-11-10');
insert into bills(user_id, category_id, amount, date) values (2, 1, 60, '2017-10-18');

insert into adjustments(user_id, amount, date) values (2, 30, '2017-10-31');
insert into adjustments(user_id, amount, date) values (1, 20, '2017-11-30');
