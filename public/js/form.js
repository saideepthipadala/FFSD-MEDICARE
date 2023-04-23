var QueryString = location.search.substring(1)
var A = QueryString.split("=");
var DocName = A[1].split('|')[0];

const heading = document.getElementById("Heading");
heading.textContent = DocName + "'s Consultation Form";


const form = document.querySelector('form');
const ageInput = document.querySelector('#age');
const dateInput = document.querySelector('#date');
const timeInput = document.querySelector('#time');
const error = document.querySelector('.error');
const Name = document.querySelector("#pname");
const patientproblem = document.querySelector('textarea');
const nameregx = /^[a-z]+$/i;

const nameerr = document.querySelector('#name-error');
const problemerr = document.querySelector("#problem-error");

function validatename() {
  if (!(nameregx.test(Name.value))) {
    nameerr.style.display = 'block';
    nameerr.textContent = "Name Should only contain alphabets";
    return false;
  }
  else {
    nameerr.textContent = "";
    nameerr.style.display = 'none';
    return true;
  }
}


function validateproblem() {
  if (!(nameregx.test(patientproblem.value))) {
    problemerr.style.display = 'block';
    problemerr.innerText = "This Field Should only contain alphabets";
    return false;
  }
  else {
    problemerr.innerText = "";
    problemerr.style.display = 'none';
    return true;
  }

}

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
  if ((validateDate() && validatename() && validateproblem())) {
    console.log("form submitted");
    return true;
  }
  else {
    e.preventDefault();
    return false;
  }
})




