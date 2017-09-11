//------------Udemy Solution------------

var faker = require("faker");

function printPrices(){
    for (var i=0; i < 10; i++){
        console.log(faker.commerce.productName() + " - $" + faker.commerce.price())
    }
}

printPrices();




//------------My solution------------
// var faker = require("faker");

// function printPrices(){
//     for (var i=0; i < 10; i++){
//         var randomName = faker.commerce.productName();
//         var randomNumber = faker.commerce.price();
//         console.log(randomName + " - $" + randomNumber)
//     }
// }

// printPrices();






