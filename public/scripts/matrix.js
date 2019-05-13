
//// MATRIX SCRIPT ////

// Function to initialize the matrix (Gets called from main file)
loadMatrix = () => {

  // Initialize
  var filename = localStorage.getItem('selected_file');
  var file;

  // Fetch file
  fetch('http://localhost:3000/csv/'+filename)
  .then(function(response) {
    return response.json();
  })
  .then(function(myJson) {
    file = JSON.parse(JSON.stringify(myJson));
    // Run Visualise with file
    Visualise(file);
  });

}

// Main Visualise Function
function Visualise(file) {

  // Initialize
  var xValues = [];
  var yValues  = [];

  // Build the name values
  for(var i = 1; i < file.length; i++) {
    xValues.push(file[0][i]);
  }

  // yValues and xValues should be equal by default
  yValues=xValues;

  // Remove duplicates, adding counter
  for(var i = 0; i < xValues.length-1;i++) {
    var counter=0;
    for(var j = i+1; j < xValues.length; j++) {
      if(xValues[i]==xValues[j]) {
        xValues[j]=xValues[j]+counter*" ";
        counter++;
      }
    }
  }

  // Build Matrix Function
  function matrix(rows, cols, defaultValue){
    var arr = [];
    // Creates all lines:
    for(var i=0; i < rows; i++){
      // Creates an empty line
      arr.push([]);
      // Adds cols to the empty line:
      arr[i].push( new Array(cols));
      for(var j=0; j < cols; j++){
        // Initializes:
        arr[i][j] = defaultValue;
      }
    }
    return arr;
  }

  // Build a Proper Matrix from the CSV file
  var array = matrix(file[0].length,file[0].length,"*");

  // Fill in array with correct values from the CSV file
  for(var i = 0; i < file[0].length; i++) {
    for(var j = 0; j < file[0].length; j++) {
      array[i][j]=file[i][j];
    }
  }

  // Build a Matrix for zValues
  var zValues = matrix(file[0].length-1,file[0].length-1,"*");

  // Fill in array with correct z-values
  for(var i = 0; i < array[0].length-1; i++) {
    for(var j = 0; j < array[0].length-1; j++) {
      zValues[i][j]=array[i+1][j+1];
    }
  }

  // Input data for heatmap
  var data = [
    {
    z: zValues,
    x: xValues,
    y: yValues,
    type: 'heatmap'
    }
  ];

  // Run Heatmap
  Plotly.newPlot('visualization-canvas', data, {}, {showSendToCloud: true});

}
