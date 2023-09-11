
const form = document.querySelector('form');
const ageInput = document.querySelector('#age');
const dateInput = document.querySelector('#date');
const timeInput = document.querySelector('#time');
const error = document.querySelector('.error');
const Name = document.querySelector("#pname");
const patientproblem = document.querySelector('textarea');
const nameregx = /^[a-z\s]+$/i;

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

const elem = document.querySelector(".rectangle");
let id = null;
let posLeft = 90; 
let direction = 1;
const buttonWidth = 200; 
const submitBtn = document.getElementById("submit-btn");

function frame() {
  if (posLeft >= 90 + buttonWidth) { 
    direction = -1;
  } else if (posLeft <= 90) {
    direction = 1;
  }

  posLeft += direction;

  elem.style.left = posLeft + "px";
}

function startAnimation() {
  clearInterval(id);
  posLeft = 90;
  direction = 1;
  id = setInterval(frame, 5);
}

function stopAnimation() {
  clearInterval(id);
  elem.style.display = "none";
}

submitBtn.addEventListener('mouseover', () => {
  elem.style.display = "block";
  startAnimation();
});

submitBtn.addEventListener('mouseout', () => {
  stopAnimation();
});



form.addEventListener('submit', (e) => {
  if ((validateDate() && validatename() && validateproblem())) {
    return true;
  }
  else {
    e.preventDefault();
    return false;
  }
})




