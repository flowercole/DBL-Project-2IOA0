# DBL WebTech Group 26

This is the visualization project of Group 26. 

## Short description
The project is made using a custom web server based on the Node.js web api. The visualizations are created using a number of graphing libraries for javascript, namely D3.js and Plotly.js

## Getting started

This project is available online at https://dbl-viz.herokuapp.com/ . Due to the fact that we are using the free tier of the platform, the perfomrnace for large datasets will be bottlenecked.

### Local setup
#### Prerequisites
The only requirement for running this project is Node.js. 
No external dependencies on npm packages are present since we want to

#### Running the application locally
After cloning the repo, in order to run the app, in the project root directory, use the following terminal command:
```
node index.js
```
If you have npm installed:
```
npm start
```
also works. 
For live reloading a tool such as nodemon can be used https://nodemon.io/. 
You should be able to see it in your browser by going to http://localhost:3000 (the port can be changed in the config.js file or by providing the PORT_ENV enviroment variable)

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