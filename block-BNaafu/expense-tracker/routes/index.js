var express = require('express');
var router = express.Router();

var passport = require("passport")

var User = require("../models/User")
var Income = require("../models/Income")
const Expense = require('../models/Expense');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get("/success",(req,res,next)=>{
  res.render("success")
})

router.get("/failure", (req,res,next)=>{
  res.render("failure")
})

router.get("/auth/github", passport.authenticate("github"))

router.get("/auth/github/callback", passport.authenticate("github", {failureRedirect:"/failure"}),(req,res)=>{
  res.redirect("/success")
})


router.get('/auth/google',
  passport.authenticate('google', {scope: ['openid', 'email', 'profile']})
);

router.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/failure' }),
  (req, res) => {
    res.redirect('/success');
  }
);

router.get("/register", (req,res, next)=>{
  res.redirect("/login")
})

router.get('/login', (req, res, next) => {
  console.log(req.session)
  var error = req.flash('error');
  res.render('login', {error});
});

router.post('/register', (req, res, next) => {
  console.log('KO')
  var { email, password } = req.body;
  if (password.length <= 4) {
    return res.redirect('/register');
  }

  User.create(req.body, (err, user) => {
    console.log(user, "ARTI")
    if (err) next(err);
    res.redirect('/login');
 
  });
  
})



router.post('/login', (req, res, next) => {
  var { email, password } = req.body;
  if (!email || !password) {
    req.flash('error', 'Email/password required');
    return res.redirect('/users/login');
  }
  User.findOne({ email }, (err, user) => {
    if (err) return next(err);
    if (!user) {
      return res.redirect('/login');
    }
    user.verifyPassword(password, (err, result) => {
      if (err) return next(err);
      if (!result) {
        req.flash('error', 'password is incorrect');
        return res.redirect('/login');
      }
      req.session.userId = user.id;
      res.redirect('/onboarding');
    });
  });
});



router.get("/onboarding", (req, res, next) => {
  const {userId} = req.session;
    Income.find({referenceToUser: userId}, (err, incomes)=>{
      Expense.find({referenceToUser: userId}, (err, expenses)=>{
        User.findById(userId, (err, user) => {
            if(err) return next(err);
            console.log(incomes)
            return res.render("Onboarding", {incomes,expenses, user})
            res.render('Onboarding');
          })
      })
    })
})



// logout

router.get('/logout', function(req, res){
  res.clearCookie('connect.sid');
  req.logout();
  res.redirect('/');
 });

module.exports = router;
