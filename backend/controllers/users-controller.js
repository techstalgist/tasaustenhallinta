const User = require('../models/user');
const jwt = require('jsonwebtoken');
const jwtOptions = require('../config/jwt');
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

function signUp(req, res, next) {
  let username = req.body.username;
  let password = req.body.password;
  let groupId = req.body.user_group_id;

  if (!groupId) {
    res.status(400).json({ message: 'Käyttäjäryhmää ei annettu.' });
    return;
  }

  if (!username || !password) {
    res.status(400).json({ message: 'Anna käyttäjänimi ja salasana.' });
    return;
  }

  User.findOne(username, (err, foundUser) => {
    if (foundUser) {
      res.status(400).json({ message: 'Antamasi käyttäjänimi on jo käytössä.' });
      return;
    }

    let salt = bcrypt.genSaltSync(bcryptSalt);
    let hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User.UserObject({
      username: username,
      password: hashPass,
      user_group_id: groupId
    });

    User.save(newUser, (err, user) => {
      if (err) {
        res.status(400).json({ message: err });
      }
      else {
        const payload = {id: user.id, user: user.username};
        const token = jwt.sign(payload, jwtOptions.secretOrKey);
        res.status(200).json({ message: 'Käyttäjän luonti onnistui! Voit nyt kirjautua sisään luomallasi käyttäjällä.' });
      }
    });
  });
}

function logIn(req, res, next) {
  let username = req.body.username;
  let password = req.body.password;
  if (!username || !password) {
    res.status(401).json({ message: 'Anna käyttäjänimi ja salasana.' });
    return;
  }

  User.findOne(username, (err, user) => {
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
}

function getUsers(req,res,next) {
  const userGroupId = parseInt(req.user.userGroupId);
  const successCall = (data) => {
    res.status(200)
      .json({
        status: 'success',
        data: data,
        message: 'Käyttäjät haettu.'
      });
  };

  User.findAll(userGroupId, successCall, next);
}

module.exports = {
  signUp: signUp,
  logIn: logIn,
  getUsers: getUsers
};
