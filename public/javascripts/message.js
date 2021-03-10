const messageForm = document.getElementById("message-form"),
    agentId = document.querySelector('meta[name="agentId"]').getAttribute("content"),
    messageEmail = document.getElementById("messageEmail"),
    fullName = document.getElementById("name"),
    subject = document.getElementById("subject"),
    phone = document.getElementById("phone"),
    directMessage = document.getElementById("directMessage"),
    messageBtn = document.getElementById("message-submit-btn"),
    messageBtnContent = messageBtn.innerHTML,
    notyfToast = new Notyf({
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
function messageSpinner() {
    return '<div class="lds-ring"><div></div><div></div><div></div><div></div></div>';
}
function clearMessageFormData() {
    messageForm.reset();
}
const handleSubmitMessage = (e) => {
    e.preventDefault();
    const t = { message: directMessage.value, email: messageEmail.value, name: fullName.value, phone: phone.value, subject: subject.value, agent: agentId };
    messageBtn.setAttribute("disabled", "true"),
        console.log(t),
        (messageBtn.innerHTML = messageSpinner()),
        axios({ method: "POST", url: `/api/contact-agent`, credentials: "same-origin", headers: { "CSRF-Token": getCookie("XSRF-TOKEN"), "Content-Type": "application/json", Accept: "application/json" }, data: JSON.stringify(t) })
            .then((e) => {
                console.log(e),
                    (messageBtn.innerHTML = messageBtnContent),
                    clearMessageFormData(),
                    messageBtn.removeAttribute("disabled"),
                    notyfToast.success(e.data.message || "Message sent!"),
                    setTimeout(() => {
                        window.location.reload();
                    }, 5e3);
            })
            .catch((e) => {
                console.log(e.response), (messageBtn.innerHTML = messageBtnContent), messageBtn.removeAttribute("disabled"), notyfToast.error(e.response.data.error.message || "Something went wrong");
            });
};
messageForm.addEventListener("submit", handleSubmitMessage);
