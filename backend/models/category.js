const db = require('../db');

const SELECT ='select c.id, c.name, count(b.id) as bills_count '+
              'from user_groups ug '+
              'inner join users u on u.user_group_id = ug.id '+
              'cross join categories c '+
              'left join bills b on b.category_id = c.id and b.user_id = u.id '+
              'where ug.id = $1 '+
              'group by c.id '+
              'order by c.name asc;';
const ANALYSIS_SELECT =
              'with periods as ( ' +
              'SELECT date_part(\'year\', generate_series) as year '+
              'FROM generate_series(\'2014-01-01 00:00\'::timestamp, now(), \'1 year\') ' +
              ') '+
              'select c.name, p.year, sum(b.amount) '+
              'from users u '+
              'cross join categories c '+
              'cross join periods p '+
              'left join bills b on b.category_id = c.id '+
              'and b.user_id = u.id '+
              'and date_part(\'year\',b.date) = p.year '+
              'where u.id in ($1:csv) and u.user_group_id = $2 '+
              'group by c.name, p.year ' +
              'order by c.name asc, p.year asc; ';

const ANALYSIS_TOTAL_SELECT =
              'with periods as ( ' +
              'SELECT date_part(\'year\', generate_series) as year '+
              'FROM generate_series(\'2014-01-01 00:00\'::timestamp, now(), \'1 year\') ' +
              ') '+
              'select \'Yhteensä\' as name, p.year, sum(b.amount) '+
              'from users u '+
              'cross join periods p '+
              'left join bills b on '+
              'b.user_id = u.id '+
              'and date_part(\'year\',b.date) = p.year '+
              'where u.id in ($1:csv) and u.user_group_id = $2 '+
              'group by p.year ' +
              'order by p.year asc; ';

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
      const insert = t.none('insert into categories (name)'+
                        values);
      queries.push(insert);
      queries.push(t.any(SELECT, userGroupId));
      return t.batch(queries);
  })
    .then((data) => {
      return success(data);
    })
    .catch(err => {
      return failure(err);
    });
}

function update(values, success, failure) {
  db.none('update categories as c set name = c2.name from (' + values +
                    ') as c2(id, name) where c2.id = c.id')
    .then(() => {
      return success();
    })
    .catch((err) => {
      return failure(err);
    });
}

function deleteById(id, userGroupId, success, failure) {
  db.tx(t => {
      let queries = [];
      const update = t.none('update bills b set category_id = null from users u where b.user_id = u.id and b.category_id = $1 and u.user_group_id = $2', [id, userGroupId]);
      queries.push(update);
      const deleteQuery = t.oneOrNone('delete from categories where id = $1 and id in ' +
                                 '(select c.id from categories c left join bills b on b.category_id = c.id group by c.id having count(b.id) = 0) '+
                                 'returning id', id);
      queries.push(deleteQuery);
      return t.batch(queries);
  })
    .then((data) => {
      return success(data);
    })
    .catch((err) => {
      return failure(err);
    });
}

function getAnalysisDataForUsers(userGroupId, users,success,failure) {
  const query = ANALYSIS_SELECT;
  return getAnalysisDataForUserIds(userGroupId, users, query, success, failure);
}

function getAnalysisDataForUserIds(userGroupId, userIds, query, success, failure) {
  db.tx(t => {
      let queries = [];
      queries.push(t.any(query, [userIds, userGroupId]));
      queries.push(t.any(ANALYSIS_TOTAL_SELECT, [userIds, userGroupId]));
      return t.batch(queries);
  })
    .then((data) => {
      return success(data);
    })
    .catch((err) => {
      return failure(err);
    });
}

module.exports = {
  findAll: findAll,
  createOneOrMany: createOneOrMany,
  update: update,
  deleteById: deleteById,
  getAnalysisDataForUsers: getAnalysisDataForUsers
};
