/*
 * This file contains the code to setup everything for the graph visualisations, like the data and the svgs
*/

let svg_force
let svg_radial
let attributes = [];
let filter_var = 1;
let showMax = 10000;
let showForce = false;
let showRadial = false;
let showHierarchical = false;
//let graph_data;

function graphPreload() {
  let filename = localStorage.getItem("selected_file");

  fetch('/csv/'+filename)
  .then(function(response) {
    //console.log(response);
    return response.json();
  })
  .then(function(myJson) {
    file = JSON.parse(JSON.stringify(myJson));

    graph_data = csvJSON(file);

    data_copy = JSON.parse(JSON.stringify(graph_data));
    //console.log(graph_data);
  })

  renderSelectedBtn = document.getElementById('renderSelected');
  renderResetBtn = document.getElementById('renderReset');
  updateViewBtn = document.getElementById('updateSettings');
  filterEdgesBtn = document.getElementById('updateSettings');

  renderSelectedBtn.addEventListener('click', renderSelected, false);
  renderResetBtn.addEventListener('click', renderReset, false);
  updateViewBtn.addEventListener('click', updateView, false);
  filterEdgesBtn.addEventListener('click', filterEdges, false);

  //console.log(graph_data);
}

function loadGraph(box, type) {

  console.log(box, type);

  switch(type) {
    case 'force':
      svg_force = d3.select(`#${box} #svg_force`);
      width = +svg_force.attr("width");
      height = +svg_force.attr("height");
	  showForce = true
      break;
    case 'radial':
      svg_radial = d3.select(`#${box} #svg_radial`)
      width = +svg_radial.attr("width")
      height = +svg_radial.attr("height")
	  showRadial = true
      break;
	case 'hierarchical':
      svg_hierarchical = d3.select(`#${box} #svg_hierarchical`)
      width = +svg_hierarchical.attr("width")
      height = +svg_hierarchical.attr("height")
	  showHierarchical = true
      break;
  }


  // Store the svg with id svg2

  svg_third = d3.select(`#${box} #svg_third`)

  // Get the attributes from the html and store them
  // The attributes array is composed as following: [link width, link opacity, node size, node color]
  // This array is the values it has first time it's loaded in
  //let attributes = [];
  attributes[0] = document.getElementById('linkWidth').value / 10;
  attributes[1] = document.getElementById('linkOpacity').value / 10;
  attributes[2] = document.getElementById('nodeSize').value / 10;
  attributes[3] = document.getElementById('nodeColor').value;
  attributes[4] = document.getElementById('selNodeColor').value;

  renderSelectedBtn = document.getElementById('renderSelected');
  renderResetBtn = document.getElementById('renderReset');
  updateViewBtn = document.getElementById('updateSettings');
  filterEdgesBtn = document.getElementById('updateSettings');

  renderSelectedBtn.addEventListener('click', renderSelected, false);
  renderResetBtn.addEventListener('click', renderReset, false);
  updateViewBtn.addEventListener('click', updateView, false);
  filterEdgesBtn.addEventListener('click', filterEdges, false);


  // Parse the csv file into a json object
  let filename = localStorage.getItem('selected_file');

  fetch('/csv/'+filename)
  .then(function(response) {
    return response.json();
  })
  .then(function(myJson) {
    file = JSON.parse(JSON.stringify(myJson));


    graph_data = csvJSON(file);

    data_copy = JSON.parse(JSON.stringify(graph_data));

  switch(type) {
    case 'force':
      console.log('SELECTED FORCE!', box, type)
	  force_data = JSON.parse(JSON.stringify(graph_data));
      loadForceGraph(force_data.nodes, force_data.links, svg_force, attributes);
      break;
    case 'radial':
      console.log('SELECTED RADIAL!', box, type)
	  radial_data = JSON.parse(JSON.stringify(graph_data));
      loadRadialGraph(radial_data.nodes, radial_data.links, svg_radial, attributes);
      break;
    case 'hierarchical':
      console.log('SELECTED THIRD!', svg_third)
	  hierarchical_data = JSON.parse(JSON.stringify(graph_data));
      loadHierarchicalGraph(hierarchical_data.nodes, hierarchical_data.links, hierarchical_data.adjacency, svg_hierarchical, attributes);
      break;
  }

  getMaxValue(graph_data.links);
  });

}

