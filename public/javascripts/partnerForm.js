const partner_page_url = location.href;
const partner_url_match = partner_page_url.match("enrolledagent.org");
const partner_base_Url = partner_url_match ? "https://enrolledagent.org" : "http://localhost:3000";
const partnerForm = document.getElementById("partner-form");
const partner_email = document.getElementById("partnerEmail");
const partner_fullName = document.getElementById("name");
const partner_phone = document.getElementById("partnerPhone");
const partner_firm = document.getElementById("firmName");
const partner_message = document.getElementById("partnerMessage");
const partner_btn = document.getElementById("partner-submit-btn");
const partner_btnContent = partner_btn.innerHTML;

const partner_notyf = new Notyf({
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

function partner_spinner() {
  const markup = `<div class="lds-ring"><div></div><div></div><div></div><div></div></div>`;
  
  return markup;
}

function clearPartnerFormData() {
  partnerForm.reset();
}

const handlePartnerSubmit = (e) => {
  e.preventDefault();
  const data = {
    message: partner_message.value,
    email: partner_email.value,
    name: partner_fullName.value,
    phone:  partner_phone.value,
    firm: partner_firm.value,
  };
  console.log(data);

  partner_btn.setAttribute("disabled", "true");
  partner_btn.innerHTML = partner_spinner();

  axios({
    method: "POST",
    url: `${partner_base_Url}/partner`,
    credentials: 'same-origin', // <-- includes cookies in the request
        headers: {
          "CSRF-Token":  getCookie('XSRF-TOKEN'), 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
    data: JSON.stringify(data),

  })
    .then((res) => {
      partner_btn.innerHTML = partner_btnContent;
      clearPartnerFormData();
      partner_btn.removeAttribute("disabled");
      partner_notyf.success(res.data.message || "Message sent!");
      $("#partnerModal").modal("hide")
    })
    .catch((err) => {
      partner_btn.innerHTML = btnContent;
      partner_btn.removeAttribute("disabled");
      partner_notyf.error(err.response.data.error.message || "Something went wrong");
    });

};

partnerForm.addEventListener("submit", handlePartnerSubmit);
