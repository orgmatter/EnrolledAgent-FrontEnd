const offshoreForm = document.getElementById("offshore-form"),
    email = document.getElementById("email"),
    firstName = document.getElementById("firstName"),
    lastName = document.getElementById("lastName"),
    city = document.getElementById("city"),
    zipCode = document.getElementById("zipCode"),
    staffNeeded = document.getElementById("staffNeeded"),
    businessSize = document.getElementById("businessSize"),
    state = document.getElementById("state"),
    contactMethod = document.getElementById("contactMethod"),
    timeline = document.getElementById("timeline"),
    phone = document.getElementById("phone"),
    optionalMessage = document.getElementById("optionalMessage"),
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
    offshoreForm.reset();
}
const handleSubmit = (e) => {
    e.preventDefault();
    const t = {
        message: optionalMessage.value,
        email: email.value,
        firstName: firstName.value,
        lastName: lastName.value,
        phone: phone.value,
        city: city.value,
        state: state.value,
        zipcode: zipCode.value,
        businessSize: businessSize.value,
        staffNeeded: staffNeeded.value,
        hireUrgency: timeline.value,
        preferredContact: contactMethod.value,
    };
    console.log(t),
        btn.setAttribute("disabled", "true"),
        (btn.innerHTML = spinner()),
        axios({ method: "POST", url: `/api/offshore`, credentials: "same-origin", headers: { "CSRF-Token": getCookie("XSRF-TOKEN"), "Content-Type": "application/json", Accept: "application/json" }, data: JSON.stringify(t) })
            .then((e) => {
                console.log(e), (btn.innerHTML = btnContent), clearFormData(), btn.removeAttribute("disabled"), notyf.success(e.data.message || "Message sent!");
            })
            .catch((e) => {
                console.log(e.response), (btn.innerHTML = btnContent), btn.removeAttribute("disabled"), notyf.error(e.response.data.error.message || "Something went wrong");
            });
};
offshoreForm.addEventListener("submit", handleSubmit);
