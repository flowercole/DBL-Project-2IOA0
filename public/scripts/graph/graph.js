/*
 * This file contains the code to setup everything for the graph visualisations, like the data and the svgs
*/

function loadGraph() {
  // Store the svg with id svg1
  let svg_force = d3.select("#svg_force")
      width = +svg_force.attr("width")
      height = +svg_force.attr("height")

  // Store the svg with id svg2
  let svg_radial = d3.select("#svg_radial")
      width = +svg_radial.attr("width")
      height = +svg_radial.attr("height")

  // The attributes array is composed as following: [link width, link opacity, node size, node color]
  // This array is the values it has first time it's loaded in
  let vis_attributes = [1.5, 0.5, 5, "#0080ff"];

  // Parse the csv file into a json object
  let filename = localStorage.getItem('selected_file');

  fetch('http://localhost:3000/csv/'+filename)
  .then(function(response) {
    return response.json();
  })
  .then(function(myJson) {
    file = JSON.parse(JSON.stringify(myJson));
	
	
    graph_data = csvJSON(file);
	
	//copy data for the radial graph
	data_copy= JSON.parse(JSON.stringify(graph_data));
	
    loadForceGraph(graph_data.nodes, graph_data.links, svg_force, vis_attributes);
    // get rid of this comment to load the radial graph aswell ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    loadRadialGraph(data_copy.nodes, data_copy.links, svg_radial, vis_attributes);
  });

}

function csvJSON(csv) {

  var vertices = csv[0]
  var nodes = []
  var links = []

  for (i = 1; i < vertices.length; i++) {
    nodes.push({"id": vertices[i]})
  }

  for (i = 1; i < csv.length; i++) {
    var weights = csv[i]
    var target = weights[0]
    for (j = 1; j < weights.length; j++) {
      if (weights[j] > 0) {
        links.push({"source": vertices[j], "target": target, "value": weights[j]});
      }
    }
  }

  graph_data = {"nodes": nodes, "links": links};
  
  return graph_data;

}
