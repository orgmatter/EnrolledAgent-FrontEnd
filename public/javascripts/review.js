const page_url = location.href;
const url_match = page_url.match("enrolledagent.org");
const base_Url = url_match ? "https://enrolledagent.org" : "http://localhost:3000";
const reviewForm = document.getElementById("review-form");
const id = document.querySelector('meta[name="agentId"]').getAttribute("content");
const rate = document.getElementById("rate");
let ratingValue = 0;
const email = document.getElementById("email");
const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const city = document.getElementById("city");
const state = document.getElementById("state");
const message = document.getElementById("message");
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

rate.querySelectorAll('.star').forEach(item => {
  item.addEventListener('click', event => {
    ratingValue = item.value 
  })
})

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
  reviewForm.reset();
}

const handleSubmit = (e) => {
  e.preventDefault();
  const data = {
    message: message.value,
    email: email.value,
    firstName: firstName.value,
    lastName:  lastName.value,
    city: city.value,
    state: state.value,
    rating: ratingValue,
    agent: id,
  };

  const checked_rating = document.querySelector('input[name = "rate"]:checked');

if(checked_rating !== null){ 
  btn.setAttribute("disabled", "true");
  btn.innerHTML = spinner();

  axios({
    method: "POST",
    url: `${base_Url}/api/review`,
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
      btn.innerHTML = btnContent;
      clearFormData();
      btn.removeAttribute("disabled");
      notyf.success(res.data.message || "Message sent!");
      setTimeout(() => {
        window.location.reload();
     },2000)
    })
    .catch((err) => {
      console.log(err.response);
      btn.innerHTML = btnContent;
      btn.removeAttribute("disabled");
      notyf.error(err.response.data.error.message || "Something went wrong");
    });
  } else {
    notyf.error('Please select a rating'); 
  }
};

reviewForm.addEventListener("submit", handleSubmit);
