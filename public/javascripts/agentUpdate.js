const agentForm = document.getElementById("update-agent-form"),
    agentFirstName = document.getElementById("agent-first-name"),
    agentLastName = document.getElementById("agent-last-name"),
    zipCode = document.getElementById("zip-code"),
    phone = document.getElementById("phone"),
    city = document.getElementById("city"),
    contactMessage = document.getElementById("contactMessage"),
    agentEditBtn = document.getElementById("agent-edit-btn"),
    agentImageInput = document.getElementById("agent-image"),
    agentImage = document.getElementById("agent-avatar-preview"),
    agentBtn = document.getElementById("agent-submit-btn") ,
    agentBtnContent = agentBtn && agentBtn.innerHTML,
    toast = new Notyf({
        dismissible: !0,
        ripple: !0,
        duration: 3e3,
        position: { x: "right", y: "bottom" },
        types: [
            { className: "alert-message", type: "success" },
            { className: "alert-message", type: "error" },
        ],
    });
function getCookie(e) {
    const t = `; ${document.cookie}`.split(`; ${e}=`);
    if (2 === t.length) return t.pop().split(";").shift();
}
function agentSpinner() {
    return '<div class="lds-ring"><div></div><div></div><div></div><div></div></div>';
}
function clearAgentFormData() {
    agentForm.reset();
}
const handleAgentEdit = (e) => {
    e.preventDefault(),
        document.querySelectorAll(".agentDisabled").forEach((e) => {
            e.removeAttribute("disabled");
        }),
        toast.success("You can edit your profile now");
};
agentBtn && agentEditBtn.addEventListener("click", handleAgentEdit),
    agentImageInput &&
        agentImageInput.addEventListener("change", (e) => {
            e.preventDefault();
            const t = new FileReader();
            (t.onloadend = function () {
                if ((agentImage.setAttribute("src", t.result), Math.round(agentImageInput.files[0].size / 1024) > 1024)) return toast.error("File size too large"), void console.log("here instead");
            }),
                t.readAsDataURL(agentImageInput.files[0]);
        });
const handleAgentSubmit = (e) => {
        e.preventDefault();
        const t = { firstName: agentFirstName.value, lastName: agentLastName.value, avatar: agentImageInput.files[0] || null, zipcode: zipCode.value, phone: phone.value, allowContactMessage: contactMessage.value, city: city.value };
        if (Math.round(agentImageInput.files[0] && agentImageInput.files[0].size / 1024) > 1024) return toast.error("File size too large"), void console.log("here instead");
        getAgentFormData(t);
    },
    getAgentFormData = (e) => {
        const t = new FormData();
        t.set("firstName", e.firstName),
            t.set("lastName", e.lastName),
            t.set("zipcode", e.zipcode),
            t.set("phone", e.phone),
            t.set("allowContactMessage", e.allowContactMessage),
            t.set("city", e.city),
            t.append("avatar", e.avatar),
            console.log(e),
            console.log("here"),
            agentBtn.setAttribute("disabled", "true"),
            (agentBtn.innerHTML = agentSpinner()),
            axios({ method: "PUT", url: `/api/update-agent`, credentials: "same-origin", headers: { "CSRF-Token": getCookie("XSRF-TOKEN"), "Content-Type": "application/json", Accept: "application/json" }, data: t })
                .then((e) => {
                    console.log(e),
                        // (agentBtn.innerHTML = btnContent),
                        clearAgentFormData(),
                        agentBtn.removeAttribute("disabled"),
                        toast.success(e.data.data.message || "Agent Account Updated!"),
                        setTimeout(() => {
                            window.location.reload();
                        }, 2e3);
                })
                .catch((e) => {
                    console.log(e.response), /*(agentBtn.innerHTML = btnContent),*/ agentBtn.removeAttribute("disabled"), toast.error(e.response.data.error.message || "Something went wrong");
                });
    };
    agentForm && agentForm.addEventListener("submit", handleAgentSubmit);
