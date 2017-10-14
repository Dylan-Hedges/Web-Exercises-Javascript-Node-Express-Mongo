var mongoose = require("mongoose");

//CAMPGROUND SCHEMA
var campgroundSchema = new mongoose.Schema({
   name: String,
   image: String,
   description: String,
   //An array of the comments ObjectId's
   comments:[
      {
         type:mongoose.Schema.Types.ObjectId,
         ref:"Comment"
      }
   ]
});

//CREATES AND EXPORTS CAMPGROUND MODEL to app.js
//Turns into a model - allows us to do ".find" ".replace" etc. NOTE - Campground automatically gets turned into Campgrounds
//module.exports - returns the mongoose model (Campground) back to app.js
module.exports = mongoose.model("Campground", campgroundSchema);