const navbarMenu = document.querySelector(".navbar .links");
const hamburgerBtn = document.querySelector(".hamburger-btn");
const showPopupBtn = document.querySelector(".login-btn");
const formPopup = document.querySelector(".form-popup");

if (formPopup) {
  const hidePopupBtn = formPopup.querySelector(".close-btn");
  const signupLoginLink = formPopup.querySelectorAll(".bottom-link a");

  showPopupBtn.addEventListener("click", () => {
      document.body.classList.add("show-popup");
  });

  hidePopupBtn.addEventListener("click", () => {
      document.body.classList.remove("show-popup");
  });

  signupLoginLink.forEach(link => {
      link.addEventListener("click", (e) => {
          e.preventDefault();
          formPopup.classList[link.id === 'signup-link' ? 'add' : 'remove']("show-signup");
      });
  });

  // Handle login form submission
  document.getElementById('signup-form').addEventListener('submit', async function(e) {
      e.preventDefault();
      const email = this.querySelector('input[type="text"]').value;
      const password = this.querySelector('input[type="password"]').value;
      const policy = this.querySelector('#policy').checked;
      if (!policy) {
          alert('You must agree to the Terms & Conditions.');
          return;
      }
      try {
          const res = await fetch('http://127.0.0.1:5000/register', {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({email, password})
          });
          const data = await res.json();
          alert(data.message);
      } catch (err) {
          alert('Error connecting to server.');
      }
  });
}

// ...rest of your script.js code (terms popup, job form, etc)...

// Show mobile menu
//hamburgerBtn.addEventListener("click", () => {
   // navbarMenu.classList.toggle("show-menu");
//});

// Terms & Conditions popup logic
const termsLink = document.querySelector('.policy-text .option');
const termsPopup = document.querySelector('.terms-popup');
const termsOverlay = document.querySelector('.terms-overlay');
const termsCloseBtn = document.querySelector('.terms-close-btn');
const termsOkBtn = document.querySelector('.terms-ok-btn');
const termsReadCheckbox = document.getElementById('terms-read');

if (termsLink && termsPopup && termsOverlay && termsCloseBtn && termsOkBtn && termsReadCheckbox) {
  // Show popup when link is clicked
  termsLink.addEventListener('click', function(e) {
    e.preventDefault();
    termsPopup.classList.add('show');
    termsOverlay.classList.add('show');
    termsReadCheckbox.checked = false;
    termsOkBtn.disabled = true;
  });

  // Enable OK button only if checkbox is checked
  termsReadCheckbox.addEventListener('change', function() {
    termsOkBtn.disabled = !this.checked;
  });

  // Close popup on OK or X
  function closeTermsPopup() {
    termsPopup.classList.remove('show');
    termsOverlay.classList.remove('show');
  }
  termsOkBtn.addEventListener('click', closeTermsPopup);
  termsCloseBtn.addEventListener('click', closeTermsPopup);
  termsOverlay.addEventListener('click', closeTermsPopup);
}
const jobForm = document.querySelector('.job-form');

if (jobForm) {
  jobForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    const formData = new FormData(jobForm);

    try {
      const res = await fetch('http://127.0.0.1:5000/apply', {
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        alert('Registration successful! You will shortly get a confirmation email with more details.');
        localStorage.removeItem('quickTestComplete');
        window.location.href = 'index.html';
      } else {
        alert('There was an error submitting your application. Please try again.');
      }
    } catch (err) {
      alert('Could not connect to server.');
    }
  });
}
// Enable/disable submit button based on Quick Test completion
document.addEventListener('DOMContentLoaded', function() {
  const submitBtn = document.querySelector('.apply-btn');
  const verificationStatus = document.getElementById('verification-status');
  function checkQuickTest() {
    if (localStorage.getItem('quickTestComplete') === 'true') {
      if (submitBtn) submitBtn.disabled = false;
      if (verificationStatus) {
        verificationStatus.textContent = '(Completed)';
        verificationStatus.style.color = 'green';
      }
    } else {
      if (submitBtn) submitBtn.disabled = true;
      if (verificationStatus) {
        verificationStatus.textContent = '(Required)';
        verificationStatus.style.color = 'red';
      }
    }
  }
  checkQuickTest();
  window.addEventListener('focus', checkQuickTest);
});