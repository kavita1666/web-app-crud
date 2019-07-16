var express = require('express');
var router = express.Router();
const User= require('../model/user'); 
const bcrypt= require('bcryptjs');
const passport= require('passport');
const {ensureAuthenticated, forwardAuthenticated} = require('../config/auth');

/* GET home page. */
router.get('/', forwardAuthenticated,  function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//POST home page
router.post('/details', function(req, res) {
  res.render('details', {Fname:req.body.Fname, Sname:req.body.Sname, email:req.body.email, password:req.body.password});
});

/* GET about page. */
router.get('/about', function(req, res) {
  res.render('about');
});

/* GET contact page. */
router.get('/contact', function(req, res) {
  res.render('contact');
});

/* GET register page*/
router.get('/register', function(req, res) {
  res.render('card');
});

/* GET Home page*/
router.get('/home', ensureAuthenticated, function(req, res) {
  res.render('home');
});



/* POST sign-in page*/
router.post('/register', function(req, res) {
  console.log('going in...');
  let {name, email, password, confirmPassword }=req.body;        //de-structuring
  let errors=[];                                                 //empty array to catch errors

  //check all fields
  if(!name || !email || !password || !confirmPassword){
    errors.push({msg:'please fill all the fields'});
    console.log(errors);
  }

  //check password match
  if(password !== confirmPassword){
    errors.push({msg:'Password doesnot match'});
    console.log(errors);
  }

  //check if password length is less than 6
  if(password.length < 6){
    errors.push({msg:'password should be atleast 6 characters'});
    console.log(errors);
  }

  //if any errors occured
  if(errors.length > 0){
    console.log(errors);
    res.render('card',{errors,name,email,password,confirmPassword} );
  }

  //if all the conditions are fulfilled
  else {

  const newUser= new User({
    username: req.body.name,
    email: req.body.email,
    password: req.body.password
  });
  // console.log(newUser);
  
  bcrypt.genSalt(10, (err,salt) =>
  bcrypt.hash(newUser.password,salt,(err,hash) =>{
    if(err) throw err;
    //set password to hashed
    newUser.password= hash;
    console.log(newUser);
    //save user
    newUser.save()
    .then(user =>{
      req.flash('success_msg', 'You are now registered and can login');
      res.redirect('/signIn');
    })
    .catch(err => console.log(err));
  })
  )

}
});

/* GET sign-in page*/
router.get('/signIn', function(req, res) {   
  res.render('signin-pg');
});

/* POST sign-in page*/
router.post('/home', function(req, res,next) {
  console.log('good going...');
  passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/signIn',
    failureFlash: true
  })(req, res, next);
});

// POST log-out
router.get('/logout', function(req, res){
  req.logout();
  req.flash('success_msg', 'You are logged out.');
  res.redirect('/signIn');
});

module.exports = router;
