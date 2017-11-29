const db = require('../db');

function UserObject(userData) {
  this.id = userData.id;
  this.username = userData.username;
  this.password = userData.password;
}

function save(user, next) {
  db.one('insert into users(username, password) values($1, $2) returning id', [user.username, user.password])
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
  db.any('select * from users where username=$1',[data.username])
    .then((data) => {
      if (data.length == 0) {
        return next(null, false);
      }
      return next(null, new UserObject(data[0]));
    })
    .catch((err) => {
      return next(err);
    });
}

function findById(id, next) {
  db.any('select * from users where id=$1',[id])
    .then((data) => {
      if (data.length == 0) {
        return next(null, false);
      }
      return next(null, new UserObject(data[0]));
    })
    .catch((err) => {
      return next(err);
    });
}

function findAll(success, failure) {
  db.any('select id, username from users')
    .then((data) => {
      return success(data);
    })
    .catch((err) => {
      return failure(err);
    });
}

module.exports = {
  UserObject: UserObject,
  findOne: findOne,
  findById: findById,
  save: save,
  findAll: findAll
};
