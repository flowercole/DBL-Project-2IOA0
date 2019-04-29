/**
 * Route handlers, used to control the response to incoming requests
 */

// Dependencies
const helpers = require('./helpers');
const config = require('./config');
const path = require('path');
const fs = require('fs');
const Papa = require('./vendor/papaparse');

// Define all the handlers
let handlers = {};

// Handler for the default route
handlers.index = (data, callback) => {
    if(data.method == 'get'){
        helpers.getView('index', (err, str)=> {
            if(!err && str){
                callback(200, str, 'html');
            } else {
                callback(500,'undefined', 'html');
            }
        });
    } else {
        callback(405,undefined,'html');
    }
};

// Handle favicon.ico requests
handlers.favicon = (data, callback) => {
    if(data.method == 'get'){
        helpers.getAsset('favicon.ico', (err, asset) => {
            if(!err && asset){
                callback(200, asset, 'favicon');
            }else {
                callback(500);
            }
        });
    }else {
        callback(400, 'undefined');
    }
}

// Deal with requests to static assets (from public folder)
handlers.public = (data, callback) => {
    if(data.method == 'get'){
        const assetName = data.path.replace('public/','').trim();

        if(assetName.length > 0){
            helpers.getAsset(assetName, (err, asset) => {
                if(!err && asset){
                    
                    const ext = path.extname(assetName);

                    let contentType = 'plain';
                    switch(ext){
                        case '.css':
                            contentType = 'css';
                            break;
                        case '.ico':
                            contentType = 'favicon';
                            break;
                        case '.jpg':
                            contentType = 'jpg';
                            break;
                        case '.png':
                            contentType = 'png';
                        default:
                            break;
                    }
                    callback(200, asset, contentType);
                }else {
                    // asset not found
                    callback(404);
                }
            })
        }else {
            callback(404);
        }
    }
}

handlers.csv = (data, callback) => {
    if(data.method == 'get'){
        const fileName = 'GephiMatrix_author_similarity.csv';
        const viewsDir = path.join(__dirname,'/../data/');
        fs.readFile(viewsDir+fileName, "utf-8", (err, file) => {
            if(!err && file){
                Papa.parse(file, {
                    complete: function(results) {
                        console.log("Finished:", results.data);
                        callback(200,results.data, 'json');
                    }
                });
            }
            else{
                callback(404);
            }
        });
    }else {
        callback(404);
    }
}

// File not found router
handlers.notFound = (data, callback) => {
    callback(404);
};

module.exports = handlers;