//// Functions for Initializing and Resetting the Settings ////

// Array containing all settings and their attributes
  // id, type, p1, p2, selector type, default value
let allSettings = [
  ['selected_file', 'file', false, false, false, 'GephiMatrix_author_similarity.csv'],
  ['layout', 'int', 0, 4, false, 0],
  ['vis-1', 'str', false, false, 'visualization', ''],
  ['vis-2', 'str', false, false, 'visualization', ''],
  ['vis-3', 'str', false, false, 'visualization', ''],
  ['vis-4', 'str', false, false, 'visualization', ''],
  ['minWeight', 'int', 0, 100, 'slider', '0'],
  ['maxWeight', 'int', 0, 100, 'slider', '100'],
  ['linkWidth', 'int', 0, 250, 'slider', '10'],
  ['linkOpacity', 'int', 0, 100, 'slider', '100'],
  ['nodeSize', 'int', 5, 100, 'slider', '25'],
  ['nodeColor', 'hex', false, false, 'slider', '#D3DFFF'],
  ['selNodeColor', 'hex', false, false, 'slider', '#003DDE'],
  ['startColor', 'hex', false, false, 'slider', '#D3DFFF'],
  ['endColor', 'hex', false, false, 'slider', '#003DDE'],
  ['selectReordering', 'str', false, false, 'selector', 'original']
]

// Change Setting in the localStorage
changeSettings = (key, value) => {
  if (value != null) {
    localStorage.setItem(key, value);
  }
}

// Initialize localStorage variables
initializeLocalStorage = (key, value, forced) => {
  if(localStorage.getItem(key)===null || forced) {
    localStorage.setItem(key, value)
  }
}

// Set Setting from the localStorage
setSetting = (type, item) => {
  switch (type) {
    case 'visualization':
      if (localStorage.getItem(item) != '') {
        document.getElementById(`${localStorage.getItem(item)}-select`).checked = true;
      }
      break;
    case 'selector':
      var val = localStorage.getItem(item);
      var sel = document.querySelector(`#${item}`);
      console.log(val, sel)
      var opts = sel.options;
      for (var opt, j = 0; opt = opts[j]; j++) {
        if (opt.value == val) {
          sel.selectedIndex = j;
          break;
        }
      }
      break;
    case 'slider':
      document.getElementById(item).value = localStorage.getItem(item);
      break;
  }
}

// Event Listeners to listen for change
listenForChange = () => {
  for (i = 6; i < allSettings.length; i++) {
    document.getElementById(allSettings[i][0]).addEventListener('change', function() { changeSettings(this.id, this.value) } )
  }
}

// Event Listeners to listen for change
listenForChange2 = () => {
  for (i = 6; i < 11; i++) {
    document.getElementById(allSettings[i][0]).addEventListener('change', function() {
      document.getElementById(`${this.id}Value`).innerHTML = this.value;
    })
  }
}

// Event Listeners to listen for change
setInitial = () => {
  for (i = 6; i < 11; i++) {
    document.getElementById(`${allSettings[i][0]}Value`).innerHTML = localStorage.getItem(allSettings[i][0]);
  }
}

// Initialize Layout Settings
initializeLayoutSettings = () => {
  initializeLocalStorage('selected_file', 'GephiMatrix_author_similarity.csv', false)
  initializeLocalStorage('layout', 0, false)
  for (i = 2; i < 6; i++) {
    initializeLocalStorage(allSettings[i][0], allSettings[i][5], false);
    setSetting(allSettings[i][4], allSettings[i][0])
  }
}

// Reset Settings (can be forced to overwrite or not)
resetSettings = (forced) => {
  for (i = 6; i < allSettings.length; i++) {
    initializeLocalStorage(allSettings[i][0], allSettings[i][5], forced);
    setSetting(allSettings[i][4], allSettings[i][0])
  }
}

listenForChange();
listenForChange2();
setInitial();
initializeLayoutSettings();
resetSettings(false);

document.getElementById('reset-btn').addEventListener('click', function() { resetSettings(true) } )

// Updating the Layout configuration the right way
updateLayoutSettings = (last) => {
  if (!document.getElementById(`${last}-select`).checked) {
    layout = parseInt(localStorage.getItem('layout')) - 1;
    localStorage.setItem('layout', layout);
    if ( localStorage.getItem('vis-1') == last ) {
      localStorage.setItem('vis-1', localStorage.getItem('vis-2'))
      localStorage.setItem('vis-2', localStorage.getItem('vis-3'))
      localStorage.setItem('vis-3', localStorage.getItem('vis-4'))
      localStorage.setItem('vis-4', '')
    } else if ( localStorage.getItem('vis-2') == last ) {
      localStorage.setItem('vis-2', localStorage.getItem('vis-3'))
      localStorage.setItem('vis-3', localStorage.getItem('vis-4'))
      localStorage.setItem('vis-4', '')
    } else if ( localStorage.getItem('vis-3') == last ) {
      localStorage.setItem('vis-3', localStorage.getItem('vis-4'))
      localStorage.setItem('vis-4', '')
    } else if ( localStorage.getItem('vis-4') == last ) {
      localStorage.setItem('vis-4', '')
    }
    if ( layout == 3 ) {
      localStorage.setItem('vis-4', '');
    } else if ( layout == 2 ) {
      localStorage.setItem('vis-3', '');
    } else if ( layout == 1 ) {
      localStorage.setItem('vis-2', '');
    } else if ( layout == 0 ) {
      localStorage.setItem('vis-1', '');
    }
  } else {
    layout = parseInt(localStorage.getItem('layout')) + 1;
    localStorage.setItem('layout', layout);
    if ( layout == 4 ) {
      localStorage.setItem('vis-4', last);
    } else if ( layout == 3 ) {
      localStorage.setItem('vis-3', last);
    } else if ( layout == 2 ) {
      localStorage.setItem('vis-2', last);
    } else if ( layout == 1 ) {
      localStorage.setItem('vis-1', last);
    }
  }
}
