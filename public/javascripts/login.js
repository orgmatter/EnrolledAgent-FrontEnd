const url = location.href;
const match = url.match("enrolledagent.org");
const baseUrl = match ? "https://enrolledagent.org" : "http://localhost:3000";
const loginForm = document.getElementById("login-form");
const email = document.getElementById("email");
const password = document.getElementById("password");
const btn = document.getElementById("login-btn");
const buttonParentNode = btn.parentNode;

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
  loginForm.reset();
}

function removeLoader(btnParent, btnNode) {
  const loader = document.querySelector('.lds-ring');
  btnParent.removeChild(loader);
  btnParent.appendChild(btnNode);
}

const handleSubmit = (e) => {
  e.preventDefault();
  const data = {
    email: email.value,
    password: password.value,
  };

  btn.setAttribute("disabled", "true");
  btn.innerHTML = spinner();

  axios({
    method: "POST",
    url: `${baseUrl}/api/login`,
    credentials: 'same-origin', // <-- includes cookies in the request
        headers: {
          "CSRF-Token":  getCookie('XSRF-TOKEN'), 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
    data: JSON.stringify(data),
  })
    .then((res) => {
      btn.textContent = "Sign in"
      clearFormData();
      btn.removeAttribute("disabled");
      window.location.href = "/";
    })
    .catch((err) => {
      btn.textContent = "Sign in"
      btn.removeAttribute("disabled");
      notyf.error(err.response.data.error.message || "Something went wrong");
    });
};

loginForm.addEventListener("submit", handleSubmit);
