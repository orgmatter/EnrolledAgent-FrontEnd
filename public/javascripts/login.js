const loginForm = document.getElementById("login-form"),
    email = document.getElementById("email"),
    password = document.getElementById("password"),
    btn = document.getElementById("login-btn"),
    buttonParentNode = btn.parentNode,
    notyf = new Notyf({
        dismissible: !0,
        ripple: !0,
        duration: 3e3,
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
    loginForm.reset();
}
function removeLoader(e, t) {
    const n = document.querySelector(".lds-ring");
    e.removeChild(n), e.appendChild(t);
}
const handleSubmit = (e) => {
    e.preventDefault();
    if(!validateLoginForm()) return
    const t = { email: email.value, password: password.value };
    btn.setAttribute("disabled", "true"),
        (btn.innerHTML = spinner()),
        axios({ method: "POST", url: `/api/login`, credentials: "same-origin", headers: { "CSRF-Token": getCookie("XSRF-TOKEN"), "Content-Type": "application/json", Accept: "application/json" }, data: JSON.stringify(t) })
            .then((e) => {
                (btn.textContent = "Sign in"), clearFormData(), btn.removeAttribute("disabled"), (window.location.href = "/");
            })
            .catch((e) => {
                (btn.textContent = "Sign in"), btn.removeAttribute("disabled"), notyf.error(e.response.data.error.message || "Something went wrong");
            });
};
loginForm.addEventListener("submit", handleSubmit);
