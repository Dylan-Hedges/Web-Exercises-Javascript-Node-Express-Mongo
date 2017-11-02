//Instead of creating a new "var app" we are going to reference the exisiting one in the app.js file using express router
var express = require("express");
//Create a router variable with a new instance of express
var router = express.Router();
//Imports our campground and comment models which are referenced below
var Campground = require("../models/campground");
var Comment = require("../models/comment");
//Includes middleware (index.js is a special name, files with this name will be included by default as part of the express framework)
var middleware = require("../middleware");



//NEW COMMENT FORM
//Nested Routes - both routes require us to get the campground id first
//"isLoggedIn" - a function (middleware) we created that checks if the user is logged in and only executes the next/callback function if they are
router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, function(req, res){
   Campground.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err);
       }else{
           //{campground: campground} pass in campground from the DB as an object into the comments/new page
           res.render("comments/new", {campground: campground});
       }
   })
});

//CREATE COMMENT 
//"isLoggedIn" - we also use it here to prevent people creating comments as a post request (e.g with postman)
router.post("/campgrounds/:id/comments", middleware.isLoggedIn, function(req, res){
   Campground.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err);
           res.redirect("/campgrounds");
       }else{
           //Create the comment (take directly from body when form is submitted)
            Comment.create(req.body.comment, function(err,comment){
                if (err){
                    req.flash("error", "Something went wrong");
                    console.log(err);
                }else{
                    //Associates user id to comment - when a comment is created we take "req.user._id" and put it into "comment.author.id" (schema defined in "comment.js") 
                    comment.author.id = req.user._id;
                    //Assocaites username to comment
                    comment.author.username = req.user.username;
                    //Saves the comment (including username)
                    comment.save();
                    //Push comment into campground
                    campground.comments.push(comment);
                    //Save to DB
                    campground.save();
                    req.flash("success", "Successfully added comment");
                    res.redirect('/campgrounds/' + campground._id);
                }
            });
       }
   })    
});

//EDIT COMMENT
router.get("/campgrounds/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    //Finds the comment for the campground in the DB and either redirects back or renders the edit comment form
    //foundComment - store the comment text in the variable "foundComment" which is passes into "edit.ejs" under the name "comment"
    Comment.findById(req.params.comment_id, function(err, foundComment){
       if(err){
           res.redirect("back");
       }else{
           //{campground_id: req.params.id - passes the campground id to edit.ejs under the name campground_id
           //comment: foundComment} - passess the comment text taken from the DB under the name comment
           res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
       } 
    });
});

//UPDATE COMMENT
// checkCommentOwnership, - we include this here to prevent users sending update requests e.g through postman
router.put("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
    //The below is the same code for updating a campground
    //req.body.comment refers to name="comment[text]" in edit.ejs
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/campgrounds/" + req.params.id );
        }
    });
});

//DESTROY COMMENT
router.delete("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
    //req.params.comment_id - refers to the comments id in the DB
   Comment.findByIdAndRemove(req.params.comment_id, function(err){
      if(err){
          res.redirect("back");
      }else{
          req.flash("success", "Comment deleted.");
         //req.params.id - refers to the campground id
         res.redirect("/campgrounds/" + req.params.id);
      } 
   });
});





//Exports the code to app.js
module.exports = router;