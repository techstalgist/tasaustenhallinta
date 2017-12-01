CREATE TABLE user_groups (
  id SERIAL PRIMARY KEY,
  name VARCHAR,
  password VARCHAR
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR,
  password VARCHAR,
  user_group_id INTEGER references user_groups(id)
);

CREATE TABLE adjustments (
  id SERIAL PRIMARY KEY,
  user_id integer references users(id),
  amount numeric,
  date date,
  comment text
);

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR
);

CREATE TABLE bills (
  id SERIAL PRIMARY KEY,
  user_id integer references users(id),
  category_id integer references categories(id),
  amount numeric,
  date date
);
