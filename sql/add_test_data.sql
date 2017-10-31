insert into users(username, password) values ('toinen','$2a$10$By7LeJRmUe0F4ieERHVMoeDDkdQ/hvcLhoK0314yi4.Ygd5mgFBFO');
insert into adjustments(user_id, amount, date) values (1, 50, '2017-10-20');
insert into categories(name) values ('Ruokaostokset');
insert into bills(user_id, category_id, amount, date) values (1, 1, 40, '2017-10-15');
