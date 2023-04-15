const pharmacyNameInput = document.getElementById("pharmacyName");
const pharmacyNameError = document.getElementById("pharmacyNameError");

const locationInput = document.getElementById("location");
const locationError = document.getElementById("locationError");

const contactNumberInput = document.getElementById("contactNumber");
const contactNumberError = document.getElementById("contactNumberError");

const emailInput = document.getElementById("email");
const emailError = document.getElementById("emailError");

const numEmployeesInput = document.getElementById("numEmployees");
const numEmployeesError = document.getElementById("numEmployeesError");

pharmacyNameInput.addEventListener("input", function () {
  if (pharmacyNameInput.validity.valid) {
    pharmacyNameError.textContent = "";
  } else {
    pharmacyNameError.textContent = "Please enter alphabetic characters only";
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

numEmployeesInput.addEventListener("input", function () {
  if (numEmployeesInput.validity.valid) {
    numEmployeesError.textContent = "";
  } else {
    numEmployeesError.textContent =
      "Please enter a valid number of doctors (greater than 0)";
  }
});

