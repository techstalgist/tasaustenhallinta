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
               'from bills inner join users on bills.user_id = users.id left join categories on bills.category_id = categories.id '+
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

function deleteBill(req, res, next) {
  db.none('delete from bills where id = $1', req.params.id)
    .then(() => {
      res.status(200)
        .json({
          status: 'success',
          message: 'Lasku poistettu.'
        });
    })
    .catch((err) => {
      return next(err);
    });
}

function createBills(req, res, next) {
  let newValuesStr;
  const newOnesExist = req.body.length > 0;

  if (!newOnesExist) {
    res.status(200)
      .json({
        status: 'success',
        data: null,
        message: 'Ei uusia laskuja.'
      });
    return;
  }

  newValuesStr = 'values ';
  req.body.map((a, i) => {
    newValuesStr = newValuesStr + '(' + parseInt(a.amount) + ',' + parseInt(a.categoryid) + ',' + parseInt(a.userid) + ',\'' +  a.date + '\')';
    if (i+1 != req.body.length) {
      newValuesStr = newValuesStr + ',';
    }
  });

  db.tx(t => {
      let queries = [];
      const insert = t.none('insert into bills (amount, category_id, user_id, date)'+
                        newValuesStr);
      queries.push(insert);
      queries.push(t.any(SELECT));
      return t.batch(queries); // all of the queries are to be resolved;
  })
    .then((data) => {
      res.status(200)
        .json({
          status: 'success',
          data: groupBillsByMonth(data[1]), // first query returns nothing, 2nd one returns back all bills (incl. new ones)
          message: 'Uudet laskut luotu.'
        });
    })
    .catch(err => {
      return next(err);
    });
}

function updateBills(req, res, next) {
  const oldOnesExist = req.body.length > 0;

  if (!oldOnesExist) {
    res.status(200)
      .json({
        status: 'success',
        message: 'Ei päivitettäviä laskuja.'
      });
    return;
  }

  let oldValuesStr;

  oldValuesStr = 'values ';
  req.body.map((a, i) => {
    oldValuesStr = oldValuesStr + '(' + parseInt(a.id) + ',' + parseInt(a.userid) + ',' + parseInt(a.categoryid) + ',' + parseInt(a.amount) + ',\'' +  a.date + '\'::date)';
    if (i+1 != req.body.length) {
      oldValuesStr = oldValuesStr + ',';
    }
  });

  db.none('update bills as b set amount = b2.amount, user_id = b2.user_id, category_id = b2.category_id, date = b2.date from (' + oldValuesStr +
                    ') as b2(id, user_id, category_id, amount, date) where b2.id = b.id')
    .then(() => {
      res.status(200)
        .json({
          status: 'success',
          message: 'Laskujen tiedot päivitetty.'
        });
    })
    .catch((err) => {
      return next(err);
    });
}

module.exports = {
  getBills: getBills,
  createBills: createBills,
  updateBills: updateBills,
  deleteBill: deleteBill
};
