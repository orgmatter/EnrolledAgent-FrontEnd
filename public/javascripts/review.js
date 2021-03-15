const reviewForm = document.getElementById("review-form"),
    id = document.querySelector('meta[name="agentId"]').getAttribute("content"),
    rate = document.getElementById("rate");
let ratingValue = 0;
const email = document.getElementById("email"),
    firstName = document.getElementById("firstName"),
    lastName = document.getElementById("lastName"),
    city = document.getElementById("city"),
    state = document.getElementById("state"),
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
    reviewForm.reset();
}
rate.querySelectorAll(".star").forEach((e) => {
    e.addEventListener("click", (t) => {
        ratingValue = e.value;
    });
});
const handleSubmit = (e) => {
    e.preventDefault();
    const t = { message: message.value, email: email.value, firstName: firstName.value, lastName: lastName.value, city: city.value, state: state.value, rating: ratingValue, agent: id };
    null !== document.querySelector('input[name = "rate"]:checked')
        ? (btn.setAttribute("disabled", "true"),
          (btn.innerHTML = spinner()),
          axios({ method: "POST", url: `/api/review`, credentials: "same-origin", headers: { "CSRF-Token": getCookie("XSRF-TOKEN"), "Content-Type": "application/json", Accept: "application/json" }, data: JSON.stringify(t) })
              .then((e) => {
                  console.log(e),
                      (btn.innerHTML = btnContent),
                      clearFormData(),
                      btn.removeAttribute("disabled"),
                      notyf.success(e.data.message || "Review sent!"),
                      setTimeout(() => {
                          window.location.reload();
                      }, 2e3);
              })
              .catch((e) => {
                  console.log(e.response), (btn.innerHTML = btnContent), btn.removeAttribute("disabled"), notyf.error(e.response.data.error.message || "Something went wrong");
              }))
        : notyf.error("Please select a rating");
};
reviewForm.addEventListener("submit", handleSubmit);
