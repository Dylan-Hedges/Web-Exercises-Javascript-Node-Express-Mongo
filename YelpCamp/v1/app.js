//--------------------SET UP--------------------
var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

var campgrounds = [
    {name: "Salmon Creek", image: "https://farm5.staticflickr.com/4080/4792057808_de7a2640cb.jpg"},
    {name: "Granite Hill", image: "http://www.photosforclass.com/download/7878880968"},
    {name: "Moutain Goats Rest", image: "http://www.photosforclass.com/download/53127306"},
    {name: "Salmon Creek", image: "https://farm5.staticflickr.com/4080/4792057808_de7a2640cb.jpg"},
    {name: "Granite Hill", image: "http://www.photosforclass.com/download/7878880968"},
    {name: "Moutain Goats Rest", image: "http://www.photosforclass.com/download/53127306"},
    {name: "Salmon Creek", image: "https://farm5.staticflickr.com/4080/4792057808_de7a2640cb.jpg"},
    {name: "Granite Hill", image: "http://www.photosforclass.com/download/7878880968"},
    {name: "Moutain Goats Rest", image: "http://www.photosforclass.com/download/53127306"},
];

//--------------------ROUTES--------------------
//We will follow the REST convention, "/campgrounds" .get and .post are the same

//Diplays landing page
app.get("/", function(req, res){
   res.render("landing"); 
});

//Displays all campgrounds
app.get("/campgrounds", function(req, res){
    res.render("campgrounds",{campgrounds:campgrounds});
});

//Takes form data, creates a new campground, redirects user back to .get /campgrounds
app.post("/campgrounds", function(req, res){
    //Take the name and image from the form
    var name = req.body.name;
    var image = req.body.image;
    //Combine as a new JS object
    var newCampground = {name:name, image:image};
    //Add this object to the exisiting array of campgrounds
    campgrounds.push(newCampground);
    
    //Default is to redirect as a .get request
    res.redirect("/campgrounds");
});

//Form page that sends a POST request to .post /campgrounds
app.get("/campgrounds/new", function(req, res){
    res.render("new.ejs");
});

//--------------------LISTENER--------------------
app.listen(process.env.PORT, process.env.IP, function(){
   console.log("YelpCamp Server has startd") 
});