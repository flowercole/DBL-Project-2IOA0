/*
 * This file contains the code to setup everything for the graph visualisations, like the data and the svgs
*/

let svg_force
let svg_radial
let attributes = [];
let filter_var = 1;

function loadGraph() {
  // Store the svg with id svg1
  svg_force = d3.select("#svg_force")
      width = +svg_force.attr("width")
      height = +svg_force.attr("height")

  // Store the svg with id svg2
  svg_radial = d3.select("#svg_radial")
      width = +svg_radial.attr("width")
      height = +svg_radial.attr("height")

  // Get the attributes from the html and store them
  // The attributes array is composed as following: [link width, link opacity, node size, node color]
  // This array is the values it has first time it's loaded in
  //let attributes = [];
  attributes[0] = document.getElementById('linkWidth').value / 10;
  attributes[1] = document.getElementById('linkOpacity').value / 10;
  attributes[2] = document.getElementById('nodeSize').value / 10;
  attributes[3] = document.getElementById('nodeColor').value;
  attributes[4] = document.getElementById('selNodeColor').value;

  // Parse the csv file into a json object
  let filename = localStorage.getItem('selected_file');

  fetch('http://localhost:3000/csv/'+filename)
  .then(function(response) {
    return response.json();
  })
  .then(function(myJson) {
    file = JSON.parse(JSON.stringify(myJson));
	
	
    graph_data = csvJSON(file);

    data_copy = JSON.parse(JSON.stringify(graph_data));

    force_data = JSON.parse(JSON.stringify(graph_data));
    radial_data = JSON.parse(JSON.stringify(graph_data));

    //console.log(graph_data)
	
	//copy data for the radial graph
  //data_copy= JSON.parse(JSON.stringify(graph_data));
  
  //og_data = JSON.parse(JSON.stringify(graph_data));
	
    loadForceGraph(force_data.nodes, force_data.links, svg_force, attributes);
    // get rid of this comment to load the radial graph aswell ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    loadRadialGraph(radial_data.nodes, radial_data.links, svg_radial, attributes);
    getMaxValue(graph_data.links);
  });

}

function csvJSON(csv) {

  var vertices = csv[0]
  var nodes = []
  var links = []

  for (i = 1; i < vertices.length; i++) {
    nodes.push({"id": vertices[i], "selected": false})
  }

  for (i = 1; i < csv.length; i++) {
    var weights = csv[i]
    var target = weights[0]
    for (j = 1; j < weights.length; j++) {
      if (weights[j] > 0) {
        if (vertices[j] != target) {
          links.push({"source": vertices[j], "target": target, "value": weights[j]});
        }
      }
    }
  }

  graph_data = {"nodes": nodes, "links": links, "selected_nodes": [], "selected_links": []};
  
  return graph_data;

}

//apply settings to change appearance
function setDisplayForce(svg) {
	svg_force.selectAll("circle")
    .attr("r", document.getElementById("nodeSize").value) //sets the radius of circle
    .attr("stroke-width", document.getElementById("nodeSize").value/3)
    .attr("fill", function(d) {
      if (!graph_data.selected_nodes.includes(d)) { return document.getElementById("nodeColor").value }
      else { return document.getElementById("selNodeColor").value }
    })

  svg_force.selectAll("circle").attr("fill", function(d) {
      if (!graph_data.selected_nodes.includes(d)) { return document.getElementById("nodeColor").value }
      else { return document.getElementById("selNodeColor").value }
    })
	svg_force.selectAll("line")
		.attr("stroke-width", document.getElementById("linkWidth").value)
		.attr("stroke-opacity", document.getElementById("linkOpacity").value/100)
}

function setDisplayRadial(svg) {
	svg_radial.selectAll("circle")
		//.attr("fill", document.getElementById("nodeColorRad").value) //sets the color of circle
    .attr("r", document.getElementById("nodeSizeRad").value) //sets the radius of circle
    .attr("stroke-width", document.getElementById("nodeSizeRad").value/3)
    .attr("fill", function(d) {
      if (!graph_data.selected_nodes.includes(d)) { return document.getElementById("nodeColorRad").value }
      else { return document.getElementById("selNodeColorRad").value }
    })
	svg_radial.selectAll("line")
		.attr("stroke-width", document.getElementById("linkWidthRad").value)
		.attr("stroke-opacity", document.getElementById("linkOpacityRad").value/100)
}

function nodeClick(node) {

  // Main data
  for (n = 0; n < graph_data.nodes.length; n++) {
    if (graph_data.nodes[n].id == node.id) {
      new_node = graph_data.nodes[n];
    }
  }
  
  if (!graph_data.selected_nodes.includes(new_node)) {
    graph_data.selected_nodes.push(new_node);
  } else {
    graph_data.selected_nodes.splice(graph_data.selected_nodes.indexOf(new_node), 1);
  }
  
  // Force data
  for (n = 0; n < force_data.nodes.length; n++) {
    if (new_node.id == force_data.nodes[n].id) {
      force_node = force_data.nodes[n];
    }
  }

  if (!force_data.selected_nodes.includes(force_node)) {
    force_data.selected_nodes.push(force_node);
  } else {
    force_data.selected_nodes.splice(force_data.selected_nodes.indexOf(force_node), 1);
  }

  // Radial data
  for (n = 0; n < radial_data.nodes.length; n++) {
    if (new_node.id == radial_data.nodes[n].id) {
      radial_node = radial_data.nodes[n];
    }
  }

  if (!radial_data.selected_nodes.includes(radial_node)) {
    radial_data.selected_nodes.push(radial_node);
  } else {
    radial_data.selected_nodes.splice(radial_data.selected_nodes.indexOf(radial_node), 1);
  }

  //console.log(graph_data, force_data, radial_data);

  svg_force.selectAll("circle")
    .attr("fill", function(d) {
      if (!force_data.selected_nodes.includes(d)) { return document.getElementById("nodeColor").value }
      else { return document.getElementById("selNodeColor").value }
    })
  
  svg_radial.selectAll("circle")
    .attr("fill", function(d) {
      if (!radial_data.selected_nodes.includes(d)) { return document.getElementById("nodeColor").value }
      else { return document.getElementById("selNodeColor").value }
    })

  updateSelectedEdges();
  //console.log(graph_data, force_data, radial_data);

}

