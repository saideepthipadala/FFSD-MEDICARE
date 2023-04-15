const success = document.getElementById("success");
const error = document.getElementById("error");
const section_how = document.getElementsByClassName("section-how");

form.addEventListener("submit", async () => {
  console.log("something");
  const login = {
    email: email.value,
    password: password.value,
  };
  await fetch("/api/login", {
    method: "POST",
    body: JSON.stringify(login),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(async (res) => await res.json())
    .then((data) => {
      console.log(data);
      if (data.status == "error") {
        success.style.display = "none";
        error.style.display = "block";
        error.innerText = data.error;
      } else {
        error.style.display = "none";
        success.style.display = "block";
        success.innerText = data.success;
        section_how.style = "block";
      }
    })
    .catch(console.log);
});
