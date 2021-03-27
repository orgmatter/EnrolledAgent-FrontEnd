const toggleBtn = document.getElementById("dropdownMenuButton"),
    listingForm = document.getElementById("listing-form") || null,
    select = document.getElementById("select") || null,
    zipInput = document.getElementById("zipInput") || null,
    nameInput = document.getElementById("name") || null,
    submitBtn = document.getElementById("submit-btn");
var res = !0;
select && select.addEventListener("change", () => {
    "state" === select.value ? (zipInput.placeholder = "Enter state*") : (zipInput.placeholder = "Enter zip code*");
});
const handleSubmit = (e) => {
    e.preventDefault();
    const t = zipInput.value,
        n = nameInput.value;
    window.location.href = res ? `/search-results?q=zipcode:${t},lastName:${n}` : `${baseUrl}/search-results?q=state:${t},lastName:${n}`;
};
listingForm && listingForm.addEventListener("submit", handleSubmit);
