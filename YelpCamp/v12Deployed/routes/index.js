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
            //If the user tries to register and it fails it will display the error in a flash message (mongoose automatically generates the error text)
            req.flash("error", err.message);
            return res.redirect("register");
        }
        //Once user has signed up log them in (authenticate them) and redirect them to campgrounds
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to YelpCamp " + user.username);
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
   //Changes the content of the flash message - error is in the middleware file (in app.js we set it up so flash messages can be displayed on every page, we copy and paste this line each time we want a different message)
   req.flash("success", "Logged you out");
   res.redirect("/campgrounds");
});


//Exports the code to app.js
module.exports = router;