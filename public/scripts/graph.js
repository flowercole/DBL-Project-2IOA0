	  // Initialize variables


	var manyBody = d3.forceManyBody()
	var collision = d3.forceCollide(5)

		  // Initialize simulation
	 var simulation = d3.forceSimulation()
		.force("link", d3.forceLink().id(function(d) { return d.id; }))
		.force("charge", manyBody)
		.force("collision", collision)


	var color = d3.scaleOrdinal(d3.schemeCategory20);

function loadForceGraph() {


  var filename = localStorage.getItem('selected_file');

  fetch('http://localhost:3000/csv/'+filename)
  .then(function(response) {
    return response.json();
  })
  .then(function(myJson) {
    file = JSON.parse(JSON.stringify(myJson));
    // Run Visualise with file
    graph_data = csvJSON(file);
	startSimulation(graph_data)
  });

  // Convert csv to json format object
  function csvJSON(csv) {

    // Initialize
    var vertices = csv[0]
    var nodes = []
    var edges = []

    // Fill nodes array with vertices
    for (var i = 1; i < vertices.length; i++) {
      nodes.push({"id" : vertices[i] })
    }

    // Fill edges array based on CSV file
    for (var i = 1; i < csv.length; i++) {
        var weights = csv[i]
        var target = weights[0]
        for (var j = 1; j < weights.length; j++) {
          if (weights[j] > 0) {
            edges.push({"source" : vertices[j], "target" : target, "value" : weights[j] })
          }

      }
    }
	// Put the data in an Object
    graph_data = {"nodes" : nodes, "links" : edges, "selected_nodes": [], "selected_links": []};

    // Save original data
    og_data = JSON.parse(JSON.stringify(graph_data));

    //create the visualization based on the graph
	return graph_data
  }

	function startSimulation(graph) {
//Show a large graph (static)
  	console.log("showing static graph")

	var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

	svg.selectAll("*").remove()

	//load data in arrays
	vertices = graph.nodes
	edges = graph.links

	simulation = d3.forceSimulation()
    .force("link", d3.forceLink()
	.id(function(d) { return d.id; })
	.iterations(0.01))
    .force("charge", manyBody)
    .force("center", d3.forceCenter(width / 2, height / 2))
	.force("collision", collision);

	minWeight = 0
	//determine settings based on amount of data
	if (edges.length > 80000) {
		//calculate weight of 100000th largest element to use as minimum weight IMPROVE TO NOT USE SORT
		var edgeWeights = []
		for (var ed in edges) {
			edgeWeights.push(edges[ed].value)
		}
		minWeight = edgeWeights.sort(function(a,b) {return b - a})[80000]
	}

	//set edge appearance group
	link = svg.append("g")
	  .attr("stroke", "#000")
	  .attr("stroke-width", 0.3)
	  .attr("stroke-opacity", 0.4)


	  //set node appearance group
	node = svg.append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 0.5)


	//add vertices and edges to force simulation
	simulation
		.nodes(vertices)
		.force("link").links(edges)


	//optimalization settings
	manyBody.theta(5)
	manyBody.distanceMax(2000)
	collision.iterations(0.01)
	simulation.velocityDecay(0.8)
	simulation.alphaDecay(0.01)

	console.log("Start simulation")
	//do 150 steps of the simulation
	for (var i = 0; i <= 150; i++) {
		simulation.tick()
	}
	console.log("Simulation done")
	simulation.stop()

	//and then display the state of the simulation
	drawGraph(minWeight)
	}
//draw the Graph based on the current state of the simulation
  function drawGraph(minWeight) {
	  //counter holds how many edges are drawn
		var counter = 0;

		console.log("Showing edges higher then: " + minWeight);

		//for each edge, draw only if its weight is high enough
		for (var ed in edges) {
			ed = edges[ed]
			if (ed.value >= minWeight) {
			counter ++
			link.append("line")
				.attr("x1", ed.source.x )
				.attr("y1", ed.source.y )
				.attr("x2", ed.target.x )
				.attr("y2", ed.target.y )
				.attr("stroke-opacity", Math.sqrt(ed.value) / 5)
				.attr("stroke-width", Math.sqrt(ed.value) / 5) ;
			}
		}

		//draw each node
		for (var no in vertices) {
		nod = vertices[no]
		node.append("circle")
			.attr("cx", nod.x)
			.attr("cy", nod.y)
			.attr("r", 2)
			.attr("fill", "#0080ff")
			.on("click", function(d) {console.log(d)})
		}
		console.log("Showing " + counter + " edges")
		console.log("done")
		//remove loading message
		d3.selectAll("text").remove()
  }

}

    // Update Selected Edges
    function updateSelectedEdges() {
      for(i = 0; i < graph_data.links.length; i++) {
        sel_edge = graph_data.links[i];

        // If both source and target of edge are selected and edge is not in selected array, add it
        if (graph_data.selected_nodes.includes(sel_edge.source) && graph_data.selected_nodes.includes(sel_edge.target) && !graph_data.selected_links.includes(sel_edge)) {
          graph_data.selected_links.push(sel_edge);
        }
        // If either the source or target (or both) is not selected and the edge is, remove it from the selected array
        if ((!graph_data.selected_nodes.includes(sel_edge.source) || !graph_data.selected_nodes.includes(sel_edge.target)) && graph_data.selected_links.includes(sel_edge)) {
          graph_data.selected_links.splice(graph_data.selected_links.indexOf(sel_edge), 1);
        }

      }
    }

    // Update for settings
    // Set force settings based on selected options
    function setSettings() {
      //change manyBody settings
      manyBody
        //sets strength (pull or push charge)
  		  .strength(document.getElementById("strength").value)
        //minimum distance between nodes
  		  .distanceMin(document.getElementById("minDis").value)
        //max distance between nodes
  		  .distanceMax(document.getElementById("maxDis").value);

      //change collision settings
  	  collision
        //set radius of collision
  		  .radius(document.getElementById("nodeRadius").value)

  	  //reset simulation for changes to go in effect
  	  simulation.alpha(0.8).restart()
    }

    // Set display settings based on selected options
    function setDisplay() {
      //change circle appearance
      colors = document.getElementById("colSelect").value
      inverseColors = document.getElementById("selColSelect").value
  	  d3.selectAll("circle")
        //sets the color of circle
        .attr("fill", function(d) {
          if (!graph_data.selected_nodes.includes(d)) {
            return colors
          } else {
            return inverseColors
          }
        })
        //sets the radius of circle
  		  .attr("r", document.getElementById("nodeRadius").value)
    }

    // Zoom and pan
    zoomed = () => {
      const {x,y,k} = d3.event.transform
      let t = d3.zoomIdentity
      t =  t.translate(x,y).scale(k).translate(50,50)
      var g = d3.selectAll("g")
      g.attr("transform", t)
    }

    var zoom = d3.zoom()
      .scaleExtent([0.50, 10])
      .on("zoom", zoomed);

    var svg = d3.select("svg")
      .call(zoom)

    function hideSelected() {
      //if a node is selected it deselects it and if it is not selected it selects it
      for (j = 0; j < graph_data.nodes.length;j++) {
        if (!graph_data.selected_nodes.includes(graph_data.nodes[j])) {
          graph_data.selected_nodes.push(graph_data.nodes[j]);
        } else {
          graph_data.selected_nodes.splice(graph_data.selected_nodes.indexOf(graph_data.nodes[j]), 1);
        };
        updateSelectedEdges();
      };
      //then run show selected
      renderSelected();
    }
