const url = location.href;
const match = url.match("enrolledagent.org");
const baseUrl = match ? "https://enrolledagent.org" : "http://localhost:3000";
const signUpForm = document.getElementById("signup-form");
const fName = document.getElementById("firstname");
const lName = document.getElementById("lastname");
const email = document.getElementById("email");
const password = document.getElementById("password");
const terms = document.getElementById("terms");
const btn = document.getElementById("signup-btn");

const notyf = new Notyf({
  dismissible: true,
  ripple: true,
  duration: 10000,
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
  signUpForm.reset();
}

const handleSubmit = (e) => {
  console.log(e)
  e.stopImmediatePropagation();
  e.preventDefault();

  if (terms.checked) {
    const data = {
      email: email.value,
      password: password.value,
      firstName: fName.value,
      lastName: lName.value,
    };

    btn.setAttribute("disabled", "true");
    btn.innerHTML = spinner();

    axios({
      method: "POST",
      url: `${baseUrl}/api/register`,
      credentials: 'same-origin', // <-- includes cookies in the request
        headers: {
          "CSRF-Token":  getCookie('XSRF-TOKEN'), 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
      data: JSON.stringify(data),
    })
      .then((res) => {
        btn.textContent = "Sign up"
        clearFormData();
        btn.removeAttribute("disabled");
        window.location.href = "/login";
      })
      .catch((err) => {
        btn.textContent = "Sign up"
        btn.removeAttribute("disabled");
        notyf.error(err.response.data.error.message || "Something went wrong");
      });
  } else {
    notyf.error("Please accept terms and conditions")
  }
};

signUpForm.addEventListener("submit", handleSubmit); 
 