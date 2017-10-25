//--------------------SET UP--------------------
//Instead of writing "var" over and over we can just use a "," and list all required
var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    Campground      = require("./models/campground"),
    Comment         = require("./models/comment"),
    User            = require("./models/user"),
    seedDB          = require("./seeds");



//Mongodb connection - connect to and create the db (if not already created, ", {useMongoClient: true}" is optional and removes a warning )
mongoose.connect("mongodb://localhost/yelp_camp_v3", {useMongoClient: true});
//S27.5 in course, replaces Mongoose's default promise library with JS's native promise library
mongoose.Promise = global.Promise;

//Convert body (string) to a JS object
app.use(bodyParser.urlencoded({extended: true}));
//Set .ejs as the default extention for our files
app.set("view engine", "ejs");
//Lets the app access files in the public folder (css, JS), "__dirname" automatically refers to the directory path app.js was run in
app.use(express.static(__dirname + "/public"));
//Executes the above seedDB which has a function passed from seeds.js that deletes all campgrounds
seedDB();

//-----PASSPORT CONFIG-----
app.use(require("express-session")({
    secret: "THIS IS USED TO ENCODE",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
//"".authenticate" method comes with passport local mongoose, used as middleware for login/sign up
passport.use(new LocalStrategy(User.authenticate()));
//Takes decoded data, encodes it and puts it back into the session (method comes with passport local mongoose)
passport.serializeUser(User.serializeUser());
//Takes data from the session and decodes it (method comes with passport local mongoose)
passport.deserializeUser(User.deserializeUser());


//"currentUser: req.user" - take req.user and store in variable currentUser, when logging in passport will create req.user which contains the user ID and username (used to determine what to show in the nav bar e.g "Login" and "Sign up" or "Logout")
//Using this means we dont have to specify "currentUser: req.user" in every route, it will be passed on every route
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    //Proceed to the callback, nothing we happen next if we dont state this
    next();
});

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
//"isLoggedIn" - a function (middleware) we created that checks if the user is logged in and only executes the next/callback function if they are
app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
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
app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
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

//---------------AUTHENTICATION ROUTES--------------------
//SHOW - sign up form
app.get("/register", function(req, res){
    res.render("register");
});

//SIGN UP LOGIC
app.post("/register", function(req, res){
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

//SHOW - log in form
app.get("/login", function(req, res){
   res.render("login"); 
});

//SIGN IN LOGIC - compares what is entered on the login form to the DB and signs in if successful match
//app.post("/login", middleware, callback function) - everthing inside passport.authenticate() is middleware
app.post("/login",  passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){
        //No action required from callback function
});

//LOGOUT
app.get("/logout", function(req, res){
   req.logout();
   res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

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
