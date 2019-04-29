/**
 * Wrapper around Web workers - to be completed
 */

// Dependencies
const http = require('http');
const https = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');


var workers = {};

workers.loop = function(){
    setInterval(function(){
            
    },1000*60)
};

workers.init = function(){
    workers.loop();
};

module.exports = workers;