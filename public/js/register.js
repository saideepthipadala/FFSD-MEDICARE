let success = document.getElementById("success");
let error = document.getElementById("error");
let fullname = document.getElementById("fullname");
let email = document.getElementById("email");
let password = document.getElementById("password");
let confirm_password = document.getElementById("confirm_password");
let submit_btn = document.getElementById("submit_btn");
let role = document.getElementById("role");
let gender = document.getElementById("gender");
let age = document.getElementById("age");
let address = document.getElementById("address");
let phone_num_1 = document.getElementById("phone_num_1");
let phone_num_2 = document.getElementById("phone_num_2");

const section_how = document.getElementsByClassName("section-how");

function ValidateEmail(mail) {
  const a = /^w+([.-]?w+)*@w+([.-]?w+)*(.w{2,3})+$/;
  if (a.test(mail)) {
    return true;
  }

  return false;
}



function isAlphaSpace(str) {
  return /^[A-Za-z\s]*$/.test(str);
}
function containsOnlyNumbers(str) {
  return /^\d+$/.test(str);
}

function ValidatePhoneNumber(phone){
  const result = containsOnlyNumbers(phone)
  if(!result){
    return false;
  }
  else{
    if(phone.length == 10){
      return true;
    }
    else{
      return false;
    }
  }
  
}

function diaplay_error_block(message) {
  success.style.display = "none";
  error.style.display = "block";
  error.innerText = message;
}

function diaplay_success_block(message) {
  error.style.display = "none";
  success.style.display = "block";
  success.innerText = message;
}

function form_validation(register) {
  let flag = true;
  if (
    register.fullname == "" ||
    register.email == "" ||
    register.password == "" ||
    register.confirm_password == "" ||
    register.gender == "" ||
    register.age == "" ||
    register.address == ""
  ) {
    diaplay_error_block("Please fill all the fields");
    flag = false;
  }

  if(register.phone_num_1 == "" && register.phone_num_2 == ""){
    diaplay_error_block("Enter atlest one contact number");
    flag = false;
  }

  if(register.phone_num_1 !== ""){
    if(!ValidatePhoneNumber(register.phone_num_1)){
      diaplay_error_block("Please enter a valid phone number");
      flag = false;

    }
  }

  if(register.phone_num_2 !== ""){
    if(!ValidatePhoneNumber(register.phone_num_2)){
      diaplay_error_block("Please enter a valid phone number");
      flag = false;

    }
  }

  // if (!ValidateEmail(register.email)) {
  //   diaplay_error_block("Please enter a valid email");
  //   flag = false;
  // }
  if (!isAlphaSpace(register.fullname)) {
    diaplay_error_block("Name should contain only letters");
    flag = false;
  }
  if (!containsOnlyNumbers(register.age)) {
    diaplay_error_block("Please enter a valid age");
    flag = false;
  } else {
    if (Number(register.age) < 0) {
      diaplay_error_block("Please enter a valid age");
      flag = false;
    }
  }
  if (register.password.length < 8) {
    diaplay_error_block("Password should have minimum 8 characters.");
    flag = false;
  }
  if (!(register.password == register.confirm_password)) {
    diaplay_error_block("Password and confirm password should be equal");
    flag = false;
  }
  return flag;
}

submit_btn.addEventListener("click", async () => {
  const register = {
    fullname: fullname.value,
    email: email.value,
    password: password.value,
    confirm_password: confirm_password.value,
    gender: gender.value,
    role: role.value,
    age: age.value,
    address:address.value,
    phone_num_1:phone_num_1.value,
    phone_num_2:phone_num_2.value,
  };
 
  if (!form_validation(register)) {
    return;
  }
  register.phone_num_1 = Number(phone_num_1.value);
  register.phone_num_2 = Number(phone_num_2.value);
  await fetch("/api/register", {
    method: "POST",
    body: JSON.stringify(register),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(async (res) => await res.json())
    .then((data) => {
      if (data.status == "error") {
        diaplay_error_block(data.error);
      } else {
        diaplay_success_block(data.success);
        section_how.style = "block";
        // localStorage.setItem("session", JSON.stringify(data));
        setTimeout(() => {
          window.location.replace("/");
        }, 300);
      }
    })
    .catch(console.log);
});
