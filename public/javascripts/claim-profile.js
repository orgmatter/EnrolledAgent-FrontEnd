const id = document.querySelector('meta[name="agentId"]').getAttribute("content"),
    claimForm = document.getElementById("claim-listing-form"),
    role = document.getElementById("role"),
    company = document.getElementById("company"),
    size = document.getElementById("size"),
    companyType = document.getElementById("type"),
    revenue = document.getElementById("revenue"),
    taxReturns = document.getElementById("tax-returns"),
    terms = document.getElementById("terms"),
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
    claimForm.reset();
}
const handleSubmit = (e) => {
    e.preventDefault(), e.stopImmediatePropagation();
    const t = { jobRole: role.value, companySize: size.value, companyName: company.value, companyRevenue: revenue.value, organizationType: companyType.value, annualTax: taxReturns.value };
    console.log(t),
        btn.setAttribute("disabled", "true"),
        (btn.innerHTML = spinner()),
        axios({
            method: "POST",
            url: `/api/claim-listing/${id}`,
            credentials: "same-origin",
            headers: { "CSRF-Token": getCookie("XSRF-TOKEN"), "Content-Type": "application/json", Accept: "application/json" },
            data: JSON.stringify(t),
        })
            .then((e) => {
                console.log(e.data.data), (btn.innerHTML = btnContent), clearFormData(), btn.removeAttribute("disabled"), notyf.success(e.data.data.data.message || "Message sent!");
            })
            .catch((e) => {
                console.log(e.response), (btn.innerHTML = btnContent), btn.removeAttribute("disabled"), notyf.error(e.response.data.error.message || "Something went wrong");
            });
};
claimForm.addEventListener("submit", handleSubmit);
