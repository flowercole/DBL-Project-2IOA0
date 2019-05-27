// Read all files on server, put them in the dataset selector
let files = [];

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
  let files = data;
  files.forEach((file) => {
    let opt = document.createElement('option');
    opt.value = file;
    opt.dataset.local = false; //TODO make this true for localStorage files
    opt.innerHTML = file;
    selectData.appendChild(opt);
  })
}
