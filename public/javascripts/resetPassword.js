const url = location.href;
const match = url.match("enrolledagent.org");
const baseUrl = match ? "https://enrolledagent.org" : "http://localhost:3000";
const resetForm = document.getElementById("password-reset-form");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirm-password");
const btn = document.getElementById("reset-password-btn");
const buttonParentNode = btn.parentNode;

// const notyf = new Notyf({
//   dismissible: true,
//   ripple: true,
//   duration: 3000,
//   position: {
//     x: "right",
//     y: "top",
//   },
//   types: [
//     {
//       className: "alert-message",
//       type: "success",
//     },
//     {
//       className: "alert-message",
//       type: "error",
//     },
//   ],
// });

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
    resetForm.reset();
}

function removeLoader(btnParent, btnNode) {
    const loader = document.querySelector('.lds-ring');
    btnParent.removeChild(loader);
    btnParent.appendChild(btnNode);
}

const handleSubmit = (e) => {
    e.preventDefault();
    if (!password || !password.value || !confirmPassword || !confirmPassword.value)
        return toast.error("Please enter a valid password");
    if (confirmPassword.value != password.value || password.value.length < 6)
        return toast.error("Password must not be less than 6 characters");
    const data = {
        password: password.value,
    };

    btn.setAttribute("disabled", "true");
    btn.innerHTML = spinner();

    axios({
        method: "POST",
        url: `${baseUrl}/api/reset-password`,
        credentials: 'same-origin', // <-- includes cookies in the request
        headers: {
            "CSRF-Token": getCookie('XSRF-TOKEN'),
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        data: JSON.stringify(data),
    })
        .then((res) => {
            btn.textContent = "Reset Password"
            clearFormData();
            btn.removeAttribute("disabled");
            window.location.href = "/login";
        })
        .catch((err) => {
            btn.textContent = "Reset Password"
            btn.removeAttribute("disabled");
            toast.error(err.response.data.error.message || "Something went wrong");
        });
};

resetForm.addEventListener("submit", handleSubmit);
