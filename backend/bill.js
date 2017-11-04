const db = require('./db');

function Month(year, month) {
  this.year = year;
  this.month = month;
  this.toString = function() {
    return this.month + "/" + this.year;
  };
}

const SELECT = 'select '+
               'bills.id,users.username,users.id as userid, bills.amount, '+
               'categories.id as categoryid, categories.name as categoryname, bills.date '+
               'from bills inner join users on bills.user_id = users.id inner join categories on bills.category_id = categories.id '+
               'order by bills.date asc;';

function groupBillsByMonth(allBills) {
  let billsPerMonth = {};
  for (let i = 0; i < allBills.length; i++) {
    let b = allBills[i];
    const date = new Date(b.date);
    const monthYear = new Month(date.getFullYear(),date.getMonth()+1);
    if(!billsPerMonth.hasOwnProperty(monthYear.toString())) {
      billsPerMonth[monthYear.toString()] = [b];
    } else {
      billsPerMonth[monthYear.toString()].push(b);
    }
  }
  return billsPerMonth;
}

function getBills(req, res, next) {
  db.any(SELECT)
    .then((data) => {
      res.status(200)
        .json({
          status: 'success',
          data: groupBillsByMonth(data),
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
