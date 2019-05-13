//// UPLOAD SCRIPT ////

// Select your INPUT_FILE and store it in a variable
const input = document.getElementById('input');

// This will upload the file after having read it
const upload = (file) => {
  var formData = new FormData();
  formData.append('file', file);

  console.log(file);
  console.log(formData);

  fetch('http://localhost:3000/upload', {   // Your POST endpoint
    method: 'POST',
    body: formData                          // This is your file object
  })
  .then(response => response.json())
  .catch(error => console.error('Error:', error))
  .then(response => console.log('Success:', JSON.stringify(response)))
};

// Event handler executed when a file is selected
const onSelectFile = () =>{ upload(input.files[0]) };

// Event listener to execute onSelectFile when a file has been selected
input.addEventListener('change', onSelectFile, false);
