with periods as (
 SELECT date_part('month', generate_series) as month
 FROM generate_series('2018-01-01 00:00'::timestamp, now(), '1 month')
)
select p.month, u.username, avg(b.amount), count(b.id), sum(b.amount)
from users u
cross join periods p
left join bills b on b.user_id = u.id
left join categories c on b.category_id = c.id
and date_part('month', b.date) = p.month
where u.id in (1,2) 
and c.name = 'Ruokaostokset'
and b.date > '2017-12-31'
group by p.month, u.id
order by p.month asc;


with periods as (
 SELECT date_part('year', generate_series) as year
 FROM generate_series('2018-01-01 00:00'::timestamp, now(), '1 year')
)
select p.year, u.username, avg(b.amount), count(b.id), sum(b.amount)
from users u
cross join periods p
left join bills b on b.user_id = u.id
left join categories c on b.category_id = c.id
and date_part('year', b.date) = p.year
where u.id in (1,2) 
and c.name = 'Ruokaostokset'
and b.date > '2017-12-31'
group by p.year, u.id
order by p.year asc;

with periods as (
 SELECT date_part('year', generate_series) as year
 FROM generate_series('2018-01-01 00:00'::timestamp, now(), '1 year')
)
select p.year, u.username, avg(b.amount), count(b.id), sum(b.amount), c.name
from users u
cross join periods p
left join bills b on b.user_id = u.id
left join categories c on b.category_id = c.id
and date_part('year', b.date) = p.year
where u.id in (1,2) 
and c.name != 'Ruokaostokset'
and b.date > '2017-12-31'
group by p.year, u.id, c.name
order by c.name asc;