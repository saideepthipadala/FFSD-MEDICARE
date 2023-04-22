const searchInput = document.getElementById("searchInput");
const hospitalCards = document.querySelectorAll(".card");

searchInput.addEventListener("keyup", (event) => {
  const searchTerm = event.target.value.toLowerCase();

  hospitalCards.forEach((card) => {
    const hospitalName = card
      .querySelector(".hospital-name")
      .textContent.toLowerCase();

    if (hospitalName.includes(searchTerm)) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
});
