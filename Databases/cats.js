//run "node cats.js to see it execute"
var mongoose = require("mongoose");

//Connect to the DB - "/cat_app" will search for the cat_app DB, if it cant find it will create one with that name 
mongoose.connect("mongodb://localhost/cat_app", {useMongoClient: true});
//mongoose.connect("mongodb://localhost/cat_app"); - causes error, use course notes code


//Creates schema - Defines what a cat is, create a pattern/structure for your data, you can still add fields later
var catSchema = new mongoose.Schema({
    name: String,
    age: Number,
    temperament: String
});

//Creates model - Take schema and save it as a model (JS object) to the variable "Cat", can now apply methods e.g "Cat.create", "Cat" is the singluar version of our model, i.e 1 cat, model names often start with a captial, in this case "Cat"
var Cat = mongoose.model("Cat", catSchema);

//Creates a new cat and saves to the DB, callback "function {}" is included to tell us if we have any errors, if yes print error, if no print cat 
Cat.create({
    name: "Snow White",
    age: 15,
    temperament: "Bland"
}, function(err, cat){
    if(err){
        console.log(err);
    }else{
        console.log(cat);
    }
});

//Displays all cats in the DB
Cat.find({}, function(err, cats){
    if(err){
        console.log("OH NO, ERROR");
        console.log(err);
    }else{
        console.log("ALL THE CATS...");
        console.log(cats);
    }
});





//---------------SLOW METHOD for .create--------------------

//Creates a new cat (not yet added to DB), the name george is only relevant in the JS, once saved to the DB we will not reference again, can use var george for every new cat 
// var george = new Cat({
//     name: "Mrs. Norris",
//     age: 7,
//     temperament: "Evil"
// });

//Saves cat to DB - executes function regardless if save worked, tells us if we have an error (use for .find, .create etc.)
// george.save(function(err, cat){
//     if(err){
//         console.log("Something went wrong");
//     }else{
//         console.log("We just saved a cat to the DB");
//         //(cat) displays what has been saved to the DB, not what we have in our JS i.e "george"
//         console.log(cat);
//     }
// });