const toggleBtn = document.getElementById("dropdownMenuButton");
const listingForm = document.getElementById("listing-form");
const select = document.getElementById("select");
const zipInput = document.getElementById("zipInput");
const nameInput = document.getElementById("name");
const submitBtn = document.getElementById("submit-btn");
const url = location.href;
const match = url.match("enrolledagent.org");
const baseUrl = match ? "https://enrolledagent.org" : "http://localhost:3000";
var res = true;

select.addEventListener("change", () => {
  if (select.value === "state"){
    zipInput.placeholder = "Enter state*";
  } else {
    zipInput.placeholder = "Enter zip code*";
  }
});

const handleSubmit = (e) => {
  e.preventDefault();
    const payload = zipInput.value;
    const name = nameInput.value;
    if (res) {
      window.location.href = `${baseUrl}/search-results?q=zipcode:${payload},lastName:${name}`;
    } else {
      window.location.href = `${baseUrl}/search-results?q=state:${payload},lastName:${name}`;
    }
}

listingForm.addEventListener("submit", handleSubmit);

