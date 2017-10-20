//--------------------SET UP--------------------
//Instead of writing "var" over and over we can just use a "," and list all required
var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment"),
    seedDB      = require("./seeds");



//Mongodb connection - connect to and create (if not already created) the db
mongoose.connect("mongodb://localhost/yelp_camp_v3");
//Convert body (string) to a JS object
app.use(bodyParser.urlencoded({extended: true}));
//Set .ejs as the default extention for our files
app.set("view engine", "ejs");
//Lets the app access files in the public folder (css, JS), "__dirname" automatically refers to the directory path app.js was run in
app.use(express.static(__dirname + "/public"));
//Executes the above seedDB which has a function passed from seeds.js that deletes all campgrounds
seedDB();

//--------------------ROUTES--------------------
//We will follow the REST convention, "/campgrounds" .get and .post are the same

//Diplays landing page
app.get("/", function(req, res){
   res.render("landing"); 
});

//INDEX ROUTE - Displays all campgrounds
app.get("/campgrounds", function(req, res){
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
app.post("/campgrounds", function(req, res){
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
app.get("/campgrounds/new", function(req, res){
    res.render("campgrounds/new");
});

//SHOW ROUTE - Displays detailed info about one campground (remember routes are executed sequentally, this route needs to be at the bottom otherwise users will not be able to reach any other route)
app.get("/campgrounds/:id", function(req,res){
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

//--------------------COMMENTS ROUTES--------------------
//Nested Routes - both routes require us to get the campground id first

//NEW COMMENT ROUTE - render form
app.get("/campgrounds/:id/comments/new", function(req, res){
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
app.post("/campgrounds/:id/comments", function(req, res){
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

//--------------------LISTENER--------------------
app.listen(process.env.PORT, process.env.IP, function(){
   console.log("YelpCamp Server has startd") 
});





//-------------IRRELEVANT CODE (FYI)-------------------

//For the model "Campground" call the ".create" function and create a new camp
// Campground.create({
//     name: "Granite Hill", 
//     image: "http://www.photosforclass.com/download/7878880968",
//     description: "This is a huge granite hill, no bathrooms, no water, beautiful granite"
// }, function(err, campground){
//     //If there is an error print the error
//     if(err){
//         console.log(err)
//     //else display text and campground info (function is always executed)    
//     } else {
//         console.log("NEWLY CREATED CAMPGROUND");
//         console.log(campground);
//         }
//     }
// );
