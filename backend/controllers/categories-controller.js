const Category = require('../models/category');

function getCategories(req, res, next) {
  const userGroupId = parseInt(req.user.userGroupId);
  const successCall = (data) => {
    res.status(200)
      .json({
        status: 'success',
        data: data,
        message: 'Kategoriat haettu.'
      });
  };

  Category.findAll(userGroupId, successCall, next);
}

function createCategories(req, res, next) {
  const userGroupId = parseInt(req.user.userGroupId);
  let newValuesStr;
  const newOnesExist = req.body.length > 0;

  if (!newOnesExist) {
    res.status(200)
      .json({
        status: 'success',
        data: null,
        message: 'Ei uusia kategorioita.'
      });
    return;
  }
  newValuesStr = 'values ';
  req.body.map((c, i) => {
    newValuesStr = newValuesStr + '(\'' + c.name + '\')';
    if (i+1 != req.body.length) {
      newValuesStr = newValuesStr + ',';
    }
  });
  const successCall = (data) => {
    res.status(200)
      .json({
        status: 'success',
        data: data[1],
        message: 'Uudet kategoriat luotu.'
      });
  };

  Category.createOneOrMany(userGroupId, newValuesStr, successCall, next);
}

function updateCategories(req, res, next) {
  const oldOnesExist = req.body.length > 0;

  if (!oldOnesExist) {
    res.status(200)
      .json({
        status: 'success',
        message: 'Ei päivitettäviä kategorioita.'
      });
    return;
  }

  let oldValuesStr;
  oldValuesStr = 'values ';
  req.body.map((c, i) => {
    oldValuesStr = oldValuesStr + '(' + parseInt(c.id) + ',\'' + c.name + '\')';
    if (i+1 != req.body.length) {
      oldValuesStr = oldValuesStr + ',';
    }
  });
  const successCall = () => {
    res.status(200)
      .json({
        status: 'success',
        message: 'Kategorioiden tiedot päivitetty.'
      });
  };
  Category.update(oldValuesStr, successCall, next);
}

function deleteCategory(req, res, next) {
  const userGroupId = parseInt(req.user.userGroupId);
  const id = parseInt(req.params.id);
  const successCall = (data) => {
    res.status(200)
      .json({
        data: data[1], //toisessa queryssa palautetaan poistetun kategorian id, jos se todella poistettiin.
        status: 'success',
        message: 'Kategoria poistettu laskuilta ja kategorioista.'
      });
  };
  Category.deleteById(id, userGroupId, successCall, next);
}

module.exports = {
  getCategories: getCategories,
  createCategories: createCategories,
  updateCategories: updateCategories,
  deleteCategory: deleteCategory
};
