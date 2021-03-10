const contactForm = document.getElementById("contact-form"),
    email = document.getElementById("email"),
    fullName = document.getElementById("fullName"),
    subject = document.getElementById("subject"),
    phone = document.getElementById("phone"),
    message = document.getElementById("message"),
    btn = document.getElementById("submit-btn"),
    btnContent = btn.innerHTML,
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
    contactForm.reset();
}
const handleSubmit = (e) => {
    e.preventDefault();
    const t = { email: email.value, name: fullName.value, subject: subject.value, message: message.value, phone: phone.value };
    console.log(t),
        btn.setAttribute("disabled", "true"),
        (btn.innerHTML = spinner()),
        axios({ method: "POST", url: `/api/contact`, credentials: "same-origin", headers: { "CSRF-Token": getCookie("XSRF-TOKEN"), "Content-Type": "application/json", Accept: "application/json" }, data: JSON.stringify(t) })
            .then((e) => {
                console.log(e), (btn.innerHTML = btnContent), clearFormData(), btn.removeAttribute("disabled"), notyf.success(e.data.message || "Message sent!");
            })
            .catch((e) => {
                console.log(e.response), (btn.innerHTML = btnContent), btn.removeAttribute("disabled"), notyf.error(e.response.data.error.message || "Something went wrong");
            });
};
contactForm.addEventListener("submit", handleSubmit);
