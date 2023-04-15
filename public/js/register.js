const success = document.getElementById("success");
const error = document.getElementById("error");

form.addEventListener("submit", async () => {
  const register = {
    email: email.value,
    password: password.value,
    fullname: fullname.value,
  };
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
        success.style.display = "none";
        error.style.display = "block";
        error.innerText = data.error;
      } else {
        error.style.display = "none";
        success.style.display = "block";
        success.innerText = data.success;
      }
    })
    .catch(console.log);
});
