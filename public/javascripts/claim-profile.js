const page_url = location.href;
const url_match = page_url.match("enrolledagent.org");
const base_Url = url_match ? "https://enrolledagent.org" : "http://localhost:3000";
const id = document.querySelector('meta[name="agentId"]').getAttribute("content");
const claimForm = document.getElementById("claim-listing-form");
const role = document.getElementById("role");
const company = document.getElementById("company");
const size = document.getElementById("size");
const companyType = document.getElementById("type");
const revenue = document.getElementById("revenue");
const taxReturns = document.getElementById("tax-returns");
const terms = document.getElementById("terms");
const btn = document.getElementById("submit-btn");
const btnContent = btn.innerHTML;

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

function spinner() {
    const markup = `<div class="lds-ring"><div></div><div></div><div></div><div></div></div>`;
  
    return markup;
  }

function clearFormData() {
  claimForm.reset();
}

const handleSubmit = (e) => {
  e.preventDefault();
  e.stopImmediatePropagation();

  const data = {
   jobRole: role.value,
   companySize: size.value,
   companyName: company.value,
   companyRevenue: revenue.value,
   organizationType: companyType.value,
   annualTax: taxReturns.value
  };

  console.log(data);
  btn.setAttribute("disabled", "true");
  btn.innerHTML = spinner();

  axios({
    method: "POST",
    url: `${base_Url}/api/claim-listing/${id}`,
    credentials: 'same-origin', // <-- includes cookies in the request
        headers: {
          "CSRF-Token":  getCookie('XSRF-TOKEN'), 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
    data: JSON.stringify(data),

  })
    .then((res) => {
      console.log(res.data.data);
      btn.innerHTML = btnContent;
      clearFormData();
      btn.removeAttribute("disabled");
      notyf.success(res.data.data.data.message || "Message sent!");
    })
    .catch((err) => {
      console.log(err.response);
      btn.innerHTML = btnContent;
      btn.removeAttribute("disabled");
      notyf.error(err.response.data.error.message || "Something went wrong");
    });
};

claimForm.addEventListener("submit", handleSubmit);
