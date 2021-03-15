function validateNonEmpty(t) {
    return "" === document.getElementById(t).value.trim() ? ((document.getElementById(`${t}-validator`).innerHTML = `${t} is required`), !1) : ((document.getElementById(`${t}-validator`).innerHTML = ""), !0);
}
function validateEmail(t) {
    const e = document.getElementById(t).value;
    if (validateNonEmpty(t)) return validator.isEmail(e) ? ((document.getElementById(`${t}-validator`).innerHTML = ""), !0) : ((document.getElementById(`${t}-validator`).innerHTML = "Please enter a valid email"), !1);
}
function validatePassword(t) {
    const e = document.getElementById(t).value;
    if (validateNonEmpty(t)) return validator.matches(
        String(e),
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d@$!%~#*?&^])[A-Za-z\d@$!._\-%~*#?&^]{6,}$/
    ) ? ((document.getElementById(`${t}-validator`).innerHTML = ""), !0) : ((document.getElementById(`${t}-validator`).innerHTML = "Password must be at least 6 characters long, must contain a lowercase letter, an uppercase letter letter, and either a number or a special character"), !1);
}
function validateConfirmPassword(t) {
    const e = document.getElementById(t).value.trim(),
        n = document.getElementById("password").value.trim();
    return e !== n || "" === n ? ((document.getElementById(`${t}-validator`).innerHTML = "Passwords must match"), !1) : ((document.getElementById(`${t}-validator`).innerHTML = ""), !0);
}
function validateSignupForm() {
    return (validateNonEmpty("firstname") && validateNonEmpty("lastname") && validateNonEmpty("email") && validatePassword("password") && validateConfirmPassword("confirmPassword"))
}
function validateLoginForm() {
    return (validateEmail("email") && validateNonEmpty("password"));
}
function validateResetForm() {
    (validateNonEmpty("confirm-password") || validateNonEmpty("password") || validateConfirmPassword("confirmPassword")) && document.getElementById("reset-submit-btn").click();
}
