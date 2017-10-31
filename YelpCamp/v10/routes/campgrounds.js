//Instead of creating a new "var app" we are going to reference the exisiting one in the app.js file using express router
var express = require("express");
//Create a router variable with a new instance of express
var router = express.Router();
//Imports our comment which is referenced below
var Campground = require("../models/campground");
//Includes middleware (index.js is a special name, files with this name will be included by default as part of the express framework)
var middleware = require("../middleware");

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
router.post("/campgrounds", middleware.isLoggedIn, function(req, res){
    //Stores information about new campgrounds in variables (refers to the name="" attribute in new.ejs and is taken from the body of the request when user sends/POST form)
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    //Object containing id and username of person posting the campground
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    //Combine variables to create a new JS object called newCampground (author:author is the username, defined in campground.js)
    var newCampground = {name:name, image:image, description:desc, author:author};
    //Adds new camp ground to DB
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

//NEW ROUTE - Shows the form page used to send a POST request to app.post("/campgrounds")
router.get("/campgrounds/new", middleware.isLoggedIn, function(req, res){
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

//EDIT CAMPGROUND ROUTE
//"checkCampgroundOwnership," - middleware we defined which checks if the original poster of the campground is logged in, if logged in then proceed to callback function, if not logged in then user is redirected to previous page
router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
        //Finds the campground by its id and passes it to the /edit route - "req.params.id," refers to the id of the campground we are looking for and stores it in the object "foundCampground"
        Campground.findById(req.params.id, function(err, foundCampground){
            //If there is a match, take the user to the edit page for that campground
            //{campground: foundCampground} - passes the found campground object to edit.ejs under the name "campground"
            res.render("campgrounds/edit", {campground: foundCampground});
        });
});

//UPDATE CAMPGROUND
router.put("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res){
    //".findByIdAndUpdate" - a mongoose feature that finds a campground by id, updates it and stores it in a new object
    //"req.params.id," - refers to the id of the campground,  "req.body.campground," - is the nested object from the body of edit.ejs, "updatedCampground" - is the new object with updated info
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            //If update unsuccessful redirect back to the main campgrounds page
            res.redirect("/campgrounds");
        }else{
            //If update successful redirect back to the campground 
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//DESTROY CAMPGROUND
router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership,  function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds");
        }
    }); 
});


//Exports the code to app.js
module.exports = router;





//-----------------------OLD CODE-------------------------------------------------
//EDIT CAMPGROUND ROUTE
// router.get("/campgrounds/:id/edit", function(req, res){
//     //If user is logged in execute the following
//     if(req.isAuthenticated()){
//         //Finds the campground by its id and passes it to the /edit route - "req.params.id," refers to the id of the campground we are looking for and stores it in the object "foundCampground"
//         Campground.findById(req.params.id, function(err, foundCampground){
//           if(err){
//               res.redirect("/campgrounds");
//           }else{
//               //User ID in DB and current user ID look the same but are constructed differently - "foundCampground.author.id" is a mongoose object not a string (we only see when printed out), "req.user._id" is a string, you cannot compare the 2 as they are different
//               //Checks if the user who posted the campground is the same as the current user - compares the user id in the DB to the current user id ".equals" is a mongoose method that allows us to compare objects and strings (see above)
//               if(foundCampground.author.id.equals(req.user._id)){
//                   //If there is a match, take the user to the edit page for that campground
//                     //{campground: foundCampground} - passes the found campground object to edit.ejs under the name "campground"
//                     res.render("campgrounds/edit", {campground: foundCampground});
//               }else{
//                   //If there is not a match, prevent the user from editing the campground
//                   res.send("YOU DO NOT HAVE PERMISSION TO DO THAT");
//               }
//           } 
//         });
//     }else{
//         console.log("YOU NEED TO BE LOGGED IN TO DO THAT");
//         res.send("YOU NEED TO BE LOGGED IN TO DO THAT");
//     }

// });