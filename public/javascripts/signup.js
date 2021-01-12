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

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

const handleSubmit = (e) => {
  console.log(e)
  e.stopImmediatePropagation();
  e.preventDefault();
  // e.stopImmediatePropagation();
  if (terms.checked) {
    const data = {
      email: email.value,
      password: password.value,
      firstName: fName.value,
      lastName: lName.value,
    };

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
      //   headers: {
      //     "CSRF-Token": token,
      //     Accept: "application/json",
      //     "Content-Type": "application/json",
      //   },
    })
      .then((res) => {
        notyf.success(res.data.data.message || "Signup successful");
        console.log(res);
        setTimeout(() => {
          window.location.href = "/login";
        }, 500);
      })
      .catch((err) => {
        notyf.error(err.response.data.error.message || "Something went wrong");
        console.log(err.response.data.error.message);
      });
  } else {
    notyf.error("Please accept terms and conditions")
  }
};

signUpForm.addEventListener("submit", handleSubmit); 

// signUpForm.addEventListener("submit", function(e) {
//   e.preventDefault();
//   console.log("submit");
// });

// const button = document.querySelector("#signup-submit-btn");
// button.addEventListener("click", function(e) {
//   console.log("click");
// });