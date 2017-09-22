//error - deals with issues e.g server is down, request times out, no connection
//response - checks and compares status codes, e.g 200 = ok
//body - actual content being returned e.g HTML from google


//Udemy
var request = require('request');
request('https://query.yahooapis.com/v1/public/yql?q=select%20astronomy.sunset%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22maui%2C%20hi%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys', function(error, response, body){
    //If there are no errors and response code is 200 (successful) do the following
    if(!error && response.statusCode == 200){
        //Turn body into a JS object we can query using JSON.parse
        var parsedData = JSON.parse(body);
        //Drill down into specific area with data
        console.log(parsedData["query"]["results"]["channel"]["astronomy"]["sunset"]);
    }
});


//Github
// var request = require('request');

// request('http://www.google.com', function (error, response, body) {
//   console.log('error:', error); // Print the error if one occurred
//   console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
//   console.log('body:', body); // Print the HTML for the Google homepage.
// });