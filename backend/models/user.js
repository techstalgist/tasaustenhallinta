const db = require('../db');

function UserObject(userData) {
  this.id = userData.id;
  this.username = userData.username;
  this.password = userData.password;
  this.userGroupId = userData.user_group_id;
  this.userGroupName = userData.user_group_name;
}

function save(user, next) {
  db.one('insert into users(username, password, user_group_id) values($1, $2, $3) returning id', [user.username, user.password, user.userGroupId])
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

function findOne(username, next) {
  db.any('select users.*, user_groups.name as user_group_name from users inner join user_groups on users.user_group_id = user_groups.id where users.username=$1',username)
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

function findAll(userGroupId, success, failure) {
  db.any('select id, username from users where user_group_id = $1', userGroupId)
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