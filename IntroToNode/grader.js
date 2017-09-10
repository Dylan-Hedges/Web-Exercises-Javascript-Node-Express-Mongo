//Udemy Solution
var scores = [90, 98, 89, 100, 100, 86, 94];
var scores2 = [40, 65, 77, 82, 80, 54, 73, 63, 95, 49];

function average(scores){
    var total = 0;
    scores.forEach(function(score){
       total += score; 
    });
    
    var avg = total/scores.length;
    return Math.round(avg);
}

console.log(average(scores));
console.log(average(scores2));






//My Solution
// var scores = [90, 98, 89, 100, 100, 86, 94];
// var scores2 = [40, 65, 77, 82, 80, 54, 73, 63, 95, 49];

// function average(scores){
//     var total = 0;
//     for (var i=0; i < scores.length; i++){
//         total += scores[i];
//         // console.log(total);
//     }
//     total = total/scores.length;
//     console.log(Math.round(total));
// }


// average(scores);
// average(scores2);