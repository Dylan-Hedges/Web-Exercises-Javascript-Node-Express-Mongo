var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    password: String
});

//Add methods from the passport local mongoose package to the user schema (i.e passport.serializeUser, passport.deserializeUser)
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);