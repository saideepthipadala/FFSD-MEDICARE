
const doctorsContainer = document.getElementById("doctors-container");

const doctorDetailsData = JSON.parse(document.body.getAttribute('data-doctor-details'));
const searchInput = document.getElementById("doc-search");
const filterInput = document.getElementById("docspec");
console.log(filterInput.value);

function updateSearchResults() {
    const searchValue = searchInput.value.toLowerCase();
    const searchDoc = doctorDetailsData.filter(doctor => {
        return doctor.name.toLowerCase().includes(searchValue);
    });

    doctorsContainer.innerHTML = '';

    if (searchDoc.length === 0) {
        doctorsContainer.innerHTML = '<p>No matching doctors found.</p>';
    } else {
        searchDoc.forEach(doctor => {
            const doctordiv = document.createElement("div");
            doctordiv.classList.add("doctor-container");
            doctordiv.innerHTML = `
          <img src="./images/img_avatar.png" alt="">
          <h2>${doctor.name}</h2>
          <p>Gender: ${doctor.gender}</p>
          <p>Email: ${doctor.email}</p>
          <p>Specialization: ${doctor.specialization}</p>
          <p>Qualification: ${doctor.qualification}</p>
          <div class="div" style="display: flex;">
          <a href="./form/${doctor._id}">Consult</a>
          </div>
        `;
            doctorsContainer.appendChild(doctordiv);
        });
    }
}
searchInput.addEventListener('keyup', updateSearchResults);

updateSearchResults();

function updateContent(selectedSpecialization) {
    doctorsContainer.innerHTML = '';

    const filteredDoctors = doctorDetailsData.filter(doctor => {
        return selectedSpecialization === '' || doctor.specialization === selectedSpecialization;
    });

    if (filteredDoctors.length === 0) {
        doctorsContainer.innerHTML = '<p>No doctors found for the selected specialization.</p>';
    } else {
        filteredDoctors.forEach(doctor => {
            const doctordiv = document.createElement("div");
            doctordiv.classList.add("doctor-container");
            doctordiv.innerHTML = `
          <img src="./images/img_avatar.png" alt="">
          <h2>${doctor.name}</h2>
          <p>Gender: ${doctor.gender}</p>
          <p>Email: ${doctor.email}</p>
          <p>Specialization: ${doctor.specialization}</p>
          <p>Qualification: ${doctor.qualification}</p>
          <div class="div" style="display: flex;">
            <a href="./form/${doctor._id}">Consult</a>
          </div>
        `;
            doctorsContainer.appendChild(doctordiv);
        });
    }
}

filterInput.addEventListener('change', function () {
    const selectedSpecialization = filterInput.value;
    updateContent(selectedSpecialization);
  });
  
  // Call updateContent initially to load all doctors
  updateContent('');

const form = document.querySelector('#filter-form');
const filterbtn = document.querySelector('#filter-btn');
function showfilterform() {
    if (form.classList.contains('d-hidden')) {
        form.classList.remove('d-hidden');
        form.classList.add('d-visible');
    } else {
        form.classList.remove('d-visible');
        form.classList.add('d-hidden');
    }
}
