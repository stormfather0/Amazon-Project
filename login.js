document.addEventListener('DOMContentLoaded', () => {
    // Pop-up and form logic
    const loginButton = document.querySelector('.log-in-btn');
    const accountIconButton = document.querySelector('.account-icon');
    const createAccountLink = document.querySelector('.open-signup');
    const popup = document.querySelector('.login-popup');
    const closeButton = document.querySelector('.close-popup-btn');
    const loginForm = popup.querySelector('.login-form');
    const signupForm = popup.querySelector('.signup-form');
    const switchToSignupLink = popup.querySelector('.switch-to-signup');
    const switchToLoginLink = popup.querySelector('.switch-to-login');
    
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
  
    signupForm.addEventListener('submit', async (event) => {
      event.preventDefault(); // Prevent default form submission
  
      // Get values from the form inputs
      const firstNameField = document.querySelector('#first-name');
      const lastNameField = document.querySelector('#last-name');
      const emailField = document.querySelector('#signup-email');
      const passwordField = document.querySelector('#signup-password');
  
      // Log the fields to ensure they are correctly selected
      console.log(firstNameField, lastNameField, emailField, passwordField);
  
      // Check if any fields are missing
      if (!firstNameField || !lastNameField || !emailField || !passwordField) {
        console.error('One or more form fields are missing!');
        return; // Exit if any field is missing
      }
  
      const firstName = firstNameField.value;
      const lastName = lastNameField.value;
      const email = emailField.value;
      const password = passwordField.value;
  
      // Create a user object
      const userData = {
        firstName,
        lastName,
        email,
        password
      };
  
      try {
        // Send a POST request to the backend to create the account
        const response = await fetch('https://amazon-project-sta4.onrender.com//api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });
  
        // Log the response text to check for empty or unexpected responses
        const text = await response.text();
        console.log('Raw response:', text); // Check raw response text
        const data = JSON.parse(text); // Parse it only if it's not empty
  
        if (response.ok) {
          alert('Account created successfully!');
          popup.classList.add('hidden');
        //   signupForm.reset(); // Clear form fields
        } else {
          alert('Error: ' + data.message);
        }
      } catch (error) {
        console.error('Error creating account:', error);
        alert('An error occurred. Please try again.');
      }
    });
  });