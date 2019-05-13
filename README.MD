# DBL WebTech Group 26

This is the visualization project of Group 26.

## Short description
The project is made using a custom web server based on Node.js. The visualizations are created using a number of graphing libraries for javascript, namely D3.js and Plotly.js

## Getting started

### Prerequisites
The only requirement for running this project is Node.js. 
No external dependencies on npm packages are present since we want to

### Running the application
~~First, for using https, create a https folder in the root of the project, and fill in a certificate (in a file cert.pem) and a key (key.pem). This can be done using this website https://www.sslchecker.com/csr/self_signed or from the terminal with Openssl.~~ For convenience, the https folder is already present.

Secondly, to run the app, in the project root directory, use the following terminal command:
```
node index.js
```
Or, if you have npm installed:
```
npm start
```
also works.
You should be able to see it in your browser by going to http://localhost:3000

## Project structure
The project has the following structure:
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
│   ├── vendor              // Place for all the external libraries
│   └── workers.js
├── public                  // Folder to share static assets (css/images/..)
│   ├── app.css
│   ├── app.js
│   └── favicon.ico
└── views                   // Templates and views to be rendered
│    └── index.html
│    └── components          // Folder for html templates
└── .gitignore    
└── package.json            // Place to define project scripts
└── README.md               // The current file. Hello 😄!  
```

## Api requests
The server currently responds to the following api paths
```
POST    /upload            -> upload a csv file, offers some metadata in return
GET     /csv/{filename}    -> returns a json matrix of the parsed csv
GET     /datasets          -> returns a list of all available datasets
```