const page_url = location.href;
const url_match = page_url.match("enrolledagent.org");
const base_Url = url_match ? "https://enrolledagent.org" : "http://localhost:3000";
const answerForm = document.getElementById("answer-form");
const id = document.querySelector('meta[name="agentId"]').getAttribute("content");
const message = document.getElementById("mytextarea");
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
    question: id,
    message: body,
  };

  console.log(data);
  btn.setAttribute("disabled", "true");
  btn.innerHTML = spinner();
  console.log("here");
  axios({
    method: "POST",
    url: `${base_Url}/api/answer`,
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
      console.log("here2");
      btn.innerHTML = btnContent;
      clearFormData();
      btn.removeAttribute("disabled");
      notyf.success(res.data.message || "Answer sent successfully!");
    })
    .catch((err) => {
      console.log(err.response);
      console.log("here instead");
      btn.innerHTML = btnContent;
      btn.removeAttribute("disabled");
      notyf.error(err.response.data.error.message || "Something went wrong");
    });
};

answerForm.addEventListener("submit", handleSubmit);
