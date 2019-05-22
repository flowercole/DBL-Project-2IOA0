/*
 * This file contains the function that renders the Radial node-link diagram
 * As input, it takes a set of nodes and links that represent the graph,
 * the svg object in which it should be rendered and an array containing the info about the attributes
 * (e.g. node radius, ndoe color, link width)
 * Attributes elements: [link width, link opacity, node size/radius, node color]
 */

function loadRadialGraph(nodes, links, svg, attributes) {

	//clear svg
	svg.selectAll("*").remove()
	
	//force simulation attributes
	var manyBody = d3.forceManyBody().strength(0)
	var collision = d3.forceCollide(5)
	var radialForce = d3.forceRadial(300)

//initialize simulation
	var radSimulation = d3.forceSimulation()
		.force("link", d3.forceLink()
			.id(function(d) { return d.id; })
			.strength(0))
		.force("charge", manyBody)
		.force("radial", radialForce)
		.force("collision", collision);
  
	vertices = nodes
	edgesRad = links 

	
	//standard radius
	radialForce
		.radius(vertices.length * 0.4 + 5 * 2 * vertices.length / (2 * Math.PI))
	
	//set minimum weight of edges to show if there are a lot of edges
	minWeight = 0
	/*if (edges.length > 50000) {
		//calculate weight of 50000th largest element to use as minimum weight IMPROVE TO NOT USE SORT
		var edgeWeights = []
		for (var ed in edges) {
			edgeWeights.push(edges[ed].value)
		}
		minWeight = edgeWeights.sort(function(a,b) {return b - a})[50000]
	}*/

	
	//set edge appearance
	radialLink = svg.append("g")
	  .attr("stroke", "#fff")
	  .attr("stroke-width", 0.5)
	  .attr("stroke-opacity", 0.5)

	  
	//add vertices and edges to force simulation
	radSimulation
		.nodes(vertices)
		.force("link").links(edgesRad)		

	console.log("Start simulation")
	//do 150 steps of the simulation
	for (var i = 0; i <= 150; i++) {
		radSimulation.tick()
	}
	console.log("Simulation done")
	radSimulation.stop()
	
	//and then display the state of the simulation
	drawGraph(minWeight)

//draw the Graph based on the current state of the simulation
  function drawGraph(minWeight) {
	  //counter holds how many edges are drawn
		var counter = 0;
		
		console.log("Showing edges higher then: " + minWeight);
		
		//for each edge, draw only if its weight is high enough
		for (var ed in edgesRad) {
			ed = edgesRad[ed]
			if (ed.value >= minWeight) {
			counter ++
			radialLink.append("line")
				.attr("x1", ed.source.x )
				.attr("y1", ed.source.y )
				.attr("x2", ed.target.x )
				.attr("y2", ed.target.y )
				.attr("stroke-opacity", attributes[1] * Math.sqrt(ed.value) / 5) 
				.attr("stroke-width", attributes[0] * Math.sqrt(ed.value) / 5) ;
			}
		}
		
		//draw each node
		node = svg.append("g")
		  .attr("stroke", "#3e3e3e")
		  .attr("stroke-width", 0.3 * attributes[2])
		.selectAll("circle")
		.data(vertices)
		.enter().append("circle")
		  .attr("r", attributes[2])
		  .attr("fill", function(d) {
				if (!radial_data.selected_nodes.includes(d)) { return attributes[3] }
				else { return attributes[4] }
			})
		  .attr("cx", function(d) {return d.x})
		  .attr("cy", function(d) {return d.y})
			.on("click", function(d) {nodeClick(d)})
			
		
		radSimulation.alpha(0.8).restart();
		radSimulation.stop();
		
		console.log("Showing " + counter + " edges")
		console.log("done")
	}
	
	
	// Zooming and panning function
    zoomed = () => {
        const {x,y,k} = d3.event.transform
        let t = d3.zoomIdentity
        t = t.translate(x,y).scale(k).translate(50,50)

        let g = svg.selectAll("g")
        g.attr("transform", t)
    }
    let zoom = d3.zoom()
        .scaleExtent([0.01, 25])
        .on("zoom", zoomed);
		svg.call(zoom);
		
			// Reset zoom and pan
		zoom.transform(svg, d3.zoomIdentity);

}

function appendLineRadial(l) {
	radialLink.append("line")
				.attr("x1", l.target.x)
				.attr("y1", l.target.y)
				.attr("x2", l.source.x)
				.attr("y2", l.source.y)
				.attr("stroke-opacity", attributes[1] * Math.sqrt(l.value) / 5) 
				.attr("stroke-width", attributes[0] * Math.sqrt(l.value) / 5) ;
}


