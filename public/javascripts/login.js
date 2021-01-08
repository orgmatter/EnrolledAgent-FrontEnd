const url = location.href;
const match = url.match("enrolledagent.org");
const baseUrl = match ? "https://enrolledagent.org" : "http://localhost:3000";
const loginForm = document.getElementById("login-form");
const email = document.getElementById("email");
const password = document.getElementById("password");

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
    email: email.value,
    password: password.value,
  };

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
    //   headers: {
    //     "CSRF-Token": token,
    //     Accept: "application/json",
    //     "Content-Type": "application/json",
    //   },
  })
    .then((res) => {
      console.log(res);
      notyf.success(res.data.data.message || "Login successful");
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 500);
    })
    .catch((err) => {
      console.log(err);
      notyf.error(err.response.data.error.message || "Something went wrong");
    });
};

loginForm.addEventListener("submit", handleSubmit);
