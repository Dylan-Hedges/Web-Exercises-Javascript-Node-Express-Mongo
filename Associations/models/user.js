var mongoose = require("mongoose");

//--------------USER MODEL--------------

//User Schema
var userSchema = new mongoose.Schema({
    email: String,
    name: String,
    posts: [
        {
            //mongoose object ID belonging to a post
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        }    
    ]
});

//User Model (return to main page)
module.exports = mongoose.model("User", userSchema);