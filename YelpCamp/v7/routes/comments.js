//Instead of creating a new "var app" we are going to reference the exisiting one in the app.js file using express router
var express = require("express");
//Create a router variable with a new instance of express
var router = express.Router();
//Imports our campground and comment models which are referenced below
var Campground = require("../models/campground");
var Comment = require("../models/comment");




//NEW COMMENT FORM ROUTE
//Nested Routes - both routes require us to get the campground id first
//"isLoggedIn" - a function (middleware) we created that checks if the user is logged in and only executes the next/callback function if they are
router.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
   Campground.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err);
       }else{
           //{campground: campground} pass in campground from the DB as an object into the comments/new page
           res.render("comments/new", {campground: campground});
       }
   })
});

//CREATE COMMENT ROUTE 
//"isLoggedIn" - we also use it here to prevent people creating comments as a post request (e.g with postman)
router.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
   Campground.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err);
           res.redirect("/campgrounds");
       }else{
           //Create the comment (take directly from body when form is submitted)
            Comment.create(req.body.comment, function(err,comment){
                if (err){
                    console.log(err);
                }else{
                    //Push comment into campground
                    campground.comments.push(comment);
                    //Save to DB
                    campground.save();
                    res.redirect('/campgrounds/' + campground._id);
                }
            });
       }
   })    
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