// console.log('about to check the shii')
// name, email, phoneNumber, message

console.log('is she a lawyer?')

function validateNonEmpty(inputId) {
  console.log('He don happen pen pen ren pen')
  const fieldContent = document.getElementById(inputId).value.trim;
  if (fieldContent === '') {
    document.getElementById(`${inputId}-validator`).innerHTML = 'Name is required';
    return false;
  } else {
    document.getElementById(`${inputId}-validator`).innerHTML = '';
    return true;
  }
}

function validateName() {
  var nameFieldContent = document.getElementById('name').value;
  if (nameFieldContent === '') {
    document.getElementById('nameValidator').innerHTML = 'Name is required';
    return false;
  } else {
    document.getElementById('nameValidator').innerHTML = '';
    return true;
  }
}

function validateEmail() {
  var emailFieldContent = document.getElementById('email').value;
  if (emailFieldContent === '') {
    document.getElementById('emailValidator').innerHTML = 'Email is required';
    return false;
  } else if (!validator.isEmail(emailFieldContent)) {
    document.getElementById('emailValidator').innerHTML =
      'Please enter a valid email';
    return false;
  } else {
    document.getElementById('emailValidator').innerHTML = '';
    return true;
  }
}

function validateMessage() {
  var messageFieldContent = document.getElementById('message').value;
  if (messageFieldContent === '') {
    document.getElementById('messageValidator').innerHTML =
      'Message is required';
    return false;
  } else {
    document.getElementById('messageValidator').innerHTML = '';
    return true;
  }
}

function validateAll() {
  if (validateName() && validateEmail() && validateMessage()) {
    document.getElementById('submit-button').click();
  }
}
