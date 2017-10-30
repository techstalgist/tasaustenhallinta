CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR,
  password VARCHAR
);

INSERT INTO users (username, password) VALUES ('t', 'testaa');

CREATE TABLE adjustments (
  id SERIAL PRIMARY KEY,
  user_id integer references users(id),
  amount numeric,
  date date
);

INSERT INTO adjustments (user_id, amount, date) VALUES (7, 50, '2017-10-24');
