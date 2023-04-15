var QueryString = location.search.substring(1)
var A = QueryString.split("|");
var DocName = A[0];

const heading = document.getElementById("Heading");
heading.textContent = DocName + "'s Consultation Form";


const form = document.querySelector('form');
const ageInput = document.querySelector('#age');
const dateInput = document.querySelector('#date');
const timeInput = document.querySelector('#time');
const error = document.querySelector('.error');

function validateDate() {
  const now = new Date();
  const selectedDate = new Date(dateInput.value);
  selectedDate.setHours(0, 0, 0, 0);
  if (selectedDate <= now) {
    alert('Appointement is approved atleast one day before the current date Please Change the data')
    return false;
  }
  else {
    return true;
  }
}


form.addEventListener('submit', (e) => {
  if (validateDate() === false) {
    e.preventDefault();
  }
})




