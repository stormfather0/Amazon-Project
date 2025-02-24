document.addEventListener('DOMContentLoaded', () => {
    const popup = document.querySelector('.login-popup');
    const loginButton = document.querySelector('.log-in-btn');
    const accountIconButton = document.querySelector('.account-icon');
    const createAccountLink = document.querySelector('.open-signup');
    const closeButton = document.querySelector('.close-popup-btn');
    const loginForm = popup?.querySelector('.login-form');
    const signupForm = popup?.querySelector('.signup-form');
    const switchToSignupLink = popup?.querySelector('.switch-to-signup');
    const switchToLoginLink = popup?.querySelector('.switch-to-login');
    const userInfoContainer = document.querySelector('.userInfo');
    const loginContainer = document.querySelector('.log-in-container');
    const userEmail = document.querySelector('#userEmail');
    const logoutButton = document.querySelector('.logout-btn');

    // Ensure essential elements exist
    if (!popup || !userInfoContainer || !loginContainer || !userEmail) {
        console.error('⚠️ Missing UI elements for login system.');
        return;
    }

    // Function to update UI after login
    function updateUIAfterLogin(email) {
        console.log('✅ Updating UI for user:', email);
        userInfoContainer.classList.add('show');
        userEmail.textContent = email;
        loginContainer.classList.add('hidden');  // Hide login container after login
    }

    // Check if user is already logged in
    const savedEmail = localStorage.getItem('userEmail');
    if (savedEmail) {
        updateUIAfterLogin(savedEmail);
    }

    // Handle logout
    logoutButton?.addEventListener('click', () => {
        console.log('🚪 Logging out...');
        localStorage.removeItem('authToken');
        localStorage.removeItem('userEmail');

        // Reset UI
        loginContainer.classList.remove('hidden'); // Show login container after logout
        userInfoContainer.classList.remove('show'); // Hide user info container
        userEmail.textContent = '';  // Clear email text

        // Optionally, you can show a success message, but you mentioned removing alerts
    });

    // Function to handle login popup visibility
    function openLoginPopup() {
        popup.classList.remove('hidden');
        loginForm.classList.remove('hidden');
        signupForm.classList.add('hidden');
    }

    // Event listeners for opening login popup
    loginButton?.addEventListener('click', openLoginPopup);
    accountIconButton?.addEventListener('click', openLoginPopup);

    // Event listeners for switching between login/signup
    createAccountLink?.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.classList.add('hidden');
        signupForm.classList.remove('hidden');
    });

    switchToSignupLink?.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.classList.add('hidden');
        signupForm.classList.remove('hidden');
    });

    switchToLoginLink?.addEventListener('click', (e) => {
        e.preventDefault();
        signupForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
    });

    // Close popup when clicking outside
    popup?.addEventListener('click', (event) => {
        if (event.target === popup) {
            popup.classList.add('hidden');
        }
    });

    closeButton?.addEventListener('click', () => {
        popup.classList.add('hidden');
    });

    // Handle login form submission
    loginForm?.addEventListener('submit', async (event) => {
        event.preventDefault();

        const emailField = document.querySelector('#login-email');
        const passwordField = document.querySelector('#login-password');

        if (!emailField || !passwordField) {
            console.error('⚠️ Missing login fields.');
            return;
        }

        const loginData = {
            email: emailField.value.trim(),
            password: passwordField.value.trim(),
        };

        try {
            const response = await fetch('https://amazon-project-sta4.onrender.com/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData),
            });

            const text = await response.text();
            console.log('📩 Raw response:', text);
            const data = JSON.parse(text);

            if (response.ok) {
                const { email, token } = data;
                console.log('🎉 Login successful:', email);
                // Store login data
                localStorage.setItem('authToken', token);
                localStorage.setItem('userEmail', email);

                // Update UI
                updateUIAfterLogin(email);

                // Hide login popup
                popup.classList.add('hidden');
            } else {
                console.error('❌ Login failed: ' + (data.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('❌ Error logging in:', error);
            alert('An error occurred. Please try again.');
        }
    });

    // Handle signup form submission
    signupForm?.addEventListener('submit', async (event) => {
        event.preventDefault();

        const firstNameField = document.querySelector('#first-name');
        const lastNameField = document.querySelector('#last-name');
        const emailField = document.querySelector('#signup-email');
        const passwordField = document.querySelector('#signup-password');

        if (!firstNameField || !lastNameField || !emailField || !passwordField) {
            console.error('⚠️ Missing signup fields.');
            return;
        }

        const userData = {
            firstName: firstNameField.value.trim(),
            lastName: lastNameField.value.trim(),
            email: emailField.value.trim(),
            password: passwordField.value.trim(),
        };

        try {
            const response = await fetch('https://amazon-project-sta4.onrender.com/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });

            const text = await response.text();
            console.log('📩 Raw response:', text);
            const data = JSON.parse(text);

            if (response.ok) {
                alert('🎉 Account created successfully!');
                popup.classList.add('hidden');
            } else {
                alert('❌ Signup failed: ' + (data.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('❌ Error signing up:', error);
            alert('An error occurred. Please try again.');
        }
    });
});