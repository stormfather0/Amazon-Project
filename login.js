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
   
    if (!popup || !userInfoContainer || !loginContainer || !userEmail) {
        console.error('⚠️ Missing UI elements for login system.');
        return;
    }

    function updateUIAfterLogin(email) {
        console.log('✅ Updating UI for user:', email);
        userInfoContainer.classList.add('show');
        userEmail.textContent = email;
        loginContainer.classList.add('hidden');  // Hide login container after login
    }

    const savedEmail = localStorage.getItem('userEmail');
    if (savedEmail) {
        updateUIAfterLogin(savedEmail);
    }

    logoutButton?.addEventListener('click', () => {
        console.log('🚪 Logging out...');
        localStorage.removeItem('authToken');
        localStorage.removeItem('userEmail');
        loginContainer.classList.remove('hidden');
        userInfoContainer.classList.remove('show');
        userEmail.textContent = '';
    });

    function isUserLoggedIn() {
        return !!localStorage.getItem('authToken');
    }

    function openLoginPopup() {
        popup.classList.remove('hidden');
        loginForm.classList.remove('hidden');
        signupForm.classList.add('hidden');
    }

    loginButton?.addEventListener('click', openLoginPopup);

    accountIconButton?.addEventListener('click', (event) => {
        if (event.target.classList.contains('account-icon-svg')) {
            if (isUserLoggedIn()) {
                window.location.href = 'account.html';
            } else {
                openLoginPopup();
            }
        }
    });

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

    popup?.addEventListener('click', (event) => {
        if (event.target === popup) {
            popup.classList.add('hidden');
        }
    });

    closeButton?.addEventListener('click', () => {
        popup.classList.add('hidden');
    });

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
            let data;
            try {
                data = JSON.parse(text);
            } catch (e) {
                console.error('Failed to parse JSON response:', e);
                alert('An error occurred. Please try again.');
                return;
            }

            if (response.ok && data.email && data.token) {
                const { email, token } = data;
                console.log('🎉 Login successful:', email);
                localStorage.setItem('authToken', token);
                localStorage.setItem('userEmail', email);

                updateUIAfterLogin(email);
                popup.classList.add('hidden');
            
            } else {
                console.error('❌ Login failed:', data.message || 'Unknown error');
                alert('Login failed. Please try again.');
            }
        } catch (error) {
            console.error('❌ Error logging in:', error);
            alert('An error occurred. Please try again.');
        }
    });

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

const userId = localStorage.getItem('userId');



document.addEventListener('DOMContentLoaded', () => {
    // Existing code for login popup and other UI logic
    
    const userId = localStorage.getItem('userId');
    if (!userId) {
        alert('You need to log in to add favourites.');
        return;  // Exit from the function
    }

    console.log('User ID:', userId);
    
    // The rest of your code remains the same
});
