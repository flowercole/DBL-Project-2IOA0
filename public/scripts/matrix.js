//// MATRIX SCRIPT ////

// Function to initialize the matrix
loadMatrix = () => {
    var a;
    var filename = localStorage.getItem('selected_file');
        fetch('http://localhost:3000/csv/'+filename)
        .then(function(response) {
        return response.json();
        })
        .then(function(myJson) {
            a = JSON.parse(JSON.stringify(myJson));
            Visualise();
        });
    //call when the
    function Visualise() {

        var xValues = [];
        var yValues  = [];
        //build the name values
        for(var i = 1; i < a.length; i++) {
            xValues.push(a[0][i]);
        }

        //yvalues and xValues should be equal by default
        yValues=xValues;

        //remove duplicates adding counter
        for(var i = 0; i < xValues.length-1;i++) {
            var counter=0;
            for(var j = i+1; j < xValues.length; j++) {
                if(xValues[i]==xValues[j]) {
                    xValues[j]=xValues[j]+counter*" ";
                    counter++;
                }
            }
        }

        //build a matrix
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

        //build a proper matrix from the csv file
        var array = matrix(a[0].length,a[0].length,"*");

        //fill in array with correct values from the csv file matrix
        for(var i = 0; i < a[0].length; i++) {
                for(var j = 0; j < a[0].length; j++) {
                    array[i][j]=a[i][j];
            }
        }

        //build a matrix for zValues
        var zValues = matrix(a[0].length-1,a[0].length-1,"*");

        for(var i = 0; i < array[0].length-1; i++) {
                for(var j = 0; j < array[0].length-1; j++) {
                    zValues[i][j]=array[i+1][j+1];
            }
        }

        //input data for heatmap
        var data = [
            {
            z: zValues,
            x: xValues,
            y: yValues,
            type: 'heatmap'
            }
        ];
        //display heatmap
        Plotly.newPlot('app', data, {}, {showSendToCloud: true});
    }
  }
