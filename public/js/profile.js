
const save = document.getElementById("save");
const fullname = document.getElementById("fullname");
const email = document.getElementById("email");
const password = document.getElementById("password");
const gender = document.getElementById("gender");
const age = document.getElementById("age");
const id = document.getElementById("_id");
const address = document.getElementById("address")
const phone_num_1 = document.getElementById("phone_num_1");
const phone_num_2 = document.getElementById("phone_num_2");

function ValidateEmail(m) {
  const a = /^w+([.-]?w+)*@w+([.-]?w+)*(.w{2,3})+$/;
  if (a.test(m)) {
    return true;
  }

  return false;
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

function isAlphaSpace(str) {
  return /^[A-Za-z\s]*$/.test(str);
}
function containsOnlyNumbers(str) {
  return /^\d+$/.test(str);
}

function genderValidate(gen) {
  if (gen == "Male" || gen == "male" || gen == "M") {
    return "Male";
  }
  if (gen == "Female" || gen == "female" || gen == "F") {
    return "Female";
  }
  if (gen == "Others" || gen == "other" || gen== "O") {
    return "Others";
  }
  return "nothing";
}



save.addEventListener("click", async () => {
  console.log("💥💥💥💥💥💥 address",address.value);
  let register = {};
  if (fullname.value != "" && isAlphaSpace(fullname.value)) {
    register.fullname = fullname.value;
  }
  if (email.value != "") {
    register.email = email.value;
  }
  if (age.value != "") {
    if (containsOnlyNumbers(age.value)) {
      const a = Number(age.value);
      if (a > 0) {
        register.age = a;
      }
    }
  }

  if (gender.value != "") {
    const gen = genderValidate(gender.value);
    console.log("gender", gen)
    if (gen !== "nothing") {
      register.gender = gen;
    }
  }

  if(address.value != ""){
    register.address = address.value;
  }
  console.log(password.value)

  if (password.value !== "" && password.value.length >= 8) {
    register.password = password.value;
    register.confirm_password = password.value;
  }
  else{

  }

  if(phone_num_1.value !== "" &&  ValidatePhoneNumber(phone_num_1.value)){
    register.phone_num_1 = phone_num_1.value;

  }

  if(phone_num_2.value !== "" &&  ValidatePhoneNumber(phone_num_2.value)){
    register.phone_num_2 = phone_num_2.value;

  }

  // register._id = id.value;



  console.log(register);

  await fetch("/api/update_user",{
    method:"PATCH",
    body: JSON.stringify(register),
    headers:{
      "Content-Type": "application/json",
    }
  }).then(async (res) => await res.json())
  .then((data) => {
    setTimeout(() => {
      window.location.replace("/");
    }, 300);
  }).catch(console.log);
});
