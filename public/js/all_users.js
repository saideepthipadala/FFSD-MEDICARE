
const doctors = document.querySelector(".doctors")
const users = document.querySelector(".users")
const registrationType = document.getElementById("registrationType");

document.addEventListener("DOMContentLoaded", () => {
    
      registrationType.addEventListener("change", () => {
    
     if (registrationType.value === "all") {
        doctors.style.display = "table-row";
        users.style.display = "table-row";
     }
    
     else if (registrationType.value === "doctors") {
       
        doctors.style.display = "table-row";
        users.style.display = "none";
     }
    
     else if (registrationType.value === "users") {
        doctors.style.display = "none";
        users.style.display = "table-row";
     }
      });
    })