const db = require('./db');

const SELECT = 'select '+
               '* '+
               'from categories '+
               'order by name asc;';

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

module.exports = {
  getCategories: getCategories
};
