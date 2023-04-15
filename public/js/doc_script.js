class Doctor {
  constructor(
    Name,
    Gender,
    Specialization,
    Experience,
    Qualification,
    Availability,
    Timings,
    image,
    DocId
  ) {
    this.Name = Name;
    this.Gender = Gender;
    this.Specialization = Specialization;
    this.Experience = Experience;
    this.Qualification = Qualification;
    this.Availability = Availability;
    this.Timings = Timings;
    this.image = image;
    this.DocId = DocId;
  }
}

const doctors = [
  new Doctor(
    "Dr.Chand",
    "Male",
    "Cardiologist",
    10,
    "MBBS, PhD",
    true,
    "Monday-Friday 9am-5pm",
    "./images/img_avatar.png",
    1
  ),
  new Doctor(
    "Dr.Monica",
    "Female",
    "Pediatrician",
    5,
    "FRCS",
    false,
    "Monday-Friday 9am-5pm",
    "./images/img_avatar.png",
    2
  ),
  new Doctor(
    "Dr.Brad",
    "Male",
    "Neurologist",
    15,
    "MD, PhD",
    true,
    "Monday-Friday 9am-5pm",
    "./images/img_avatar.png",
    3
  ),
  new Doctor(
    "Dr.Chand",
    "Male",
    "Cardiologist",
    10,
    "MBBS, PhD",
    true,
    "Monday-Friday 9am-5pm",
    "./images/img_avatar.png",
    4
  ),
  new Doctor(
    "Dr.Monica",
    "Female",
    "Pediatrician",
    5,
    "FRCS",
    false,
    "Monday-Friday 9am-5pm",
    "./images/img_avatar.png",
    5
  ),
  new Doctor(
    "Dr.Brad",
    "Male",
    "Neurologist",
    15,
    "MD, PhD",
    true,
    "Monday-Friday 9am-5pm",
    "./images/img_avatar.png",
    6
  ),
];

function generateDoctorHTML(doctor) {
  const container = document.createElement("div");
  container.classList.add("doctor-container");
  const image = document.createElement("img");
  image.src = doctor.image;
  8;
  container.appendChild(image);

  const nameElement = document.createElement("h2");
  nameElement.textContent = doctor.Name;

  const genderElement = document.createElement("p");
  genderElement.textContent = `Gender: ${doctor.Gender}`;

  const specializationElement = document.createElement("p");
  specializationElement.textContent = `Specialization: ${doctor.Specialization}`;

  const experienceElement = document.createElement("p");
  experienceElement.textContent = `Experience: ${doctor.Experience} years`;
  const qualificationElement = document.createElement("p");

  qualificationElement.textContent = `Qualification: ${doctor.Qualification}`;
  const availabilityElement = document.createElement("p");

  if (doctor.Availability === true) {
    availabilityElement.textContent = "Availability:online";
  } else {
    availabilityElement.textContent = "Availability:offline";
  }

  const timingElement = document.createElement("p");
  timingElement.textContent = `Timings: ${doctor.Timings.toString()}`;

  const consultButton = document.createElement("a");
  consultButton.textContent = "Consult";
  consultButton.setAttribute("href", "./form?" + doctor.Name);
  consultButton.classList.add("consultButton");
  container.appendChild(nameElement);
  container.appendChild(genderElement);
  container.appendChild(specializationElement);
  container.appendChild(experienceElement);
  container.appendChild(qualificationElement);
  container.appendChild(availabilityElement);
  container.appendChild(timingElement);
  container.appendChild(consultButton);

  return container;
}

function displayDoctors(doctors) {
  const container = document.querySelector("#doctors-container");

  doctors.forEach((doctor) => {
    const doctorElement = generateDoctorHTML(doctor);
    container.appendChild(doctorElement);
  });
}

displayDoctors(doctors);

const consultButtons = document.querySelectorAll(".consultButton");
