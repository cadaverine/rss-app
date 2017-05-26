var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var ctrlAbout = require('../controllers/about');
var ctrlSources = require('../controllers/sources');
var ctrlNews = require('../controllers/news');
var ctrlProfile = require('../controllers/profile');


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


function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        req.flash('error_msg','You are not logged in');
        res.redirect('/login');
    }
}

// About
router.get('/about', ctrlAbout.about);

// Sources
router.get('/sources', ensureAuthenticated, ctrlSources.getSources);
router.get('/sources/my', ensureAuthenticated, ctrlSources.getMySources);
router.get('/sources/all', ensureAuthenticated, ctrlSources.getAllSources);

router.post('/add_source', ensureAuthenticated, ctrlSources.addSource);
router.post('/add_source/:id', ensureAuthenticated, ctrlSources.AddSourceFromDB);

router.delete('/sources/:id', ensureAuthenticated, ctrlSources.deleteSource);

// Profile
router.get('/login', ctrlProfile.getLoginPage);
router.post('/login', passport.authenticate('local', {successRedirect:'/', failureRedirect:'/login', failureFlash: true}));

router.get('/signup', ctrlProfile.getSignupPage);
router.post('/signup', ctrlProfile.sendSignupInfo);

router.get('/logout', ctrlProfile.logout);

// News
router.get('/:id?', ensureAuthenticated, ctrlNews.getNews);
router.put('/update', ensureAuthenticated, ctrlNews.updateNews);


