const preferenceForm = document.getElementById("preference-form"),
    review = document.getElementById("for-review"),
    message = document.getElementById("for-message"),
    published = document.getElementById("for-published"),
    contact = document.getElementById("form-select"),
    preferenceBtn = document.getElementById("preferenceBtn"),
    preferenceBtnContent = preferenceBtn && preferenceBtn.innerHTML,
    notyfToast = new Notyf({
        dismissible: !0,
        ripple: !0,
        duration: 3e3,
        position: { x: "right", y: "bottom" },
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
    preferenceForm.reset();
}
const handlePreferenceSubmit = (e) => {
    e.preventDefault();
    const t = { articlePublished: published.checked, messageReceived: message.checked, newReview: review.checked, preferredContact: contact.value };
    console.log(t),
        console.log("here"),
        (preferenceBtn.innerHTML = spinner()),
        axios({
            method: "POST",
            url: `/api/contact-preference`,
            credentials: "same-origin",
            headers: { "CSRF-Token": getCookie("XSRF-TOKEN"), "Content-Type": "application/json", Accept: "application/json" },
            data: JSON.stringify(t),
        })
            .then((e) => {
                console.log(e),
                    (preferenceBtn.innerHTML = preferenceBtnContent),
                    clearFormData(),
                    notyfToast.success(e.data.data.message || "Preference Set!"),
                    setTimeout(() => {
                        window.location.reload();
                    }, 2e3);
            })
            .catch((e) => {
                console.log(e.response), (preferenceBtn.innerHTML = preferenceBtnContent), notyfToast.error(e.response.data.error.message || "Something went wrong");
            });
};
preferenceForm && preferenceForm.addEventListener("submit", handlePreferenceSubmit);
