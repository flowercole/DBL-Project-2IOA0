//// Read all files on server, put them in the dataset selector ////

// Data Selector
let select_file = document.querySelector('#select_file');

// Set Selector Function
setSelector = (item, selector) => {
  var val = localStorage.getItem(item);
  var sel = selector;
  console.log(val, sel)
  var opts = sel.options;
  for (var opt, j = 0; opt = opts[j]; j++) {
    if (opt.value == val) {
      sel.selectedIndex = j;
      break;
    }
  }
}

// On Dataset selection, save filename in LocalStorage
select_file.addEventListener('change', (event) => {
  console.log(`File ${event.target.value} has been chosen`);
  localStorage.setItem('selected_file', `${event.target.value}`)
});

let files = [];

updateDataSelector = () => {
  fetch('/datasets')
  .then((resp) => resp.json()) // Transform the data into json
  .then(function(res) {
    files = files.concat(res.data);
    // Remove duplicates
    files = [...new Set(files)];
    updateSelect(files);
  })
  .catch(function(err) {
    console.log(`Dataselector Update Error:`, err);
  });

  // Update data selector
  updateSelect = (data) => {
    select_file.innerHTML='';
    let files = data;
    files.forEach((file) => {
      let opt = document.createElement('option');
      opt.value = file;
      opt.dataset.local = false; //TODO make this true for localStorage files
      opt.innerHTML = file;
      select_file.appendChild(opt);
    })
    setSelector('selected_file', select_file);
  }
}

window.addEventListener('load', function () {
  updateDataSelector();
}, false);
