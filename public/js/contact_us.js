const message = document.getElementById('message');
const email = document.getElementById('email');
const fullname = document.getElementById('fullname');
const save = document.getElementById('save');
const hid = document.getElementById('hid');
const confirmation = document.getElementById('confirmation');

save.addEventListener('click',async()=>{
    data = {
        fullname : fullname.value,
        email:email.value,
        message:message.value,
    }
    await fetch("/api/contact_us", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then(async (res) => await res.json())
        .then((data) => {
          if (data.status != "success") {
            hid.style.display = 'block';
            confirmation.innerText = 'error sending the message';
          } else {
        
            hid.style.display = 'block';
            confirmation.innerText = 'message send';
            
          }
        })
        .catch(console.log);
})