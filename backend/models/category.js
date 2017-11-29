const db = require('../db');

const SELECT ='select c.id, c.name, count(b.id) as bills_count '+
              'from user_groups ug '+
              'inner join users u on u.user_group_id = ug.id '+
              'cross join categories c '+
              'left join bills b on b.category_id = c.id and b.user_id = u.id '+
              'where ug.id = $1 '+
              'group by c.id '+
              'order by c.name asc;';
const ANALYSIS_SELECT = 'select categories.name,sum(amount),date_part(\'year\',bills.date) as year '+
              'from bills '+
              'inner join users on bills.user_id = users.id '+
              'inner join categories on bills.category_id = categories.id ' +
              'where users.user_group_id = $2'; //TODO add users.id in ($1:csv) and
const ANALYSIS_GROUP_BY_WITH_USER = 'group by categories.id,users.id,date_part(\'year\',bills.date) ';
const ANALYSIS_GROUP_BY_WITHOUT_USER = 'group by categories.id,date_part(\'year\',bills.date) ';
const ANALYSIS_ORDER_BY = 'order by categories.name,year asc;';

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

function deleteById(id, success, failure) {
  db.tx(t => {
      let queries = [];
      const update = t.none('update bills set category_id = null where category_id = $1', id);
      queries.push(update);
      const deleteQuery = t.none('delete from categories where id = $1', id);
      queries.push(deleteQuery);
      return t.batch(queries);
  })
    .then(() => {
      return success();
    })
    .catch((err) => {
      return failure(err);
    });
}

function getAnalysisDataForUsers(userGroupId, users,success,failure) {
  const query = ANALYSIS_SELECT + (users.length > 1 ? ANALYSIS_GROUP_BY_WITHOUT_USER : ANALYSIS_GROUP_BY_WITH_USER) + ANALYSIS_ORDER_BY;
  return getAnalysisDataForUserIds(userGroupId, users, query, success, failure);
}

function getAnalysisDataForUserIds(userGroupId, userIds, query, success, failure) {
  db.any(query, [userIds, userGroupId])
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
