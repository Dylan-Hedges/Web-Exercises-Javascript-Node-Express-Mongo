//--------------------SET UP--------------------
//Instead of writing "var" over and over we can just use a "," and list all required
var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose");

//Mongodb connection - connect to and create (if not already created) the db
mongoose.connect("mongodb://localhost/yelp_camp");
//Convert body (string) to a JS object
app.use(bodyParser.urlencoded({extended: true}));
//Set .ejs as the default extention for our files
app.set("view engine", "ejs");

//SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
   name: String,
   image: String,
   description: String
});

//MODEL SETUP
//Turns into a model - allows us to do ".find" ".replace" etc. NOTE - Campgrounds automatically gets turned into Campgrounds
var Campground = mongoose.model("Campground", campgroundSchema);

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
            res.render("index",{campgrounds:allCampgrounds});
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
    res.render("new.ejs");
});

//SHOW ROUTE - Displays detailed info about one campground (remember routes are executed sequentally, this route needs to be at the bottom otherwise users will not be able to reach any other route)
app.get("/campgrounds/:id", function(req,res){
   //findById() is a Mongoose command that lets you find an entry by id in a MongoDB database
   Campground.findById(req.params.id, function(err, foundCampground){
       if(err){
           console.log(err);
       }else{
           //Passes the campground/object into show.ejs which render the info on screen
           res.render("show", {campground: foundCampground}); 
       }
   });
   
});

//--------------------LISTENER--------------------
app.listen(process.env.PORT, process.env.IP, function(){
   console.log("YelpCamp Server has startd") 
});