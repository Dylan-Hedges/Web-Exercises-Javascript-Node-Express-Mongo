var express = require('express');
var app = express();

//Home page route
app.get("/", function(req, res){
    res.send("Hi there, welcome to my exercise");
});

//Animal sounds text display
app.get("/speak/:animal", function(req, res){
    //Create object of animals and their corrisponding sounds
    var sounds = {
        pig: "Oink",
        cow: "Moo",
        dog: "Woof Woof",
        cat: "Meow",
        goldfish: "..."
    }
    //Store the animals name in a variable & convert to lower case (so "Dog" and "dog" works)
    var animal = req.params.animal.toLowerCase();
    //Take the animal name (key), run it through the sounds object, take the (value) and store in a variable
    var sound = sounds[animal];
    
    res.send("The " + animal + " says '" + sound + "'");
});

//Repeat words
app.get("/repeat/:word/:number", function(req, res){
    var word = req.params.word;
    var number = Number(req.params.number);
    var displayOnScreen = "";
    
    for (var i=0; i < number; i++){
      displayOnScreen += word + " ";
    }
    
    //Can only send once, cant be in loop
    res.send(displayOnScreen);
});

//Catch all page
app.get("*", function(req, res){
    res.send("Sorry, page not found, what are you doing with your life?");
});

//Listen for requests
app.listen(process.env.PORT, process.env.IP,function(){
    console.log("Server has started!");
});



//---------------My Solution---------------

// app.get("/speak/:animal", function(req, res){
//     var animal = req.params.animal;
    
//     if (animal === "pig"){
//         res.send("Oink");
//     } else if (animal === "cow"){
//         res.send("Moo");
//     } else if (animal === "dog"){
//         res.send("Woof Woof");
//     }
// });