//// MATRIX SCRIPT ////

// Function to initialize the matrix (Gets called from main file)
var xValues = [];
var yValues  = [];
var zValues;
var xValuesOriginal=[];
var yValuesOriginal=[];
var zValuesOriginal=[];
var box;
var colorscaleValue = [
        [0, '#D3DFFF'],
        [1, '#003DDE']
    ];
loadMatrix = (box1) => {

  // Initialize
  var filename = localStorage.getItem('selected_file');
  var file;

  // Fetch file
  fetch('/csv/'+filename)
  .then(function(response) {
    return response.json();
  })
  .then(function(myJson) {
    file = JSON.parse(JSON.stringify(myJson));
    box = box1;
    // Run Visualise with file
    Visualise(file, box);
  });

}
function AlphabeticalOrder(xVal,yVal,zVal) {
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
    var sortAr = new Array();
    for(var i =0; i < xVal.length; i++) {
        sortAr.push(xVal[i]);
    }
    sortAr = sortAr.sort();
    var permutation = new Array();
    for(var i = 0; i < xVal.length; i++) {
        for(var j = 0; j < xVal.length; j++) {
            //.valueOf()
            if(xVal[i]==sortAr[j]) {
                permutation.push(j);
                break;
            }
        }
    }

    var alphaZValues = matrix(zVal[0].length,zVal[0].length,"*")
    var reorderedZValues = matrix(zVal[0].length,zVal[0].length,"*")
    for(var i = 0; i < zVal[0].length; i++) {
      for(var j = 0; j < zVal[0].length; j++) {
          alphaZValues[i][j] = zVal[i][permutation[j]];
      }
    }
    for(var i = 0; i < zVal[0].length; i++) {
      for(var j = 0; j < zVal[0].length; j++) {
          reorderedZValues[j][i] = alphaZValues[permutation[j]][i];
      }
    }
    DisplayGraph(sortAr,sortAr,reorderedZValues)
    //var returnArray = [sortAr,sortAr,reorderedZValues];
    //return returnArray;
    return;
}
function SumOrder(xVal,yVal,matrix) {
    var rows = new Array(matrix[0].length).fill(0);
    for(var i = 0; i < matrix[0].length; i++){
      for(var j = 0; j < matrix[0].length; j++){
        rows[i] += matrix[i][j];
      }
    }

    var cols = new Array(matrix[0].length).fill(0);
    for(var i = 0; i < matrix[0].length; i++){
      for(var j = 0; j < matrix[0].length; j++){
        cols[j] += matrix[i][j];
      }
    }

    rows_index = [];
    cols_index = [];
    for(var i = 0; i < matrix[0].length; i++){
      rows_index[i] = i;
      cols_index[i] = i;
    }

    function swap(a, b) {
      return [b, a]
    }

    function partition(A, B, lo, hi){
      var pivot = A[hi];
      var i = lo;
      for (j = lo; j < hi; j++){
        if (A[j] < pivot){
          [A[i],A[j]] = swap(A[i],A[j]);
          [B[i],B[j]] = swap(B[i],B[j]);
          i++;
        }
      }
      [A[i],A[hi]] = swap(A[i],A[hi]);
      [B[i],B[hi]] = swap(B[i],B[hi]);
      return i;
    }

    function quicksort(A, B, lo, hi){
      if (lo < hi){
        var p = partition(A, B, lo, hi);
        quicksort(A, B, lo, p - 1);
        quicksort(A, B, p + 1, hi);
      }
    }

    quicksort(cols, cols_index,0,cols.length-1);
    quicksort(rows, rows_index,0,rows.length-1);


    var order_matrix = [];
    for(var i = 0; i < matrix[0].length; i++){
      order_matrix[i] = [];
      for(var j = 0; j < matrix[0].length; j++){
        order_matrix[i][j] = matrix[rows_index[i]][cols_index[j]];
      }
    }
    var reorderedXValues = new Array(xVal.length).fill(0);
    var reorderedYValues = new Array(yVal.length).fill(0);
    for(var i = 0; i < xVal.length;i++) {
        reorderedXValues[i] = xVal[cols_index[i]];
        reorderedYValues[i] = yVal[rows_index[i]];
    }
    
    /*colorscaleValue = [
        [0, '#D3DFFF'],
        [1, '#003DDE']
    ];*/
    
    console.log(zValues);
    DisplayGraph(reorderedXValues,reorderedYValues,order_matrix)
    //var returnArray = [reorderedXValues,reorderedYValues,order_matrix]
    //return returnArray;
    return;
}
function AverageOrder(xVal,yVal,initial_matrix) {

    var rows = new Array(initial_matrix[0].length).fill(1);
    for(var i = 0; i < initial_matrix[0].length; i++){
      for(var j = 0; j < initial_matrix[0].length; j++){
        rows[i] *= initial_matrix[i][j];
      }
    }
    for(var i = 0; i < initial_matrix[0].length; i++){
      rows[i] = Math.pow(rows[i],1/initial_matrix[0].length);
    }

    var cols = new Array(initial_matrix[0].length).fill(1);
    for(var i = 0; i < initial_matrix[0].length; i++){
      for(var j = 0; j < initial_matrix[0].length; j++){
        cols[j] *= initial_matrix[i][j];
      }
    }

    for(var i = 0; i < initial_matrix[0].length; i++){
      cols[i] = Math.pow(cols[i],1/initial_matrix[0].length);
    }

    rows_index = [];
    cols_index = [];
    for(var i = 0; i < initial_matrix[0].length; i++){
      rows_index[i] = i;
      cols_index[i] = i;
    }

    function swap(a, b) {
      return [b, a]
    }

    function partition(A, B, lo, hi){
      var pivot = A[hi];
      var i = lo;
      for (j = lo; j < hi; j++){
        if (A[j] < pivot){
          [A[i],A[j]] = swap(A[i],A[j]);
          [B[i],B[j]] = swap(B[i],B[j]);
          i++;
        }
      }
      [A[i],A[hi]] = swap(A[i],A[hi]);
      [B[i],B[hi]] = swap(B[i],B[hi]);
      return i;
    }

    function quicksort(A, B, lo, hi){
      if (lo < hi){
        var p = partition(A, B, lo, hi);
        quicksort(A, B, lo, p - 1);
        quicksort(A, B, p + 1, hi);
      }
    }

    quicksort(cols, cols_index,0,cols.length-1);
    quicksort(rows, rows_index,0,rows.length-1);


    var order_matrix = [];
    var matrix_names = [];
    for(var i = 0; i < initial_matrix[0].length; i++){
      order_matrix[i] = [];
      matrix_names[i] = [];
      for(var j = 0; j < initial_matrix[0].length; j++){
        order_matrix[i][j] = initial_matrix[rows_index[i]][cols_index[j]];
      }
    }

    var reorderedXValues = new Array(xVal.length).fill(0);
    var reorderedYValues = new Array(yVal.length).fill(0);
    for(var i = 0; i < xVal.length;i++) {
        reorderedXValues[i] = xVal[cols_index[i]];
        reorderedYValues[i] = yVal[rows_index[i]];
    }
    
  console.log(zValues);
    DisplayGraph(reorderedXValues,reorderedYValues,order_matrix)
    //var returnArray = [reorderedXValues,reorderedYValues,order_matrix]
    //return returnArray;
    return;
}
function OriginalOrder() {
    DisplayGraph(xValuesOriginal,yValuesOriginal,zValuesOriginal);
}
function UpdateGraphColor(xVal,yVal,zVal,box) {
    let attributes = [];
    attributes[0] = document.getElementById('startColor').value;
    attributes[1] = document.getElementById('endColor').value;
    colorscaleValue = [
        [0, attributes[0].toString()],
        [1, attributes[1].toString()]
    ];
  //Input data for heatmap
    DisplayGraph(xVal,yVal,zVal)
    
}
function SelectReordering(selectTag) {
            var selIndexes = "";
            //console.log(zValues);
            for (var i = 0; i < selectTag.options.length; i++) {
                var optionTag = selectTag.options[i];
                if (optionTag.selected) {
                    if (selIndexes.length > 0)
                        selIndexes += ", ";
                    selIndexes += optionTag.text;
                }
            }

            var info = document.getElementById ("info");
            if (selIndexes.length > 0) {
                console.log("Selected options: " + selIndexes);
                if(selIndexes=="Original") {
                    console.log("Original");
                    OriginalOrder();
                }
                if(selIndexes=="Alphabetical") {
                    console.log("Alphabetical");
                    AlphabeticalOrder(xValues,yValues,zValues);
                }
                if(selIndexes=="Sum") {
                    console.log("Sum");
                    SumOrder(xValues,yValues,zValues);
                }
                if(selIndexes=="Average") {
                    console.log("Average");
                    AverageOrder(xValues,yValues,zValues);
                }   
            }
            else {
                console.log("There is no selected option");
            }
}
function Visualise(file, box) {  
    
  xValues = [];
  yValues = [];
  // Build the name values
  for(var i = 1; i < file.length; i++) {
    xValues.push(file[0][i]);
  }

  // yValues and xValues should be equal by default
  yValues = xValues;
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

  //matrix for after a reordering
  var reorderedMatrix = array;

  // Fill in array with correct values from the CSV file
  for(var i = 0; i < file[0].length; i++) {
    for(var j = 0; j < file[0].length; j++) {
      array[i][j]=file[i][j];
    }
  }
  // Build a Matrix for zValues
  zValues = matrix(file[0].length-1,file[0].length-1,"*");

  // Build a Table for zValues
  var table = matrix(file[0].length,file[0].length-1,"*");

  for(var i = 0; i < array[0].length; i++) {
    for(var j = 0; j < array[0].length-1; j++) {
      table[i][j]=array[i][j+1];
    }
  }
  // Fill in array with correct z-values
  for(var i = 0; i < array[0].length-1; i++) {
    for(var j = 0; j < array[0].length-1; j++) {
      zValues[i][j]=array[i+1][j+1];
    }
  }

    //var returnAlphaBeticalOrder = AlphabeticalOrder(xValues,yValues,zValues);
    //var returnSumOrder = SumOrder(xValues,yValues,zValues);
    //var returnAverageOrder = AverageOrder(xValues,yValues,zValues);
    //console.log(zValues);
    //console.log(returnSumOrder[2]);
  //Input data for heatmap
xValuesOriginal = xValues;
yValuesOriginal = yValues;
zValuesOriginal = zValues;

DisplayGraph(xValues,yValues,zValues);
document.getElementById("updateHeatmap").addEventListener("click",function() {UpdateGraphColor(xValues,yValues,zValues,box)} );
    
}
function DisplayGraph(xVal,yVal,zVal) {
    var data = [
    {
    z: zVal,
    x: xVal,
    y: yVal,
    colorscale: colorscaleValue,
    type: 'heatmap'
    }
  ];
    var layout = {
  title: 'Heatmap of your data set',
};
  
  Plotly.newPlot(`${box}`, data, layout,{showSendToCloud: true});
}

