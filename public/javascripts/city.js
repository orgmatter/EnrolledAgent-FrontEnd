const citySelect = document.getElementById("city-select");

citySelect && citySelect.addEventListener("change", () => {
    window.location.href =`/agents/${citySelect.value}`;
})
