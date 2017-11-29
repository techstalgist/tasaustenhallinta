const db = require('../db');

function UserGroupObject(data) {
  this.id = data.id;
  this.name = data.name;
  this.password = data.password;
}

function createOne(group, next) {
  db.one('insert into user_groups(name, password) values($1, $2) returning id', [group.name, group.password])
    .then(data => {
      const UserGroupObject = Object.assign({}, group);
      delete UserGroupObject.password; // cannot send password to frontend
      UserGroupObject.id = data.id;
      return next(null, UserGroupObject);
    })
    .catch((err) => {
      return next(err);
    });
}

function findOne(name, next) {
  db.any('select * from user_groups where name=$1',name)
    .then((data) => {
      if (data.length == 0) {
        return next(null, false);
      }
      return next(null, new UserGroupObject(data[0]));
    })
    .catch((err) => {
      return next(err);
    });
}

module.exports = {
  findOne: findOne,
  createOne: createOne,
  UserGroupObject: UserGroupObject
};
