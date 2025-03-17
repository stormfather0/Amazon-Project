
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

export function getUserName() {
    console.log('1', localStorage.getItem('userName'));
    
    return localStorage.getItem('userName');
}

export function getLastName() {
    console.log('2', localStorage.getItem('lastName'));

    return localStorage.getItem('lastName');
}

getUserName()
getLastName()





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
    localStorage.removeItem('userName');
    localStorage.removeItem('lastName');


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

    const loginInfo = document.querySelector('.login-info');

    
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
                localStorage.setItem('userName', data.firstName);
                localStorage.setItem('lastName', data.lastName);
              
             
                


                updateUIAfterLogin(data.email);
                window.location.reload(); 
                
            
                // Hide the login popup
                popup.classList.add('hidden');  
                document.body.classList.remove('popup-open'); 
                displayCheckoutUser()
                // Check if we have a stored page to redirect to
                const redirectPage = localStorage.getItem('redirectAfterLogin');
                if (redirectPage) {
                    localStorage.removeItem('redirectAfterLogin'); // Clean up after redirect
                    window.location.href = redirectPage; // Redirect user back to the intended page
                } else {
                    window.reload // Default redirect (home page)
                    //HERE
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



//







// document.addEventListener("DOMContentLoaded", function () {
//     // Get the current page URL
//     const currentPage = window.location.pathname.split('/').pop(); // Gets last part of URL
  
//     // Select the login-info element
//     const loginInfo = document.querySelector('.login-info');
  
//     if (currentPage === 'checkout.html') {
//       if (loginInfo) {
       
//         console.log('✅ Background color changed to yellow.');
//       } else {
//         console.error('❌ .login-info element not found.');
//       }
//     } else {
//       return
//     }
//   });

 function displayCheckoutUser() {
    const loginInfo = document.querySelector('.login-info');
  
    // Get the current page
    const currentPage = window.location.pathname.split('/').pop(); // Extracts last part of the URL
  
    if (currentPage === 'checkout.html') {
      if (loginInfo) {
        loginInfo.classList.remove('hidden'); // Remove the hidden class
        console.log('✅ login-info is now visible.');
      } else {
        console.error('❌ .login-info element not found.');
      }
    } else {
      console.log('Hi');
    }
  }
  
  // Call function when the page loads
//   document.addEventListener("DOMContentLoaded", displayCheckoutUser);

    
  





