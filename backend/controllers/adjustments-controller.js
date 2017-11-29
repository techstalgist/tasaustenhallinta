const Adjustment = require('../models/adjustment');

function getAdjustments(req, res, next) {

  const successCall = (data) => {
    res.status(200)
      .json({
        status: 'success',
        data: data,
        message: 'Kaikki tasaukset haettu.'
      });
  };
  Adjustment.findAll(successCall, next);
}

function deleteAdjustment(req, res, next) {

  const id = req.params.id;
  const successCall = () => {
    res.status(200)
      .json({
        status: 'success',
        message: 'Tasaus poistettu.'
      });
  };

  Adjustment.deleteById(id, successCall, next);
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

  const successCall = (data) => {
    res.status(200)
      .json({
        status: 'success',
        data: data[1], // first query returns nothing, 2nd one returns back all adjustments (incl. new ones)
        message: 'Uudet tasaukset luotu.'
      });
  };

  Adjustment.createOneOrMany(newValuesStr, successCall, next);
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
    oldValuesStr = oldValuesStr + '(' + parseInt(a.id) + ',' + parseInt(a.userid) + ',' + parseInt(a.amount) + ',\'' +  a.date + '\'::date)';
    if (i+1 != req.body.length) {
      oldValuesStr = oldValuesStr + ',';
    }
  });

  const successCall = () => {
    res.status(200)
      .json({
        status: 'success',
        message: 'Tasausten tiedot päivitetty.'
      });
  };

  Adjustment.update(oldValuesStr, successCall, next);
}

module.exports = {
  getAdjustments: getAdjustments,
  createAdjustments: createAdjustments,
  updateAdjustments: updateAdjustments,
  deleteAdjustment: deleteAdjustment
};
