//// MATRIX SCRIPT ////

// Function to initialize the matrix (Gets called from main file)
var xValues = [];
var yValues  = [];
var zValues;
var xValuesOriginal=[];
var yValuesOriginal=[];
var zValuesOriginal=[];
var box;
var dimention=2;
var colorscaleValue = [
        [0, localStorage.getItem('startColor')],
        [1, localStorage.getItem('endColor')]
    ];

document.getElementById("updateSettings").addEventListener("click",function() {
  if (localStorage.getItem('vis-1') == 'matrix' || localStorage.getItem('vis-2') == 'matrix' || localStorage.getItem('vis-3') == 'matrix' || localStorage.getItem('vis-4') == 'matrix'  ){
    UpdateGraph()
    SelectReordering(document.getElementById('selectReordering'))
  }
});

document.getElementById("viewHeatmap3D").addEventListener("click",function() {
  if (localStorage.getItem('vis-1') == 'matrix' || localStorage.getItem('vis-2') == 'matrix' || localStorage.getItem('vis-3') == 'matrix' || localStorage.getItem('vis-4') == 'matrix'  ){
    ChangeDimention()
    SelectReordering(document.getElementById('selectReordering'))
  }
});

var minSlider = document.getElementById("minWeight");
var maxSlider = document.getElementById("maxWeight");
minSlider.oninput = function() {
    //document.getElementById('minWeightHeatmapValue').innerHTML = this.value;
}
maxSlider.oninput = function() {
    //document.getElementById('maxWeightHeatmapValue').innerHTML = this.value;
}

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

    if(dimention==2) {
        DisplayGraph(sortAr,sortAr,reorderedZValues)
    } else {
        Display3DGraph(sortAr,sortAr,reorderedZValues)
    }

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
    if(dimention==2) {
        DisplayGraph(reorderedXValues,reorderedYValues,order_matrix);
    } else {
        Display3DGraph(reorderedXValues,reorderedYValues,order_matrix);
    }
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

    if(dimention==2) {
        DisplayGraph(reorderedXValues,reorderedYValues,order_matrix);
    } else {
        Display3DGraph(reorderedXValues,reorderedYValues,order_matrix);
    }
    //var returnArray = [reorderedXValues,reorderedYValues,order_matrix]
    //return returnArray;
    return;
}
function OriginalOrder() {
    //xValues=xValuesOriginal;
    //yValues=yValuesOriginal;
    //zValues=zValuesOriginal;

    if(dimention==2) {
        DisplayGraph(xValuesOriginal,yValuesOriginal,zValuesOriginal);
    } else {
        Display3DGraph(xValuesOriginal,yValuesOriginal,zValuesOriginal);
    }
}
function ColSumOrder(xVal,yVal,matrix) {
    var cols = new Array(matrix[0].length).fill(0);
    for(var i = 0; i < matrix[0].length; i++){
      for(var j = 0; j < matrix[0].length; j++){
        cols[j] += matrix[i][j];
      }
    }

    cols_index = [];
    for(var i = 0; i < matrix[0].length; i++){
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

    var order_matrix = [];
    for(var i = 0; i < matrix[0].length; i++){
      order_matrix[i] = [];
      for(var j = 0; j < matrix[0].length; j++){
        order_matrix[i][j] = matrix[cols_index[i]][cols_index[j]];
      }
    }
    var reorderedXValues = new Array(xVal.length).fill(0);
    var reorderedYValues = new Array(yVal.length).fill(0);
    for(var i = 0; i < xVal.length;i++) {
        reorderedXValues[i] = xVal[cols_index[i]];
        reorderedYValues[i] = yVal[cols_index[i]];
    }

    /*colorscaleValue = [
        [0, '#D3DFFF'],
        [1, '#003DDE']
    ];*/
    console.log("col sum");
    if(dimention==2) {
        DisplayGraph(reorderedXValues,reorderedYValues,order_matrix);
    } else {
        Display3DGraph(reorderedXValues,reorderedYValues,order_matrix);
    }
    //var returnArray = [reorderedXValues,reorderedYValues,order_matrix]
    //return returnArray;
    return;
}
function RowSumOrder(xVal,yVal,matrix) {
    var rows = new Array(matrix[0].length).fill(0);
    for(var i = 0; i < matrix[0].length; i++){
      for(var j = 0; j < matrix[0].length; j++){
        rows[i] += matrix[i][j];
      }
    }

    rows_index = [];
    for(var i = 0; i < matrix[0].length; i++){
      rows_index[i] = i;
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

    quicksort(rows, rows_index,0,rows.length-1);

    var order_matrix = [];
    for(var i = 0; i < matrix[0].length; i++){
      order_matrix[i] = [];
      for(var j = 0; j < matrix[0].length; j++){
        order_matrix[i][j] = matrix[rows_index[i]][rows_index[j]];
      }
    }
    var reorderedXValues = new Array(xVal.length).fill(0);
    var reorderedYValues = new Array(yVal.length).fill(0);
    for(var i = 0; i < xVal.length;i++) {
        reorderedXValues[i] = xVal[rows_index[i]];
        reorderedYValues[i] = yVal[rows_index[i]];
    }

    /*colorscaleValue = [
        [0, '#D3DFFF'],
        [1, '#003DDE']
    ];*/
    console.log("row sum");
    if(dimention==2) {
        DisplayGraph(reorderedXValues,reorderedYValues,order_matrix);
    } else {
        Display3DGraph(reorderedXValues,reorderedYValues,order_matrix);
    }
    //var returnArray = [reorderedXValues,reorderedYValues,order_matrix]
    //return returnArray;
    return;
}
function Cuthill_Mckee(xVal,yVal,initial_matrix){
  //var initial_matrix = [];
  for(var i=0; i < initial_matrix[0].length;i++){
    initial_matrix[i] = [];
    for(var j=0;j<initial_matrix[0].length;j++){
      initial_matrix[i][j]=initial_matrix[i][j];
    }

  }
  for(var i = 0; i < initial_matrix[0].length; i++){
      for(var j = 0; j <= i; j++){
        if (initial_matrix[i][j] == 0 && initial_matrix[j][i] != 0) {
          initial_matrix[i][j] = initial_matrix[j][i]
        }else if (initial_matrix[i][j] != 0 && initial_matrix[j][i] != 0){
          initial_matrix[j][i] = initial_matrix[i][j] = (initial_matrix[i][j] + initial_matrix [j][i])/2;
        }else if (initial_matrix[i][j] != 0 && initial_matrix[j][i] == 0){
          initial_matrix[j][i] = initial_matrix[i][j];
        }
    }
  }
  var maxValue = 0;
    for (var i = 0; i < initial_matrix[0].length; i++) {
      for (var j = 0; j < initial_matrix[0].length; j++){
        if(maxValue < initial_matrix[i][j])
          maxValue = initial_matrix[i][j];
      }
    }
    console.log(maxValue);
    var binary_matrix = [];
    for(var i = 0; i < initial_matrix[0].length; i++){
      binary_matrix[i] = [];
      for(var j = 0; j < initial_matrix[0].length; j++){
        if(initial_matrix[i][j] > 0 && initial_matrix[i][j] < 0.225*maxValue){
          binary_matrix[i][j] = 1;
        } else {
          binary_matrix[i][j] = 0;
        }
        if(i == j){
          binary_matrix[i][j] = 1;
        }
      }
    }

    function findIndex(a, x) {
      for (var i = 0; i < a.length; i++)
        if (a[i].index == x)
            return i;
      return -1;
    }

    function sumDegrees(a){
      var sum = 0;
      for(var i = 0; i < a.length; i++){
        sum += a[i];
      }
      return sum;
    }

    Array.prototype.remove = function(from, to) {
      var rest = this.slice((to || from) + 1 || this.length);
      this.length = from < 0 ? this.length + from : from;
      return this.push.apply(this, rest);
    };
    var perm_0 = cuthillMckee(binary_matrix);
    function cuthillMckee(matrix) {
      var n = matrix[0].length;
      var result = [];
      var queue = new Queue();
      var added = new Array(n).fill(false);
      var notVisited = [];
      for(var i = 0; i < n; i++){
        notVisited.push(i);
      }
      //step 6: Terminate this algorithm once all objects are included in R.
      while(notVisited.length){
        //step 1: We first find the object with minimum degree whose index has not yet been added to Result. Say, object corresponding to pth row has been identified as the object with a minimum degree. Add p to Result.
        var minNodeIndex = 0;

        for (var i = 1; i < notVisited.length; i++){
          if (sumDegrees(matrix[notVisited[i]]) < sumDegrees(matrix[notVisited[minNodeIndex]])){
            minNodeIndex = i;
          }
        }
        queue.enqueue(notVisited[minNodeIndex]);

        for(var i = 0; i < notVisited.length; i++){
          if(notVisited[i] == queue.peek()){
            notVisited.splice(i,1);
          }
        }
        //step 2:As an index is added to Result, and add all neighbors of the corresponding object at the index, in increasing order of degree, to Q.
        //step 3:Extract the first node in Q, say C. If C has not been inserted in R, add it to R, add to Q the neighbors of C in increasing order of degree.
        //step 4:If Q is not empty, repeat S3.
        while(!queue.isEmpty()){
          var toSort = [];

          for (var i = 0; i < n; i++) {
            var found_i = -1;
            for (var j = 0; j < notVisited.length; j++){
              if (notVisited[j] == i){
                found_i = j;
                break;
              }
            }
            if (i != queue.peek() && matrix[queue.peek()][i] == 1 && found_i != -1) {
              toSort.push(i);
              notVisited.splice(i,1);
            }
          }

          toSort.sort(function(a, b){return a-b});

          for (var i = 0; i < toSort.length; i++){
            queue.enqueue(toSort[i]);
          }
          result.push(queue.peek());
          queue.dequeue();
        }
      //If Q is empty, but there are objects in the matrix which have not been included in R, start from S1, once again. (This could happen if there are disjoint graphs)
      }
      return result;
    }


    console.log(perm_0);
    var perm = [];
    var exist = new Array(binary_matrix[0].length).fill(false);
    for(var i = 0; i < perm_0.length; i++){
      if(exist[perm_0[i]]){
        ;
      } else {
        perm.push(perm_0[i]);
        exist[perm_0[i]] = true;
      }
    }

    for(var i = 0; i < initial_matrix[0].length; i++){
      if(!exist[i]){
        perm.splice(i,0,i);
      }
    }
    console.log(binary_matrix[0]);
    console.log(perm);

    var order_matrix = [];
    for(var i = 0; i < initial_matrix[0].length; i++){
      order_matrix[i] = [];
      for(var j = 0; j < initial_matrix[0].length; j++){
        order_matrix[i][j] = initial_matrix[perm[i]][perm[j]];
      }
    }

    var reorderedXValues = new Array(xVal.length).fill(0);
    var reorderedYValues = new Array(yVal.length).fill(0);
    for(var i = 0; i < xVal.length;i++) {
        reorderedXValues[i] = xVal[perm[i]];
        reorderedYValues[i] = yVal[perm[i]];
    }

     if(dimention==2) {
        DisplayGraph(reorderedXValues,reorderedYValues,order_matrix);
    } else {
        Display3DGraph(reorderedXValues,reorderedYValues,order_matrix);
    }


}
function SelectGraphColor(xVal,yVal,zVal,box) {
    let attributes = [];
    attributes[0] = document.getElementById('startColor').value;
    attributes[1] = document.getElementById('endColor').value;
    colorscaleValue = [
        [0, attributes[0].toString()],
        [1, attributes[1].toString()]
    ];

  //Input data for heatmap
}
function SelectEdgeRange(xVal,yVal,zVal) {
    var minWeightHeatmap = document.getElementById("minWeight").value;
    var maxWeightHeatmap = document.getElementById("maxWeight").value;
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

    var zValuesReduced = matrix(zVal[0].length,zVal[0].length,"*")
    for(var i = 0; i < zVal[0].length; i++) {
        for(var j = 0; j < zVal[0].length; j++) {
            zValuesReduced[i][j]=zVal[i][j];
        }
    }

    for(var i = 0; i < zVal[0].length; i++) {
        for(var j = 0; j < zVal[0].length; j++) {
            if(zVal[i][j] < minWeightHeatmap || zVal[i][j] > maxWeightHeatmap) {
              zValuesReduced[i][j] = null;
            }
        }
    }
    var returnArray = [xVal,yVal,zValuesReduced];
    return returnArray;
}
function UpdateGraph() {
    var ret=[];
    ret=SelectEdgeRange(xValues,yValues,zValues);
    SelectGraphColor(ret[0],ret[1],ret[2],box);
    console.log(ret);

    if(dimention==2) {
        DisplayGraph(ret[0],ret[1],ret[2]);
     } else {
         Display3DGraph(ret[0],ret[1],ret[2]);
    }

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

            var info = document.getElementById("info");
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
                if(selIndexes=="Column Sum") {
                    console.log("Column Sum");
                    ColSumOrder(xValues,yValues,zValues);
                }
                if(selIndexes=="Row Sum") {
                    console.log("Row Sum");
                    RowSumOrder(xValues,yValues,zValues);
                }
                if(selIndexes=="Cuthill-Mckee") {
                    console.log("Cuthill-Mckee");
                    //Cuthill_Mckee(xValues,yValues,zValues);
                }
            }
            else {
                console.log("There is no selected option");
            }
}
function ChangeDimention() {
    console.log("button hit");
    console.log("start"+dimention);
    element = document.getElementById("viewHeatmap3D").innerHTML
    if (element=="Switch to 3D") {
        document.getElementById("viewHeatmap3D").innerHTML = "Switch to 2D";
        dimention=3;
        console.log("to3d")
        Display3DGraph(xValuesOriginal,yValuesOriginal,zValuesOriginal);
        //document.getElementById("selectReordering").selectedIndex = 0;
        //document.getElementById('minWeightHeatmapValue').innerHTML = 0.00;
        //document.getElementById('maxWeightHeatmapValue').innerHTML = 10;
    }
    else {
        console.log("to2d")
        document.getElementById("viewHeatmap3D").innerHTML = "Switch to 3D";
        dimention=2;
        DisplayGraph(xValuesOriginal,yValuesOriginal,zValuesOriginal);
        //document.getElementById("selectReordering").selectedIndex = 0;
        //document.getElementById('minWeightHeatmapValue').innerHTML = 0.00;
        //document.getElementById('maxWeightHeatmapValue').innerHTML = 10;
    }
    console.log("end"+dimention);
}
function Visualise(file, box) {
    //document.getElementById("selectReordering").selectedIndex = 0;
    //document.getElementById('minWeightHeatmapValue').innerHTML = 0.00;
    //document.getElementById('maxWeightHeatmapValue').innerHTML = 10;
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
SelectReordering(document.getElementById('selectReordering'))

}
function DisplayGraph(xVal,yVal,zVal) {
    document.getElementById("viewHeatmap3D").innerHTML = "Switch to 3D";
    var data = [
    {
    z: zVal,
    x: xVal,
    y: yVal,
    colorscale: colorscaleValue,
    colorbar: { tickfont: {family: "\'Inconsolata\', monospace;", size:"9", color: "#f3f3f3"}},
    type: 'heatmap'
    }
  ];
    var layout = {
    xaxis: {linecolor: "#f3f3f3", linewidth: 1, mirror: true, tickfont:{color:"rgba(0,0,0,0)"}, tickcolor:"rgba(0,0,0,0)"},
    yaxis: {linecolor: "#f3f3f3", linewidth: 1, mirror: true, tickfont:{color:"rgba(0,0,0,0)"}, tickcolor:"rgba(0,0,0,0)"},
    margin: {b:'20', l:'20', r:'20', t:'20'},
    paper_bgcolor: "rgba(0,0,0,0)"
};

  Plotly.newPlot(`${box}`, data, layout,{showSendToCloud: true,scrollZoom: true,displayModeBar: false,displaylogo: false,responsive: true});
      myPlot = document.getElementById(`${box}`);
myPlot.on('plotly_hover', function(data){
    console.log("hover");
    //pn = data.points[0].pointNumber;
    //console.log("pointnumber"+pn);
    //colors[0] = '#00000';

    /*var update = {
        z: tempZ
    };*/
    //Plotly.restyle(`${box}`, update);
});

myPlot.on('plotly_unhover', function(data){
 console.log("unhover")
});
    /*var update = {
        z: tempZ
    };*/
    //Plotly.restyle(`${box}`, update);
}
function Display3DGraph(xVal,yVal,zVal) {

    document.getElementById("viewHeatmap3D").innerHTML = "Switch to 2D";
     var data = [{
      x: xVal,
      y: yVal,
      z: zVal,
      type: 'surface',
      colorbar: { tickfont: {family: "\'Inconsolata\', monospace;", size:"9", color: "#f3f3f3"}},
      colorscale: colorscaleValue,
      contours: {
        z: {
          show:true,
          //usecolormap: true,
          highlightcolor:"#42f462",
          project:{z: true}
        }
      }
    }];

    var layout = {
      scene: {
        camera: {eye: {x: 1.87, y: 0.88, z: 1}},
        xaxis: { color:"rgba(0,0,0,0)", gridwidth:"0", tickfont:{size:"1"}, title:{text:""} },
        yaxis: { color:"rgba(0,0,0,0)", gridwidth:"0", tickfont:{size:"1"}, title:{text:""} },
        zaxis: { color:"rgba(0,0,0,0)", gridwidth:"0", tickfont:{size:"1"}, title:{text:""} }
      },
      margin: {b:'20', l:'20', r:'20', t:'20'},
      paper_bgcolor: "rgba(0,0,0,0)"

    };
    Plotly.newPlot(`${box}`, data, layout,{showSendToCloud: true,displayModeBar: false,scrollZoom: true,displaylogo: false,responsive: true});
}
