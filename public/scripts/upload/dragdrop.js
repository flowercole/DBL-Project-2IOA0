//// Drag Drop File Upload Function ////

// Initialize Drag and Drop
//let dropArea = document.getElementById('drop-area')

;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  //dropArea.addEventListener(eventName, preventDefaults, false)
})

function preventDefaults (e) {
  e.preventDefault()
  e.stopPropagation()
}

// Drag Handler
;['dragenter', 'dragover'].forEach(eventName => {
  //dropArea.addEventListener(eventName, highlight, false)
})

;['dragleave', 'drop'].forEach(eventName => {
  //dropArea.addEventListener(eventName, unhighlight, false)
})

function highlight(e) { dropArea.classList.add('highlight') }
function unhighlight(e) { dropArea.classList.remove('highlight') }


// Drop Handler
//dropArea.addEventListener('drop', handleDrop, false)

function handleDrop(e) {
  let dt = e.dataTransfer
  let files = dt.files
  handleFile(files[0])
}

function handleFile(file) {
  upload(file, filename.value)
}
