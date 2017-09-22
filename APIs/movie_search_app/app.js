//--------------------BASIC SET UP--------------------
var express = require("express");
var app = express();
var request = require("request");

//No need to specify e.js extention on res.render()
app.set("view engine", "ejs");


//--------------------ROUTES--------------------
app.get("/", function(req, res){
    res.render("search");
});

app.get("/results", function(req, res){
    //Take what we typed into our form in search.ejs -> access name="search" and store in a variable
    var query = req.query.search;
    //Concat API URL with what we typed in form to create a custom search
    var url = "http://www.omdbapi.com/?s=" + query + "&apikey=thewdb";
    
    //Make API request using concatinated URL
    request(url, function(error, response, body){
        //If there is no error and response status code is successful (200)
        if(!error && response.statusCode == 200){
            //Take the body (returned as a long string) and turn into a JS object we can query, store in a variable
            var data = JSON.parse(body);
            //Pass the variable/JS object to results.ejs for processing and render the results on screen
            res.render("results", {data: data});
        }
    });
});


//--------------------LISTENER--------------------
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Movie app has started");
});


//=================NOTES====================
//As this is an array we use ["Search"][0] to access the first movie
//res.send(results["Search"][0]["Title"]);