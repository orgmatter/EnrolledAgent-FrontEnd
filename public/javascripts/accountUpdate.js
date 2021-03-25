const updateForm = document.getElementById("update-profile-form"),
    firstName = document.getElementById("first-name"),
    lastName = document.getElementById("last-name"),
    website = document.getElementById("website"),
    address = document.getElementById("address"),
    city = document.getElementById("city"),
    state = document.getElementById("state"),
    phoneNumber = document.getElementById("phone-number"),
    fax = document.getElementById("fax"),
    serviceOffered = document.getElementById("service-offered"),
    bio = document.getElementById("bio"),
    taxServices = document.getElementById("tax-services"),
    industrySpecialities = document.getElementById("industry-specialities"),
    professionalMemberships = document.getElementById("professional-memberships"),
    instagram = document.getElementById("instagram"),
    facebook = document.getElementById("facebook"),
    twitter = document.getElementById("twitter"),
    zipCode = document.getElementById("zip-code"),
    editBtn = document.getElementById("edit-btn"),
    imageInput = document.getElementById("image"),
    imageLabel = document.getElementById("image-label"),
    image = document.getElementById("avatar-preview"),
    btn = document.getElementById("submit-btn"),
    btnContent = btn.innerHTML,
    notyf = new Notyf({
        dismissible: !0,
        ripple: !0,
        duration: 3e3,
        position: { x: "right", y: "bottom" },
        types: [
            { className: "alert-message", type: "success" },
            { className: "alert-message", type: "error" },
        ],
    });

//
imageLabel.addEventListener("click", function(){
    if(imageInput.disabled){
        notyf.error("Click on the Edit Profile button to enable editing of your profile");
    }
})

function getCookie(e) {
    const t = `; ${document.cookie}`.split(`; ${e}=`);
    if (2 === t.length) return t.pop().split(";").shift();
}
function spinner() {
    return '<div class="lds-ring"><div></div><div></div><div></div><div></div></div>';
}
function clearFormData() {
    updateForm.reset();
}
const handleEdit = (e) => {
    e.preventDefault(),
        document.querySelectorAll(".disabled").forEach((e) => {
            e.removeAttribute("disabled");
        }),
        notyf.success("You can edit your profile now");
};
editBtn.addEventListener("click", handleEdit),
    imageInput &&
        imageInput.addEventListener("change", (e) => {
            e.preventDefault();
            const t = new FileReader();
            (t.onloadend = function () {
                if ((image.setAttribute("src", t.result), Math.round(imageInput.files[0].size / 1024) > 1024)) return notyf.error("File size too large"), void console.log("here instead");
            }),
                t.readAsDataURL(imageInput.files[0]);
        });
const handleSubmit = (e) => {
        e.preventDefault();
        const t = { firstName: firstName.value, lastName: lastName.value, avatar: imageInput.files[0] || null };
        if (Math.round(imageInput.files[0] && imageInput.files[0].size / 1024) > 1024) return notyf.error("File size too large"), void console.log("here instead");
        getFormData(t);
    },
    getFormData = (e) => {
        const t = new FormData();
        t.set("firstName", e.firstName),
            t.set("lastName", e.lastName),
            t.append("avatar", e.avatar),
            btn.setAttribute("disabled", "true"),
            (btn.innerHTML = spinner()),
            axios({ method: "PUT", url: `/api/update-profile`, credentials: "same-origin", headers: { "CSRF-Token": getCookie("XSRF-TOKEN"), "Content-Type": "application/json", Accept: "application/json" }, data: t })
                .then((e) => {
                    console.log(e),
                        (btn.innerHTML = btnContent),
                        clearFormData(),
                        btn.removeAttribute("disabled"),
                        notyf.success(e.data.data.message || "Account Updated!"),
                        setTimeout(() => {
                            window.location.reload();
                        }, 2e3);
                })
                .catch((e) => {
                    (btn.innerHTML = btnContent), btn.removeAttribute("disabled"), notyf.error(e.response.data.error.message || "Something went wrong");
                });
    };
updateForm.addEventListener("submit", handleSubmit);
