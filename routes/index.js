let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let passport = require('passport');
let flash = require('connect-flash');

let userModel = require('../models/user');
let User = userModel.User;
let Bcontact = require('../models/bcontact');

//Helper function to require auth to some content
function requireAuth(req, res, next){
  if(!req.isAuthenticated()){
    return res.redirect('/login');
  }
  next();
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'My Portfolio' });
});

/* GET aboutme page. */
router.get('/aboutme', function(req, res, next) {
  res.render('aboutme', { title: 'About me' });
});

/* GET projects page. */
router.get('/projects', function(req, res, next) {
  res.render('projects', { title: 'Projects' });
});

/* GET services page. */
router.get('/services', function(req, res, next) {
  res.render('services', { title: 'Services' });
});

/* GET contact page. */
router.get('/contact', function(req, res, next) {
  res.render('contact', { title: 'Contact Information' });
});

/* GET contact_list page. */
router.get('/contact_list', requireAuth, function(req, res, next) {
  Bcontact.find ((err, bcontactList) => {
    if(err){
      return console.error(err);
    }
    else{
      res.render('contact_list', { 
        title: 'Contact Information',
        BcontactList : bcontactList,
        displayName: req.user ? req.user.displayName : ''});
    }
  });
});

/* GET edit page. */
router.get('/edit/:id', (req, res, next) => {
  let id = req.params.id;
  Bcontact.findById(id, (err, bcontactToEdit) =>{
    if(err){
      console.log(err);
      res.end(err);
    }
    else{
      res.render('editpage', {title: 'Edit this contact', bcontact: bcontactToEdit });
    }
  });
});

/* POST edit page. */
router.post('/edit/:id', function(req, res, next) {
  let id = req.params.id;
  let updatedBcontact = Bcontact({
    "_id":id,
    "name": req.body.name,
    "email": req.body.email,
  });
  Bcontact.updateOne({_id:id}, updatedBcontact, (err) => {
    if(err){
      console.log(err);
      res.end(err);
    }
    else{
      res.redirect('/contact_list');
    }
  });
});

/* GET login page. */
router.get('/login', function(req, res, next) {
  if(!req.user){
    res.render('auth/login'),{
      title: "Login",
      messages : req.flash('loginMessage'),
      displayName : req.user ? req.user.displayName : ''
    }
  }
  else{
    return res.redirect('/contact_list');
    }
});

/*POST login page*/
router.post('/login', function(req, res, next) {
  passport.authenticate('local', (err, user, info) =>{
    if(err){
      return next(err);
    }
    if(!user){
      req.flash('loginMessage', 'Authentication Error');
      return res.redirect('/login');
    }
    req.login(user, (err) =>{
      if(err){
        return next(err);
      }
      const payload = {
        id : user.id,
        displayName : user.displayName,
        username : user.username,
        email : user.email
      }
    })

    return res.redirect('/');
  })
  
});

/* GET registration page. */
router.get('/register', function(req, res, next) {
  if(!req.user){
    res.render('auth/register'),{
      title: "Register",
      messages : req.flash('registerMessage'),
      displayName : req.user ? req.user.displayName : ''
    }
  }
  else{
    return res.redirect('/');
    }
});

/*POST registration page*/
router.post('/register', function(req, res, next) {
  let newUser = new User({
    username : req.body.username,
    email : req.body.email,
    displayName : req.body.displayName

  });

  User.register(newUser, req.body.password, (err) =>{
    if(err){
      console.log("Error: Failed to insert new user")
      if(err.name == "UserExistsError"){
        req.flash('registerMessage','Registration Failed : Specified User Already Exists');
      console.log('User Registration error');
    }
    return res.render('auth/register', {
      title: "Register",
      messages : req.flash('registerMessage'),
      displayName : req.user ? req.user.displayName : ''
    });
  }
    else{
      return passport.authenticate('local')(req, res, () =>{
        res.redirect('/contact_list');
      })
    }
  });  
});

/*GET Route for logout */
router.get('/register', function(req, res, next) {
  req.logout();
  res.redirect('/');
});

module.exports = router;
