const url = location.href;
const match = url.match("enrolledagent.org");
const baseUrl = match ? "https://enrolledagent.org" : "http://localhost:3000";
const signUpForm = document.getElementById("signup-form");
const fName = document.getElementById("firstname");
const lName = document.getElementById("lastname");
const email = document.getElementById("email");
const password = document.getElementById("password");
const terms = document.getElementById("terms");

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
  if (terms.checked) {
    const formData = {
      firstName: fName.value,
      lastName: lName.value,
      email: email.value,
      password: password.value,
    };

    axios({
      method: "POST",
      url: `${baseUrl}/register`,
      data: JSON.stringify(formData),
      //   headers: {
      //     "CSRF-Token": token,
      //     Accept: "application/json",
      //     "Content-Type": "application/json",
      //   },
    })
      .then((res) => {
        notyf.success("Signup successful!");
        setTimeout(() => {
          window.location.href = "/login";
        }, 3000);
      })
      .catch((err) => {
        notyf.error("Something went wrong");
      });
  } else {
    console.log("accept terms");
  }
};

signUpForm.addEventListener("submit", handleSubmit);