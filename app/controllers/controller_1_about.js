var express = require('express'),
    router = express.Router();

module.exports = function (app) {
  app.use('/', router);
};




router.get('/about', (req, res) => {
  res.render('about', {
    title: 'О проекте'
  });
});
