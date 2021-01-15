const page_url = location.href;
const url_match = page_url.match("enrolledagent.org");
const base_Url = url_match ? "https://enrolledagent.org" : "http://localhost:3000";
const licenseForm = document.getElementById("license-form");
const email = document.getElementById("email");
const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const city = document.getElementById("city");
const zipCode = document.getElementById("zipCode");
const state = document.getElementById("state");
const contactMethod = document.getElementById("preferred-contact");
const phone = document.getElementById("phone");
const optionalMessage = document.getElementById("optionalMessage");
const agentFirstName = document.getElementById("agent-firstName");
const agentLastName = document.getElementById("agent-lastName");
const agentCity = document.getElementById("agent-city");
const agentZipCode = document.getElementById("agent-zipCode");
const agentLicense = document.getElementById("agent-license");
const agentPhone = document.getElementById("agent-phone");
const agentState = document.getElementById("agent-state");
const agentEmail = document.getElementById("agent-email");
const btn = document.getElementById("submit-btn");
const btnContent = btn.innerHTML;

const notyf = new Notyf({
  dismissible: true,
  ripple: true,
  duration: 3000,
  position: {
    x: "right",
    y: "top",
  },
  types: [
    {
      className: "alert-message",
      type: "success",
    },
    {
      className: "alert-message",
      type: "error",
    },
  ],
});

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

function spinner() {
  const markup = `<div class="lds-ring"><div></div><div></div><div></div><div></div></div>`;
  
  return markup;
}

function clearFormData() {
  licenseForm.reset();
}

const handleSubmit = (e) => {
  e.preventDefault();
  const data = {
    message: optionalMessage.value,
    email: email.value,
    firstName: firstName.value,
    lastName:  lastName.value,
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
    preferredContact: contactMethod.value
  };

  // console.log(data);
  // document.getElementById("paymentModal").showModal();
  btn.setAttribute("disabled", "true");
  btn.innerHTML = spinner();
  $("#paymentModal").modal()
  // return
  axios({
    method: "POST",
    url: `${base_Url}/api/licence`,
    credentials: 'same-origin', // <-- includes cookies in the request
        headers: {
          "CSRF-Token":  getCookie('XSRF-TOKEN'), 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
    data: JSON.stringify(data),

  })
    .then((res) => {
      console.log(res);
      // notyf.success(res.data.message || "Message sent!");
      btn.innerHTML = btnContent;
      clearFormData();
      btn.removeAttribute("disabled");
      return setupStripeElements(res.data);
    })
    .then(function({ stripe, card, clientSecret }) {
      $("#paymentModal").modal()
      // document.querySelector("button").disabled = false;
      // paymentModal
      // Handle form submission.
      const form = document.getElementById("payment-form");
      const postalCodeSpan = form.querySelector(".CardField-postalCode span");
      postalCodeSpan.classList.add("InputContainer");
      postalCodeSpan.innerHTML = "Postal Code";

      form.addEventListener("submit", function(event) {
        event.preventDefault();
        // Initiate payment when the submit button is clicked
        pay(stripe, card, clientSecret);
      });
      // notyf.success(res.data.message || "Message sent!");
    })
    .catch((err) => {
      console.log(err.response);
      btn.innerHTML = btnContent;
      btn.removeAttribute("disabled");
      notyf.error(err.response.data.error.message || "Something went wrong");
    });
};


// Set up Stripe.js and Elements to use in checkout form
var setupStripeElements = function(data) {
  stripe = Stripe(data.publishableKey);
  var elements = stripe.elements();
  var style = {
    base: {
      color: "#01125a",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4"
      }
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a"
    }
  };

  var card = elements.create("card", { style: style });
  card.mount("#card-element");

  return {
    stripe: stripe,
    card: card,
    clientSecret: data.clientSecret
  };
};


/*
 * Calls stripe.confirmCardPayment which creates a pop-up modal to
 * prompt the user to enter extra authentication details without leaving your page
 */
var pay = function(stripe, card, clientSecret) {
  // changeLoadingState(true);

  // Initiate the payment.
  // If authentication is required, confirmCardPayment will automatically display a modal
  stripe
    .confirmCardPayment(clientSecret, {
      payment_method: {
        card: card
      }
    })
    .then(function(result) {
      if (result.error) {
        // console.log(result.error)
        notyf.error( result.error.message || 'Payment failed,');
        // Show error to your customer
        // showError(result.error.message);
      } else {
        // The payment has been processed!
        orderComplete(clientSecret);
      }
    });
};

/* Shows a success / error message when the payment is complete */
var orderComplete = function(clientSecret) {
  $("#paymentModal").modal('hide')
  // Just for the purpose of the sample, show the PaymentIntent response object
  stripe.retrievePaymentIntent(clientSecret).then(function(result) {
    var paymentIntent = result.paymentIntent;
    var paymentIntentJson = JSON.stringify(paymentIntent, null, 2);
    if(paymentIntentJson.status = 'succeeded'){
      notyf.success('Payment Succesfull,');
      notyf.success('Your verification has been submitted, you will be contacted appropriately');
    } else notyf.error('Payment failed,');
  });
};


licenseForm.addEventListener("submit", handleSubmit);
