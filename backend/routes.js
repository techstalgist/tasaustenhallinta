const express = require('express');
const passport = require('./config/passport');
const jwt = require('jsonwebtoken');
const jwtOptions = require('./config/jwt');
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

const Adjustment = require('./adjustment');
const Bill = require('./bill');
const Category = require('./category');
const UserDao = require('./user-dao');
const Analysis = require('./analysis');

const router = express.Router();

router.post('/signup', (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;

  if (!username || !password) {
    res.status(400).json({ message: 'Anna käyttäjänimi ja salasana.' });
    return;
  }

  UserDao.findOne({ username }, (err, foundUser) => {
    if (foundUser) {
      res.status(400).json({ message: 'Antamasi käyttäjänimi on jo käytössä.' });
      return;
    }

    let salt = bcrypt.genSaltSync(bcryptSalt);
    let hashPass = bcrypt.hashSync(password, salt);

    const newUser = new UserDao.User({
      username: username,
      password: hashPass
    });

    UserDao.save(newUser, (err, user) => {
      if (err) {
        res.status(400).json({ message: err });
      }
      else {
        const payload = {id: user.id, user: user.username};
        const token = jwt.sign(payload, jwtOptions.secretOrKey);
        res.status(200).json({ token, user, message: 'Rekisteröityminen onnistui!' });
      }
    });
  });
});

router.post('/login', (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;
  if (!username || !password) {
    res.status(401).json({ message: 'Anna käyttäjänimi ja salasana.' });
    return;
  }

  UserDao.findOne({'username': username}, (err, user) => {
    if (!user) {
      res.status(401).json({ message: 'Käyttäjänimi tai salasana on väärä.' });
      return;
    }
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (!isMatch) {
        res.status(401).json({ message: 'Käyttäjänimi tai salasana on väärä.' });
      }
      else {
        delete user.password; // cannot send password to frontend
        const payload = {id: user.id, user: user.username};
        const token = jwt.sign(payload, jwtOptions.secretOrKey);
        res.status(200).json({ token, user, message: 'Kirjautuminen onnistui!' });
      }
    });
  });
});

router.get('/users', passport.authenticate('jwt', { session: false }), UserDao.getUsers);

router.get('/adjustments', passport.authenticate('jwt', { session: false }), Adjustment.getAdjustments);
router.post('/adjustments', passport.authenticate('jwt', { session: false }), Adjustment.createAdjustments);
router.put('/adjustments', passport.authenticate('jwt', { session: false }), Adjustment.updateAdjustments);
router.delete('/adjustments/:id', passport.authenticate('jwt', { session: false }), Adjustment.deleteAdjustment);

router.get('/bills', passport.authenticate('jwt', { session: false }), Bill.getBills);
router.post('/bills', passport.authenticate('jwt', { session: false }), Bill.createBills);
router.put('/bills', passport.authenticate('jwt', { session: false }), Bill.updateBills);
router.delete('/bills/:id', passport.authenticate('jwt', { session: false }), Bill.deleteBill);

router.get('/categories', passport.authenticate('jwt', { session: false }), Category.getCategories);
router.post('/categories', passport.authenticate('jwt', { session: false}), Category.createCategories);
router.put('/categories', passport.authenticate('jwt', { session: false}), Category.updateCategories);
router.delete('/categories/:id', passport.authenticate('jwt', { session: false }), Category.deleteCategory);

router.post('/analysis', passport.authenticate('jwt', { session: false }), Analysis.getDataForUser);

module.exports = router;
