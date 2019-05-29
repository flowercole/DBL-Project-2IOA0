//// Global Upload Function ////

// Select your elements
const input = document.getElementById('input');
const input_placeholder = document.getElementById('input-placeholder');
const filename = document.getElementById('filename');
const submit = document.getElementById('submit');

// Event handler executed when file is changed
const onSelectFile = () => {
  console.log(input.files[0])
  input_placeholder.innerHTML = input.files[0].name;
}

// Event handler executed when submit is clicked
const onSubmitFile = () => {
  upload(input.files[0], filename.value);
}

// Event listener to execute onSumbitFile when a file has been changed
input.addEventListener('change', onSelectFile, false);

// Event listener to execute onSumbitFile when a file has been submitted
submit.addEventListener('click', onSubmitFile, false);

// This will upload the file after having read it
const upload = (file, name) => {
  var formData = new FormData();

  if (name != '') {
    formData.append('file', file, name);
  } else {
    formData.append('file', file);
  }


  console.log(formData.get('file'));

  fetch('/upload', {   // Your POST endpoint
    method: 'POST',
    body: formData                          // This is your file object
  })
  .then(response => response.json())
  .catch(error => console.error('Error:', error))
  .then(response => {
    console.log('Success:', JSON.stringify(response));
    if (response.type=='error') {
      document.getElementById('file').innerHTML = 'An error has occured.';
      document.getElementById('msg').innerHTML = response.message;
      document.getElementById('name').innerHTML = 'No file uploaded.';
    } else {
      document.getElementById('file').innerHTML = file.name;
      document.getElementById('msg').innerHTML = response.message;
      document.getElementById('name').innerHTML = response.file_name;
      localStorage.setItem('selected_file', response.file_name);
      updateDataSelector();
    }


  })
};
