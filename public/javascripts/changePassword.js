const passwordForm = document.getElementById("password-form"),
    password = document.getElementById("new-password"),
    oldPassword = document.getElementById("old-password"),
    passwordBtn = document.getElementById("password-submit-btn"),
    passwordBtnContent = passwordBtn.innerHTML,
    passwordToast = new Notyf({
        dismissible: !0,
        ripple: !0,
        duration: 3e3,
        position: { x: "right", y: "bottom" },
        types: [
            { className: "alert-message", type: "success" },
            { className: "alert-message", type: "error" },
        ],
    });
function getCookie(s) {
    const e = `; ${document.cookie}`.split(`; ${s}=`);
    if (2 === e.length) return e.pop().split(";").shift();
}
function spinner() {
    return '<div class="lds-ring"><div></div><div></div><div></div><div></div></div>';
}
function clearPasswordFormData() {
    passwordForm.reset();
}
const handlePasswordSubmit = (s) => {
    s.preventDefault();
    const e = { password: password.value, oldPassword: oldPassword.value };
    console.log(e),
        (passwordBtn.innerHTML = spinner()),
        axios({
            method: "POST",
            url: `/api/changepass`,
            credentials: "same-origin",
            headers: { "CSRF-Token": getCookie("XSRF-TOKEN"), "Content-Type": "application/json", Accept: "application/json" },
            data: JSON.stringify(e),
        })
            .then((s) => {
                console.log(s), (passwordBtn.innerHTML = passwordBtnContent), clearPasswordFormData(), passwordToast.success(s.data.data.message || "Preference Set!");
            })
            .catch((s) => {
                console.log(s.response), (passwordBtn.innerHTML = passwordBtnContent), passwordToast.error(s.response.data.error.message || "Something went wrong");
            });
};
passwordForm.addEventListener("submit", handlePasswordSubmit);
