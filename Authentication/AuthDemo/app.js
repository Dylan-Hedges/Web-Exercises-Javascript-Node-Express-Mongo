var express                 = require("express"),
    mongoose                = require("mongoose"),
    passport                = require("passport"),
    bodyParser              = require("body-parser"),
    User                    = require("./models/user"),
    LocalStrategy           = require("passport-local"),
    passportLocalMongoose   = require("passport-local-mongoose");


mongoose.connect("mongodb://localhost/auth_demo_app");
//Needs to come before app.use
var app = express();
app.set('view engine', 'ejs');
//Allows us to extract the typed username and password from the body of the POST request from the sign up form (e.g req.body.username, req.body.password)
app.use(bodyParser.urlencoded({extended: true}));

//Adds our express session to our app
app.use(require("express-session")({
    //Used to encode and decode our sessions 
    secret: "Rusty is the best and cutest dog in the world",
    resave: false,
    saveUninitialized: false
}));
//Tells express to initalize passport and allow it to work in our session
app.use(passport.initialize());
app.use(passport.session());

//passport-local is imported and saved in LocalStrategy above, create a new "LocalStrategy" using the "authenticate" method from passport-local-mongoose in the "user.js" file 
passport.use(new LocalStrategy(User.authenticate()));
//Takes decoded data, encodes it and puts it back into the session
passport.serializeUser(User.serializeUser());
//Takes data from the session and decodes it
passport.deserializeUser(User.deserializeUser());


//-------------ROUTES----------------------------------

//HOME
app.get("/", function(req, res){
    res.render("home");
});

//HIDDEN PAGE
//isLoggedIn - when a get request is sent to "/secret", the "isLoggedIn" (middleware) function will run first to determine if the user is logged in 
app.get("/secret", isLoggedIn, function(req,res){
   res.render("secret"); 
});

//NEW - sign up form
app.get("/register", function(req,res){
   res.render("register"); 
});

//CREATE - create user
app.post("/register", function(req,res){
    //new User({username: req.body.username}) - creates a new user object to be passed to "User.register" (taken from body of the POST request created by the form on "register.ejs", not yet in the DB)
    //req.body.password - pass the password as a 2nd argument to "User.register" (same as above)
    //User.register - hashes the password (so you can see it in the DB) and creates a new user in the DB consisting of the username and the hashed password
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        //if there is an error when creating a user do the following
        if(err){
            console.log(err);
            return res.render('register');
        }
        //passport.authenticate - logs the user in, takes care of session, stores information, run passport.serializeUser
        //("local") - use the local strategy, can also use facebook, twitter, google login strategies, can easily swap out
        passport.authenticate("local")(req, res, function(){
            res.redirect("/secret");
        });
    });
});

//LOGIN
app.get("/login", function(req, res){
   res.render("login"); 
});

//LOGIN AUTHENTICATION
//passport.authenticate - takes username and password from req.body from login.ejs and compares it to the username and password in the DB
//-in this case it is used inside app.post(), known as middleware (code that runs before route callback, sites in the middle of the route)
app.post("/login", passport.authenticate("local",{
    //If it matches redirect to /secret page
    successRedirect: "/secret",
    //If it doesnt match redirect back to /login page
    failureRedirect: "/login"
}),function(req, res){
    
});

//LOGOUT
app.get("/logout", function(req, res){
    //passport destorys all the user data in this session, no longer keeps track of user data in this session (nothing changes in the DB)
   req.logout();
   res.redirect("/");
});

//MIDDLEWARE - function we defined
//Takes 3 parameters - request, response and the next function
function isLoggedIn(req, res, next){
    //If the user is logged in (".isAuthenticated" comes with passport and checks to see if the GET request is authenticated)
    if(req.isAuthenticated()){
        //If it is run the next thing which refers to the "function(req, res){}" on the "/secret" page 
        return next();
    }
    //If the user is not logged in, redirect back to the login page and the "function(req, res){}" on the "/secret" page is never run
    res.redirect("/login");
}

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("SERVER HAS STARTED...."); 
});