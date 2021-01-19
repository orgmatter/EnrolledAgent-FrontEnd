const url = location.href;
const url_match = url.match("enrolledagent.org");
const base_url = url_match ? "https://enrolledagent.org" : "http://localhost:3000";
const passwordForm = document.getElementById("forgot-password");
const email = document.getElementById("email");
const passwordBtn = document.getElementById("submit-btn");
const passwordBtnContent = passwordBtn.innerHTML;

const passwordToast = new Notyf({
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

function clearPasswordFormData() {
  passwordForm.reset();
}

const handlePasswordSubmit = (e) => {
  e.preventDefault();
  const data = {
    email: email.value,
  };

  console.log(data);
  passwordBtn.innerHTML = spinner();

  axios({
    method: "POST",
    url: `${base_url}/api/send-reset`,
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
      passwordBtn.innerHTML = passwordBtnContent;
      clearPasswordFormData();
      passwordToast.success(res.data.data.message || "Preference Set!");
    })
    .catch((err) => {
      console.log(err.response);
      passwordBtn.innerHTML = passwordBtnContent;
      passwordToast.error(err.response.data.error.message || "Something went wrong");
    });
};

passwordForm.addEventListener("submit", handlePasswordSubmit);
