const db = require('./db');

const SELECT = 'select adjustments.id, users.username, users.id as userid, adjustments.amount, adjustments.date from adjustments inner join users on adjustments.user_id = users.id order by adjustments.date asc;';

function getAdjustments(req, res, next) {
  db.any(SELECT)
    .then((data) => {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Kaikki tasaukset haettu.'
        });
    })
    .catch((err) => {
      return next(err);
    });
}

function createAdjustments(req, res, next) {
  let newValuesStr;
  const newOnesExist = req.body.length > 0;

  if (!newOnesExist) {
    res.status(200)
      .json({
        status: 'success',
        data: null,
        message: 'Ei uusia tasauksia.'
      });
    return;
  }

  newValuesStr = 'values ';
  req.body.map((a, i) => {
    newValuesStr = newValuesStr + '(' + parseInt(a.amount) + ',' + parseInt(a.userid) + ',\'' +  a.date + '\')';
    if (i+1 != req.body.length) {
      newValuesStr = newValuesStr + ',';
    }
  });

  db.tx(t => {
      let queries = [];
      const insert = t.none('insert into adjustments (amount, user_id, date)'+
                        newValuesStr);
      queries.push(insert);
      queries.push(t.any(SELECT));
      return t.batch(queries); // all of the queries are to be resolved;
  })
    .then((data) => {
      res.status(200)
        .json({
          status: 'success',
          data: data[1], // first query returns nothing, 2nd one returns back all adjustments (incl. new ones)
          message: 'Uudet tasaukset luotu.'
        });
    })
    .catch(err => {
      return next(err);
    });
}

function updateAdjustments(req, res, next) {
  const oldOnesExist = req.body.length > 0;

  if (!oldOnesExist) {
    res.status(200)
      .json({
        status: 'success',
        message: 'Ei päivitettäviä tasauksia.'
      });
    return;
  }

  let oldValuesStr;

  oldValuesStr = 'values ';
  req.body.map((a, i) => {
    oldValuesStr = oldValuesStr + '(' + parseInt(a.id) + ',' + parseInt(a.amount) + ',\'' +  a.date + '\'::date)';
    if (i+1 != req.body.length) {
      oldValuesStr = oldValuesStr + ',';
    }
  });

  db.none('update adjustments as a set amount = a2.amount, date = a2.date from (' + oldValuesStr +
                    ') as a2(id, amount, date) where a2.id = a.id')
    .then(() => {
      res.status(200)
        .json({
          status: 'success',
          message: 'Tasausten tiedot päivitetty.'
        });
    })
    .catch((err) => {
      return next(err);
    });
}

module.exports = {
  getAdjustments: getAdjustments,
  createAdjustments: createAdjustments,
  updateAdjustments: updateAdjustments
};
