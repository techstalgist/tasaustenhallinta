const db = require('./db');

const SELECT = 'select '+
               'bills.id,users.username,users.id as userid, bills.amount, '+
               'categories.id as categoryid, categories.name as categoryname, bills.date '+
               'from bills inner join users on bills.user_id = users.id inner join categories on bills.category_id = categories.id '+
               'where date_part(\'year\',date)=$1 and date_part(\'month\',date)=$2'+
               'order by bills.date asc;';

function getBills(req, res, next) {
  const monthYear = req.params.month + "/" + req.params.year;
  db.any(SELECT, [req.params.year, req.params.month])
    .then((data) => {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          monthYear: monthYear,
          message: 'Laskut haettu.'
        });
    })
    .catch((err) => {
      return next(err);
    });
}

module.exports = {
  getBills: getBills
};
