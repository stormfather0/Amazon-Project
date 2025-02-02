document.addEventListener('DOMContentLoaded', () => {
  // Select popup element
  const popup = document.querySelector('.login-popup');

  // If popup doesn't exist, stop execution and log a warning
  if (!popup) {
      console.warn("⚠️ Warning: .login-popup element not found. Skipping popup logic.");
      return;
  }

  // Other element selections
  const loginButton = document.querySelector('.log-in-btn');
  const accountIconButton = document.querySelector('.account-icon');
  const createAccountLink = document.querySelector('.open-signup');
  const closeButton = document.querySelector('.close-popup-btn');
  const loginForm = popup.querySelector('.login-form');
  const signupForm = popup.querySelector('.signup-form');
  const switchToSignupLink = popup.querySelector('.switch-to-signup');
  const switchToLoginLink = popup.querySelector('.switch-to-login');

  // Ensure all necessary elements exist before adding event listeners
  if (!loginButton || !accountIconButton || !createAccountLink || !closeButton || !loginForm || !signupForm || !switchToSignupLink || !switchToLoginLink) {
      console.warn("⚠️ Warning: One or more required elements for login popup are missing.");
      return;
  }

  // Event listeners for opening and closing the popup
  loginButton.addEventListener('click', () => {
      popup.classList.remove('hidden');
      loginForm.classList.remove('hidden');
      signupForm.classList.add('hidden');
  });

  accountIconButton.addEventListener('click', () => {
      popup.classList.remove('hidden');
      loginForm.classList.remove('hidden');
      signupForm.classList.add('hidden');
  });

  createAccountLink.addEventListener('click', (event) => {
      event.preventDefault();
      popup.classList.remove('hidden');
      loginForm.classList.add('hidden');
      signupForm.classList.remove('hidden');
  });

  switchToSignupLink.addEventListener('click', (event) => {
      event.preventDefault();
      loginForm.classList.add('hidden');
      signupForm.classList.remove('hidden');
  });

  switchToLoginLink.addEventListener('click', (event) => {
      event.preventDefault();
      signupForm.classList.add('hidden');
      loginForm.classList.remove('hidden');
  });

  closeButton.addEventListener('click', () => {
      popup.classList.add('hidden');
  });

  popup.addEventListener('click', (event) => {
      if (event.target === popup) {
          popup.classList.add('hidden');
      }
  });

  // Signup Form Submission
  signupForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      // Get values from the form inputs
      const firstNameField = document.querySelector('#first-name');
      const lastNameField = document.querySelector('#last-name');
      const emailField = document.querySelector('#signup-email');
      const passwordField = document.querySelector('#signup-password');

      // Check if fields exist
      if (!firstNameField || !lastNameField || !emailField || !passwordField) {
          console.error('One or more form fields are missing!');
          return;
      }

      const userData = {
          firstName: firstNameField.value,
          lastName: lastNameField.value,
          email: emailField.value,
          password: passwordField.value
      };

      try {
          const response = await fetch('https://amazon-project-sta4.onrender.com/api/register', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(userData),
          });

          const text = await response.text();
          console.log('Raw response:', text);
          const data = JSON.parse(text);

          if (response.ok) {
              alert('Account created successfully!');
              popup.classList.add('hidden');
          } else {
              alert('Error: ' + data.message);
          }
      } catch (error) {
          console.error('Error creating account:', error);
          alert('An error occurred. Please try again.');
      }
  });
});