/**
 * Route handlers, used to control the response to incoming requests
 */

// Dependencies
const helpers = require('./helpers');
const config = require('./config');
const path = require('path');
const fs = require('fs');
const { parse } = require('querystring');

const Papa = require('./vendor/papaparse');
//const multipart = require('./vendor/multipart');

var formidable = require('./vendor/formidable/'),
http = require('http'),
util = require('util');
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

// Handler for test page
handlers.bundle = (data, callback) => {
    if(data.method == 'get'){
        helpers.getView('test_edgeb', (err, str)=> {
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

// Handler for the main page
handlers.main = (data, callback) => {
    if(data.method == 'get'){
        helpers.getView('main', (err, str)=> {
            if(!err && str){
                callback(200, str, 'html');
            } else {
                callback(500, 'undefined', 'html');
            }
        });
    } else {
        callback(405, undefined, 'html');
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
        console.log(assetName);
        if(assetName.length > 0){
            helpers.getAsset(assetName, (err, asset) => {
                if(!err && asset){

                    const ext = path.extname(assetName);

                    let contentType = 'plain';
                    switch(ext){
                        case '.html':
                            contentType = 'html';
                            break;
                        case '.css':
                            contentType = 'css';
                            break;
                        case '.js':
                            contentType = 'js';
                            break;
                        case '.ico':
                            contentType = 'favicon';
                            break;
                        case '.jpg':
                            contentType = 'jpg';
                            break;
                        case '.png':
                            contentType = 'png';
                            break;
                        case '.gif':
                            contentType = 'gif';
                            break;
                        case '.json':
                            contentType = 'json';
                            break;
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
        let fileName = data.path.replace('csv/','').trim();
        const csvDir = path.join(__dirname,'/../data/');

        fs.stat(csvDir + fileName, function(err) {
            if (!err) {
                console.log('file or directory exists');
                helpers.getFormattedCSV(fileName, (err, data) => {
                    if(!err && data){
                        callback(200, data, 'json')
                    }
                    else {
                        callback('No file found.');
                    }
                });
            }
            else if (err.code === 'ENOENT') {
                console.log('file or directory does not exist');
                callback(404);
            }
        });

    }else {
        callback(404);
    }
}

handlers.listDatasets = (data, callback) => {

    const csvDir = path.join(__dirname, '/../data/');

    if(data.method =='get'){

        let fileList = [];

        fs.readdir(csvDir, (err, files) => {
            if(!err && files){
                files.forEach(file => {
                    if(path.extname(file) == '.csv'){
                        fileList.push(file);
                    }
                });

                callback(200, {data : fileList}, 'json');
            } else {
                callback(405, 'undefined', 'html');
            }
        });

    }else {
        callback(405, 'undefined', 'html');
    }
}

handlers.comp = (data, callback) => {
    if(data.method == 'get'){
        let compName = data.path.replace('comp/','').trim();

        console.log(compName);
        if(compName.length > 0){
            helpers.getComponents(compName, (err, str)=>{
                if(!err && str){
                    callback(200, str, 'html');
                } else {
                    callback(500,'undefined', 'html');
                }
            });
        }
    }else {
        callback(405, undefined, 'html');
    }
}

// File not found router
handlers.notFound = (data, callback) => {
    callback(404, {'error': 'Resource not found!'}, 'json');
};

module.exports = handlers;
