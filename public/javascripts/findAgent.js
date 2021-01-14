const toggleBtn = document.getElementById("dropdownMenuButton");
const zip = document.getElementById("zip");
const states = document.getElementById("state");
const zipInput = document.getElementById("zipInput");
const submitBtn = document.getElementById("submitBtn");
const inputDiv = document.querySelector(".input");
const url = location.href;
const match = url.match("enrolledagent.org");
const baseUrl = match ? "https://enrolledagent.org" : "http://localhost:3000";
var res = true;

zip.addEventListener("click", () => {
  toggleBtn.textContent = "Zip Code";
  zipInput.placeholder = "Enter zip code";
});

states.addEventListener("click", () => {
  toggleBtn.textContent = "State";
  zipInput.placeholder = "Enter state";
  res = false;
});

const clearForm = () => {
  zipInput.value = " ";
}

submitBtn.addEventListener("click", () => {
  if (zipInput.value !== "") {
    const payload = zipInput.value;
    if (res) {
      location.href = `${baseUrl}/search-results?q=zipcode:${payload}`;
      clearForm();
    } else {
      location.href = `${baseUrl}/search-results?q=state:${payload}`;
      clearForm();
    }
  }
});

zipInput.addEventListener("keyup", function (event) {
                // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
      if (zipInput.value !== "") {
        const payload = zipInput.value;
        if (res) {
          location.href = `${baseUrl}/search-results?q=zipcode:${payload}`;
          clearForm();
        } else {
          location.href = `${baseUrl}/search-results?q=state:${payload}`;
          clearForm();
        }
    }
  }
})
