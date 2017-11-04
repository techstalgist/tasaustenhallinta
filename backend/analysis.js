const db = require('./db');

const SELECT = 'select categories.name,sum(amount),date_part(\'year\',bills.date) as year '+
               'from bills '+
               'inner join users on bills.user_id = users.id inner join categories on bills.category_id = categories.id ' +
               'where users.id in ($1:csv)';
const GROUP_BY_WITH_USER = 'group by categories.id,users.id,date_part(\'year\',bills.date) ';
const GROUP_BY_WITHOUT_USER = 'group by categories.id,date_part(\'year\',bills.date) ';
const ORDER_BY = 'order by categories.name,year asc;';


function getTemplateObject(untilDate) {
  let rollingDate = new Date('2014-01-01');
  let obj = {};
  while(rollingDate <= untilDate) {
    let year = rollingDate.getFullYear();
    obj[year] = 0;
    rollingDate.setMonth(rollingDate.getMonth()+12);
  }
  return obj;
}

function groupSumsByCategory(data) {
 let sumsByCategory = {};

 for (let i = 0; i < data.length; i++) {
   let s = data[i];
   if(!sumsByCategory.hasOwnProperty(s.name)) {
     sumsByCategory[s.name] = getTemplateObject(new Date());
   }
   sumsByCategory[s.name][s.year] = s.sum;
 }
 return sumsByCategory;
}


function getDataForUser(req,res,next) {
  const userIds = JSON.parse("[" + req.body.users + "]");
  const query = SELECT + (userIds.length > 1 ? GROUP_BY_WITHOUT_USER : GROUP_BY_WITH_USER) + ORDER_BY;
  return getDataForUserIds(userIds, query, res, next);
}

function getDataForUserIds(userIds, query, res, next) {

  db.any(query, [userIds])
    .then((data) => {
      res.status(200)
        .json({
          status: 'success',
          data: groupSumsByCategory(data),
          message: 'Analyysidatat haettu.'
        });
    })
    .catch((err) => {
      return next(err);
    });
}

module.exports = {
  getDataForUser: getDataForUser
};
