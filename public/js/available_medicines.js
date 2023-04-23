
const searchInput = document.getElementById("search");
const cards = document.querySelectorAll(".card-medicines");

searchInput.addEventListener("input", function () {
  const keyword = this.value.toLowerCase().trim();

  cards.forEach((card) => {
    const name = card
      .querySelector(".medicine-name h1")
      .textContent.toLowerCase();

    if (name.includes(keyword)) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
});
