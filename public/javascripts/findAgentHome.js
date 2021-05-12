const toggleBtn = document.getElementById("dropdownMenuButton");
const select = document.getElementById("select");
const zip = document.getElementById("zip");
const states = document.getElementById("state");
const zipInput = document.getElementById("zipInput");
const zipInputMobile = document.getElementById("zipInputMobile");
const submitBtn = document.getElementById("submitBtn");
const inputDiv = document.querySelector(".input");
const url = location.href;
var res = true;

zip.addEventListener("click", () => {
  toggleBtn.innerHTML = getInnerState("Zip Code");
  zipInput.placeholder = "Enter zip code";
});

const getInnerState = (val) => {
    return `${val} <span> <img src= \'/assets/files/arrow-down.svg\' alt=\'icon\' class=\'my-dropdown-icon\'/> </span>`
}

states.addEventListener("click", () => {
  toggleBtn.innerHTML = getInnerState("State");
  zipInput.placeholder = "Enter state";
  res = false;
});

const clearForm = () => {
  zipInput.value = " ";
  zipInputMobile.value = "";
}

submitBtn.addEventListener("click", () => {
   
  if (zipInput.value !== "" || zipInputMobile.value !== "") {
    const payload = zipInput.value.trim() || zipInputMobile.value.trim();
    if (res) {
      location.href = `/search-results?q=zipcode:${payload}`;
      clearForm();
    } else {
      location.href = `/search-results?q=state:${payload}`;
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
          location.href = `/search-results?q=zipcode:${payload}`;
          clearForm();
        } else {
          location.href = `/search-results?q=state:${payload}`;
          clearForm();
        }
    }
  }
})

select.addEventListener("change", () => {
  if (select.value === "state"){
    zipInputMobile.placeholder = "Enter state*";
  } else {
    zipInputMobile.placeholder = "Enter zip code*";
  }
});

