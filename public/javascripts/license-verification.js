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

  console.log(data);

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
      notyf.success(res.data.message || "Message sent!");
    })
    .catch((err) => {
      console.log(err.response);
      notyf.error(err.response.data.error.message || "Something went wrong");
    });
};

licenseForm.addEventListener("submit", handleSubmit);
