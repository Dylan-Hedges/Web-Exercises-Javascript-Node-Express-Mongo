var mongoose = require("mongoose");
//Includes passport-local-mongoose as installed
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    password: String
});

//Adds methods from passport local mongoose to our user schema (e.g authentication etc.)
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);