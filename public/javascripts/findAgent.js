const toggleBtn = document.getElementById("dropdownMenuButton");
const select = document.getElementById("select");
const zip = document.getElementById("zip");
const states = document.getElementById("state");
const zipInput = document.getElementById("zipInput");
const lastNameInput = document.getElementById("lastNameInput");
const lastNameInputMobile = document.getElementById("lastNameInputMobile");
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
  lastNameInput.value = "";
  lastNameInputMobile.value = "";
}

function getLastNameValue(){
  return lastNameInput.value.trim() || lastNameInputMobile.value.trim()
}

function EnterKey(event,state) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13 || state == 'submit') {
    if (zipInput.value.trim() !== "" || zipInputMobile.value.trim() !== "") {
      
      const payload = zipInput.value.trim() || zipInputMobile.value.trim();
      let url = null
      let lastNameValue = getLastNameValue() !== '' ? getLastNameValue() : null

      if (res) {
        url  = `/search-results?q=zipcode:${payload}`;
        if(lastNameValue) url = `${url},lastName:${getLastNameValue()}`
  
        location.href = url;
        clearForm();
      } else {
        url = `/search-results?q=state:${payload}`;
        if(lastNameValue) url = `${url},lastName:${getLastNameValue()}`
  
        location.href = url;
        clearForm();
      }
    }
  }
}


zipInput.addEventListener("keyup", EnterKey)

lastNameInput.addEventListener("keyup", EnterKey)


zipInputMobile.addEventListener("keyup", EnterKey)

lastNameInputMobile.addEventListener("keyup", EnterKey)

submitBtn.addEventListener("click", function(e){EnterKey(e,'submit')});

select.addEventListener("change", () => {
  if (select.value === "state"){
    zipInputMobile.placeholder = "Enter state*";
  } else {
    zipInputMobile.placeholder = "Enter zip code*";
  }
});

