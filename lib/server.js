/**
 * Server implementation for Node.js
 * @author Adrian
 */

// Dependencies
const http = require('http');
const https = require('https');
const http2 = require('http2');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');
const fs = require('fs');
const path = require('path');
const handlers = require('./handlers');

// Instantiate server
let server = {};

// Create the 3 server flavors: HTTP, HTTPS, HTTP/2
server.httpServer = http.createServer((req, res) => {
    server.unifiedServer(req,res);
});

server.httpsServerOptions = {
    // Self-signed certificate, to be replaced with a real one at some point
    'key': fs.readFileSync(path.join(__dirname,'/../https/key.pem')).toString(),
    'cert': fs.readFileSync(path.join(__dirname,'/../https/cert.pem')).toString()
};

server.httpsServer = https.createServer(server.httpsServerOptions, (req, res) => {
    server.unifiedServer(req,res);
});


server.http2Server = http2.createSecureServer(server.httpsServerOptions, (req, res) => {
    server.unifiedServer(req, res);
});

// Shared server code
server.unifiedServer = function(req, res){
 
    // Parse url
    const parseUrl = url.parse(req.url,true);
    // Get path and trim it (remove trailing /)
    const path = parseUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g,'');
    
    // Get the HTTP Method for the request
    const method = req.method.toLowerCase();
    
    // Get query string as object
    const queryString = parseUrl.query;

    // Get requests headers
    const headers = req.headers;

    // Get payload (if any, for e.g. http post data)
    const decoder = new StringDecoder('utf-8');
    let buffer = '';
    // start reading it on a buffer
    req.on('data', function(data){
        buffer += decoder.write(data);      
    });
    req.on('end', function(){
        // till it's done (node uses a stream model)
        buffer += decoder.end();
        // Pick appropriate handler
        let chosenHandler = typeof(server.router[trimmedPath]) !== 'undefined' ? server.router[trimmedPath] : handlers.notFound;
        
        // special case for the public assets
        chosenHandler = trimmedPath.indexOf('public/') > -1 ? handlers.public : chosenHandler;

        // Data object, to be passed back with the response
        const data = {
            'path' : trimmedPath,
            'queryStringObject': queryString,
            'method': method,
            'headers': headers,
            'payload': buffer
        };
        
        // Route request

        chosenHandler(data, (statusCode, payload,contentType) => {
            // if no content type provided, default to json
            contentType = typeof(contentType) === 'string' ? contentType : 'json';
            // get status code or default to 200
            statusCode = typeof(statusCode) === 'number'? statusCode : 200;
            
            // Set the appropriate headers and the payload
            let payloadString = '';
           
            if(contentType == 'html'){
                res.setHeader('Content-Type', 'text/html; charset=utf-8');
                payloadString = typeof(payload) == 'string'? payload : '';
            }
           
            if(contentType == 'favicon'){
                res.setHeader('Content-Type', 'image/x-icon');
                payloadString = typeof(payload) !== 'undefined' ? payload : '';
            }
           
            if(contentType == 'json'){
                res.setHeader('Content-Type', 'application/json');
                // use the payload of the handler, or default to empty object
                payload = typeof(payload) === 'object' ? payload : {};
                // convert payload to string
                payloadString = JSON.stringify(payload);
            }
           
            if(contentType == 'css'){
                res.setHeader('Content-Type', 'text/css');
                payloadString = typeof(payload) !== 'undefined' ? payload : '';
            }
           
            if(contentType == 'jpg'){
                res.setHeader('Content-Type', 'image/jpeg');
                payloadString = typeof(payload) !== 'undefined' ? payload : '';
            }
            
            if(contentType == 'png'){
                res.setHeader('Content-Type', 'image/png');
                payloadString = typeof(payload) !== 'undefined' ? payload : '';
            }

            if(contentType == 'plain'){
                res.setHeader('Content-Type', 'text/plain');
                payloadString = typeof(payload) === 'string' ? payload : '';
            }

            // return the request
            res.writeHead(statusCode);
            res.end(payloadString)
        });
        
        // console.log(`Received ${method} request for ${trimmedPath} with query string parameters`, queryString);
        // console.log('Headers:', headers);
        // console.log('Payload', buffer);
    });

}


server.router = {
    '': handlers.index, 
    'favicon.ico': handlers.favicon,
    'public': handlers.public,
    'csv': handlers.csv,
};


server.init = () => {
    // Start the http server
    server.httpServer.listen(config.httpPort, () => {
        console.log('\x1b[34m%s\x1b[0m',`The HTTP server is listening on port ${config.httpPort}.`);
    });
    // Start the https server
    server.httpsServer.listen(config.httpsPort, () => {
        console.log('\x1b[36m%s\x1b[0m',`The HTTPS server is listening on port ${config.httpsPort}.`);
    });
    // Start experimental HTTP/2 server
    server.http2Server.listen(3003, () => console.log('\x1b[32m%s\x1b[0m', 'The HTTP/2 server is listening on port 3003.'))
};

module.exports = server;