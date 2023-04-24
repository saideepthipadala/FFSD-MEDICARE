
const fullname =  document.getElementById("fullname");
const email = document.getElementById("email");
const save = document.getElementById("save");
const message = document.getElementById("message");
const role =document.getElementById("role");
const save_changes = document.getElementById("save_changes");
const hidden = document.getElementById("hidden");
const user_exist = document.getElementById("user_exist");


save.addEventListener("click", async () => {
  const survey = {
    email: email.value,
    fullname: fullname.value,
  };
  await fetch("/api/up_role_1", {
    method: "POST",
    body: JSON.stringify(survey),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(async (res) => await res.json())
    .then((data) => {
      console.log(data);
      hidden.style.display = "block";
      message.setAttribute('value',data.message);
      if(data.status == "success"){
        user_exist.style.display = "block";
        console.log(data)
        role.value = data.user.role;
        user_exist.style.display = "block";

      }
    })
    .catch(console.log);
});


save_changes.addEventListener("click", async () => {
  const survey = {
    email: email.value,
    fullname: fullname.value,
    role:role.value,
  };
  console.log('role',role);
  await fetch("/api/up_role", {
    method: "POST",
    body: JSON.stringify(survey),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(async (res) => await res.json())
    .then((data) => {
      message.setAttribute('value',data.message);
      if(data.status == "success"){
    
        console.log('data : ',data)
        message.innerText = 'Role updates';
        role.value = data.new_data.role;
        setTimeout(() => {
          window.location.replace("/dashboard");
        }, 300);
    

      }
    })
    .catch(console.log);
})