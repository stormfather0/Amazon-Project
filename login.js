// document.addEventListener('DOMContentLoaded', () => {
//     const popup = document.querySelector('.login-popup');
//     const loginButton = document.querySelector('.log-in-btn');
//     const accountIconButton = document.querySelector('.account-icon');
//     const createAccountLink = document.querySelector('.open-signup');
//     const closeButton = document.querySelector('.close-popup-btn');
//     const loginForm = popup?.querySelector('.login-form');
//     const signupForm = popup?.querySelector('.signup-form');
//     const switchToSignupLink = popup?.querySelector('.switch-to-signup');
//     const switchToLoginLink = popup?.querySelector('.switch-to-login');
//     const userInfoContainer = document.querySelector('.userInfo');
//     const loginContainer = document.querySelector('.log-in-container');
//     const userEmail = document.querySelector('#userEmail');
//     const logoutButton = document.querySelector('.logout-btn');
   
//     if (!popup || !userInfoContainer || !loginContainer || !userEmail) {
//         console.error('⚠️ Missing UI elements for login system.');
//         return;
//     }

//     const authToken = localStorage.getItem('authToken');
  



//     function updateUIAfterLogin(email) {
//         console.log('✅ Updating UI for user:', email);
//         userInfoContainer.classList.add('show');
//         userEmail.textContent = email;
//         loginContainer.classList.add('hidden');  // Hide login container after login
//     }

//     const savedEmail = localStorage.getItem('userEmail');
//     if (savedEmail) {
//         updateUIAfterLogin(savedEmail);
//     }

//     logoutButton?.addEventListener('click', () => {
//         console.log('🚪 Logging out...');
//         localStorage.removeItem('authToken');
//         localStorage.removeItem('userEmail');
//         loginContainer.classList.remove('hidden');
//         userInfoContainer.classList.remove('show');
//         userEmail.textContent = '';
//     });

//     function isUserLoggedIn() {
//         return !!localStorage.getItem('authToken');
//     }

//      function openLoginPopup() {
//         popup.classList.remove('hidden');
//         loginForm.classList.remove('hidden');
//         signupForm.classList.add('hidden');
//     }

//     loginButton?.addEventListener('click', openLoginPopup);

//     accountIconButton?.addEventListener('click', (event) => {
//         if (event.target.classList.contains('account-icon-svg')) {
//             if (isUserLoggedIn()) {
//                 window.location.href = 'account.html';
//             } else {
//                 openLoginPopup();
//             }
//         }
//     });

//     createAccountLink?.addEventListener('click', (e) => {
//         e.preventDefault();
//         loginForm.classList.add('hidden');
//         signupForm.classList.remove('hidden');
//     });

//     switchToSignupLink?.addEventListener('click', (e) => {
//         e.preventDefault();
//         loginForm.classList.add('hidden');
//         signupForm.classList.remove('hidden');
//     });

//     switchToLoginLink?.addEventListener('click', (e) => {
//         e.preventDefault();
//         signupForm.classList.add('hidden');
//         loginForm.classList.remove('hidden');
//     });

//     popup?.addEventListener('click', (event) => {
//         if (event.target === popup) {
//             popup.classList.add('hidden');
//         }
//     });

//     closeButton?.addEventListener('click', () => {
//         popup.classList.add('hidden');
//     });

//     loginForm?.addEventListener('submit', async (event) => {
//         event.preventDefault();

//         const emailField = document.querySelector('#login-email');
//         const passwordField = document.querySelector('#login-password');

//         if (!emailField || !passwordField) {
//             console.error('⚠️ Missing login fields.');
//             return;
//         }

//         const loginData = {
//             email: emailField.value.trim(),
//             password: passwordField.value.trim(),
//         };

//         try {
//             const response = await fetch('https://amazon-project-sta4.onrender.com/api/login', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(loginData),
//             });

//             const text = await response.text();
//             let data;
//             try {
//                 data = JSON.parse(text);
//             } catch (e) {
//                 console.error('Failed to parse JSON response:', e);
//                 alert('An error occurred. Please try again.');
//                 return;
//             }

//             if (response.ok && data.email && data.token) {
//                 const { email, token } = data;
//                 console.log('🎉 Login successful:', email);
//                 localStorage.setItem('authToken', token);
//                 localStorage.setItem('userEmail', email);

//                 updateUIAfterLogin(email);
//                 popup.classList.add('hidden');
//                 window.location.reload();
            
//             } else {
//                 console.error('❌ Login failed:', data.message || 'Unknown error');
//                 alert('Login failed. Please try again.');
//             }
//         } catch (error) {
//             console.error('❌ Error logging in:', error);
//             alert('An error occurred. Please try again.');
//         }
//     });

//     signupForm?.addEventListener('submit', async (event) => {
//         event.preventDefault();
    
//         const firstNameField = document.querySelector('#first-name');
//         const lastNameField = document.querySelector('#last-name');
//         const emailField = document.querySelector('#signup-email');
//         const passwordField = document.querySelector('#signup-password');
    
//         if (!firstNameField || !lastNameField || !emailField || !passwordField) {
//             console.error('⚠️ Missing signup fields.');
//             return;
//         }
    
//         const userData = {
//             firstName: firstNameField.value.trim(),
//             lastName: lastNameField.value.trim(),
//             email: emailField.value.trim(),
//             password: passwordField.value.trim(),
//         };
    
