const promise = require('bluebird');

const options = {
  promiseLib: promise
};
const pgp = require('pg-promise')(options);

const config = {
  host: 'localhost',
  port: 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
};

// select typname, oid, typarray from pg_type where typname = 'date' order by oid
// 1082 is oid for datatype 'date'
// stupid pg adds timestamp with timezone by default, which messes up all dates
pgp.pg.types.setTypeParser(1082, function (stringVal) {
  return stringVal;
});

const db = pgp(config);

module.exports = db;
