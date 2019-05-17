//// Select File Upload Function ////

// Select your INPUT_FILE and store it in a variable
const input = document.getElementById('input');

// Event handler executed when a file is selected
const onSelectFile = () =>{ upload(input.files[0]) };

// Event listener to execute onSelectFile when a file has been selected
input.addEventListener('change', onSelectFile, false);
