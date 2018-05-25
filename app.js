require('dotenv').load();

const express = require('express');
const config = require('./config/config');
const glob = require('glob');
const passport = require('passport');
const mongoose = require('mongoose');


mongoose.connect(config.db);
const db = mongoose.connection;
db.on('error', function () {
  throw new Error('unable to connect to database at ' + config.db);
});


const models = glob.sync(config.root + '/app/models/*.js');
models.forEach(function (model) {
  require(model);
});
const app = express();


module.exports = require('./config/express')(app, config);


app.listen(config.port, function () {
  console.log('Express server listening on port ' + config.port);
});

