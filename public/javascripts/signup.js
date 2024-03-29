const signUpForm = document.getElementById("signup-form"),
    fName = document.getElementById("firstname"),
    lName = document.getElementById("lastname"),
    email = document.getElementById("email"),
    password = document.getElementById("password"),
    terms = document.getElementById("terms"),
    btn = document.getElementById("signup-btn"),
    notyf = new Notyf({
        dismissible: !0,
        ripple: !0,
        duration: 1e4,
        position: { x: "right", y: "top" },
        types: [
            { className: "alert-message", type: "success" },
            { className: "alert-message", type: "error" },
        ],
    });
function getCookie(e) {
    const t = `; ${document.cookie}`.split(`; ${e}=`);
    if (2 === t.length) return t.pop().split(";").shift();
}
function spinner() {
    return '<div class="lds-ring"><div></div><div></div><div></div><div></div></div>';
}
function clearFormData() {
    signUpForm.reset();
}
const handleSubmit = (e) => {
    e.preventDefault();
    if(!validateSignupForm()) return
    if (terms.checked) {
        const e = { email: email.value, password: password.value, firstName: fName.value, lastName: lName.value };
        btn.setAttribute("disabled", "true"),
            (btn.innerHTML = spinner()),
            axios({ method: "POST", url: `/api/register`, credentials: "same-origin", headers: { "CSRF-Token": getCookie("XSRF-TOKEN"), "Content-Type": "application/json", Accept: "application/json" }, data: JSON.stringify(e) })
                .then((e) => {
                    (btn.textContent = "Sign up"), clearFormData(), btn.removeAttribute("disabled"), (window.location.href = "/login");
                })
                .catch((e) => {
                    (btn.textContent = "Sign up"), btn.removeAttribute("disabled"), notyf.error(e.response.data.error.message || "Something went wrong");
                });
    } else notyf.error("Please accept terms and conditions");
};
signUpForm.addEventListener("submit", handleSubmit);
