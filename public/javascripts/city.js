const cityUrl = location.href;
const cityMatch = cityUrl.match("enrolledagent.org");
const cityBaseUrl = cityMatch ? "https://enrolledagent.org" : "http://localhost:3000";
const citySelect = document.getElementById("city-select");

citySelect && citySelect.addEventListener("change", () => {
    window.location.href =`${cityBaseUrl}/agents/${citySelect.value}`;
})
