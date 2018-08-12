/**
 * Request handlers
 * 
 */

 // Dependencies
var users = require('./users');


// Define the handlers
var handlers = {};

// Not found handler
handlers.notfound = function(data, callback){
    callback(404);
};

// Ping handler
handlers.ping = function(data, callback){
    callback(200);
};


// Export module
module.exports = Object.assign(
    handlers,
    users
);