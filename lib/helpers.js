/**
 * A way to share helper function across the codebase
 */

 // Dependencies
const config = require('./config');
const querystring = require('querystring');
const path = require('path');
const fs = require('fs');

let helpers = {};
const Papa = require('./vendor/papaparse');

// Fetch view  based on request
helpers.getView = (viewName, callback) => {
    typeof(viewName) === "string" && viewName.length > 0 ? viewName : false;
    if(viewName){
        const viewsDir = path.join(__dirname,'/../views/');
        fs.readFile(viewsDir+viewName+'.html', 'utf8', function(err,str){
            if(!err && str && str.length > 0){
                callback(false, str);
            }else {
                callback('View not found');
            }
        });
    } else {
        callback('Wrong template specified');
    }
}

// Fetch static asset (from the public folder!)
helpers.getAsset = (assetName, callback) => {
    assetName = typeof(assetName) == 'string' && assetName.length >0 ? assetName : false;
    if(assetName){
        const publicDir = path.join(__dirname, '/../public/');
        fs.readFile(publicDir+assetName, (err,data) => {
            if(!err && data){
                callback(false, data);
            }else {
                callback('No file found.');
            }
        });
    } else {
        callback('A valid filename was not specified.');
    }
}


helpers.getFormattedCSV = (csvFile, callback) => {
    csvFile = typeof(csvFile) == 'string' && csvFile.length >0 ? csvFile : false;
    if(csvFile){
        const csvDir = path.join(__dirname, '/../data/');

        fs.readFile(csvDir+csvFile, "utf-8", (err, data) => {
            if(!err && data){
                Papa.parse(data, {
                    complete: function(results) {
                        console.log("Finished (first 200 characters):", JSON.stringify(results.data).substring(0,200));
                        callback(false,results.data);
                    }
                });
                // callback(false, data);
            }else {
                callback('No file found.');
            }
        });
    } else {
        callback('A valid filename was not specified.');
    }
}

module.exports = helpers;
