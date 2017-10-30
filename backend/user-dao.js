const db = require('./db');

function User(userData) {
  this.id = userData.id;
  this.username = userData.username;
  this.password = userData.password;
}

function save(user, next) {
  db.one('INSERT INTO users(username, password) VALUES($1, $2) RETURNING id', [user.username, user.password])
    .then(data => {
      const newUser = Object.assign({}, user);
      delete newUser.password; // cannot send password to frontend
      newUser.id = data.id;
      return next(null, newUser);
    })
    .catch(err => {
      return next(err);
    });
}

function findOne(data, next) {
  db.any('SELECT * FROM USERS WHERE USERNAME=$1',[data.username])
    .then((data) => {
      if (data.length == 0) {
        return next(null, false);
      }
      return next(null, new User(data[0]));
    })
    .catch((err) => {
      return next(err);
    });
}

function findById(id, next) {
  db.any('SELECT * FROM USERS WHERE ID=$1',[id])
    .then((data) => {
      if (data.length == 0) {
        return next(null, false);
      }
      return next(null, new User(data[0]));
    })
    .catch((err) => {
      return next(err);
    });
}

module.exports = {
  User: User,
  findOne: findOne,
  findById: findById,
  save: save
};
