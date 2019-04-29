# DBL WebTech Group 26

This is the visualization project of Group 26.

## Getting started
The project is made using a custom web server based on Node.js.
First, for using https, create a https folder in the root of the project, and fill in a certificate (in a file cert.pem) and a key (key.pem). This can be done using this website https://www.sslchecker.com/csr/self_signed or from the terminal with openssl.
Secondly, to run the app, in the root directory, run:
```
node index.js
```
You should be able to see it in your browser by going to http://localhost:3000

### Prerequisites
* Node.js

## Project structure
```
├── data                    // Folder for the storage of data files
├── https                   // Holds the SSL certificate and key
│   ├── cert.pem
│   └── key.pem
├── index.js                // Entry point for the application
├── lib
│   ├── config.js
│   ├── handlers.js
│   ├── helpers.js
│   ├── server.js           
│   ├── vendor              // Place for all the external libraries (jQuer, Angularjs,....)
│   └── workers.js
├── public                 // Folder to share static assets (css/images/..)
│   ├── app.css
│   ├── app.js
│   └── favicon.ico
└── views                   // Templates and views to be rendered
    └── index.html
```