var express = require("express");
var app = express();
var bodyParser = require("body-parser");

//We moved the friends variable to be global as the "/addfriend" route could not add a new name to the array due to it being defined local in the "/friends"  route
//Note whenever we restart our server, only these values will be loaded, other added values will be lost
var friends = ["Tony", "Miranda", "Justin", "Pierre", "Lily"];

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");


//--------ROUTES--------
app.get("/", function(req, res){
    res.render("home");
});

//Retrive information
app.get("/friends", function(req, res){
   res.render("friends", {friends: friends}); 
});

//Send information i.e add data to something e.g add a post to a DB, add an item to a list
//Install "body-parser" used whenever we have a form and we want to extract the data
app.post("/addfriend", function(req, res){
    //"body-parser" will turn the body of the POST request into an object we can use to add a new name to the "friends" array
    //var newFriend = req.body.newfriend; take the name entered into the text field after the button has sent it as a POST request
    var newFriend = req.body.newfriend;
    //Add the new name to the friends array
    friends.push(newFriend);
    //Take the user back to the friends list when they click the add button
    res.redirect("/friends");
});

//--------LISTEN--------
app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Server started!!"); 
});