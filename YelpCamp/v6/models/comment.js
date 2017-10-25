var mongoose = require("mongoose");

//CREATES COMMENT SCHEMA
var commentSchema = mongoose.Schema({
    text: String,
    author: String
});


//CREATES AND EXPORTS COMMENT MODEL to app.js
module.exports = mongoose.model("Comment", commentSchema);