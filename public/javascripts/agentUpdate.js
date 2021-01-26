const url = location.href;
const match = url.match("enrolledagent.org");
const base_URL = match ? "https://enrolledagent.org" : "http://localhost:3000";
const agentForm = document.getElementById("update-agent-form");
const agentFirstName = document.getElementById("agent-first-name");
const agentLastName = document.getElementById("agent-last-name");
const zipCode = document.getElementById("zip-code");
const phone = document.getElementById("phone");
// const address = document.getElementById("address");
const city = document.getElementById("city");
// const state = document.getElementById("state");
const contactMessage = document.getElementById("contactMessage");
const agentEditBtn = document.getElementById("agent-edit-btn");
const agentImageInput = document.getElementById("agent-image");
const agentImage = document.getElementById("agent-avatar-preview");
const agentBtn = document.getElementById("agent-submit-btn");
const agentBtnContent = agentBtn.innerHTML;

const toast = new Notyf({
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

function agentSpinner() {
    const markup = `<div class="lds-ring"><div></div><div></div><div></div><div></div></div>`;
  
    return markup;
  }

function clearAgentFormData() {
  agentForm.reset();
}

const handleAgentEdit = (e) => {
    e.preventDefault();
    const disabledAgentFields = document.querySelectorAll(".agentDisabled");
    disabledAgentFields.forEach(field => {
        field.removeAttribute("disabled");
    })
    toast.success("You can edit your profile now");
}

agentEditBtn.addEventListener("click", handleAgentEdit);

  if (agentImageInput) {
    agentImageInput.addEventListener('change', (e) => {
      e.preventDefault();
      const reader = new FileReader(); 
      reader.onloadend = function () {
        agentImage.setAttribute('src', reader.result);
        const fileSize = Math.round(agentImageInput.files[0].size / 1024);
        if (fileSize > 1024) {
            toast.error('File size too large');
            console.log("here instead");
            return;
        }
      };
      reader.readAsDataURL(agentImageInput.files[0]);
    });
  }
const handleAgentSubmit = (e) => {
  e.preventDefault();
  const data = {
    firstName: agentFirstName.value,
    lastName: agentLastName.value,
    avatar: agentImageInput.files[0] || null,
    zipcode: zipCode.value,
    phone: phone.value,
    allowContactMessage: contactMessage.value,
    // address: address.value,
    city: city.value,
    // state: state.value,
  };

  const agentFileSize = Math.round(agentImageInput.files[0] && agentImageInput.files[0].size / 1024);
  if (agentFileSize > 1024) {
      toast.error('File size too large');
      console.log("here instead");
      return;
    } else {
      getAgentFormData(data);
    }
};

const getAgentFormData = (data) => {
    const agentFormData = new FormData();
  agentFormData.set('firstName', data.firstName);
  agentFormData.set('lastName', data.lastName);
  agentFormData.set('zipcode', data.zipcode);
  agentFormData.set('phone', data.phone);
  agentFormData.set('allowContactMessage', data.allowContactMessage);
//   agentFormData.set('address', data.address);
  agentFormData.set('city', data.city);
//   agentFormData.set('state', data.state);
  agentFormData.append('avatar', data.avatar);

  console.log(data);
  console.log("here");
  agentBtn.setAttribute("disabled", "true");
  agentBtn.innerHTML = agentSpinner();

  axios({
    method: "PUT",
    url: `${base_URL}/api/update-agent`,
    credentials: 'same-origin', // <-- includes cookies in the request
        headers: {
          "CSRF-Token":  getCookie('XSRF-TOKEN'), 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
    data: agentFormData,

  })
    .then((res) => {
      console.log(res);
      agentBtn.innerHTML = btnContent;
      clearAgentFormData();
      agentBtn.removeAttribute("disabled");
      toast.success(res.data.data.message || "Agent Account Updated!");
      setTimeout(() => {
        window.location.reload();
     },2000)
    })
    .catch((err) => {
      console.log(err.response);
      agentBtn.innerHTML = btnContent;
      agentBtn.removeAttribute("disabled");
      toast.error(err.response.data.error.message || "Something went wrong");
    });
}
agentForm.addEventListener("submit", handleAgentSubmit);
