var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer");
        

    

mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine", "ejs");
//Allows us to use our custom style sheet (semantic UI/Bootstrap)
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
//express-sanitizer must come after body parser
app.use(expressSanitizer());
//"_method" treat POST as a PUT request
app.use(methodOverride("_method"));


//SCHEMA
var blogSchema = new mongoose.Schema({
   title: String,
   image: String,
   body: String,
   created: {type: Date, default: Date.now}
});

//MODEL
var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//     title: "Test Blog",
//     image: "https://cdn.pixabay.com/photo/2017/09/26/23/04/monkey-2790452__340.jpg",
//     body: "HELLO THIS IS A BLOG POST",
// });



app.get("/", function(req, res){
   res.redirect("/blogs"); 
});

//INDEX
app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log("ERROR!");
        }else{
            res.render("index", {blogs: blogs});
        }
    });
});

//NEW
app.get("/blogs/new", function(req, res){
    res.render("new");
});


//CREATE
app.post("/blogs", function(req, res){
    //Take typed content, sanitize it for harmful code (i.e remove <script> tags) and save
    req.body.blog.body = req.sanitize(req.body.blog.body);
    //Create blog post
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render("new");
        }else{
            res.redirect("/blogs");
        }        
    });
});


//SHOW
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("show", {blog: foundBlog});
        }                
    })
});

//EDIT
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("edit", {blog: foundBlog});
        }          
    })
});

//UPDATE
app.put("/blogs/:id", function(req, res){
    //Sanitze the blog update for harmful <script> tags
    req.body.blog.body = req.sanitize(req.body.blog.body);
    
    //Takes 3 arguments - Id, New Data, Callback function
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect("/blogs");
        }else{
           res.redirect("/blogs/" + req.params.id);
        }  
    });
});

//DELETE
app.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs");
        }  
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("BLOG SERVER HAS STARTED"); 
});
    