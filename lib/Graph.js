var a;
     fetch('http://localhost:3000/csv/GephiMatrix_author_similarity.csv')
      .then(function (response) {
        return response.json();
      })
      .then(function (myJson) {
         a = JSON.parse(JSON.stringify(myJson));
         StartMaking();
      });
function StartMaking() {

  function MakeCsvToArray() {

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
    return zValues;
  }

    function Vertex(Name) {
        this.vertexName = Name;
        /*this.sayVertexName = function() {
          return this.vertexName;
        };*/
    }
    function Edge(startV,endV,EWeight) {
        this.startVertex = startV;
        this.endVertex = endV;
        this.edgeWeight = EWeight;
        /*this.sayEdgeID = function() {
            return this.vertexID;
      };*/
    }
    function Graph(array) {
        this.vertices=[];
        this.edges=[];

        for(var i = 1; i < array.length; i++) {
        this.vertices.push(new Vertex(array[0][i]));
        }

        for(var i = 1; i < array.length; i++) {
            for(var j = 1; j < array.length; j++) {
                if(array[i][j] > 0) {
                    this.edges.push(new Edge(this.vertices[i-1].vertexName,this.vertices[j-1].vertexName,array[i][j]));
                }
            }
        }
    }
var graph = new Graph(MakeCsvToArray());
var myJSON = JSON.stringify(graph);
var fs = require('fs');
    fs.writeFile("thing.json", myJSON, (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
    });
}
