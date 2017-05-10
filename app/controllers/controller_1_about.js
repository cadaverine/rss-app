var express = require('express'),
    router = express.Router();

module.exports = function (app) {
  app.use('/', router);
};


router.use((req, res, next) => {
    if(req.query._method == 'DELETE') {
        req.method = 'DELETE';
        req.url = req.path;
    } 
    else if(req.query._method == 'PUT') {
        req.method = 'PUT';
        req.url = req.path;
    }      
    next(); 
});



router.get('/about', (req, res) => {
  res.render('about', {
    title: 'О проекте'
  });
});
