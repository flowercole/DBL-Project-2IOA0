/*
 * This file contains the function that renders the ForceDirected node-link diagram
 * As input, it takes a set of nodes and links that represent the graph,
 * the svg object in which it should be rendered and an array containing the info about the attributes
 * (e.g. node radius, ndoe color, link width)
 * Attributes elements: [link width, link opacity, node size/radius, node color]
 */

function loadForceGraph(nodes, links, svg, attributes) {

    console.log(attributes);

    // Clear the svg
    svg.selectAll("*").remove();

    // Set the forces
    let forceManyBody = d3.forceManyBody()
    let forceCollision = d3.forceCollide(5)

    // initialize the simulation
    let forceSimulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function(d) { return d.id; }))
        .force("charge", forceManyBody)
        .force("center", d3.forceCenter(width/2, height/2))
        .force("collision", forceCollision);

    forceLink = svg.append("g")
        .attr("stroke", "#000")
        // Change 1.5 to element of attributes that represents link width
        .attr("stroke-width", attributes[0])
        // Change 0.5 to element of attributes that represents link opacity
        .attr("stroke-opacity", attributes[1])
        .selectAll("line")
        .data(links)
        .enter().append("line")
        // Set stroke width based on weight value
        .attr("stroke-width", function(d) { return Math.sqrt(d.value); })

    // Set the ndoe appearance
    forceNode = svg.append("g")
        .attr("stroke", '#fff')
        .attr("stroke-width", attributes[2]/3)
        .selectAll("circle")
        .data(nodes)
        .enter().append("circle")
        // Change 5 to element of attributes that represents node size/radius
        .attr("r", attributes[2])
        // Change "#0080ff" to element of attributes that represents node color
        //.attr("fill", attributes[3])
        .attr("fill", attributes[3])
        //.call(dragRadial(radialSimulation));

    // Show the node's id when hovering over it, could potentially add more detailed information
    forceNode.append("title").text(function(d) { return d.id; });

    forceSimulation
        .nodes(nodes)
        .on("tick", ticked)
        .force("link").links(links);

    function ticked() {

        // update node position
        forceNode
            .attr("cx", function(d) { return d.x })
            .attr("cy", function(d) { return d.y });

        // update link position
        forceLink
            .attr("x1", function(d) { return d.source.x})
            .attr("y1", function(d) { return d.source.y})
            .attr("x2", function(d) { return d.target.x})
            .attr("y2", function(d) { return d.target.y})
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
        .scaleExtent([0.01, 10])
        .on("zoom", zoomed);
    svg.call(zoom);

}
