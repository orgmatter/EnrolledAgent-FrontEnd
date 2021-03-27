const agentForm = document.getElementById("update-agent-form"),
    agentFirstName = document.getElementById("agent-first-name"),
    agentLastName = document.getElementById("agent-last-name"),
    website = document.getElementById("website"),
    address = document.getElementById("address"),
    state = document.getElementById("state"),
    fax = document.getElementById("fax"),
    serviceOffered = document.getElementById("service-offered"),
    bio = document.getElementById("bio"),
    taxServices = document.getElementById("tax-services"),
    industrySpecialities = document.getElementById("industry-specialities"),
    professionalMemberships = document.getElementById("professional-memberships"),
    instagram = document.getElementById("instagram"),
    facebook = document.getElementById("facebook"),
    twitter = document.getElementById("twitter"),
    language = document.getElementById("lang"),
    education = document.getElementById("education"),
    zipCode = document.getElementById("zip-code"),
    phone = document.getElementById("phone"),
    city = document.getElementById("city"),
    contactMessage = document.getElementById("contactMessage"),
    agentEditBtn = document.getElementById("agent-edit-btn"),
    agentImageInput = document.getElementById("agent-image"),
    agentImageLabel = document.getElementById("agent-image-label") || null ,
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

agentImageLabel && agentImageLabel.addEventListener("click", function(){
    if(agentImageInput.disabled){
        notyf.error("Click on the Edit Profile button to enable editing of your profile");
    }
})
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
        const t = { 
            firstName: agentFirstName.value, 
            lastName: agentLastName.value, 
            avatar: agentImageInput.files[0] || null, 
            zipcode: zipCode.value, 
            address1: address.value,
            phone: phone.value, 
            bio: bio.value,
            allowContactMessage: contactMessage.value, 
            city: city.value,
            state: state.value,
            fax: fax.value,
            industry: industrySpecialities.value,
            instagram: instagram.value,
            facebook: facebook.value,
            twitter: twitter.value,
            lang: language.value,
            education: education.value,
            website: website.value,
            serviceOffered: serviceOffered.value,
            taxServices: taxServices.value,
            membership: professionalMemberships.value,
        };
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
            t.set("state", e.state),
            t.set("bio",e.bio),
            t.set("address1",e.address),
            t.set("fax", e.fax),
            t.set("industry", e.industry),
            t.set("instagram", e.instagram),
            t.set("facebook", e.facebook),
            t.set("twitter", e.twitter),
            t.set("lang", e.lang),
            t.set("education", e.education),
            t.set("website", e.website),
            t.set("serviceOffered", e.serviceOffered),
            t.set("taxServices", e.taxServices),
            t.set("membership", e.membership),
            t.append("avatar", e.avatar),
            console.log(e);
            agentBtn.setAttribute("disabled", "true"),
            (agentBtn.innerHTML = agentSpinner()),
            axios({ method: "PUT", url: `/api/update-agent`, credentials: "same-origin", headers: { "CSRF-Token": getCookie("XSRF-TOKEN"), "Content-Type": "application/json", Accept: "application/json" }, data: t })
                .then((e) => {
                    console.log(e),
                        // (agentBtn.innerHTML = btnContent),
                        // clearAgentFormData(),
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
