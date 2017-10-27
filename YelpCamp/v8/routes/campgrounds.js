//Instead of creating a new "var app" we are going to reference the exisiting one in the app.js file using express router
var express = require("express");
//Create a router variable with a new instance of express
var router = express.Router();
//Imports our comment which is referenced below
var Campground = require("../models/campground");

//--------------------ROUTES--------------------
//We will follow the REST convention, "/campgrounds" .get and .post are the same

//INDEX ROUTE (displays all campgrounds)
router.get("/campgrounds", function(req, res){
    //Look for all entries in the Mongodb collection "Campground", once finished execute error checking and send all the Campgrounds from the collection to the "campgrounds.ejs" file 
    //Linking to a DB means the campgrounds will always be displayed even if we reset our server, as they are now in the DB yelp_camp
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/index",{campgrounds:allCampgrounds});
        }
    });
});


//CREATE ROUTE - Takes data from the form, creates a new campground, redirects user back to .get /campgrounds
router.post("/campgrounds", function(req, res){
    //Stores information about new campgrounds in variables (refers to the name="" attribute in new.ejs and is taken from the body of the request when user sends/POST form)
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    //Combine variables to create a new JS object
    var newCampground = {name:name, image:image, description:desc};
    
    //Add new camp ground to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        }else{
            //Redirect to campgrounds page - Default is to redirect as a .get request
            res.redirect("/campgrounds");
        }

    });
    //Add this object to the exisiting array of campgrounds - no longer used when using a DB
    // campgrounds.push(newCampground);
});

//NEW ROUTE - Show the form page used to send a POST request to app.post("/campgrounds")
router.get("/campgrounds/new", function(req, res){
    res.render("campgrounds/new");
});

//SHOW ROUTE - Displays detailed info about one campground (remember routes are executed sequentally, this route needs to be at the bottom otherwise users will not be able to reach any other route)
router.get("/campgrounds/:id", function(req,res){
   //findById() is a Mongoose command that lets you find an entry by id in a MongoDB database
   //.populate("comments").exec - populates campgrounds with comments (not just Ids) then executes our function same as before
   Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
       if(err){
           console.log(err);
       }else{
           console.log(foundCampground);
           //Passes the campground/object into show.ejs which render the info on screen
           res.render("campgrounds/show", {campground: foundCampground}); 
       }
   });
   
})


//Exports the code to app.js
module.exports = router;