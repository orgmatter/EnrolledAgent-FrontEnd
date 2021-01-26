const page_url = location.href;
const url_match = page_url.match("enrolledagent.org");
const BASE_Url = url_match ? "https://enrolledagent.org" : "http://localhost:3000";
const btn = document.getElementById("upgrade-btn");
const btnContent = btn && btn.innerHTML;

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


const handleUpgrade = (e) => {
  e.preventDefault();
  btn.setAttribute("disabled", "true");
  btn.innerHTML = spinner();

  // return
  axios({
    method: "POST",
    url: `${BASE_Url}/api/upgrade-account`,
    credentials: 'same-origin', // <-- includes cookies in the request
        headers: {
          "CSRF-Token":  getCookie('XSRF-TOKEN'), 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },

  })
    .then((res) => {
      console.log(res.data);
      btn.innerHTML = btnContent;
      btn.removeAttribute("disabled");
      const amount = document.getElementById("order-amount");
      amount.textContent = res.data.amount || "";
      return setupStripeElements(res.data);
    })
    .then(function({ stripe, card, clientSecret }) {
      $("#paymentModal").modal()
      // document.querySelector("button").disabled = false;
      // paymentModal
      // Handle form submission.
      const form = document.getElementById("payment-form");

      form.addEventListener("submit", function(event) {
        event.preventDefault();
        // Initiate payment when the submit button is clicked
        pay(stripe, card, clientSecret);
      });
      // notyf.success(res.data.message || "Message sent!");
    })
    .catch((err) => {
       console.log(err);
      btn.innerHTML = btnContent;
      btn.removeAttribute("disabled");
      // notyf.error(err.response.data.error.message || "Something went wrong");
      notyf.error("Something went wrong");
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


if(btn){
  btn.addEventListener("click", handleUpgrade);
}
