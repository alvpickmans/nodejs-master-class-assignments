/*
* NodeJS Master Class
* Homework 1 - RESTful JSON API
*
*/

// Node Dependencies
var http = require('http');
var https = require('https');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var fs = require('fs');

// Custom Dependencies
var config = require('./config');

/**
 * @description HelloWolrd API for The NodeJS Master Class, Homework #1
 */
function HelloWorldAPI(){

    var httpsServerOptions = {
        'key': fs.readFileSync('./https/key.pem'),
        'cert': fs.readFileSync('./https/cert.pem')
    };

    /**
     * @description Available servers on API
     */
    this.servers = {
        'http': http.createServer(function(req, res){ this.serverCallback(req, res) }.bind(this)),
        'https': https.createServer(httpsServerOptions, function(req, res){this.serverCallback(req,res)}.bind(this))
    };

    /**
     * @description API Handlers
     */
    this.handlers = {
        'ping': function(data, callback){
            callback(202);
        },
        'notFound': function(data, callback){
            callback(404);
        },
        'hello': function(data, callback){
            https.get('https://randomuser.me/api/', function(res){
                var response = '';
                
                res.on('data', function(d){ 
                    response += d;
                })

                res.on('end', function(){
                    callback(200, JSON.parse(response));
                })
            });
        }
    };
    
    /**
     * @description API Routers
     */
    this.routers = {
        'ping': this.handlers.ping,
        'hello': this.handlers.hello
    };

};


/**
 * @description Method to be called for every server created
 * @param  {} req
 * @param  {} res
 */
HelloWorldAPI.prototype.serverCallback = function(req, res){
    // Get and parse URL
    var parsedUrl = url.parse(req.url, true);

    // Get the path from URL
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g, '');

    // Get the query string as an object
    var queryStringObject = parsedUrl.query;

    // Get the HTTP Method
    var method = req.method.toLowerCase();

    // Get the Headers as an object
    var headers = req.headers;

    //Get the payload, if any
    var decoder = new StringDecoder('utf-8');
    var buffer = '';
    req.on('data', function(data){
        buffer += decoder.write(data);
    });

    req.on('end', function(){
        buffer += decoder.end();

        // Choose the handler this request should go to.
        // If one is not found, use the notFound handler

        var chosenHandler;
        if(typeof(this.routers[trimmedPath]) !== 'undefined'){
            chosenHandler = this.routers[trimmedPath];
        }else{
            chosenHandler = this.handlers.notFound;
        }

        var data = {
            'trimmedpath' : trimmedPath,
            'queryStringObject': queryStringObject,
            'method': method,
            'headers': headers,
            'payload': buffer
        };

        // Route the request to the handler specified in the router
        chosenHandler(data, function(statusCode, payload){
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

            // Log the request path
            console.log("Returning this response", statusCode, payload);
        });

    }.bind(this));
}

/**
 * @description Method to start a server by providing its name.
 * Input '*' to start all servers defined
 * @param  {string} server Name of the server to start. Input '*' to start all.
 */
HelloWorldAPI.prototype.startServer = function(server){
    // If input not a string
    if(typeof(server) !== "string"){
        console.log("Server input must be a string");
    }
    // If input is '*', start all servers
    else if(server == "*")
    {
        Object.keys(this.servers).forEach(function(key){
            this.servers[key].listen(config[key].port, function(){
                console.log("Server is listening on port " + config[key].port);
            });
        }.bind(this));
    }
    // If input not a defiend server
    else if(typeof(this.servers[server])  == 'undefined'){
        console.log("Server input not found on servers defined");
    }
    // Start defined server
    else{
        this.servers[server].listen(config[server].port, function(){
            console.log("Server is listening on port " + config[server].port);
        });
    }
}



// Starting app
var app = new HelloWorldAPI();

app.startServer('*');
