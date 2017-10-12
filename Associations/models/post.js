var mongoose = require("mongoose");

//--------------POST MODEL----------

//Post Schema
var postSchema = new mongoose.Schema({
    title: String,
    content: String
});

//Post Model
//Returns the data back to the references.js page (in this case returns the model, works similar to the return function, nothing is returned unless we explicitly say)
module.exports = mongoose.model("Post", postSchema);