function csvJSON(csv) {

  console.log("test");

  var vertices = csv[0]
  var nodes = []
  var links = []
  var adjacency = {}

  for (i = 1; i < vertices.length; i++) {
    nodes.push({"id": vertices[i], "selected": false, "index" : i})
  }

  for (i = 1; i < csv.length; i++) {
    var weights = csv[i]
    var target = weights[0]
	adjacency[target] = weights.slice(1, weights.length-1)
    for (j = 1; j < weights.length; j++) {
      if (weights[j] > 0) {
        if (vertices[j] != target)
          links.push({"source": target, "target": vertices[j], "value": weights[j]});
        }
      }
    }


  graph_data = {"nodes": nodes, "links": links, "selected_nodes": [], "selected_links": [], "adjacency" : adjacency};

  console.log(graph_data);

  return graph_data;

}
/*
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
}*/

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
  if (showForce) {
	  console.log("Showing Force")
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
  }

  // Radial data
  if (showRadial) {
	  console.log("Showing Radial")
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
  }

    // Radial data
  if (showHierarchical) {
	  console.log("Showing Hierarchical")
	  for (n = 0; n < hierarchical_data.nodes.length; n++) {
		if (new_node.id == hierarchical_data.nodes[n].data.id) {
		  hierarchical_node = hierarchical_data.nodes[n];
		}
	  }

	  if (!hierarchical_data.selected_nodes.includes(hierarchical_node)) {
		hierarchical_data.selected_nodes.push(hierarchical_node);
	  } else {
		hierarchical_data.selected_nodes.splice(hierarchical_data.selected_nodes.indexOf(hierarchical_node), 1);
	  }
  }

  //console.log(graph_data, force_data, radial_data);
	if (showForce) {
  svg_force.selectAll("circle")
    .attr("fill", function(d) {
      if (!force_data.selected_nodes.includes(d)) { return document.getElementById("nodeColor").value }
      else { return document.getElementById("selNodeColor").value }
    })
	}

	if (showRadial) {
  svg_radial.selectAll("circle")
    .attr("fill", function(d) {
      if (!radial_data.selected_nodes.includes(d)) { return document.getElementById("nodeColor").value }
      else { return document.getElementById("selNodeColor").value }
    })
	}

	if (showHierarchical) {
  svg_hierarchical.selectAll("circle")
    .attr("fill", function(d) {
      if (!hierarchical_data.selected_nodes.includes(d)) { return document.getElementById("nodeColor").value }
      else { return document.getElementById("selNodeColor").value }
    })
	}

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
	if (showForce) {
	  for (i = 0; i < force_data.links.length; i++) {
		l = force_data.links[i];

		if (force_data.selected_nodes.includes(l.source) && force_data.selected_nodes.includes(l.target) && !force_data.selected_links.includes(l)) {
		  force_data.selected_links.push(l);
		}
		if ((!force_data.selected_nodes.includes(l.source) || !force_data.selected_nodes.includes(l.target)) && force_data.selected_links.includes(l)) {
		  force_data.selected_links.splice(force_data.selected_links.indexOf(l), 1);
		}
		}
	}
  // Radial data
  if (showRadial) {
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
    // Hierarhical data
  if (showHierarchical) {
	  for (i = 0; i < hierarchical_data.links.length; i++) {
		l = hierarchical_data.links[i];

		if (hierarchical_data.selected_nodes.includes(l.source) && hierarchical_data.selected_nodes.includes(l.target) && !hierarchical_data.selected_links.includes(l)) {
		  hierarchical_data.selected_links.push(l);
		}
		if ((!hierarchical_data.selected_nodes.includes(l.source) || !hierarchical_data.selected_nodes.includes(l.target)) && hierarchical_data.selected_links.includes(l)) {
		  hierarchical_data.selected_links.splice(hierarchical_data.selected_links.indexOf(l), 1);
		}
	  }
  }


}

function renderSelected() {

  console.log("test");
	//for(i)
 var smth = graph_data.selected_nodes.length;
 console.log(smth);
 
  if(smth>0) {
    console.log(" SelectOnMatrix(graph_data.selected_nodes);")
    if (showMatrix) {
      SelectOnMatrix(graph_data.selected_nodes);
    }

    graph_data.nodes = graph_data.selected_nodes;
    graph_data.links = graph_data.selected_links;


    graph_data.selected_nodes = [];
    graph_data.selected_links = [];

    updateAttributes();

    //MatrixEdges();

    if (showForce) {
            force_data = JSON.parse(JSON.stringify(graph_data));
            loadForceGraph(force_data.nodes, force_data.links, svg_force, attributes);
    }
    if (showRadial) {
            radial_data = JSON.parse(JSON.stringify(graph_data));
            loadRadialGraph(radial_data.nodes, radial_data.links, svg_radial, attributes);
    }
    if (showHierarchical) {
            hierarchical_data = JSON.parse(JSON.stringify(graph_data));
            loadHierarchicalGraph(hierarchical_data.nodes, hierarchical_data.links, hierarchical_data.adjacency, svg_hierarchical, attributes);
    }

    getMaxValue(graph_data.links);

    } else {
            console.log("MatrixEdges();")
            //showMatrix = true;
            MatrixEdges();
    }
}

function selectFromMatrix(name) {
  for(i = 0; i < graph_data.nodes.length; i++) {
    if (graph_data.nodes[i].id == name) {
      console.log(graph_data.nodes[i]);
      // if it is, perform the actions to select that node
      nodeClick(graph_data.nodes[i]);
    }
  }
}

