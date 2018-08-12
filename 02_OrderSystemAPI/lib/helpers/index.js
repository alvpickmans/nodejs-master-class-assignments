/**
 * Helpers library
 */

 // Node Dependencies
 var crypto = require('crypto');

 // Custom dependencies
 var config = require('./../config');


/**
 * Helpers object module to be exported
 */
 var helpers = {};


 /**
  * Parses a JSON formatted string into an object, or empty object if failing to parse.
  * @param  {} jsonString The string to parse 
  */
 helpers.parseJsonStringToObject = function(jsonString){
     try{
         return JSON.parse(jsonString);
     }catch(e){
         return {};
     }
 };

/**
 * Hash a string using SHA256
 * @param {String} str String to hash
 * @returns {String} Hashed string
 */
 helpers.hash = function(str){
    if(typeof(str) == 'string' && str.length > 0){
        var hash = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
        return hash;
    }else{
        return false;
    }
 };

/**
 * Returns an object with the Error key and the given message;
 * @param {String} message 
 */
 helpers.throwError = function(message){
    var errorObject = {'Error': String(message)};
    return errorObject;
 }


/**
 * Object containing colour codes for login to console
 */
 helpers.logColours = {
     'yellow' : '\x1b[33m%s\x1b[0m',
     'blue' : '\x1b[36m%s\x1b[0m',
     'green' : '\x1b[32m%s\x1b[0m',
     'red' : '\x1b[31m%s\x1b[0m'
 }


 // Export the module
 module.exports = Object.assign(
     helpers
 );
