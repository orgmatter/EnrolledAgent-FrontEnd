
const notyfy = new Notyf({
  dismissible: true,
  ripple: true,
  duration: 6000,
  position: {
    x: "right",
    y: "top",
  },
  types: [
    {
      className: "alert-message",
      type: "success",
    },
    {
      className: "alert-message",
      type: "error",
    },
  ],
});

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

const subscribeToNews = (e) => {
  // e.preventDefault();
const email = document.getElementById("newsletter-email");
const button = document.getElementById("newsletter-join");

  const data = {
    email: email.value,
  };
 console.log(email)
 if(!email.value) return

 button.disabled = true
 button.style.background  = '#4e6986'
 axios({
    method: "POST",
    url: `/api/subscribe`,
    credentials: 'same-origin', // <-- includes cookies in the request
        headers: {
          "CSRF-Token":  getCookie('XSRF-TOKEN'), 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
    data: JSON.stringify(data),
  })
    .then((res) => {
      console.log(res);
      notyfy.success(res.data.data.message || "Success");
      // setTimeout(() => {
      //   window.location.href = "/dashboard";
      // }, 500);
     button.disabled = false
     button.style.background  = '#0d6bf0'
     email.value = ''
    })
    .catch((err) => {
      console.log(err);
      notyfy.error(err.response.data.error.message || "Something went wrong");
     button.disabled = false
     button.style.background  = '#0d6bf0'
     email.value = ''
    });
}; 