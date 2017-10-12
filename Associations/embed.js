//--------------SET UP----------

var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/blog_demo");

//--------------POST MODEL----------

//Post Schema
var postSchema = new mongoose.Schema({
    title: String,
    content: String
});

//Post Model
var Post = mongoose.model("Post", postSchema);

//--------------USER MODEL--------------

//User Schema
var userSchema = new mongoose.Schema({
    email: String,
    name: String,
    //Store all our posts as an array, brings 2 models together (USER &  POST)
    posts: [postSchema]
});

//User Model
var User = mongoose.model("User", userSchema);

//Create new user (temporary)
var newUser = new User({
    email: "hermione@hogwarts.edu",
    name: "Hermione Granger"
});

//Push post into posts array
newUser.posts.push({
    title: "How to brew potion",
    content: "Go to potions class"
});

//Save new user to the DB (permenant)
newUser.save(function(err, user){
    if(err){
        console.log(err);
    }else{
        console.log(user);  
    }
});

//Display user & add additonal post
//(user) everything before "user.save" refers to the pre-updated user
User.findOne({name: "Hermione Granger"}, function(err, user){
   if(err){
    //   console.log(err);
   }else{
       //Push post to the array (temporary - not saved in DB)
       user.posts.push({
           title: "3 things i dont like",
           content:"Voldermort, Voldermort, Voldermort"
       });
       //Save post to DB (premenant), (user) now refers to the updated user from the DB
       user.save(function(err, user){
           if(err){
               console.log(err)
            }else{
                console.log(user)
            }
        });
   }
});




//-----------------------SEPERATE SCHEMAS-----------------------------------------
// var newPost = new Post({
//     title: "Reflections on Apples",
//     content:"They are delicious"
// });

// newPost.save(function(err, post){
//     if(err){
//         console.log(err);
//     }else{
//         console.log(post);  
//     }
// });