function updateSelectedEdges() {
  
  /*target = force_data.links[0].target;
  if (force_data.nodes.includes(target)) {
    console.log(force_data);
  } else {
    console.error('err');
  }*/

  for (i = 0; i < graph_data.links.length; i++) {
    l = graph_data.links[i];
    source = false;
    target = false;

    for (n = 0; n < graph_data.selected_nodes.length; n++) {
      no = graph_data.selected_nodes[n];
      if (no.id == l.source) {
        source = true;
      }
      if (no.id == l.target) {
        target = true;
      }
    }

    if (source && target && !graph_data.selected_links.includes(l)) {
      graph_data.selected_links.push(l);
    }
    if ((!source || !target) && graph_data.selected_links.includes(l)) {
      graph_data.selected_links.splice(graph_data.selected_links.indexOf(l), 1);
    }
    
  }

  // Force data
  for (i = 0; i < force_data.links.length; i++) {
    l = force_data.links[i];
    
    if (force_data.selected_nodes.includes(l.source) && force_data.selected_nodes.includes(l.target) && !force_data.selected_links.includes(l)) {
      force_data.selected_links.push(l);
    }
    if ((!force_data.selected_nodes.includes(l.source) || !force_data.selected_nodes.includes(l.target)) && force_data.selected_links.includes(l)) {
      force_data.selected_links.splice(force_data.selected_links.indexOf(l), 1);
    }
  }

  // Radial data
  for (i = 0; i < radial_data.links.length; i++) {
    l = radial_data.links[i];
    
    if (radial_data.selected_nodes.includes(l.source) && radial_data.selected_nodes.includes(l.target) && !radial_data.selected_links.includes(l)) {
      radial_data.selected_links.push(l);
    }
    if ((!radial_data.selected_nodes.includes(l.source) || !radial_data.selected_nodes.includes(l.target)) && radial_data.selected_links.includes(l)) {
      radial_data.selected_links.splice(radial_data.selected_links.indexOf(l), 1);
    }
  }



}

function renderSelected() {

  graph_data.nodes = graph_data.selected_nodes;
  graph_data.links = graph_data.selected_links;
  //force_data.nodes = force_data.selected_nodes;

  graph_data.selected_nodes = [];
  graph_data.selected_links = [];
  //data_copy.selected_nodes = [];
  //data_copy.selected_links = [];
  force_data = JSON.parse(JSON.stringify(graph_data));
  radial_data = JSON.parse(JSON.stringify(graph_data));

  updateAttributes();

  loadForceGraph(force_data.nodes, force_data.links, svg_force, attributes);
  loadRadialGraph(radial_data.nodes, radial_data.links, svg_radial, attributes);
  getMaxValue(graph_data.links);

}

function renderReset() {
  graph_data = JSON.parse(JSON.stringify(data_copy));
  
  force_data = JSON.parse(JSON.stringify(graph_data));
  radial_data = JSON.parse(JSON.stringify(graph_data));

  updateAttributes();

  loadForceGraph(force_data.nodes, force_data.links, svg_force, attributes);
  loadRadialGraph(radial_data.nodes, radial_data.links, svg_radial, attributes);
  getMaxValue(graph_data.links);
}

function updateView() {
  updateAttributes();

  loadForceGraph(force_data.nodes, force_data.links, svg_force, attributes);
  loadRadialGraph(radial_data.nodes, radial_data.links, svg_radial, attributes);
}

function filterEdges() {
  minWeight = document.getElementById("minWeight").value * filter_var;
  maxWeight = document.getElementById("maxWeight").value * filter_var;

  updateAttributes();
  //filterEdgesForce(minWeight, maxWeight);
  //console.log(minWeight, maxWeight);

	svg_force.selectAll("line").remove();

	for (i = 0; i < force_data.links.length; i++) {
		l_f = force_data.links[i]
		if (l_f.value >= minWeight && l_f.value <= maxWeight) {
      //counter++
      appendLineForce(l_f);
		}
  }
  
  svg_radial.selectAll("line").remove();

  for (i = 0; i < radial_data.links.length; i++) {
    l_r = radial_data.links[i]
    if (l_r.value >= minWeight && l_r.value <= maxWeight) {
      //counter++
      appendLineRadial(l_r);
    }
  }

}

function updateAttributes() {
  attributes[0] = document.getElementById('linkWidth').value / 10;
  attributes[1] = document.getElementById('linkOpacity').value / 10;
  attributes[2] = document.getElementById('nodeSize').value / 10;
  attributes[3] = document.getElementById('nodeColor').value;
  attributes[4] = document.getElementById('selNodeColor').value;
}

function getMaxValue(links) {
  max = 0;
  for (i = 0; i < links.length; i++) {
    if (links[i].value > max) {
      max = links[i].value;
    }
  }
 
  filter_var = max / 100;

}