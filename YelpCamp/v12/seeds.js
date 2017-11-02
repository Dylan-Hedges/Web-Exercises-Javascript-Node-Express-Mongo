var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

//Array of starter data
var data = [
    {
        name: "Clouds Rest", 
        image: "http://www.photosforclass.com/download/3694766056",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    },
    {
        name: "Desert", 
        image: "http://www.photosforclass.com/download/769733695",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."    
    },
    {
        name: "Moutain", 
        image: "http://www.photosforclass.com/download/3694766056",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    }
];



function seedDB(){
    //Removes all campgrounds in DB
    Campground.remove({}, function(err){
        if(err){
            console.log(err);
        }
            console.log("removed campgrounds!"); 
            //Loop through the data array
            data.forEach(function(seed){
            //Save a campground for each entry in the data array
            Campground.create(seed, function(err,campground){
                if(err){
                    console.log(err);
                }else{
                    console.log("Added a campground");
                    //Create Comment for each newly created campground
                    Comment.create(
                        {
                            text: "This is great, but i want internet",
                            author: "Homer"
                        }, function(err,comment){
                            if(err){
                                console.log(err);
                            }else{
                                //Push comment to the comments array (as defined in campground.js)
                                campground.comments.push(comment);
                                //Save comment to campground on DB
                                campground.save();
                                console.log("Created new comment");
                            }
                        });
                }
            });
        });
    }); 
    

}

//Exports the function seedDB
module.exports = seedDB;