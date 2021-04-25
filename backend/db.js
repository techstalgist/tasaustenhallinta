const promise = require('bluebird');

const options = {
  promiseLib: promise
};
const pgp = require('pg-promise')(options);

let config;

if (process.env.DATABASE_URL !== undefined) {
  config = process.env.DATABASE_URL;
} else {
  config = {
    host: 'localhost',
    port: 5432,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
  };
}

// select typname, oid, typarray from pg_type where typname = 'date' order by oid
// 1082 is oid for datatype 'date'
// stupid pg adds timestamp with timezone by default, which messes up all dates
pgp.pg.types.setTypeParser(1082, function (stringVal) {
  return stringVal;
});

const db = pgp(config);

db.connect()
    .then(obj => {
        // Can check the server version here (pg-promise v10.1.0+):
        const serverVersion = obj.client.serverVersion;

        obj.done(); // success, release the connection;
    })
    .catch(error => {
        console.log('ERROR:', error.message || error);
});

module.exports = db;
