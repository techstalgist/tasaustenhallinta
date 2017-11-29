const UserGroup = require('../models/user-group');
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

function signUpGroup(req, res, next) {
  let groupName = req.body.name;
  let password = req.body.password;

  if (!groupName || !password) {
    res.status(400).json({ message: 'Anna ryhmän nimi ja salasana.' });
    return;
  }

  const callThisNext = (err, found) => {
    if (found) {
      res.status(400).json({ message: 'Antamasi ryhmän nimi on jo käytössä.' });
      return;
    }

    let salt = bcrypt.genSaltSync(bcryptSalt);
    let hashPass = bcrypt.hashSync(password, salt);
    const newUserGroup = new UserGroup.UserGroupObject({
      name: groupName,
      password: hashPass
    });

    UserGroup.createOne(newUserGroup, (err, userGroup) => {
      if (err) {
        res.status(400).json({ message: err });
      }
      else {
        res.status(200).json({ userGroup, message: 'Käyttäjäryhmän rekisteröityminen onnistui!' });
      }
    });
  };

  UserGroup.findOne(groupName, callThisNext);
}

function logIntoGroup(req, res, next) {
  const groupName = req.body.name;
  const password = req.body.password;

  const callThisNext = (err, userGroup) => {
    if (!userGroup) {
      res.status(401).json({ message: 'Ryhmän nimi tai salasana on väärä.' });
      return;
    }
    bcrypt.compare(password, userGroup.password, (err, isMatch) => {
      if (!isMatch) {
        res.status(401).json({ message: 'Ryhmän nimi tai salasana on väärä.' });
      }
      else {
        delete userGroup.password; // cannot send password to frontend
        res.status(200).json({userGroup, message: 'Kirjautuminen käyttäjäryhmään onnistui!' });
      }
    });
  };

  UserGroup.findOne(groupName, callThisNext);
}

module.exports = {
  logIntoGroup: logIntoGroup,
  signUpGroup: signUpGroup
};
