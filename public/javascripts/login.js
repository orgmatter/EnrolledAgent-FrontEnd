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

const handleSubmit = (e) => {
  e.preventDefault();
  const formData = {
    email: email.value,
    password: password.value,
  };

  axios({
    method: "POST",
    url: `${baseUrl}/login`,
    data: JSON.stringify(formData),
    //   headers: {
    //     "CSRF-Token": token,
    //     Accept: "application/json",
    //     "Content-Type": "application/json",
    //   },
  })
    .then((res) => {
      console.log(res);
      notyf.success("Login successful!");
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 3000);
    })
    .catch((err) => {
      console.log(err);
      notyf.error("Something went wrong");
    });
};

loginForm.addEventListener("submit", handleSubmit);
