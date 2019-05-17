//// Global Upload Function ////

// This will upload the file after having read it
const upload = (file) => {
  var formData = new FormData();
  formData.append('file', file);

  document.getElementById('file').innerHTML=`Uploaded file: ${file.name}`;

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