//         try {
//             const response = await fetch('https://amazon-project-sta4.onrender.com/api/register', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(userData),
//             });
    
//             const text = await response.text();
//             console.log('📩 Raw response:', text);
//             let data;
//             try {
//                 data = JSON.parse(text);
//             } catch (e) {
//                 console.error('❌ JSON Parse Error:', text);
//                 alert('Server error. Please try again.');
//                 return;
//             }
    
//             if (response.ok && data.userId) {
//                 console.log('🎉 Signup successful:', data.userId);
//                 localStorage.setItem('userId', data.userId); // Store user ID
//                 alert('🎉 Account created successfully! You can now log in.');
//                 popup.classList.add('hidden');
//             } else if (data.message === "User already exists") {
//                 alert('❌ This email is already registered. Try logging in instead.');
//             } else {
//                 console.error('❌ Signup failed:', data.message || 'Unknown error');
//                 alert('❌ Signup failed: ' + (data.message || 'Unknown error'));
//             }
//         } catch (error) {
//             console.error('❌ Error signing up:', error);
//             alert('An error occurred. Please try again.');
//         }
//     });
// });

// const userId = localStorage.getItem('userId');



//
// auth.js (or login.js)

export function isUserLoggedIn() {
    return !!localStorage.getItem('authToken');
}

export function getAuthToken() {
    return localStorage.getItem('authToken');
}

export function getUserEmail() {
    return localStorage.getItem('userEmail');
}

export function openLoginPopup() {
    const popup = document.querySelector('.login-popup');
    const loginForm = popup?.querySelector('.login-form');
    const signupForm = popup?.querySelector('.signup-form');

    if (popup && loginForm && signupForm) {
        popup.classList.remove('hidden');
        loginForm.classList.remove('hidden');
        signupForm.classList.add('hidden');
    }
}

export function updateUIAfterLogin(email) {
    const userInfoContainer = document.querySelector('.userInfo');
    const loginContainer = document.querySelector('.log-in-container');
    const userEmail = document.querySelector('#userEmail');

    if (userInfoContainer && loginContainer && userEmail) {
        console.log('✅ Updating UI for user:', email);
        userInfoContainer.classList.add('show');
        userEmail.textContent = email;
        loginContainer.classList.add('hidden');
    }
}



export function logoutUser() {
    console.log('🚪 Logging out...');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    window.location.reload(); 

    const loginContainer = document.querySelector('.log-in-container');
    const userInfoContainer = document.querySelector('.userInfo');
    const userEmail = document.querySelector('#userEmail');

    if (loginContainer && userInfoContainer && userEmail) {
        loginContainer.classList.remove('hidden');
        userInfoContainer.classList.remove('show');
        userEmail.textContent = '';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const popup = document.querySelector('.login-popup');
    const loginButton = document.querySelector('.log-in-btn');
    // const accountIconButton = document.querySelector('.account-icon');
    const createAccountLink = document.querySelector('.open-signup');
    const closeButton = document.querySelector('.close-popup-btn');
    const loginForm = popup?.querySelector('.login-form');
    const signupForm = popup?.querySelector('.signup-form');
    const switchToSignupLink = popup?.querySelector('.switch-to-signup');
    const switchToLoginLink = popup?.querySelector('.switch-to-login');
    const logoutButton = document.querySelector('.logout-btn');


    
    if (getUserEmail()) {
        updateUIAfterLogin(getUserEmail());
    }

    logoutButton?.addEventListener('click', logoutUser);
    loginButton?.addEventListener('click', openLoginPopup);


    createAccountLink?.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm?.classList.add('hidden');
        signupForm?.classList.remove('hidden');
    });

    switchToSignupLink?.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm?.classList.add('hidden');
        signupForm?.classList.remove('hidden');
    });

    switchToLoginLink?.addEventListener('click', (e) => {
        e.preventDefault();
        signupForm?.classList.add('hidden');
        loginForm?.classList.remove('hidden');
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
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('userEmail', data.email);
                updateUIAfterLogin(data.email);
            
                // Hide the login popup
                popup.classList.add('hidden');  
                document.body.classList.remove('popup-open'); 
            
                // Check if we have a stored page to redirect to
                const redirectPage = localStorage.getItem('redirectAfterLogin');
                if (redirectPage) {
                    localStorage.removeItem('redirectAfterLogin'); // Clean up after redirect
                    window.location.href = redirectPage; // Redirect user back to the intended page
                } else {
                    window.location.href = 'index.html'; // Default redirect (home page)
                }
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
            let data;
            try {
                data = JSON.parse(text);
            } catch (e) {
                console.error('❌ JSON Parse Error:', text);
                alert('Server error. Please try again.');
                return;
            }

            if (response.ok && data.userId) {
                localStorage.setItem('userId', data.userId);
                alert('🎉 Account created successfully! You can now log in.');
                popup.classList.add('hidden');
            } else if (data.message === 'User already exists') {
                alert('❌ This email is already registered. Try logging in instead.');
            } else {
                console.error('❌ Signup failed:', data.message || 'Unknown error');
                alert('❌ Signup failed: ' + (data.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('❌ Error signing up:', error);
            alert('An error occurred. Please try again.');
        }
    });
});



