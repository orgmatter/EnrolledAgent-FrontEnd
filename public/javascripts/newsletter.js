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

  const email1 = document.getElementById("newsletter-email");
  const email2 = document.getElementById("newsletter-email2");
  const button = document.getElementById("newsletter-join");
  const button2 = document.getElementById("newsletter-join2");
  const formmm = document.getElementById('newsletter-form');

const subscribeToNews = () => {
  formmm.addEventListener('submit', function (e) {
    e.preventDefault();
  });
  var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  let email

  if (email1 && email1.value && email1.value.match(mailformat)) email = email1.value
  if (email2 && email2.value && email2.value.match(mailformat)) email = email2.value

  const data = {
    email
  };
  //  console.log(email)
  if (!email) {
    notyfy.error('Please provide a valid email address');
    return
  }

  button.disabled = true
  button.style.background = '#4e6986'
  axios({
    method: "POST",
    url: `/api/subscribe`,
    credentials: 'same-origin', // <-- includes cookies in the request
    headers: {
      "CSRF-Token": getCookie('XSRF-TOKEN'),
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    data: JSON.stringify(data),
  })
    .then((res) => {
      console.log(res);
      notyfy.success(res.data.data.message || "Success");
      button.disabled = false
      button.style.background = '#0d6bf0'
      email.value = ''
      try {
        email1.value = ''
      } catch (error) {
        
      }
      try {
        email2.value = ''
      } catch (error) {
        
      }
    })
    .catch((err) => {
      notyfy.error(err.response.data.error.message || "Something went wrong");
      button.disabled = false
      button.style.background = '#0d6bf0'
      email.value = ''
    });
}; 

button2 && button2.addEventListener('click', subscribeToNews);