function selectFromMatrixArray(names) {

  //console.log(names);

  // loop over the names of the nodes that should be selected
  for (name = 0; name < names.length; name++) {
    name_string = names[name];

    // loop over all nodes and check if the name is equal to their id
    for(i = 0; i < graph_data.nodes.length; i++) {
      if (graph_data.nodes[i].id == name_string) {
        // if it is, perform the actions to select that node
        nodeClick(graph_data.nodes[i]);
      }
    }
  }

  renderSelected();

}

function renderReset() {
console.log("in reset");

  if (showMatrix) {
    ResetMatrix();
  }

  graph_data = JSON.parse(JSON.stringify(data_copy));
    updateAttributes();

	if (showForce) {
		force_data = JSON.parse(JSON.stringify(graph_data));
		loadForceGraph(force_data.nodes, force_data.links, svg_force, attributes);
	}
	if (showRadial) {
		radial_data = JSON.parse(JSON.stringify(graph_data));
		loadRadialGraph(radial_data.nodes, radial_data.links, svg_radial, attributes);
	}
	if (showHierarchical) {
		hierarchical_data = JSON.parse(JSON.stringify(graph_data));
		loadHierarchicalGraph(hierarchical_data.nodes, hierarchical_data.links, hierarchical_data.adjacency,svg_hierarchical, attributes);
	}


  getMaxValue(graph_data.links);
}

function updateView() {

	if (showForce) {
		svg_force.selectAll("circle")
			.attr("r", attributes[2]) //sets the radius of circle
			.attr("stroke-width", 0.3 * attributes[2])
			.attr("fill", function(d) {
				if (!force_data.selected_nodes.includes(d)) { return attributes[3] }
				else { return attributes[4] }
		})

		svg_force.selectAll("line").data(force_data.links)
			.attr("stroke-width", function(d) {return attributes[0] * Math.sqrt(d.value) / 5})
			.attr("stroke-opacity", function(d) {return attributes[1] * Math.sqrt(d.value) / 5})
	}

	if (showRadial) {
		svg_radial.selectAll("circle")
			.attr("r", attributes[2]) //sets the radius of circle
			.attr("stroke-width", 0.3 * attributes[2])
			.attr("fill", function(d) {
				if (!radial_data.selected_nodes.includes(d)) { return attributes[3] }
				else { return attributes[4] }
		})

		svg_radial.selectAll("line").data(radial_data.links)
			.attr("stroke-width", function(d) {return attributes[0] * Math.sqrt(d.value) / 5})
			.attr("stroke-opacity", function(d) {return attributes[1] * Math.sqrt(d.value) / 5})
	}

	if (showHierarchical) {
		svg_hierarchical.selectAll("circle")
			.attr("r", attributes[2]) //sets the radius of circle
			.attr("stroke-width", 0.3 * attributes[2])
			.attr("fill", function(d) {
				if (!hierarchical_data.selected_nodes.includes(d)) { return attributes[3] }
				else { return attributes[4] }
		})

		svg_hierarchical.selectAll("line").data(hierarchical_data.links)
			.attr("stroke-opacity", function(d) {return attributes[1] * 2/Math.sqrt(d.source.children.length)})
			.attr("stroke-width", function(d) {return attributes[0] * 2/Math.sqrt(d.source.children.length)}) ;
	}
}

function filterEdges() {
    
  minWeight = document.getElementById("minWeight").value * filter_var;
  maxWeight = document.getElementById("maxWeight").value * filter_var;

  updateAttributes();
  //filterEdgesForce(minWeight, maxWeight);
  //console.log(minWeight, maxWeight);

	if (showForce) {
		svg_force.selectAll("line").remove();
		let counter = 0;
		for (i = 0; i < force_data.links.length && counter < showMax; i++) {
			l_f = force_data.links[i]
			if (l_f.value >= minWeight && l_f.value <= maxWeight) {
				counter++
				appendLineForce(l_f);
			}
	  }
	}

	if (showRadial) {
	  svg_radial.selectAll("line").remove();

		counter = 0;
		for (i = 0; i < radial_data.links.length && counter < showMax; i++) {
			l_r = radial_data.links[i]
			if (l_r.value >= minWeight && l_r.value <= maxWeight) {
				counter++
				appendLineRadial(l_r);
			}
		}
	}

	if (showHierarchical) {
	  svg_hierarchical.selectAll("line").remove();

		counter = 0;
		for (i = 0; i < hierarchical_data.links.length && counter < showMax; i++) {
			l_h = hierarchical_data.links[i]
		  	if (l_r.value >= minWeight && l_r.value <= maxWeight) {
				appendLineHierarchical(l_h);
			}
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

//filters the an array of edges to contain only a certain amount with the highest weights, return that array with those edges
function filterEdgesWeight(dataLinks, maxEdges) {
	if (dataLinks.length < maxEdges) {
		return dataLinks
	} else {
		filteredEdges = []
		edgeSort = dataLinks.sort(function(a,b) {return b.value - a.value} )
		for (let i = 0; i < maxEdges; i++) {
			filteredEdges.push(edgeSort[i])
		}
		return filteredEdges
	}
}
