const db = require('./db');

function save(req, next) {
  db.one('insert into user_groups(name, password) values($1, $2)', [req.body.name, req.body.password])
    .then(() => {
      res.status(200)
        .json({
          status: 'success',
          message: 'Käyttäjäryhmän luonti onnistui.'
        });
    })
    .catch((err) => {
      return next(err);
    });
}

function findOne(data, next) {
  db.any('select * from user_groups where name=$1',[req.body.name])
    .then((data) => {
      if (data.length == 0) {
        return next(null, false);
      }
      return next(null);
    })
    .catch((err) => {
      return next(err);
    });
}


module.exports = {
  findOne: findOne,
  save: save
};
