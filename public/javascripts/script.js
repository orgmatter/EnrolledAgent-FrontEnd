alert("here");
const btn = document.querySelector(".btn");
const txt = document.querySelector(".login");

btn.addEventListener("click", () => {
  txt.textContent = "Helo!";
  txt.style.fontSize = "50px";
});
