const User = require('../models/user');
const jwt = require('jsonwebtoken');
const jwtOptions = require('../config/jwt');
const bcrypt = require('bcrypt');
const bcryptSalt = 10;
const sgMail = require('@sendgrid/mail');
const sendGridKey = process.env.SENDGRID_API_KEY;
const clientURL = process.env.CLIENT_URL;
const senderEmail = process.env.SENDER_EMAIL;

function signUp(req, res, next) {
  let username = req.body.username;
  let password = req.body.password;
  let email = req.body.email;
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
      email: email,
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
      res.status(401).json({ message: 'Käyttäjänimi on väärä.' });
      return;
    }
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (!isMatch) {
        res.status(401).json({ message: 'Salasana on väärä.' });
      } else {
        delete user.password; // cannot send password to frontend
        const payload = {id: user.id, user: user.username};
        const token = jwt.sign(payload, jwtOptions.secretOrKey);
        res.status(200).json({ token, user, message: 'Kirjautuminen onnistui!' });
      }
    })
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

function forgotPassword(req, res, next) {
  const { email } = req.body;
  if (!email) {
    res.status(401).json({ message: 'Anna sähköposti.' });
    return;
  }

  User.findByEmail(email, (err, user) => {
    if (err) {
      res.status(400).json({ message: err });
    } else if (!user) {
      res.status(401).json({ message: 'Sähköpostiosoitteella ei löytynyt käyttäjää.' });
    } else {
      const resetLink = jwt.sign({ email: user.email }, jwtOptions.secretOrKey, { expiresIn: '10m' });
      const userId = user.id;
      const successCall = () => {
        sendEmail(email, resetLink);
        res.status(200)
          .json({
            status: 'success',
            message: 'Tarkista sähköpostisi.'
          });
      };
      User.updateResetLink(userId, resetLink, successCall, next);
    }
  })
}

  function resetPassword(req, res, next) {
    const resetLink = req.params.token;
    let password = req.body.password;
    if(resetLink) {
      jwt.verify(resetLink, jwtOptions.secretOrKey, (error, decodedToken) => {
           if(error) {
             res.status(401).json({ message: 'Virheellinen tai vanhentunut token.' })
           }
      })
    }
    User.findByResetLink(resetLink, (err, user) => {
      if (err) {
        res.status(400).json({ message: err });
      } else if (!user) {
        res.status(401).json({ message: 'Käyttäjää ei löytynyt tälle linkille.' });
      } else {
        let salt = bcrypt.genSaltSync(bcryptSalt);
        let hashPass = bcrypt.hashSync(password, salt);
        const userId = user.id;
        const successCall = () => {
          res.status(200)
            .json({
              status: 'success',
              message: 'Salasana päivitetty.'
            });
        };
        User.updatePassword(userId, hashPass, successCall, next);
      }
    })
  }

  function sendEmail(email, token) {
    sgMail.setApiKey(sendGridKey);
    const msg = {
      to: email,
      from: senderEmail,
      subject: "Tasaustenhallinta: Salasanan resetointi",
      html: `
      <p>
        Voit resetoida salasanan Tasaustenhallintaan tästä linkistä. Älä klikkaa sitä jos et pyytänyt resetointia itse.
        <a href="${clientURL}/reset-password/${token}">${token}</a>
      </p> 
     `
    };
  
    sgMail.send(msg)
      .then(() => {
        console.log("Sähköposti lähetetty");
    }).catch((error) => {
        console.error(error);
    })
  }

module.exports = {
  signUp: signUp,
  logIn: logIn,
  getUsers: getUsers,
  forgotPassword: forgotPassword,
  resetPassword: resetPassword
};
