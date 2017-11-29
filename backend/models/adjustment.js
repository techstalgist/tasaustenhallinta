const db = require('../db');

const SELECT = 'select adjustments.id, users.username, users.id as userid, adjustments.amount, adjustments.date from adjustments inner join users on adjustments.user_id = users.id order by adjustments.date asc;';

function findAll(success, failure) {
  db.any(SELECT)
    .then(data => {
      return success(data);
    }).catch((err) => {
      return failure(err);
    });
}

function deleteById(id, success, failure) {
  db.none('delete from adjustments where id = $1', id)
    .then(() => {
      return success();
    })
    .catch((err) => {
      return failure(err);
    });
}

function createOneOrMany(values, success, failure) {
  db.tx(t => {
      let queries = [];
      const insert = t.none('insert into adjustments (amount, user_id, date)'+
                        values);
      queries.push(insert);
      queries.push(t.any(SELECT));
      return t.batch(queries);
  })
    .then((data) => {
      return success(data);
    }).catch((err) => {
      return failure(err);
    });
}

function update(values, success, failure) {
  db.none('update adjustments as a set amount = a2.amount, user_id = a2.user_id, date = a2.date from (' + values +
                    ') as a2(id, user_id, amount, date) where a2.id = a.id')
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
