//require('dotenv').config();
const express = require('express');
const expressLogging = require('express-logging');
const logger = require('logops');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const routes = require('./backend/routes');

const app = express();
app.use(expressLogging(logger));
const port = 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

if (process.env.NODE_ENV === 'production') {
  console.log("serving static assets");
  app.use(express.static('client/build'));
}

app.use('/', routes);

app.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Listening on port " + port);
  }
});
