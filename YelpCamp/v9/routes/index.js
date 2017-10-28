//Instead of creating a new "var app" we are going to reference the exisiting one in the app.js file using express router
var express = require("express");
//Create a router variable with a new instance of express
var router = express.Router();
//Includes passport
var passport = require("passport");
//Includes our user model (referenced below)
var User = require("../models/user");


//ROOT ROUTE
router.get("/", function(req, res){
   res.render("landing"); 
});


//---------------AUTHENTICATION ROUTES--------------------
//REGISTER FORM ROUTE
//"router." replaces "app." as we have now split this code into seperate files but stil need to reference "var app" in "app.js"
router.get("/register", function(req, res){
    res.render("register");
});

//SIGN UP LOGIC ROUTE
router.post("/register", function(req, res){
    //Store username from the register.ejs form in the the variable newUser
    var newUser = new User({username: req.body.username});
    //Takes new user and hashes the password
    User.register(newUser, req.body.password, function(err, user){
        //By note having an "else" is a short way to exit the if statement if there is no error when signing up
        if(err){
            console.log(err);
            return res.render("register");
        }
        //Once user has signed up log them in (authenticate them) and redirect them to campgrounds
        passport.authenticate("local")(req, res, function(){
            console.log(err);
            res.redirect("/campgrounds");
        });
    });
});

//LOGIN FORM ROUTE
router.get("/login", function(req, res){
   res.render("login"); 
});

//LOGIN LOGIC ROUTE
//-compares what is entered on the login form to the DB and signs in if successful match
//app.post("/login", middleware, callback function) - everthing inside passport.authenticate() is middleware
router.post("/login",  passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){
        //No action required from callback function
});

//LOGOUT ROUTE
router.get("/logout", function(req, res){
   req.logout();
   res.redirect("/campgrounds");
});


//Middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

//Exports the code to app.js
module.exports = router;