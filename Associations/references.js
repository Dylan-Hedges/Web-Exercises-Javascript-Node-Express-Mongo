//--------------SET UP----------

var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/blog_demo_2");

//Include the "post" file, ./" references where we currently are
var Post = require("./models/post");
var User = require("./models/user");

//Create User
User.create({
    email: "bob@gmail.com",
    name: "Bob Belcher"
});

//Create post and assign to user
Post.create({
        //Create post
        title: "How to cook the best burger part 4",
        content: "ADSADSDADADEWDEWFWEFW"
    }, function(err, post){
            //Find the user
            User.findOne({email: "bob@gmail.com"}, function(err,foundUser){
                if(err){
                    console.log(err);
                }else{
                    //Push posts into the users posts
                    foundUser.posts.push(post);
                    //Save post to DB
                    foundUser.save(function(err, data){
                        if(err){
                            console.log(err);
                        }else{
                            //Print out the data
                            console.log(data);
                        }
                    })
                }
            });
    });

//Retrive data
//User.findOne({email: "bob@gmail.com"}) - find a user
//.populate("posts") - populate the posts array (temporary) with all posts in the DB
//.exec(function(err,user) - executes the query

User.findOne({email: "bob@gmail.com"}).populate("posts").exec(function(err,user){
    if(err){
        console.log(err);
    }else{
        console.log(user);
    }
});