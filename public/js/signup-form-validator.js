function validateNonEmpty(inputId) {
  const fieldContent = document.getElementById(inputId).value.trim();
  if (fieldContent === "") {
    document.getElementById(
      `${inputId}-validator`
    ).innerHTML = `${inputId} is required`;
    return false;
  } else {
    document.getElementById(`${inputId}-validator`).innerHTML = "";
    return true;
  }
}

function validateEmail(emailInputId) {
  const emailFieldContent = document.getElementById(emailInputId).value;
  if (validateNonEmpty(emailInputId)) {
    if (!validator.isEmail(emailFieldContent)) {
      document.getElementById(`${emailInputId}-validator`).innerHTML =
        "Please enter a valid email";
      return false;
    } else {
      document.getElementById(`${emailInputId}-validator`).innerHTML = "";
      return true;
    }
  }
}

function validateConfirmPassword(inputId) {
  const fieldContent = document.getElementById(inputId).value.trim();
  const passwordFieldContent = document.getElementById("password").value.trim();
  if (fieldContent !== passwordFieldContent || passwordFieldContent === '') {
    document.getElementById(`${inputId}-validator`).innerHTML =
      "Passwords must match";
    return false;
  } else {
    document.getElementById(`${inputId}-validator`).innerHTML = "";
    return true;
  }
}

function validateSignupForm() {
  if (
    !(
      !validateNonEmpty("firstname") &&
      !validateNonEmpty("lastname") &&
      !validateEmail("email") &&
      !validateNonEmpty("password") &&
      !validateConfirmPassword("confirmPassword")
    )
  ) {
    document.getElementById("signup-submit-btn").click();
  }
}

function validateLoginForm(){
  if(!(
    !validateEmail("email") &&
    !validateNonEmpty('password')
  )){
    document.getElementById("login-submit-btn").click();
  }
}

function validateResetForm(){
  if(!(
    !validateNonEmpty("confirm-password") &&
    !validateNonEmpty('password') &&
    !validateConfirmPassword("confirm-password")
  )){
    document.getElementById("reset-submit-btn").click();
  }
}
