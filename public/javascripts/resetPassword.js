const resetForm = document.getElementById("password-reset-form"),
    password = document.getElementById("password"),
    confirmPassword = document.getElementById("confirm-password"),
    btn = document.getElementById("reset-password-btn"),
    buttonParentNode = btn.parentNode;
function getCookie(e) {
    const t = `; ${document.cookie}`.split(`; ${e}=`);
    if (2 === t.length) return t.pop().split(";").shift();
}
function spinner() {
    return '<div class="lds-ring"><div></div><div></div><div></div><div></div></div>';
}
function clearFormData() {
    resetForm.reset();
}
function removeLoader(e, t) {
    const r = document.querySelector(".lds-ring");
    e.removeChild(r), e.appendChild(t);
}
const handleSubmit = (e) => {
    if ((e.preventDefault(), !(password && password.value && confirmPassword && confirmPassword.value))) return toast.error("Please enter a valid password");
    if (confirmPassword.value != password.value || password.value.length < 6) return toast.error("Password must not be less than 6 characters");
    const t = { password: password.value };
    btn.setAttribute("disabled", "true"),
        (btn.innerHTML = spinner()),
        axios({ method: "POST", url: `/api/reset-password`, credentials: "same-origin", headers: { "CSRF-Token": getCookie("XSRF-TOKEN"), "Content-Type": "application/json", Accept: "application/json" }, data: JSON.stringify(t) })
            .then((e) => {
                (btn.textContent = "Reset Password"), clearFormData(), btn.removeAttribute("disabled"), (window.location.href = "/login");
            })
            .catch((e) => {
                (btn.textContent = "Reset Password"), btn.removeAttribute("disabled"), toast.error(e.response.data.error.message || "Something went wrong");
            });
};
resetForm.addEventListener("submit", handleSubmit);
