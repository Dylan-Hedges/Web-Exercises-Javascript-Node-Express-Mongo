//var express = require("express"); Includes express in our app
var express = require("express");
//var app = express(); used to call express
var app = express();

//------------------------ROUTES ".get"---------------------------------
//Routes are executed in a LINEAR order, as soon as a route/URL matches it will stop, "*" must go at bottom

//when we go to the root page "/", execute the following function
//(req, res) = request (object that contains all information about the request), response (object that contains all information about what we will respond with)
app.get("/", function(req, res){
    //Displays "Hi there!" in the browser
    res.send("Hi there!");
});

//for the bye page, execute the following function
app.get("/bye", function(req, res){
    res.send("Goodbye");
});

app.get("/dog", function(req, res){
    console.log("someone made a request");
    res.send("MEOW");
});

//------------------------ROUTE PARAMETERS/PATH VARIABLES---------------------------------
//Allows us to define routes without knowing the specific page names
//":" is put in front of anything that changes its name 

app.get("/r/:subredditName/", function(req, res) {
    //"req.params.subredditName;" calls the JSON for the request, "params: { subredditName: 'soccer"},"
    //In this case we specify the name of the key (.subredditName) and get back the value (soccer)
    //This is then stored in "var subreddit" and displayed on screen in uppercase, NOTE this is only for the "/:subredditName" path, will not apply to the below
    var subreddit = req.params.subredditName;
    res.send("WELCOME TO THE " + subreddit.toUpperCase() + " SUBREDDIT");
});


//e.g ":subredditName/comments" comments is always the same name in the link, but the sub reddit name is not
//When typing the URL everything with a ":" can be anything, "comments" has to be the same and in the same position
app.get("/r/:subredditName/comments/:id/:title/", function(req, res) {
    console.log(req.params);
    res.send("Welcome to the comments page");
});

//-----------------------ROUTES "*"-----------------------------------

//"*" = for all routes execute function, i.e a catch all, use as a cannot find page
//Must come last, otherwise it will always be called, even for valid pages due to how routes in order
app.get("*", function(req, res){
    res.send("YOU ARE A STAR!");
});


//------------------------ROUTES ".listen"---------------------------------

//app.listen(); tells Express to listen for requests (starts server, when we make changes we have to restart the server) 
//(process.env.PORT, process.env.IP) returns the port number & IP for cloud9 server, could also be e.g port 3000 & 17.32.161.0
app.listen(process.env.PORT, process.env.IP,function(){
    console.log("Server has started!");
    
});

