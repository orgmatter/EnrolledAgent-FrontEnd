const PAGE_url = location.href;
const URL_match = PAGE_url.match("enrolledagent.org");
const BASE_URL = URL_match ? "https://enrolledagent.org" : "http://localhost:3000";
const preferenceForm = document.getElementById("preference-form");
const review = document.getElementById("for-review");
const message = document.getElementById("for-message");
const published = document.getElementById("for-published");
const contact = document.getElementById("form-select");
const preferenceBtn = document.getElementById("preferenceBtn");
const preferenceBtnContent = preferenceBtn.innerHTML;

const notyfToast = new Notyf({
  dismissible: true,
  ripple: true,
  duration: 3000,
  position: {
    x: "right",
    y: "bottom",
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
  preferenceForm.reset();
}

const handlePreferenceSubmit = (e) => {
  e.preventDefault();
  const data = {
    articlePublished: published.checked,
    messageReceived: message.checked,
    newReview: review.checked,
    preferredContact: contact.value,
  };

  console.log(data);
  console.log("here");
  preferenceBtn.innerHTML = spinner();

  axios({
    method: "POST",
    url: `${BASE_URL}/api/contact-preference`,
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
      preferenceBtn.innerHTML = preferenceBtnContent;
      clearFormData();
      notyfToast.success(res.data.data.message || "Preference Set!");
      setTimeout(() => {
        window.location.reload();
     },2000)
    })
    .catch((err) => {
      console.log(err.response);
      preferenceBtn.innerHTML = preferenceBtnContent;
      notyfToast.error(err.response.data.error.message || "Something went wrong");
    });
};

preferenceForm.addEventListener("submit", handlePreferenceSubmit);
