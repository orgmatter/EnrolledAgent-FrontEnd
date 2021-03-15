const passwordForm = document.getElementById("forgot-password"),
    email = document.getElementById("email"),
    passwordBtn = document.getElementById("submit-btn"),
    passwordBtnContent = passwordBtn.innerHTML,
    passwordToast = new Notyf({
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
    const s = `; ${document.cookie}`.split(`; ${e}=`);
    if (2 === s.length) return s.pop().split(";").shift();
}
function spinner() {
    return '<div class="lds-ring"><div></div><div></div><div></div><div></div></div>';
}
function clearPasswordFormData() {
    passwordForm.reset();
}
const handlePasswordSubmit = (e) => {
    e.preventDefault();
    const s = { email: email.value };
    console.log(s),
        (passwordBtn.innerHTML = spinner()),
        axios({ method: "POST", url: `/api/send-reset`, credentials: "same-origin", headers: { "CSRF-Token": getCookie("XSRF-TOKEN"), "Content-Type": "application/json", Accept: "application/json" }, data: JSON.stringify(s) })
            .then((e) => {
                console.log(e), (passwordBtn.innerHTML = passwordBtnContent), clearPasswordFormData(), passwordToast.success(e.data.data.message || "Email Sent!");
            })
            .catch((e) => {
                console.log(e.response), (passwordBtn.innerHTML = passwordBtnContent), passwordToast.error(e.response.data.error.message || "Something went wrong");
            });
};
passwordForm.addEventListener("submit", handlePasswordSubmit);
