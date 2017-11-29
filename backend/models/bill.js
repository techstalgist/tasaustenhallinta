const db = require('../db');

const SELECT = 'select '+
               'bills.id,users.username,users.id as userid, bills.amount, '+
               'categories.id as categoryid, categories.name as categoryname, bills.date '+
               'from bills inner join users on bills.user_id = users.id left join categories on bills.category_id = categories.id '+
               'where users.user_group_id = $1 ' +
               'order by bills.date asc;';

function findAll(userGroupId, success, failure) {
  db.any(SELECT, userGroupId)
    .then((data) => {
      return success(data);
    })
    .catch((err) => {
      return failure(err);
    });
}

function createOneOrMany(userGroupId, values, success, failure) {
  db.tx(t => {
      let queries = [];
      const insert = t.none('insert into bills (amount, category_id, user_id, date)'+
                        values);
      queries.push(insert);
      queries.push(t.any(SELECT, userGroupId));
      return t.batch(queries);
  })
    .then((data) => {
      return success(data);
    })
    .catch((err) => {
      return failure(err);
    });
}

function update(values, success, failure) {
  db.none('update bills as b set amount = b2.amount, user_id = b2.user_id, category_id = b2.category_id, date = b2.date from (' + values +
                    ') as b2(id, user_id, category_id, amount, date) where b2.id = b.id')
    .then(() => {
      return success();
    })
    .catch((err) => {
      return failure(err);
    });
}

function deleteById(id, success, failure) {
  db.none('delete from bills where id = $1', id)
    .then(() => {
      return success();
    })
    .catch((err) => {
      return failure(err);
    });
}

module.exports = {
  findAll: findAll,
  createOneOrMany: createOneOrMany,
  update: update,
  deleteById: deleteById
};
