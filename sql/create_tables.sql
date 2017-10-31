CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR,
  password VARCHAR
);

CREATE TABLE adjustments (
  id SERIAL PRIMARY KEY,
  user_id integer references users(id),
  amount numeric,
  date date
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
