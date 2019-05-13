
//// DIRECTED FORCE GRAPH SCRIPT ////

// Function to initialize the directed force graph (Gets called from main file)
loadForceGraph = () => {

  // Initialize variables
  var svg = d3.select('svg');
  width = +svg.attr('width');
  height = +svg.attr('height');

  var color = d3.scaleOrdinal(d3.schemeCategory20);
  var manyBody = d3.forceManyBody()
  var collision = d3.forceCollide(5)

  // Get the selected colors
  var colors = document.getElementById("colSelect").value
  var inverseColors = document.getElementById("selColSelect").value


  // Initialize simulation
  var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.id; }))
    .force("charge", manyBody)
    .force("center", d3.forceCenter(width/2, height/2))
    .force("collision", collision);

  // global variables so they can be changed by html later
  let node;
  let link;
  let graph_data;
  let og_data;

  // Get filename from LocalStorage
  var filename = localStorage.getItem('selected_file');

  d3.csv("/csv/"+filename, function(data) {
      csvJSON(data)
  })

  // Convert csv to json format object
  function csvJSON(csv) {

    // Initialize
    var vertices = csv.columns[0].split(";")
    var nodes = []
    var edges = []

    // Fill nodes array with vertices
    for (var i = 1; i < 100; i++) {
      nodes.push({"id" : vertices[i] })
    }

    // Fill edges array based on CSV file
    for (var i = 0; i < 100; i++) {
      for (var key in csv[i]) {
        var weights = csv[i][key].split(";")
        var target = weights[0]
        for (var j = 1; j < 100; j++) {
          if (weights[j] > 0 && target != "Clement_T._Yu") {
            edges.push({"source" : vertices[j], "target" : target, "value" : weights[j] })
          }
        }
      }
    }

    // Put the data in an Object
    graph_data = {"nodes" : nodes, "links" : edges, "selected_nodes": [], "selected_links": []};

    // Save original data
    og_data = JSON.parse(JSON.stringify(graph_data));

    //console.log("nodes: " + parsedObj.nodes.length + " - links: " + parsedObj.links.length)
    console.log(nodes, edges);

    //create the visualization based on the graph
    renderDisplay(nodes, edges);
  }

  // Called on reset button
  function renderNormal() {
    // Reset graph_data to og_data
    // Again, doing this any other way will cause both og_data and graph_data to change when interacting
    graph_data = JSON.parse(JSON.stringify(og_data));
    // Render
    renderDisplay(graph_data.nodes, graph_data.links);
    // Restart the simulation to get the vertices and edges at the right positions
    simulation.alpha(0.8).restart();
  };

  // Called on Show selected button
  function renderSelected() {
    // Move selected vertices and edges to vertices and edges arrays
    graph_data.nodes = graph_data.selected_nodes;
    graph_data.links = graph_data.selected_links;
    // Empty selected vertices and edges arrays
    graph_data.selected_nodes = [];
    graph_data.selected_links = [];
    // Render
    renderDisplay(graph_data.nodes, graph_data.links);
    // Restart simulation
    simulation.alpha(0.8).restart();
  };

  // Main render function
  function renderDisplay(vertices, edges) {
    // Clear the canvas
    d3.selectAll("svg > *").remove();

    // Set vertices and edges
    vertices = vertices;
    edges = edges;

    // Set edge appearance
    edge = svg.append("g")
      .attr("stroke", "#000")
      .attr("stroke-width", 1.5)
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(edges)
      .enter().append("line")
      .attr("stroke-width", function(d) { return 0.1 * Math.sqrt(d.value);})
      .attr("stroke-opacity",function(d) { return 0.1 * Math.sqrt(d.value);})

    // Set vertex appearance
    node = svg.append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(vertices)
      .enter().append("circle")
      .attr("r", 5)
      .attr("fill", "colors")
      .call(drag(simulation));

    // Make sure the colors are loaded correctly
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

    // Set title to show when hovering
  	node.append("title")
      .text(function(d) { return d.id; })

    // Add vertices and edges to force simulation
    simulation
      .nodes(vertices)
      .on("tick", ticked)
      .force("link").links(edges)

    //function triggers at each tick of the simulation, sets position of nodes and links
    function ticked() {
      // Update node position
      node
        .attr("cx", function(d) { return d.x})
        .attr("cy", function(d) { return d.y});

      // Update edge position
      edge
        .attr("x1", function(d) { return d.source.x; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("y2", function(d) { return d.target.y; })
      }

    }

    drag = function(simulation) {
      function drag_start(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;

        //d.selected = !d.selected

        // Check if d is already selected

        if (!graph_data.selected_nodes.includes(d)) {
          // if it's not yet selected, add it to the selected vertices array
          graph_data.selected_nodes.push(d);
          // Loop over all edges to check if both their source and target are selected
          for(i = 0; i < graph_data.links.length; i++) {
            sel_edge = graph_data.links[i];
            // Check if both source and target are selected and edge is not yet selected
            if (graph_data.selected_nodes.includes(sel_edge.source) && graph_data.selected_nodes.includes(sel_edge.target) && !graph_data.selected_links.includes(sel_edge)) {
              graph_data.selected_links.push(sel_edge);
            }
          }

        } else {
          // if it is selected, get the index of d and remove that from the selected vertices array
          graph_data.selected_nodes.splice(graph_data.selected_nodes.indexOf(d), 1);
        };


        updateSelectedEdges();
        d3.selectAll("circle")
          //sets the color of circle
          .attr("fill", function(d) {
            if (!graph_data.selected_nodes.includes(d)) {
              return colors
            } else {
              return inverseColors
            }
          })
      }

      function drag_doing(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
      }

      function drag_end(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }

      return d3.drag()
        .on("start", drag_start)
        .on("drag", drag_doing)
        .on("end", drag_end);

    }

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
        .attr("fill", function(d) {if (!graph_data.selected_nodes.includes(d)) {return colors} else {return inverseColors} })
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
}
