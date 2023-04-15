const hospitalNameInput = document.getElementById("hospitalName");
const hospitalNameError = document.getElementById("hospitalNameError");

const locationInput = document.getElementById("location");
const locationError = document.getElementById("locationError");

const contactNumberInput = document.getElementById("contactNumber");
const contactNumberError = document.getElementById("contactNumberError");

const emailInput = document.getElementById("email");
const emailError = document.getElementById("emailError");

const numDoctorsInput = document.getElementById("numDoctors");
const numDoctorsError = document.getElementById("numDoctorsError");

hospitalNameInput.addEventListener("input", function () {
  if (hospitalNameInput.validity.valid) {
    hospitalNameError.textContent = "";
  } else {
    hospitalNameError.textContent = "Please enter alphabetic characters only";
  }
});

locationInput.addEventListener("input", function () {
  if (locationInput.validity.valid) {
    locationError.textContent = "";
  } else {
    locationError.textContent = "Please enter alphabetic characters only";
  }
});

contactNumberInput.addEventListener("input", function () {
  if (contactNumberInput.validity.valid) {
    contactNumberError.textContent = "";
  } else {
    contactNumberError.textContent =
      "Please enter a valid 10-digit phone number";
  }
});

numDoctorsInput.addEventListener("input", function () {
  if (numDoctorsInput.validity.valid) {
    numDoctorsError.textContent = "";
  } else {
    numDoctorsError.textContent =
      "Please enter a valid number of doctors (greater than 0)";
  }
});

