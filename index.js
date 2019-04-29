/**
 * Entry point
 */

const server = require('./lib/server');
// const workers = require('./lib/workers');

var app = {};

app.init = function(){
    server.init();
    // Background workers
    // workers.init();
};

app.init();

module.exports = app;