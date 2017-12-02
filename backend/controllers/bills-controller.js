const db = require('../db');
const Bill = require('../models/bill');

function getBills(req, res, next) {
  const userGroupId = parseInt(req.user.userGroupId);
  const successCall = (data) => {
    res.status(200)
      .json({
        status: 'success',
        data: groupBillsByMonth(data),
        message: 'Laskut haettu.'
      });
  };

  Bill.findAll(userGroupId, successCall, next);
}

function deleteBill(req, res, next) {
  const id = parseInt(req.params.id);
  const successCall = () => {
    res.status(200)
      .json({
        status: 'success',
        message: 'Lasku poistettu.'
      });
  };
  Bill.deleteById(id, successCall, next);
}

function createBills(req, res, next) {
  const userGroupId = parseInt(req.user.userGroupId);
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
    newValuesStr = newValuesStr + '(' + parseFloat(a.amount) + ',' + parseInt(a.categoryid) + ',' + parseInt(a.userid) + ',\'' +  a.date + '\')';
    if (i+1 != req.body.length) {
      newValuesStr = newValuesStr + ',';
    }
  });

  const successCall = (data) => {
    res.status(200)
      .json({
        status: 'success',
        data: groupBillsByMonth(data[1]), // first query returns nothing, 2nd one returns back all bills (incl. new ones)
        message: 'Uudet laskut luotu.'
      });
  };

  Bill.createOneOrMany(userGroupId, newValuesStr, successCall, next);
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
    oldValuesStr = oldValuesStr + '(' + parseInt(a.id) + ',' + parseInt(a.userid) + ',' + parseInt(a.categoryid) + ',' + parseFloat(a.amount) + ',\'' +  a.date + '\'::date)';
    if (i+1 != req.body.length) {
      oldValuesStr = oldValuesStr + ',';
    }
  });
  const successCall = () => {
    res.status(200)
      .json({
        status: 'success',
        message: 'Laskujen tiedot päivitetty.'
      });
  };

  Bill.update(oldValuesStr, successCall, next);
}

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

function Month(year, month) {
  this.year = year;
  this.month = month;
  this.toString = function() {
    return this.month + "/" + this.year;
  };
}

module.exports = {
  getBills: getBills,
  createBills: createBills,
  updateBills: updateBills,
  deleteBill: deleteBill
};
