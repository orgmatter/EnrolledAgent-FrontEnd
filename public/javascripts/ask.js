const askForm = document.getElementById("askForm"),
    email = document.getElementById("email"),
    firstName = document.getElementById("firstName"),
    lastName = document.getElementById("lastName"),
    phone = document.getElementById("phone"),
    category = document.getElementById("category"),
    title = document.getElementById("title"),
    message = document.getElementById("message"),
    btn = document.getElementById("submit-btn"),
    btnContent = btn.innerHTML,
    notyf = new Notyf({
        dismissible: !0,
        ripple: !0,
        duration: 3e3,
        position: { x: "right", y: "top" },
        types: [
            { className: "alert-message", type: "success" },
            { className: "alert-message", type: "error" },
        ],
    });
function getCookie(e) {
    const t = `; ${document.cookie}`.split(`; ${e}=`);
    if (2 === t.length) return t.pop().split(";").shift();
}
function spinner() {
    return '<div class="lds-ring"><div></div><div></div><div></div><div></div></div>';
}
function clearFormData() {
    askForm.reset();
}
const handleSubmit = (e) => {
    e.preventDefault();
    const t = { body: message.value, email: email.value, firstName: firstName.value, lastName: lastName.value, phone: phone.value, category: category.value, title: title.value };
    console.log(t),
        btn.setAttribute("disabled", "true"),
        (btn.innerHTML = spinner()),
        axios({ method: "POST", url: `/api/ask`, credentials: "same-origin", headers: { "CSRF-Token": getCookie("XSRF-TOKEN"), "Content-Type": "application/json", Accept: "application/json" }, data: JSON.stringify(t) })
            .then((e) => {
                console.log(e), (btn.innerHTML = btnContent), clearFormData(), btn.removeAttribute("disabled"), notyf.success(e.data.message || "Message sent!");
            })
            .catch((e) => {
                console.log(e), (btn.innerHTML = btnContent), btn.removeAttribute("disabled"), notyf.error(e.response.data.error.message || "Something went wrong");
            });
};
askForm.addEventListener("submit", handleSubmit);

//
var x = document.getElementsByClassName("category_grid-side-recent-div-truncate");
var i;
for (i = 0; i < x.length; i++) {
  x[i].innerHTML = x[i].innerText.substring(0,100) + '...';
}

