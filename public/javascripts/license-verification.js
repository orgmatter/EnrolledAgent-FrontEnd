const licenseForm = document.getElementById("license-form"),
    email = document.getElementById("email"),
    firstName = document.getElementById("firstName"),
    lastName = document.getElementById("lastName"),
    city = document.getElementById("city"),
    zipCode = document.getElementById("zipCode"),
    state = document.getElementById("state"),
    contactMethod = document.getElementById("preferred-contact"),
    phone = document.getElementById("phone"),
    optionalMessage = document.getElementById("optionalMessage"),
    agentFirstName = document.getElementById("agent-firstName"),
    agentLastName = document.getElementById("agent-lastName"),
    agentCity = document.getElementById("agent-city"),
    agentZipCode = document.getElementById("agent-zipCode"),
    agentLicense = document.getElementById("agent-license"),
    agentPhone = document.getElementById("agent-phone"),
    agentState = document.getElementById("agent-state"),
    agentEmail = document.getElementById("agent-email"),
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
    licenseForm.reset();
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
        agentFirstName: agentFirstName.value,
        agentLastName: agentLastName.value,
        agentCity: agentCity.value,
        agentZipcode: agentZipCode.value,
        agentPhone: agentPhone.value,
        agentstate: agentState.value,
        agentEmail: agentEmail.value,
        licence: agentLicense.value,
        preferredContact: contactMethod.value,
    };
    btn.setAttribute("disabled", "true"),
        (btn.innerHTML = spinner()),
        axios({ method: "POST", url: `/api/licence`, credentials: "same-origin", headers: { "CSRF-Token": getCookie("XSRF-TOKEN"), "Content-Type": "application/json", Accept: "application/json" }, data: JSON.stringify(t) })
            .then((e) => {
                return console.log(e.data), (btn.innerHTML = btnContent), clearFormData(), btn.removeAttribute("disabled"), (document.getElementById("order-amount").textContent = e.data.amount || ""), setupStripeElements(e.data);
            })
            .then(function ({ stripe: e, card: t, clientSecret: n }) {
                $("#paymentModal").modal(),
                    document.getElementById("payment-form").addEventListener("submit", function (a) {
                        a.preventDefault(), pay(e, t, n);
                    });
            })
            .catch((e) => {
                console.log(e), (btn.innerHTML = btnContent), btn.removeAttribute("disabled"), notyf.error(e.response.data.error.message || "Something went wrong");
            });
};
var setupStripeElements = function (e) {
        stripe = Stripe(e.publishableKey);
        var t = stripe
            .elements()
            .create("card", {
                style: {
                    base: { color: "#01125a", fontFamily: '"Helvetica Neue", Helvetica, sans-serif', fontSmoothing: "antialiased", fontSize: "16px", "::placeholder": { color: "#aab7c4" } },
                    invalid: { color: "#fa755a", iconColor: "#fa755a" },
                },
            });
        return t.mount("#card-element"), { stripe: stripe, card: t, clientSecret: e.clientSecret };
    },
    pay = function (e, t, n) {
        e.confirmCardPayment(n, { payment_method: { card: t } }).then(function (e) {
            e.error ? notyf.error(e.error.message || "Payment failed,") : orderComplete(n);
        });
    },
    orderComplete = function (e) {
        $("#paymentModal").modal("hide"),
            stripe.retrievePaymentIntent(e).then(function (e) {
                var t = e.paymentIntent;
                (JSON.stringify(t, null, 2).status = "succeeded") ? (notyf.success("Payment Succesfull,"), notyf.success("Your verification has been submitted, you will be contacted appropriately")) : notyf.error("Payment failed,");
            });
    };
licenseForm.addEventListener("submit", handleSubmit);
