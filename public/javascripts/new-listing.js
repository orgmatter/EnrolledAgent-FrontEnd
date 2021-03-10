const listingForm = document.getElementById("listing-form"),
    firstName = document.getElementById("first-name"),
    middleName = document.getElementById("last-name"),
    lastName = document.getElementById("last-name"),
    email = document.getElementById("email"),
    phone = document.getElementById("phone"),
    fax = document.getElementById("fax"),
    country = document.getElementById("country"),
    address = document.getElementById("address"),
    address2 = document.getElementById("address2"),
    city = document.getElementById("city"),
    zipCode = document.getElementById("zipCode"),
    state = document.getElementById("state"),
    title = document.getElementById("title"),
    position = document.getElementById("position"),
    website = document.getElementById("website"),
    bio = document.getElementById("bio"),
    language = document.getElementById("language"),
    service = document.getElementById("service"),
    stateLicensed = document.getElementById("state-licensed"),
    licenseNo = document.getElementById("license-no"),
    myFile = document.getElementById("myFile"),
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
    listingForm.reset();
}
const handleSubmit = (e) => {
        e.preventDefault(), e.stopPropagation();
        const t = {
            firstName: firstName.value,
            lastName: lastName.value,
            email: email.value,
            phone: phone.value,
            fax: fax.value,
            city: city.value,
            state: state.value,
            country: country.value,
            zipcode: zipCode.value,
            address1: address.value,
            address2: address2.value,
            title: title.value,
            website: website.value,
            bio: bio.value,
            lang: language.value,
            stateLicenced: stateLicensed.value,
            licence: licenseNo.value,
            licenceProof: myFile.files[0],
            position: position.value,
        };
        Math.round(myFile.files[0].size / 1024) > 1024 ? notyf.error("File size too large") : getFormData(t);
    },
    getFormData = (e) => {
        const t = new FormData();
        t.set("firstName", e.firstName),
            t.set("lastName", e.lastName),
            t.set("email", e.email),
            t.set("phone", e.phone),
            t.set("fax", e.fax),
            t.set("city", e.city),
            t.set("state", e.state),
            t.set("country", e.country),
            t.set("zipcode", e.zipcode),
            t.set("address1", e.address1),
            t.set("address2", e.address2),
            t.set("title", e.title),
            t.set("website", e.website),
            t.set("bio", e.bio),
            t.set("lang", e.lang),
            t.set("licence", e.licence),
            t.set("position", e.position),
            t.set("stateLicenced", e.stateLicenced),
            t.set("phone", e.phone),
            t.append("doc", e.licenceProof),
            console.log(e),
            btn.setAttribute("disabled", "true"),
            (btn.innerHTML = spinner()),
            axios({ method: "POST", url: `/api/listing-request`, credentials: "same-origin", headers: { "CSRF-Token": getCookie("XSRF-TOKEN"), "Content-Type": "application/json", Accept: "application/json" }, data: t })
                .then((e) => {
                    console.log(e), (btn.innerHTML = btnContent), clearFormData(), notyf.success(e.data.data.message || "Message sent!"), btn.removeAttribute("disabled");
                })
                .catch((e) => {
                    console.log(e.response), (btn.innerHTML = btnContent), btn.removeAttribute("disabled"), notyf.error(e.response.data.error.message || "Something went wrong");
                });
    };
listingForm.addEventListener("submit", handleSubmit);
