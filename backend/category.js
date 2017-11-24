const db = require('./db');

const SELECT = 'select '+
               'c.id, c.name, count(b.id) as bills_count '+
               'from categories c '+
               'left join bills b on b.category_id = c.id '+
               'group by c.id ' +
               'order by c.name asc;';

function getCategories(req, res, next) {

  db.any(SELECT)
    .then((data) => {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Kategoriat haettu.'
        });
    })
    .catch((err) => {
      return next(err);
    });
}

function createCategories(req, res, next) {
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

  db.tx(t => {
      let queries = [];
      const insert = t.none('insert into categories (name)'+
                        newValuesStr);
      queries.push(insert);
      queries.push(t.any(SELECT));
      return t.batch(queries); // all of the queries are to be resolved;
  })
    .then((data) => {
      res.status(200)
        .json({
          status: 'success',
          data: data[1],
          message: 'Uudet kategoriat luotu.'
        });
    })
    .catch(err => {
      return next(err);
    });
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

  db.none('update categories as c set name = c2.name from (' + oldValuesStr +
                    ') as c2(id, name) where c2.id = c.id')
    .then(() => {
      res.status(200)
        .json({
          status: 'success',
          message: 'Kategorioiden tiedot päivitetty.'
        });
    })
    .catch((err) => {
      return next(err);
    });
}

function deleteCategory(req, res, next) {
  db.tx(t => {
      let queries = [];
      const update = t.none('update bills set category_id = null where category_id = $1', req.params.id);
      queries.push(update);
      const deleteQuery = t.none('delete from categories where id = $1', req.params.id);
      queries.push(deleteQuery);
      return t.batch(queries);
  })
    .then(() => {
      res.status(200)
        .json({
          status: 'success',
          message: 'Kategoria poistettu laskuilta ja kategorioista.'
        });
    })
    .catch((err) => {
      return next(err);
    });
}

module.exports = {
  getCategories: getCategories,
  createCategories: createCategories,
  updateCategories: updateCategories,
  deleteCategory: deleteCategory
};
