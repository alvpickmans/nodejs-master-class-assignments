/**
 * User handlers
 */

  // Dependencies
  var _data = require('./../data');
  var validator = require('./../validator');
  var helpers = require('./../helpers');
//   var tokensHandlers = require('./tokens');
//   var checksHandlers = require('./checks');

  // Define handlers
  var handlers = {};

 // Users handlers
handlers.users = function(data, callback){
    var acceptableMethods = ['post', 'get', 'put', 'delete'];
    if(acceptableMethods.indexOf(data.method) > -1){
        handlers._users[data.method](data, callback);
    }else{
        callback(405);
    }
};

// User submethods container
handlers._users = {};

// Users - post
// Required data: firstName, lastName, email, password, phone, address, 
// Optional: none
handlers._users.post = function(data, callback){
    // Validate new user payload
    validator.validateSchema("new-user", data.payload)
    .then(payload => _data.read("users", payload.email))
    .then(dataRead =>{
        console.log(dataRead);
    })
    .catch(error =>{
        callback(400, error);
    });
    console.log("Executed");
    // validator.validateSchema("new-user", data.payload, (err, userData) => {
    //     if(!err && userData){
    //         // Checking if user already exists
    //         _data.read('users', userData.email, (err, data) => {
    //             if(err){
    //                 // Hash the password
    //                 var hashedPassword = helpers.hash(userData.password);

    //                 if(hashedPassword){
    //                     // Create the user object
    //                     userData.password = hashedPassword;

    //                     // Store the user
    //                     _data.create('users', userData.email, userData, (err) =>{
    //                         if(!err){
    //                             callback(200);
    //                         } else{
    //                             console.log(err);
    //                             callback(500, helpers.throwError("Could not create the new user"));
    //                         }
    //                     });
    //                 }else{
    //                     callback(500, helpers.throwError("Could not hash user\'s password"));
    //                 }

    //             } else{
    //                 callback(400, helpers.throwError('A user with that email account already exists.'));
    //             }
    //         });
    //     }else{
    //         callback(400, {"Error":"Some data is missing or invalid", "StackTrace": err})
    //     }
    // });
};

// // Users - get
// // Required data: email
// // Optional data: none
// handlers._users.get = function(data, callback){
//     // Check  that the email requested is valid
//     var queryEmail = data.queryStringObject.email;
//     var email = typeof(queryEmail) == 'string' && helpers.validEmailValue(queryEmail) ? queryEmail : false;

//     if(email){
//         // Get the token from the headers
//         var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
//         // Verify that the given token is valid for the email
//         tokensHandlers._tokens.verifyToken(token, email, (isTokenValid) => {
//             if(isTokenValid){
//                 // Lookup the user
//                 _data.read('users', email, (err, data) => {
//                     if(!err && data){
//                         // Remove hash password from the user object before returning it to the requester
//                         delete data.password;
//                         callback(200, data);
//                     }else{
//                         callback(404);
//                     }
//                 });
//             }else{
//                 callback(403, helpers.throwError("Missing required token in header or token is invalid"));
//             }
//         });
        
//     }else{
//         callback(400, helpers.throwError("Missing required field"))
//     }
// };

// // Users - put
// // Required data: email
// // Optional data: firstname, lastname, phone, password (at least one must be specified)
// handlers._users.put = function(data, callback){
//     // Check  that the email requested is valid
//     var queryEmail = data.payload.email;
//     var email = typeof(queryEmail) == 'string' && helpers.validEmailValue(queryEmail) ? queryEmail : false;

//     // Check optional fields
//     var firstName = helpers.validStringValue(data.payload.firstName);
//     var lastName = helpers.validStringValue(data.payload.lastName);
//     var password = helpers.validStringValue(data.payload.password);
//     var phone = helpers.validPhoneValue(data.payload.phone);

//     if(email){
//         //Error if nothing is sent to update
//         if(firstName || lastName || phone || password){

//             // Get the token from the headers
//             var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
//             // Verify that the given token is valid for the email
//             tokensHandlers._tokens.verifyToken(token, email, (isTokenValid) => {
//                 if(isTokenValid){
//                     _data.read('users', email, (err, userData) => {
//                         if(!err && userData){
//                             // Update the fields necessary
//                             if(firstName){ userData.firstName = firstName;}
//                             if(lastName) { userData.lastName = lastName; }
//                             if(phone) {userData.phone = phone; }
//                             if(password) {userData.password = helpers.hash(password); }
        
//                             // Store the new updates
//                             _data.update('users', email, userData, (err) => {
//                                 if(!err){
//                                     callback(200);
//                                 }else{
//                                     console.log(err);
//                                     callback(500, helpers.throwError("Could not update the user"));
//                                 }
//                             })
//                         }else{
//                             callback(400, helpers.throwError("The specified user does not exist"));
//                         }
//                     });
//                 }else{
//                     callback(403, helpers.throwError("Missing required token in header or token is invalid"));
//                 }
//             });
            
//         }else{
//             callback(400, helpers.throwError("Missing fields to update"));
//         }

//     }else{
//         callback(404, helpers.throwError("Missing required field"));
//     }
// };

// // Users - delete
// // Require data: email
// handlers._users.delete = function(data, callback){
//     // Check  that the email requested is valid
//     var queryEmail = data.queryStringObject.email;
//     var email = typeof(queryEmail) == 'string' && helpers.validEmailValue(queryEmail) ? queryEmail : false;

//     if(email){

//         // Get the token from the headers
//         var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
//         // Verify that the given token is valid for the email
//         tokensHandlers._tokens.verifyToken(token, email, (isTokenValid) => {
//             if(isTokenValid){
//                // Lookup the user
//                 _data.read('users', email, (err, userData) => {
//                     if(!err && userData){
//                         _data.delete('users', email, (err) => {
//                             if(!err){
//                                 var userChecks = typeof(userData.checks) == 'object' && userData.checks instanceof Array ? userData.checks : [];

//                                 if(userChecks.length > 0){
//                                     // Delete all checks associated with the user
//                                     checksHandlers._checks.deleteAll(userChecks, (err) => {
//                                         if(!err){
//                                             callback(200);
//                                         }else{
//                                             callback(500, err);
//                                         }
//                                     });
//                                 } else{
//                                     callback(200);
//                                 }
                                
//                             }else{
//                                 callback(500, helpers.throwError("Could not delete the specified user"));
//                             }
//                         })
//                     }else{
//                         callback(400, helpers.throwError("Could not find specified user "));
//                     }
//                 });
//             }else{
//                 callback(403, helpers.throwError("Missing required token in header or token is invalid"));
//             }
//         });

        
//     }else{
//         callback(404, helpers.throwError("Missing required field"))
//     }
// };

//Export user's module
module.exports = handlers;