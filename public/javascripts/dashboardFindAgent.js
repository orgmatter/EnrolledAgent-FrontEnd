const toggleBtn = document.getElementById("dropdownMenuButton"),
    listingForm = document.getElementById("listing-form"),
    select = document.getElementById("select"),
    zipInput = document.getElementById("zipInput"),
    nameInput = document.getElementById("name"),
    submitBtn = document.getElementById("submit-btn");
var res = !0;
select.addEventListener("change", () => {
    "state" === select.value ? (zipInput.placeholder = "Enter state*") : (zipInput.placeholder = "Enter zip code*");
});
const handleSubmit = (e) => {
    e.preventDefault();
    const t = zipInput.value,
        n = nameInput.value;
    window.location.href = res ? `/search-results?q=zipcode:${t},lastName:${n}` : `${baseUrl}/search-results?q=state:${t},lastName:${n}`;
};
listingForm.addEventListener("submit", handleSubmit);
