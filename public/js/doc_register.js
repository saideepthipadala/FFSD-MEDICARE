
const form = document.querySelector("form");
const docname = document.querySelector("#Doc_name");
const docemail = document.querySelector("#Doc_email");
const docpass = document.querySelector("#Doc_password");
const cnfpass = document.querySelector("#Cnf_password");
const docgender = document.querySelector("#Doc_gender");
const docspec = document.querySelector("#Doc_spec");
const docqual = document.querySelector("#Doc_qual");
const span = document.querySelector("#error-name");
const spanemail = document.querySelector("#error-email");
const spanpass = document.querySelector("#error-pass");
const spancnfpass = document.querySelector("#error-cnfpass");
const label = document.querySelector("label");

const nameregx = /^[a-z\s]+$/i;
const emailregx = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
const passregx = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#%&]).{8,}$/;

function validateName() {
    if (!(nameregx.test(docname.value))) {
        span.innerText = "Name Should Conatain Alphabets Only";
        // span.style.color = "red";
        span.style.fontSize = "12.5px";
        return false;
    }

    else if (docname.value.length < 3) {
        span.innerText = "Name Should Conatain Atleast 3 alphabets";
        // span.style.color = "red";
        span.style.fontSize = "12.5px";
        return false;
    }
    else {
        span.innerText = "";
        return true;
    }
}


function validateEmail() {
    if (!(emailregx.test(docemail.value))) {
        spanemail.innerText = "Invalid Email";
        // spanemail.style.color = "red";
        spanemail.style.fontSize = "12.5px";
        return false;
    }
    else {
        spanemail.innerText = '';
        return true;
    }
}

function passwordStrength() {
    if (docpass.value.length >= 8) {
        return true;
    }
    else {
        return false;
    }
}



function checkUpperCase() {
    var upperCaseLetters = /[A-Z]/g;
    if (docpass.value.match(upperCaseLetters)) {
        return true;
    }
    else {
        return false;
    }
}



function checkNumber() {
    var numbers = /[0-9]/g;
    if (docpass.value.match(numbers)) {
        return true;
    } else {
        return false;
    }
}

function checkSpecialCharacter() {
    var sp_char = /[!@#$%^&*()_+=-]/g;
    if (docpass.value.match(sp_char)) {
        return true;
    } else {
        return false;
    }
}


function validatePassword() {
    if (!passregx.test(docpass.value)) {
        spanpass.innerText = "Password should be at least 8 characters long and include at least one uppercase letter, one number, and one special character (!@#%&).";
        spanpass.style.fontSize = "9.5px";
        return false;
    } else {
        spanpass.innerText = "";
        return true;
    }
}


function validateCnfPassword() {
    if (docpass.value !== cnfpass.value) {
        spancnfpass.innerText = "Check Your Password";
        // spancnfpass.style.color = "red";
        spancnfpass.style.fontSize = "12.5px";
        return false;
    }
    else {
        spancnfpass.innerText = "";
        return true;
    }
}


form.addEventListener('submit', (e) => {
    if (validateName() && validateEmail() && validatePassword() && validateCnfPassword()) {
        return true;
    }
    else {
        e.preventDefault();
        return false;
    }
})

