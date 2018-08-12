/**
 * Server library
 */

 // Node Dependencies
 var fs = require('fs');
 var http = require('http');
 var https = require('https');
 var url = require('url');
 var StringDecoder = require('string_decoder').StringDecoder;
 var path = require('path');
 var util = require('util');
 var debug = util.debuglog('server');

 // Custom Dependencies
 var config = require('./../config');
 var handlers = require('./../handlers');
 var helpers = require('./../helpers');


/**
 * @description Main server object to be exported as a module.
 */
 var server = {};

/**
 * @description Routers for the server to listen to.
 */
 server.router = {
     'ping': handlers.ping,
     'notfound' : handlers.notfound,
     'users': handlers.users
 }

 /**
  * @description Master method called for every server created
  * @param  {object} req Request object
  * @param  {object} res Response object
  */
 server.masterServer = function(req, res){
    // Parsed data
    var parsed = server.parseUrl(req.url);

    // Get the method used
    var method = req.method.toLowerCase();

    // Get the headers
    var headers = req.headers;

    // Get the payload, if any
    var decoder = new StringDecoder('utf-8');
    var buffer = '';

    // On data request event
    req.on('data', data => {
        buffer += decoder.write(data);
    });

    // On end request event
    req.on('end', () => {
        buffer += decoder.end();

        // Choosing requested handlers, notfound if wrong
        var chosenHandler = typeof(server.router[parsed.path]) != 'undefined' 
            ? server.router[parsed.path] 
            : handlers.notfound;

        var data = {
            'path': parsed.path,
            'query': parsed.query,
            'method': method,
            'headers': headers,
            'payload': helpers.parseJsonStringToObject(buffer)
        };

        // Route the request to the specified handler in the router
        chosenHandler(data, (statusCode, payload) => {
            // Use the status code called back by the handler, or default 200
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

            // Use the payload defined by the handlers or default to an empty object
            payload = typeof(payload) == 'object' ? payload : {};

            // Convert the payload to a string
            var payloadString = JSON.stringify(payload);

            // Return the response
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);

            // If the response is 200, print green, otherwise print red
            var msgToLog = method.toUpperCase() + ' /' + parsed.path + ' ' + statusCode;
            var colourString = statusCode == 200 ? helpers.logColours.green : helpers.logColours.red;
            console.log(colourString, msgToLog);

        })


    });
 }

 /**
  * @description HTTP server
  * @param  {object} req Request object
  * @param  {object} res Response object
  */
 server.httpServer = http.createServer((res, req) => {
     server.masterServer(res, req);
 })

/**
 * @description Options for https server
 */
 server.httpsOptions = {
    'key': fs.readFileSync(path.join(__dirname, './https/key.pem')),
    'cert': fs.readFileSync(path.join(__dirname, './https/cert.pem'))
 };

  /**
  * @description HTTPS server
  * @param  {object} req Request object
  * @param  {object} res Response object
  */
 server.httpsServer = https.createServer(server.httpsOptions, (res, req) => {
    server.masterServer(res, req);
})


 /**
  * @description Parse a url giving back the clean path
  * and any query received
  * @param  {string} url Url to be parsed
  * @returns {object} {'path': string, 'query': string}
  */
 server.parseUrl = function(urlString){
     // Get and parse URK
     var parsedUrl = url.parse(urlString, true);

     // Getting the path from the URL
     var path = parsedUrl.pathname.replace(/^\/+|\/+$/g, '');

     return {
         'path': path,
         'query' : parsedUrl.query
     };
 }


 server.init = function(){
     // Start the HTTP server
     server.httpServer.listen(config.httpPort, () =>{
         console.log(helpers.logColours.blue, "Server listening on port " + config.httpPort);
     });

     // Start the HTTPS server
     server.httpsServer.listen(config.httpsPort, () =>{
        console.log(helpers.logColours.blue, "Server listening on port " + config.httpsPort);
    })

 }

 // Export the module
 module.exports = server;