var mongoose = require("mongoose");

//CREATES COMMENT SCHEMA
var commentSchema = mongoose.Schema({
    text: String,
    //Author was changed from a String to an object consisting of 2 properties an id and username
    author: {
        id: {
            //refers to the auto gerate ID for each user
            type: mongoose.Schema.Types.ObjectId,
            //ref: refers to the model we will use, in this case the "User" model
            ref: "User"
        },
        //String name of the current user
        username: String
    }
});


//CREATES AND EXPORTS COMMENT MODEL to app.js
module.exports = mongoose.model("Comment", commentSchema);