const page_url = location.href;
const url_match = page_url.match("enrolledagent.org");
const base_Url = url_match ? "https://enrolledagent.org" : "http://localhost:3000";
const listingForm = document.getElementById("listing-form");

const firstName = document.getElementById("first-name");
const middleName = document.getElementById("last-name");
const lastName = document.getElementById("last-name");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const fax = document.getElementById("fax");
const country = document.getElementById("country");
const address = document.getElementById("address");
const address2 = document.getElementById("address2");
const city = document.getElementById("city");
const zipCode = document.getElementById("zipCode");
const state = document.getElementById("state");
const title = document.getElementById("title");
const position = document.getElementById("position");
const website = document.getElementById("website");
const bio = document.getElementById("bio");
const language = document.getElementById("language");
const service = document.getElementById("service");
const stateLicensed = document.getElementById("state-licensed");
const licenseNo = document.getElementById("license-no");
const myFile = document.getElementById("myFile");
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
  listingForm.reset();
}

const handleSubmit = (e) => {
  e.preventDefault();
  e.stopPropagation();

  const data = {
    firstName: firstName.value,
    lastName:  lastName.value,
    email: email.value,
    phone: phone.value,
    fax: fax.value,
    city: city.value,
    state: state.value,
    country: country.value,
    zipcode: zipCode.value,
    address1: address.value,
    address2: address2.value,
    title: title.value,
    website: website.value,
    bio: bio.value,
    lang: language.value,
    stateLicenced: stateLicensed.value,
    licence: licenseNo.value,
    licenceProof: myFile.files[0],
    position: position.value,
  };
  const fileSize = Math.round(myFile.files[0].size / 1024);
  if (fileSize > 1024) {
      notyf.error('File size too large');
      return;
    } else {
      getFormData(data);
    }
  
};

const getFormData = (data) => {
    const formData = new FormData();
  formData.set('firstName', data.firstName);
  formData.set('lastName', data.lastName);
  formData.set('email', data.email);
  formData.set('phone', data.phone);
  formData.set('fax', data.fax);
  formData.set('city', data.city);
  formData.set('state', data.state);
  formData.set('country', data.country);
  formData.set('zipcode', data.zipcode);
  formData.set('address1', data.address1);
  formData.set('address2', data.address2);
  formData.set('title', data.title);
  formData.set('website', data.website);
  formData.set('bio', data.bio);
  formData.set('lang', data.lang);
  formData.set('licence', data.licence);
  formData.set('position', data.position);
  formData.set('stateLicenced', data.stateLicenced);
  formData.set('phone', data.phone);
  formData.append('doc', data.licenceProof);

  console.log(data);
  btn.setAttribute("disabled", "true");
  btn.innerHTML = spinner();
  // return
  axios({
    method: "POST",
    url: `${base_Url}/api/listing-request`,
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
      notyf.success(res.data.data.message || "Message sent!");
      btn.removeAttribute("disabled");
    })
    .catch((err) => {
      console.log(err.response);
      btn.innerHTML = btnContent;
      btn.removeAttribute("disabled");
      notyf.error(err.response.data.error.message || "Something went wrong");
    });
}

listingForm.addEventListener("submit", handleSubmit);
