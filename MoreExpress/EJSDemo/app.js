var express = require("express");
var app = express();

// Tells express to serve the contents of the public folder, i.e other .js, .ejs files can be found <link> to without the exact path, put in header.ejs/footer.ejs partials/templates
app.use(express.static("public"));

//DRY Tip - Tells express the end of the file is ".ejs" you do not need to write this in res.render()
app.set("view engine", "ejs");

//--------------------------------------------

app.get("/", function(req, res){
    res.render("home.ejs");
});

app.get("/fallinlovewith/:thing", function(req, res){
    var thing = req.params.thing;
    res.render("love.ejs", {thingVar: thing});
});

app.get("/posts", function(req, res){
    var posts = [
        {title: "post 1", author: "Suzy"},
        {title: "post 2", author: "John"},
        {title: "post 3", author: "Fred"},
    ];
    //posts: - refers to .ejs variable, :posts - refers to "var posts ={}"
    res.render("posts.ejs", {posts: posts})
});

//process.env.PORT/IP are environment variables set up by cloud9
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server is on");
});