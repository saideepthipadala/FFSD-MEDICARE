const success = document.getElementById("success");
const error = document.getElementById("error");
const section_how = document.getElementsByClassName("section-how");

form.addEventListener("submit", async () => {
    const login = {
        email: email.value,
        password: password.value,
    };
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/login", true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                const data = JSON.parse(xhr.responseText);
                if (data.status === "error") {
                    success.style.display = "none";
                    error.style.display = "block";
                    error.innerText = data.error;
                } else {
                    error.style.display = "none";
                    success.style.display = "block";
                    success.innerText = data.success;
                    section_how.style = "block";
                    localStorage.setItem("session", JSON.stringify(data));

                    setTimeout(() => {
                        window.location.replace("/");
                    }, 300);
                }
            } else {
                console.error("Request failed with status:", xhr.status);
            }
        }
    };

    const loginData = JSON.stringify(login);
    xhr.send(loginData);

    // await fetch("/api/login", {
    //     method: "POST",
    //     body: JSON.stringify(login),
    //     headers: {
    //         "Content-Type": "application/json",
    //     },
    // })
    //     .then(async (res) => await res.json())
    //     .then((data) => {
    //         //  console.log(data);
    //         if (data.status === "error") {
    //             success.style.display = "none";
    //             error.style.display = "block";
    //             error.innerText = data.error;
    //         } else {
    //             error.style.display = "none";
    //             success.style.display = "block";
    //             success.innerText = data.success;
    //             section_how.style = "block";
    //             localStorage.setItem("session", JSON.stringify(data));

    //             setTimeout(() => {
    //                 window.location.replace("/");
    //             }, 300);
    //         }
    //     })
    //     .catch(console.log);
});
