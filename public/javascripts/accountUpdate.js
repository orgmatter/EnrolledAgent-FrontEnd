const page_url = location.href;
const url_match = page_url.match("enrolledagent.org");
const base_Url = url_match ? "https://enrolledagent.org" : "http://localhost:3000";
const updateForm = document.getElementById("update-profile-form");
const firstName = document.getElementById("first-name");
const lastName = document.getElementById("last-name");
const editBtn = document.getElementById("edit-btn");
const imageInput = document.getElementById("image");
const image = document.getElementById("avatar-preview");
const btn = document.getElementById("submit-btn");
const btnContent = btn.innerHTML;

const notyf = new Notyf({
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

function clearFormData() {
  updateForm.reset();
}

const handleEdit = (e) => {
    e.preventDefault();
    const disabledFields = document.querySelectorAll(".disabled");
    disabledFields.forEach(field => {
        field.removeAttribute("disabled");
    })
    notyf.success("You can edit your profile now");
}

editBtn.addEventListener("click", handleEdit);

  if (imageInput) {
    imageInput.addEventListener('change', (e) => {
      e.preventDefault();
      const reader = new FileReader(); 
      reader.onloadend = function () {
        image.setAttribute('src', reader.result);
        const fileSize = Math.round(imageInput.files[0].size / 1024);
        if (fileSize > 1024) {
            notyf.error('File size too large');
            console.log("here instead");
            return;
        }
      };
      reader.readAsDataURL(imageInput.files[0]);
    });
  }
const handleSubmit = (e) => {
  e.preventDefault();
  const data = {
    firstName: firstName.value,
    lastName: lastName.value,
    avatar: imageInput.files[0] || null,
  };

  const fileSize = Math.round(imageInput.files[0] && imageInput.files[0].size / 1024);
  if (fileSize > 1024) {
      notyf.error('File size too large');
      console.log("here instead");
      return;
    } else {
      getFormData(data);
    }
};

const getFormData = (data) => {
    const formData = new FormData();
  formData.set('firstName', data.firstName);
  formData.set('lastName', data.lastName);
  formData.append('avatar', data.avatar);

  console.log(data);
  console.log("here");
  btn.setAttribute("disabled", "true");
  btn.innerHTML = spinner();

  axios({
    method: "PUT",
    url: `${base_Url}/api/update-profile`,
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
      btn.innerHTML = btnContent;
      clearFormData();
      btn.removeAttribute("disabled");
      notyf.success(res.data.message || "Message sent!");
    })
    .catch((err) => {
      console.log(err.response);
      btn.innerHTML = btnContent;
      btn.removeAttribute("disabled");
      notyf.error(err.response.data.error.message || "Something went wrong");
    });
}
updateForm.addEventListener("submit", handleSubmit);
