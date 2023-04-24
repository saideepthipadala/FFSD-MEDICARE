
const hospitals = document.querySelectorAll(".hosp");
const pharmacies = document.querySelectorAll(".pharm");
const doctors = document.querySelectorAll(".doc");
const pending = document.querySelectorAll(".pending");
const registrationType = document.getElementById("registrationType");
const statusType = document.getElementById("statusType");

// const tocheck = document.getElementById("status").value;

document.addEventListener("DOMContentLoaded", () => {

  registrationType.addEventListener("change", () => {

    if (registrationType.value === "all") {
      doctors.forEach((doctor) => {
        doctor.style.display = "table-row";
      });
      pharmacies.forEach((pharmacy) => {
        pharmacy.style.display = "table-row";
      });
      hospitals.forEach((hospital) => {
        hospital.style.display = "table-row";
      });



    }


    else if (registrationType.value === "doctors") {
      doctors.forEach((doctor) => {
        doctor.style.display = "table-row";
      });
      pharmacies.forEach((pharmacy) => {
        pharmacy.style.display = "none";
      });
      hospitals.forEach((hospital) => {
        hospital.style.display = "none";
      });
    }


    else if (registrationType.value === "hospitals") {
      doctors.forEach((doctor) => {
        doctor.style.display = "none";
      });
      pharmacies.forEach((pharmacy) => {
        pharmacy.style.display = "none";
      });
      hospitals.forEach((hospital) => {
        hospital.style.display = "table-row";
      });
    }


    else if (registrationType.value === "pharmacies") {
      doctors.forEach((doctor) => {
        doctor.style.display = "none";
      });
      pharmacies.forEach((pharmacy) => {
        pharmacy.style.display = "table-row";
      });
      hospitals.forEach((hospital) => {
        hospital.style.display = "none";
      });
    }
  });


  statusType.addEventListener('change', () => {

    if (statusType.value === "Approved") {
      keyword = "approved";

      doctors.forEach((doctor) => {

        const names = doctor.querySelectorAll("button");
        if (names[0].textContent.toLowerCase().includes(keyword)) {
          doctor.style.display = "table-row";

        }
        else {
          doctor.style.display = "none";
        }
      });

      pharmacies.forEach((pharmacy) => {
        const names = pharmacy.querySelectorAll("button");
        if (names[0].textContent.toLowerCase().includes(keyword)) {
          pharmacy.style.display = "table-row";
        } else {
          pharmacy.style.display = "none";
        }
      });


      hospitals.forEach((hospital) => {
        const names = hospital.querySelectorAll("button");
        if (names[0].textContent.toLowerCase().includes(keyword)) {
          hospital.style.display = "table-row";
        } else {
          hospital.style.display = "none";
        }
      });
    }

    else if (statusType.value === "Rejected") {
      keyword = "rejected";

      doctors.forEach((doctor) => {

        const names = doctor.querySelectorAll("button");
        if (names[1].textContent.toLowerCase().includes(keyword)) {
          doctor.style.display = "table-row";

        }
        else {
          doctor.style.display = "none";
        }
      });

      pharmacies.forEach((pharmacy) => {
        const names = pharmacy.querySelectorAll("button");
        if (names[1].textContent.toLowerCase().includes(keyword)) {
          pharmacy.style.display = "table-row";
        } else {
          pharmacy.style.display = "none";
        }
      });


      hospitals.forEach((hospital) => {
        const names = hospital.querySelectorAll("button");
        if (names[1].textContent.toLowerCase().includes(keyword)) {
          hospital.style.display = "table-row";
        } else {
          hospital.style.display = "none";
        }
      });
    }



    else if (statusType.value === "statuspending") {

      keyword0 = "approved";
      keyword1 = "rejected";


      doctors.forEach((doctor) => {

        const names = doctor.querySelectorAll("button");
        if (!(names[0].textContent.toLowerCase().includes(keyword0)) && !(names[1].textContent.toLowerCase().includes(keyword1))) {
          doctor.style.display = "table-row";
        }
        else {
          doctor.style.display = "none";
        }
      });

      pharmacies.forEach((pharmacy) => {
        const names = pharmacy.querySelectorAll("button");
        if (!(names[0].textContent.toLowerCase().includes(keyword0)) && !(names[1].textContent.toLowerCase().includes(keyword1))) {
          pharmacy.style.display = "table-row";
        } else {
          pharmacy.style.display = "none";
        }
      });


      hospitals.forEach((hospital) => {
        const names = hospital.querySelectorAll("button");
        if (!(names[0].textContent.toLowerCase().includes(keyword0)) && !(names[1].textContent.toLowerCase().includes(keyword1))) {
          hospital.style.display = "table-row";
        } else {
          hospital.style.display = "none";
        }
      });

    }

    else{
      doctors.forEach((doctor) => {
        doctor.style.display = "table-row";
      });
      pharmacies.forEach((pharmacy) => {
        pharmacy.style.display = "table-row";
      });
      hospitals.forEach((hospital) => {
        hospital.style.display = "table-row";
      });
    }

  });





});

