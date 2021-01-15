const page_url = location.href;
const url_match = page_url.match("enrolledagent.org");
const base_Url = url_match ? "https://enrolledagent.org" : "http://localhost:3000";
const offshoreForm = document.getElementById("offshore-form");
const email = document.getElementById("email");
const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const city = document.getElementById("city");
const zipCode = document.getElementById("zipCode");
const staffNeeded = document.getElementById("staffNeeded");
const businessSize = document.getElementById("businessSize");
const state = document.getElementById("state");
const contactMethod = document.getElementById("contactMethod");
const timeline = document.getElementById("timeline");
const phone = document.getElementById("phone");
const optionalMessage = document.getElementById("optionalMessage");
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
  offshoreForm.reset();
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
    businessSize: businessSize.value,
    staffNeeded: staffNeeded.value,
    hireUrgency: timeline.value,
    preferredContact: contactMethod.value
  };

  console.log(data);
  btn.setAttribute("disabled", "true");
  btn.innerHTML = spinner();

  axios({
    method: "POST",
    url: `${base_Url}/api/offshore`,
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
    })
    .catch((err) => {
      console.log(err.response);
      btn.innerHTML = btnContent;
      btn.removeAttribute("disabled");
      notyf.error(err.response.data.error.message || "Something went wrong");
    });
};

offshoreForm.addEventListener("submit", handleSubmit);
