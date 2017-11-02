//Includes our campgrounds.js and comments.js files (otherwise we cannot do Campground.findById() etc.)
var Campground = require ("../models/campground");
var Comment = require ("../models/comment");

//Create an empty object called middlewareObj (our functions go in here, defined after)
var middlewareObj ={};

//Campground ownership
middlewareObj.checkCampgroundOwnership = function(req, res, next){
    //If user is logged in execute the following
    if(req.isAuthenticated()){
        //Finds the campground by its id and passes it to the /edit route - "req.params.id," refers to the id of the campground we are looking for and stores it in the object "foundCampground"
        Campground.findById(req.params.id, function(err, foundCampground){
           if(err || !foundCampground){
               req.flash("error", "Campground not found.");
               res.redirect("back");
           }else{
                //Checks if the user who posted the campground is the same as the current user
               //When printed User ID in DB and current user ID look the same but are constructed differently - "foundCampground.author.id" is a mongoose object and "req.user._id" is a string which cannot be compared - ".equals" is a mongoose method that allows us to compare objects and strings
               if(foundCampground.author.id.equals(req.user._id)){
                    //Executes whatever is next (typically the callback function)
                    next();
               }else{
                   //If there is not a match, prevent the user from editing the campground
                   res.redirect("back");
               }
           } 
        });
    }else{
        //"back" takes user back to previous page they were on
        res.redirect("back");
    }
}

//Comment ownership - prevents users editing/updating others comments (similar to campgrounds middleware)
middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            //IF there is an error or the comment is not found (i.e NULL) then redirect back and display a message
           if(err || !foundComment){
               req.flash("error", "Comment not found");
               res.redirect("back");
           }else{
               //Checks if user owns the comment, cant do === as the id's are different types, must use mongoos method "".equals"
               if(foundComment.author.id.equals(req.user._id)){
                   next();
               }else{
                   req.flash("error", "You dont have permission to do that.");
                   res.redirect("back");
               }
           } 
        });
    }else{
        //Displays error message if user manually edit the comment by typing in the URL
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("back");
    }
}

//User log in checker
middlewareObj.isLoggedIn= function (req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    //Uses connect-flash to display a message once, vanishes after (must come first, required in app.js)
    //("error", "Please Login First.") - is key/value pair which is called by index.js
    req.flash("error", "You need to be logged in to do that.");
    //Then redirect to Login
    res.redirect("/login");
}

module.exports = middlewareObj;