//// Global Upload Function ////

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
  .then(response => {
    console.log('Success:', JSON.stringify(response));
    if (response.type=='error') {
      document.getElementById('file').innerHTML = 'No file.';
      document.getElementById('msg').innerHTML = response.message;
    } else {
      document.getElementById('file').innerHTML = file.name;
      document.getElementById('msg').innerHTML = response.message;
    }


  })
};
