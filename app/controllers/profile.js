const mongoose = require('mongoose');
const User = mongoose.model('User');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


//***************************
//***************************
//***************************
// "Login" section:
//***************************
//***************************
//***************************



module.exports.getLoginPage = (req, res) => {
  res.render('login', {
    title: 'Войти'
  });
}


//***************************
//***************************
//***************************
// "Sign Up" section:
//***************************
//***************************
//***************************


module.exports.getSignupPage = (req, res) => {
  // User.remove({}, () => { console.log("Все пользователи удалены.") });
  res.render('signup', {
    title: 'Регистрация'
  });
}


module.exports.sendSignupInfo = (req, res) => {
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const password2 = req.body.password2;

  //Validation
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  const errors = req.validationErrors();

  if(errors) {
    res.render('signup',{
      title: 'Регистрация',
      errors: errors
    });
  }
  else {
    User.findOne( { username: username },  (error, user) => {
      if (error) throw error;
      if (user) {
        req.flash('error_msg', 'Пользователь с таким именем уже существует.');
        res.redirect('/signup');
        return;
      }
      else {
        const newUser = new User({
          email:email,
          username: username,
          password: password
        });

        User.createUser(newUser, (error, user) => {
          if (error) throw err;
        });

        req.flash('success_msg', 'You are registered and can now login');
        res.redirect('/login');
      }
    })
  }
}


//***************************
//***************************
//***************************
// "Logout" section:
//***************************
//***************************
//***************************


module.exports.logout = (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/login');
}