/*
* NodeJS Master Class
* Homework 2 - Ordering System API
*
*/

// Node Dependencies

// Custom Dependencies
var server = require('./lib/server');

// Instantiate app 
var app = {};

// App init function
app.init = function(){
    // Start the server
    server.init();
    // Start the workers
}

// Execute the app
app.init();

// Export the app
module.exports = app;