//// Draw correct layout, and fill it with the correct visualizations ////

// Button and Canvas
let updateLayout_btn = document.getElementById('updateLayout')
let canvas = document.getElementById('canvas');

// Update Layout Button Listener
updateLayout_btn.addEventListener('click', function(){ submitLayout(localStorage.getItem('layout')) }, false);

// Update Layout Function
submitLayout = (num) => {
    loadLayout(num);
    for (i = 1; i <= num; i++) {
      loadVisualization(i);
    }
}

// load correct Layout (depending on the amount of visualizations)
loadLayout = (num) => {
  canvas.innerHTML = '';

  for (i = 1; i <= parseInt(num); i++) {
    var box = document.createElement('div');
    box.classList.add('special-component')
    box.classList.add('bordered')
    box.id = `box${i}`
    canvas.appendChild(box)
  }

  switch (num) {
    case '1':
      document.getElementById('box1').style = 'grid-area: a / a / d / d; ';
      break;
    case '2':
      document.getElementById('box1').style = 'grid-area: a / a / a / d';
      document.getElementById('box2').style = 'grid-area: c / c / c / d';
      break;
    case '3':
      document.getElementById('box1').style = 'grid-area: a / a / a / d';
      document.getElementById('box2').style = 'grid-area: c';
      document.getElementById('box3').style = 'grid-area: d';
      break;
    case '4':
      document.getElementById('box1').style = 'grid-area: a';
      document.getElementById('box2').style = 'grid-area: b';
      document.getElementById('box3').style = 'grid-area: c';
      document.getElementById('box4').style = 'grid-area: d';
      break;
  }

}

// Load Visualization (draws canvas and executes script)
loadVisualization = (i) => {
  var vis = localStorage.getItem(`vis-${i}`)
  var box = `box${i}`
  loadVisualizationCanvas(vis, box);
  setTimeout(function(){ loadVisualizationScript(vis, box)}, 200 )
}

// Load the correct Visualization Canvas
loadVisualizationCanvas = (vis, box) => {
  console.log(`Loading the CANVAS for the ${vis} visualization into element #${box}`)
  fetch(`/comp/${vis}.html`)
  .then(function(response) {
    response.text().then(function (body) {
      document.getElementById(box).innerHTML = body;
    });
    return response;
  });
}

// Load the correct Visualization Scripts
loadVisualizationScript = (vis, box) => {
  console.log(`Loading the SCRIPT for the ${vis} visualization into element #${box}`)
  switch(vis) {
    case 'matrix':
      loadMatrix(box);
      break;
    case 'force':
      loadGraph(box, vis);
      break;
    case 'radial':
      loadGraph(box, vis);
      break;
    case 'hierarchical':
      loadGraph(box, vis);
      break;
  }
}
