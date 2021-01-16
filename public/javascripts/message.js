const url = location.href;
const match = url.match("enrolledagent.org");
const base_URL = match ? "https://enrolledagent.org" : "http://localhost:3000";
const messageForm = document.getElementById("message-form");
const agentId = document.querySelector('meta[name="agentId"]').getAttribute("content");
const messageEmail = document.getElementById("messageEmail");
const fullName = document.getElementById("name");
const subject = document.getElementById("subject");
const phone = document.getElementById("phone");
const directMessage = document.getElementById("directMessage");
const messageBtn = document.getElementById("message-submit-btn");
const messageBtnContent = messageBtn.innerHTML;

const notyfToast = new Notyf({
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

function messageSpinner() {
  const markup = `<div class="lds-ring"><div></div><div></div><div></div><div></div></div>`;
  
  return markup;
}

function clearMessageFormData() {
  messageForm.reset();
}

const handleSubmitMessage = (e) => {
  e.preventDefault();
  const data = {
    message: directMessage.value,
    email: messageEmail.value,
    name: fullName.value,
    phone: phone.value,
    subject: subject.value,
    agent: agentId,
  };

  messageBtn.setAttribute("disabled", "true");
  console.log(data);
  messageBtn.innerHTML = messageSpinner();

  axios({
    method: "POST",
    url: `${base_URL}/api/contact-agent`,
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
      messageBtn.innerHTML = messageBtnContent;
      clearMessageFormData();
      messageBtn.removeAttribute("disabled");
      notyfToast.success(res.data.message || "Message sent!");
      setTimeout(() => {
        window.location.reload();
     },5000)
    })
    .catch((err) => {
      console.log(err.response);
      messageBtn.innerHTML = messageBtnContent;
      messageBtn.removeAttribute("disabled");
      notyfToast.error(err.response.data.error.message || "Something went wrong");
    });
};

messageForm.addEventListener("submit", handleSubmitMessage);
