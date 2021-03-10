const answerForm = document.getElementById("article-form"),
    heading = document.getElementById("heading"),
    category = document.getElementById("articleCategory"),
    image = document.getElementById("image"),
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
            n = { title: heading.value, body: t, category: category.value, avatar: image.files[0] };
        Math.round(image.files[0].size / 1024) > 1024 ? notyf.error("File size too large") : getFormData(n);
    },
    getFormData = (e) => {
        const t = new FormData();
        t.set("title", e.title),
            t.set("body", e.body),
            t.set("category", e.category),
            t.append("avatar", e.avatar),
            console.log(e),
            btn.setAttribute("disabled", "true"),
            (btn.innerHTML = spinner()),
            axios({ method: "POST", url: `/api/article`, credentials: "same-origin", headers: { "CSRF-Token": getCookie("XSRF-TOKEN"), "Content-Type": "application/json", Accept: "application/json" }, data: t })
                .then((e) => {
                    console.log(e), (btn.innerHTML = btnContent), clearFormData(), btn.removeAttribute("disabled"), notyf.success(e.data.message || "Article Upload Successful!");
                })
                .catch((e) => {
                    console.log(e.response), (btn.innerHTML = btnContent), btn.removeAttribute("disabled"), notyf.error(e.response.data.error.message || "Something went wrong");
                });
    };
answerForm.addEventListener("submit", handleSubmit);
