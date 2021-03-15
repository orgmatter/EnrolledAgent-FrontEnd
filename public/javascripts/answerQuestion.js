const answerForm = document.getElementById("answer-form"),
    id = document.querySelector('meta[name="agentId"]').getAttribute("content"),
    message = document.getElementById("mytextarea"),
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
function getCookie(e) {
    const t = `; ${document.cookie}`.split(`; ${e}=`);
    if (2 === t.length) return t.pop().split(";").shift();
}
function spinner() {
    return '<div class="lds-ring"><div></div><div></div><div></div><div></div></div>';
}
function clearFormData() {
    answerForm.reset();
}
const handleSubmit = (e) => {
    e.preventDefault();
    const t = tinyMCE.activeEditor.getContent(),
        n = { question: id, message: t };
    console.log(n),
        btn.setAttribute("disabled", "true"),
        (btn.innerHTML = spinner()),
        console.log("here"),
        axios({ method: "POST", url: `/api/answer`, credentials: "same-origin", headers: { "CSRF-Token": getCookie("XSRF-TOKEN"), "Content-Type": "application/json", Accept: "application/json" }, data: JSON.stringify(n) })
            .then((e) => {
                console.log(e), console.log("here2"), (btn.innerHTML = btnContent), clearFormData(), btn.removeAttribute("disabled"), notyf.success(e.data.message || "Answer sent successfully!");
            })
            .catch((e) => {
                console.log(e.response), console.log("here instead"), (btn.innerHTML = btnContent), btn.removeAttribute("disabled"), notyf.error(e.response.data.error.message || "Something went wrong");
            });
};
answerForm.addEventListener("submit", handleSubmit);
