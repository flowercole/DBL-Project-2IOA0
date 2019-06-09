/*
 * This file contains the function that renders the hierarchical node-link diagram
 * As input, it takes a set of nodes and links that represent the graph and an dictionary containing each row of the csv (parsed),
 * the svg object in which it should be rendered and an array containing the info about the attributes
 * (e.g. node radius, ndoe color, link width)
 * Attributes elements: [link width, link opacity, node size/radius, node color]
 */

function loadHierarchicalGraph(nodes, links, adjacents, svg, attributes) {
	
	//clear svg
	svg.selectAll("*").remove()
	
	width = +svg.attr("width"),
    height = +svg.attr("height");
	
	//assign it to new variables for comfort
	vertices = nodes
	edgesHier = links
	adjacency = adjacents
	
	//get a starting node (TO BE IMPROVED: pick a node in a smarter way!!)
	startNode = vertices[0]
	
	//run bfs to get a tree
	bfs({"nodes" : vertices, "links" : links, "adjacency" : adjacency}, startNode)
	
	//transform it into data in shape of tree
	data = createTree(startNode)
	
	//create tree data shape with d3
	const root = d3.tree().nodeSize([10,200])(d3.hierarchy(data));
	
	//replace nodes and links with those of the tree in hierarchical_data
	hierarchical_data.nodes = root.descendants()
	hierarchical_data.links = root.links()
	
	//draw links
	hierarchicalLink = svg.append("g")
	  .attr("stroke", "#fff")
	  .attr("stroke-width", attributes[0])
	  .attr("stroke-opacity", attributes[1])

	for (link in hierarchical_data.links) {
	link = hierarchical_data.links[link]
	hierarchicalLink.append("line")
	  .attr("x1",link.source.x)
      .attr("y1", link.source.y)
      .attr("x2", link.target.x)
      .attr("y2", link.target.y)
	  .attr("stroke-opacity", attributes[1] * 2/Math.sqrt(link.source.children.length)) 
	  .attr("stroke-width", attributes[0] * 2/Math.sqrt(link.source.children.length)) ;
	}
	  
	//draw nodes
	node = svg.append("g")
		 .attr("stroke", "#3e3e3e")
		 .attr("stroke-width", 0.3 * attributes[2])
		.selectAll("circle")
		.data(hierarchical_data.nodes)
		.enter().append("circle")
		  .attr("r", attributes[2])
		  .attr("fill", function(d) {
				if (!hierarchical_data.selected_nodes.includes(d)) { return attributes[3] }
				else { return attributes[4] }
			})
		  .attr("cx", function(d) {return d.x})
		  .attr("cy", function(d) {return d.y})
		  .on("click", function(d) {nodeClick(d.data)})
		  
		  
	node.append("title")
		.text(function(d) { return d.data.id; })
	  
	
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

		zoom.transform(svg, d3.zoomIdentity);
}			

//runs bfs on the graph given a name of the starting node, assigns children and distance to each node
function bfs(graph, startNode) {
	let queue = []
	
	for (node in graph.nodes) {
		if (graph.nodes[node] == startNode) {
			startNode.color = 1
			startNode.dis = 0
			startNode.children = []
		} else {
			graph.nodes[node].color = 0
			graph.nodes[node].dis = -1
			graph.nodes[node].children = []
		}

	}
	
	queue.push(startNode)
	
	while (queue.length > 0) {
		curNode = queue[0]
		queue.shift()
		let adj = adjacent(graph, curNode)
		for (node in adj) {
			node = adj[node]
			if (node.color == 0) {
				node.color = 1;
				node.dis = curNode.dis + 1
				curNode.children.push(node)
				queue.push(node)
			}
			
		}
		curNode.color = 2
	}
}

//returns an array of all the nodes adjacent to nodeFrom
function adjacent(graph, nodeFrom) {
	let adjacent = []
	let nodeRef = {}

	for (node in graph.nodes) {
		nodeRef[graph.nodes[node].index] = graph.nodes[node]
	}
	for (link in graph.adjacency[nodeFrom.id]) {
			if (graph.adjacency[nodeFrom.id][link] > 0) {
				if (typeof(nodeRef[(parseInt(link)+1).toString()]) != "undefined") {
					adjacent.push(nodeRef[(parseInt(link)+1).toString()])
				}
			}
	}
	return adjacent
}


//converts the bfs result recursively to the right data format
function createTree(rootNode) {
	if (rootNode.children.length == 0) {
		return { "id" : rootNode.id} 
	} else {	
		let tree = {"id" : rootNode.id, "children" : []}
		for (child in rootNode.children) {
			child = rootNode.children[child]
			tree["children"].push(createTree(child))
		}
		return tree
	}
}

//draw a single line
function appendLineHierarchical(l) {
		
	hierarchicalLink.append("line")
	  .attr("x1", l.source.x )
      .attr("y1", l.source.y )
      .attr("x2", l.target.x )
      .attr("y2", l.target.y )
	  .attr("stroke-opacity", attributes[1] * 2/Math.sqrt(l.source.children.length)) 
	  .attr("stroke-width", attributes[0] * 2/Math.sqrt(l.source.children.length)) ; 
}

	  