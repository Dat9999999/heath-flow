/*
  Import the openModal function to handle showing login popups/modals
  Import the base API URL from the config file
  Define constants for the admin and doctor login API endpoints using the base URL

  Use the window.onload event to ensure DOM elements are available after page load
  Inside this function:
    - Select the "adminLogin" and "doctorLogin" buttons using getElementById
    - If the admin login button exists:
        - Add a click event listener that calls openModal('adminLogin') to show the admin login modal
    - If the doctor login button exists:
        - Add a click event listener that calls openModal('doctorLogin') to show the doctor login modal


  Define a function named adminLoginHandler on the global window object
  This function will be triggered when the admin submits their login credentials

  Step 1: Get the entered username and password from the input fields
  Step 2: Create an admin object with these credentials

  Step 3: Use fetch() to send a POST request to the ADMIN_API endpoint
    - Set method to POST
    - Add headers with 'Content-Type: application/json'
    - Convert the admin object to JSON and send in the body

  Step 4: If the response is successful:
    - Parse the JSON response to get the token
    - Store the token in localStorage
    - Call selectRole('admin') to proceed with admin-specific behavior

  Step 5: If login fails or credentials are invalid:
    - Show an alert with an error message

  Step 6: Wrap everything in a try-catch to handle network or server errors
    - Show a generic error message if something goes wrong


  Define a function named doctorLoginHandler on the global window object
  This function will be triggered when a doctor submits their login credentials

  Step 1: Get the entered email and password from the input fields
  Step 2: Create a doctor object with these credentials

  Step 3: Use fetch() to send a POST request to the DOCTOR_API endpoint
    - Include headers and request body similar to admin login

  Step 4: If login is successful:
    - Parse the JSON response to get the token
    - Store the token in localStorage
    - Call selectRole('doctor') to proceed with doctor-specific behavior

  Step 5: If login fails:
    - Show an alert for invalid credentials

  Step 6: Wrap in a try-catch block to handle errors gracefully
    - Log the error to the console
    - Show a generic error message
*/
// Import Required Modules
import { openModal } from '../components/modals';
import { API_BASE_URL } from '../config/config.js'; // Assuming this file exists and exports the URL

// Define API Constants
const ADMIN_API = API_BASE_URL + '/admin/login'; // Adjusted path to commonly used '/admin/login'
const DOCTOR_API = API_BASE_URL + '/doctor/login';

// Setup Button Event Listeners for the landing page
window.onload = function () {
    const adminBtn = document.getElementById('adminLogin');
    const doctorBtn = document.getElementById('doctorLogin');
    const patientSignupBtn = document.getElementById('patientSignup'); // Assuming signup is also handled here

    // Admin Login Button
    if (adminBtn) {
        adminBtn.addEventListener('click', () => {
            openModal('adminLogin');
        });
    }

    // Doctor Login Button
    if (doctorBtn) {
        doctorBtn.addEventListener('click', () => {
            openModal('doctorLogin');
        });
    }

    // Patient Signup Button (assuming it uses the same modal mechanism)
    if (patientSignupBtn) {
        patientSignupBtn.addEventListener('click', () => {
            openModal('patientSignup');
        });
    }
};

/**
 * Global function called from the Admin login modal form submission.
 * Handles authentication for the Admin role.
 * @param {Event} event - The submission event.
 */
window.adminLoginHandler = async function(event) {
    event.preventDefault();

    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;

    if (!username || !password) {
        window.showMessageBox("Login Error", "Please enter both username and password.");
        return;
    }

    const adminCredentials = { username, password };

    try {
        const response = await fetch(ADMIN_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(adminCredentials)
        });

        // Check if the response is successful (status code 200-299)
        if (response.ok) {
            const data = await response.json();

            // Assuming the token is returned directly in the response body (e.g., { token: "..." })
            const token = data.token;

            if (token) {
                localStorage.setItem('token', token);
                localStorage.setItem('userRole', 'admin'); // Set role immediately

                // Assumes selectRole is a global helper function (e.g., in util.js)
                window.selectRole('admin');
            } else {
                window.showMessageBox("Login Failed", "Authentication successful, but no token received.");
            }
        } else {
            // Handle HTTP error statuses (e.g., 401 Unauthorized, 403 Forbidden)
            window.showMessageBox("Login Failed", "Invalid Admin credentials!");
        }
    } catch (error) {
        console.error("Unexpected error during Admin login:", error);
        window.showMessageBox("System Error", "An unexpected network or system error occurred.");
    }
};


/**
 * Global function called from the Doctor login modal form submission.
 * Handles authentication for the Doctor role.
 * @param {Event} event - The submission event.
 */
window.doctorLoginHandler = async function(event) {
    event.preventDefault();

    const email = document.getElementById('doctorEmail').value;
    const password = document.getElementById('doctorPassword').value;

    if (!email || !password) {
        window.showMessageBox("Login Error", "Please enter both email and password.");
        return;
    }

    const doctorCredentials = { email, password };

    try {
        const response = await fetch(DOCTOR_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(doctorCredentials)
        });

        if (response.ok) {
            const data = await response.json();

            // Assuming the token is returned directly
            const token = data.token;

            if (token) {
                localStorage.setItem('token', token);
                localStorage.setItem('userRole', 'doctor'); // Set role immediately

                // Assumes selectRole is a global helper function
                window.selectRole('doctor');
            } else {
                window.showMessageBox("Login Failed", "Authentication successful, but no token received.");
            }
        } else {
            // Handle HTTP error statuses
            window.showMessageBox("Login Failed", "Invalid Doctor credentials!");
        }
    } catch (error) {
        console.error("Unexpected error during Doctor login:", error);
        window.showMessageBox("System Error", "An unexpected network or system error occurred.");
    }
};