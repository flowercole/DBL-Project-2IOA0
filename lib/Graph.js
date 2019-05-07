function Vertex(Name) {
    this.vertexName = Name;
    //this.vertexID = ID;
    //this.degree = 0;
    this.sayVertexName = function() {
        return this.vertexName;
  };
}
function Edge(startV,endV,EWeight) {
    this.startVertex = startV;
    this.endVertex = endV;
    this.edgeWeight = EWeight;
    this.sayEdgeID = function() {
        return this.vertexID;
  };
}
function Graph(array) {
    this.vertices=[];
    this.edges=[];
    this.getVertices = function() {           
        for(var i = 1; i < array.length; i++) {
        this.vertices.push(new Vertex(array[0][i]));
	   }
    }
    this.getEdges = function() {;
        for(var i = 1; i < array.length; i++) {
            for(var j = 1; j < array.length; j++) {
                if(array[i][j] > 0) {
                    this.edges.push(new Edge(this.vertices[i-1].vertexName,this.vertices[j-1].vertexName,array[i][j]));
                }
            }
        }
    }
}
var fs = require('fs');
fs.writeFile("thing.json", myJSON, (err) => {
  if (err) throw err;
  console.log('The file has been saved!');
});