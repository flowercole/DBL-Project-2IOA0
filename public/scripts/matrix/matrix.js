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
function AlphabeticalOrder(xValues,zValues) {
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
    for(var i =0; i < xValues.length; i++) {
        sortAr.push(xValues[i]);
    }
    sortAr = sortAr.sort();
    var permutation = new Array();
    for(var i = 0; i < xValues.length; i++) {
        for(var j = 0; j < xValues.length; j++) {
            //.valueOf()
            if(xValues[i]==sortAr[j]) {
                permutation.push(j);
                break;
            }
        }   
    }
    
    var alphaZValues = matrix(zValues[0].length,zValues[0].length,"*")
    var reorderedZValues = matrix(zValues[0].length,zValues[0].length,"*")
    for(var i = 0; i < zValues[0].length; i++) {
      for(var j = 0; j < zValues[0].length; j++) {
          alphaZValues[i][j] = zValues[i][permutation[j]];     
      } 
    } 
    for(var i = 0; i < zValues[0].length; i++) {
      for(var j = 0; j < zValues[0].length; j++) {
          reorderedZValues[j][i] = alphaZValues[permutation[j]][i];  
      } 
    }
    var ret = [sortAr,reorderedZValues];
    return ret;
}
function SumOrder(xValues,yValues,matrix) {
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
    var reorderedXValues = new Array(xValues.length).fill(0);
    var reorderedYValues = new Array(yValues.length).fill(0);
    for(var i = 0; i < xValues.length;i++) {
        reorderedXValues[i] = xValues[cols_index[i]];
        reorderedYValues[i] = yValues[rows_index[i]];
    }
    var returnArray = [reorderedXValues,reorderedYValues,order_matrix]
    return returnArray;
}
/*function AverageOrder(xValues,yValues,matrix) {
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
    var reorderedXValues = new Array(xValues.length).fill(0);
    var reorderedYValues = new Array(yValues.length).fill(0);
    for(var i = 0; i < xValues.length;i++) {
        reorderedXValues[i] = xValues[cols_index[i]];
        reorderedYValues[i] = yValues[rows_index[i]];
    }
    var returnArray = [reorderedXValues,reorderedYValues,order_matrix]
    return returnArray;
}*/
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
  var zValues = matrix(file[0].length-1,file[0].length-1,"*");
    
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
    //some reordering from reorder.js
    //console.log(zValues);
    //var perm = reorder.optimal_leaf_order()(zValues);
    //console.log(perm);
    //var permuted_mat = reorder.stablepermute(zValues, perm);
    //console.log(permuted_mat);
    //console.log(permuted_mat);
    
  //color diapason of the tiles 
    var colorscaleValue = [
        [0, '#ffffff'],
        [1, '#FF0000']
    ];
    var returnAlphaBeticalOrder = AlphabeticalOrder(xValues,zValues);
    var returnSumOrder = SumOrder(xValues,yValues,zValues);
    console.log(zValues);
    console.log(returnSumOrder[2]);
  //Input data for heatmap
 var data = [
    {
    z: returnSumOrder[2],
    x: returnSumOrder[0],
    y: returnSumOrder[1],
    colorscale: colorscaleValue,
    type: 'heatmap'
    }
  ];
  //var data = [trace1,trace2];
  var layout = {
  title: 'Heatmap of your data set',
};
    
  // Run Heatmap
  Plotly.newPlot('visualization-canvas', data, layout,{showSendToCloud: true});
}
