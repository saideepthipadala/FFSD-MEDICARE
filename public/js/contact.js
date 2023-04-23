
  function validateComment() {

    const commentField = document.getElementById('comment');


    const comment = commentField.value.trim();

    const pattern = /^[a-zA-Z0-9.,!? ]{10,}$/;

    const isValidComment = pattern.test(comment);
    if (!isValidComment) {
      alert('Please enter a comment that is at least 10 characters long and only contains letters, numbers, spaces, and the punctuation marks .,!?');
      commentField.focus();
      return false;
    }

    return true;
  }
const fname = document.getElementById("fname");
const fnameError= document.getElementById("fnameError");
const lname = document.getElementById("lname");
const lnameError = document.getElementById("lnameError");
const email = document.getElementById("email");


  fname.addEventListener("input", function () {
    if (fname.validity.valid) {
     fnameError.textContent = "";
    } else {
     fnameError.textContent =
        "Please enter alphabetic characters, spaces only.";
    }
  });

  lname.addEventListener("input", function () {
    if (lname.validity.valid) {
      lnameError.textContent = "";
    } else {
      lnameError.textContent =
        "Please enter alphabetic characters, spaces only.";
    }
  });

