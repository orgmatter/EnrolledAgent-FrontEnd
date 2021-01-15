const page_url = location.href;
const url_match = page_url.match("enrolledagent.org");
const base_Url = url_match ? "https://enrolledagent.org" : "http://localhost:3000";
const answerForm = document.getElementById("article-form");
const heading = document.getElementById("heading");
const category = document.getElementById("articleCategory");
const image = document.getElementById("image");
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
  answerForm.reset();
}

const handleSubmit = (e) => {
  e.preventDefault();
  const body = tinyMCE.activeEditor.getContent();

  const data = {
    title: heading.value,
    body: body,
    category: category.value,
    avatar: image.files[0],
  };
   const fileSize = Math.round(image.files[0].size / 1024);
  if (fileSize > 1024) {
      notyf.error('File size too large');
      return;
    } else {
      getFormData(data);
    }
  

};

const getFormData = (data) => {
  const formData = new FormData();
  formData.set('title', data.title);
  formData.set('body', data.body);
  formData.set('category', data.category);
  formData.append('avatar', data.avatar);

  console.log(data);
  btn.setAttribute("disabled", "true");
  btn.innerHTML = spinner();
  
  axios({
    method: "POST",
    url: `${base_Url}/api/article`,
    credentials: 'same-origin', // <-- includes cookies in the request
        headers: {
          "CSRF-Token":  getCookie('XSRF-TOKEN'), 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
    data: formData,

  })
    .then((res) => {
      console.log(res);
      btn.innerHTML = btnContent;
      clearFormData();
      btn.removeAttribute("disabled");
      notyf.success(res.data.message || "Article Upload Successful!");
    })
    .catch((err) => {
      console.log(err.response);
      btn.innerHTML = btnContent;
      btn.removeAttribute("disabled");
      notyf.error(err.response.data.error.message || "Something went wrong");
    });
}

answerForm.addEventListener("submit", handleSubmit);
