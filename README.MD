# Funsualization

Funsualization is a data visualization tool made by Group 26 for the DBL HTI + Webtech (2IOA0) course, followed in Q4 of 2019 at the Eindhoven University of Technology.

## What is the purpose of our tool?

To visualize network data in the most time efficient and representative way possible. To get the most meaning out of your data we implement several kinds of visualizations. We have a heatmap with multiple reorderings which allow a better insight into your data. Furthermore we have extended our tool to have a Force Directed, Radial and Hierarchical representation of your graph - you can choose which suits your needs the best.

## Features:

We have implemented the following features. Please do note, some of the functionalities and features are very early versions, and are subject to change and may not work properly just yet.

* Node-link visualisation
* Heatmap visualisation
* Force Directed visualization of your Graph
* Radial  visualization of your Graph
* Hierarchical visualization of your Graph
* File uploading
* CSV parser
* Multiple interactions for both visualizations
* Multiple reorderings for heatmap visualization
* 3D view of Matrix visualization
* Saving and exporting the state of the visualisation



## Background

Our tool is built upon the following existing projects:

* [node.js](https://nodejs.org/en/download/) - The server framework
* [d3.js](https://d3js.org/) - The visualization library for the node-link diagrams
* [plotly](https://plot.ly/javascript/) - The visualization library for the matrix heatmaps

## Get Started

### Prerequisites

Download and install [node.js](https://nodejs.org/en/download/). No other external dependencies.

### Installation

Clone the repository.

Navigate to the downloaded folder.

Use the standard node.js command to start the server:
```
node index.js
```

The server will be reachable on:
```
localhost:3000
```

## Known issues

Displaying big datasets takes a long time in the node-link diagrams, that is why we had to set a limit to only show the 10.000 edges with the highest weights.

## Roadmap

In the last week, we will polish up the whole tool for a better user experience, connect interactions of node-link diagrams with the adjacency matrix. With some page updates some information is lost- needs to be a steady workflow.

## Usage

tbc...

## Authors and acknowledgment

Contributors: Adrian Cucos, Wouter Haneveer, Stijn Kuijper, Maxim Snoep,
Bart van der Steenhoven, Luca Tudor, and Konstantin Velkov.

And our tutor, who has guided us through this project: Delyana Stoyanova.

## License

We are not using a license.


## Project status

We are done with the project, the current state of the project, is the final state of the project, including all its bugs and forgotten features. Every student has put 140 hours of work into this project.
