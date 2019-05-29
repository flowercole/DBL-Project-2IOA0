// Read all files on server, put them in the dataset selector

// Data Selector
let select_data = document.querySelector('#select-data');

// On Dataset selection, save filename in LocalStorage
select_data.addEventListener('change', (event) => {
  console.log(`You chose ${event.target.value}`);
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
    console.log(err);
  });

  // Update data selector
  updateSelect = (data) => {
    select_data.innerHTML='';
    let files = data;
    files.forEach((file) => {
      let opt = document.createElement('option');
      opt.value = file;
      opt.dataset.local = false; //TODO make this true for localStorage files
      opt.innerHTML = file;
      select_data.appendChild(opt);
    })
    setSelectors('selected_file', select_data);
  }
}

window.addEventListener('load', function () {
  updateDataSelector();
}, false);
