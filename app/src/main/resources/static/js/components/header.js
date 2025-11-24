    /*
  Step-by-Step Explanation of Header Section Rendering

  This code dynamically renders the header section of the page based on the user's role, session status, and available actions (such as login, logout, or role-switching).

  1. Define the `renderHeader` Function

     * The `renderHeader` function is responsible for rendering the entire header based on the user's session, role, and whether they are logged in.

  2. Select the Header Div

     * The `headerDiv` variable retrieves the HTML element with the ID `header`, where the header content will be inserted.
       ```javascript
       const headerDiv = document.getElementById("header");
       ```

  3. Check if the Current Page is the Root Page

     * The `window.location.pathname` is checked to see if the current page is the root (`/`). If true, the user's session data (role) is removed from `localStorage`, and the header is rendered without any user-specific elements (just the logo and site title).
       ```javascript
       if (window.location.pathname.endsWith("/")) {
         localStorage.removeItem("userRole");
         headerDiv.innerHTML = `
           <header class="header">
             <div class="logo-section">
               <img src="../assets/images/logo/logo.png" alt="Hospital CRM Logo" class="logo-img">
               <span class="logo-title">Hospital CMS</span>
             </div>
           </header>`;
         return;
       }
       ```

  4. Retrieve the User's Role and Token from LocalStorage

     * The `role` (user role like admin, patient, doctor) and `token` (authentication token) are retrieved from `localStorage` to determine the user's current session.
       ```javascript
       const role = localStorage.getItem("userRole");
       const token = localStorage.getItem("token");
       ```

  5. Initialize Header Content

     * The `headerContent` variable is initialized with basic header HTML (logo section), to which additional elements will be added based on the user's role.
       ```javascript
       let headerContent = `<header class="header">
         <div class="logo-section">
           <img src="../assets/images/logo/logo.png" alt="Hospital CRM Logo" class="logo-img">
           <span class="logo-title">Hospital CMS</span>
         </div>
         <nav>`;
       ```

  6. Handle Session Expiry or Invalid Login

     * If a user with a role like `loggedPatient`, `admin`, or `doctor` does not have a valid `token`, the session is considered expired or invalid. The user is logged out, and a message is shown.
       ```javascript
       if ((role === "loggedPatient" || role === "admin" || role === "doctor") && !token) {
         localStorage.removeItem("userRole");
         alert("Session expired or invalid login. Please log in again.");
         window.location.href = "/";   or a specific login page
         return;
       }
       ```

  7. Add Role-Specific Header Content

     * Depending on the user's role, different actions or buttons are rendered in the header:
       - **Admin**: Can add a doctor and log out.
       - **Doctor**: Has a home button and log out.
       - **Patient**: Shows login and signup buttons.
       - **LoggedPatient**: Has home, appointments, and logout options.
       ```javascript
       else if (role === "admin") {
         headerContent += `
           <button id="addDocBtn" class="adminBtn" onclick="openModal('addDoctor')">Add Doctor</button>
           <a href="#" onclick="logout()">Logout</a>`;
       } else if (role === "doctor") {
         headerContent += `
           <button class="adminBtn"  onclick="selectRole('doctor')">Home</button>
           <a href="#" onclick="logout()">Logout</a>`;
       } else if (role === "patient") {
         headerContent += `
           <button id="patientLogin" class="adminBtn">Login</button>
           <button id="patientSignup" class="adminBtn">Sign Up</button>`;
       } else if (role === "loggedPatient") {
         headerContent += `
           <button id="home" class="adminBtn" onclick="window.location.href='/pages/loggedPatientDashboard.html'">Home</button>
           <button id="patientAppointments" class="adminBtn" onclick="window.location.href='/pages/patientAppointments.html'">Appointments</button>
           <a href="#" onclick="logoutPatient()">Logout</a>`;
       }
       ```



  9. Close the Header Section



  10. Render the Header Content

     * Insert the dynamically generated `headerContent` into the `headerDiv` element.
       ```javascript
       headerDiv.innerHTML = headerContent;
       ```

  11. Attach Event Listeners to Header Buttons

     * Call `attachHeaderButtonListeners` to add event listeners to any dynamically created buttons in the header (e.g., login, logout, home).
       ```javascript
       attachHeaderButtonListeners();
       ```


  ### Helper Functions

  13. **attachHeaderButtonListeners**: Adds event listeners to login buttons for "Doctor" and "Admin" roles. If clicked, it opens the respective login modal.

  14. **logout**: Removes user session data and redirects the user to the root page.

  15. **logoutPatient**: Removes the patient's session token and redirects to the patient dashboard.

  16. **Render the Header**: Finally, the `renderHeader()` function is called to initialize the header rendering process when the page loads.
*/

    / Global function exposed to the window, usually called from the <body> onload event
    window.renderHeader = function() {
        // 2. Select the Header Div
        const headerDiv = document.getElementById("header");

        if (!headerDiv) {
            console.error("Header injection point (#header) not found.");
            return;
        }

        // 3. Check if the Current Page is the Root Page (Simulating initial unauthenticated state)
        // If we are at the root, we clear any previous role and render a minimal header with login options.
        if (window.location.pathname.endsWith("/") || window.location.pathname.endsWith("/index.html")) {
            localStorage.removeItem("userRole");
            localStorage.removeItem("token");

            // Minimal header for the root/landing page
            headerDiv.innerHTML = `
            <header class="header">
                <div class="logo-section">
                    <img src="../assets/images/logo/logo.png" alt="Hospital CMS Logo" class="logo-img">
                    <span class="logo-title">Hospital CMS</span>
                </div>
                <nav>
                    <button id="doctorLogin" class="adminBtn">Doctor Login</button>
                    <button id="adminLogin" class="adminBtn">Admin Login</button>
                    <button id="patientSignup" class="adminBtn">Sign Up</button>
                </nav>
            </header>`;

            // 11. Attach Event Listeners
            attachHeaderButtonListeners();
            return;
        }

        // 4. Retrieve the User's Role and Token from LocalStorage
        const role = localStorage.getItem("userRole");
        const token = localStorage.getItem("token");

        // 5. Initialize Header Content with base structure
        let headerContent = `<header class="header">
        <div class="logo-section">
            <img src="../assets/images/logo/logo.png" alt="Hospital CMS Logo" class="logo-img">
            <span class="logo-title">Hospital CMS</span>
        </div>
        <nav>`;

        // 6. Handle Session Expiry or Invalid Login for protected routes
        if ((role === "loggedPatient" || role === "admin" || role === "doctor") && !token) {
            localStorage.removeItem("userRole");
            localStorage.removeItem("token");

            // Use a custom message box instead of the forbidden alert()
            window.showMessageBox("Session Expired", "Session expired or invalid login. Please log in again.", () => {
                window.location.href = "/"; // Redirect after user acknowledges
            });

            // Prevent rendering the rest of the header until redirect
            return;
        }

        // 7. Add Role-Specific Header Content
        if (role === "admin") {
            headerContent += `
            <button id="addDocBtn" class="adminBtn" onclick="openModal('addDoctor')">Add Doctor</button>
            <a href="#" onclick="logout()">Logout</a>`;
        } else if (role === "doctor") {
            // Doctor Home button links to the Thymeleaf page defined in the structure
            headerContent += `
            <button class="adminBtn"  onclick="window.location.href='/app/doctorDashboard.html'">Home</button>
            <a href="#" onclick="logout()">Logout</a>`;
        } else if (role === "patient") {
            // Unlogged Patient access on the Patient Dashboard
            headerContent += `
            <button id="patientLogin" class="adminBtn">Login</button>
            <button id="patientSignup" class="adminBtn">Sign Up</button>`;
        } else if (role === "loggedPatient") {
            headerContent += `
            <button id="home" class="adminBtn" onclick="window.location.href='/pages/loggedPatientDashboard.html'">Home</button>
            <button id="patientAppointments" class="adminBtn" onclick="window.location.href='/pages/patientAppointments.html'">Appointments</button>
            <a href="#" onclick="logoutPatient()">Logout</a>`;
        } else {
            // Fallback for non-recognized role on a protected page, redirect to root
            window.location.href = "/";
            return;
        }

        // 9. Close the Header Section
        headerContent += `</nav></header>`;

        // 10. Render the Header Content
        headerDiv.innerHTML = headerContent;

        // 11. Attach Event Listeners to Header Buttons
        attachHeaderButtonListeners();
    };


    // 13. Helper Function: attachHeaderButtonListeners
    // Attaches event listeners to dynamically created buttons (especially login/signup buttons)
    window.attachHeaderButtonListeners = function() {
        const doctorLoginBtn = document.getElementById("doctorLogin");
        const adminLoginBtn = document.getElementById("adminLogin");
        const patientLoginBtn = document.getElementById("patientLogin");
        const patientSignupBtn = document.getElementById("patientSignup");

        // Open Doctor Login Modal
        if (doctorLoginBtn) {
            doctorLoginBtn.addEventListener('click', () => {
                // Assume openModal is a global function defined in modals.js
                window.openModal('doctorLogin');
            });
        }

        // Open Admin Login Modal
        if (adminLoginBtn) {
            adminLoginBtn.addEventListener('click', () => {
                window.openModal('adminLogin');
            });
        }

        // Open Patient Login Modal
        if (patientLoginBtn) {
            patientLoginBtn.addEventListener('click', () => {
                window.openModal('patientLogin');
            });
        }

        // Open Patient Signup Modal
        if (patientSignupBtn) {
            patientSignupBtn.addEventListener('click', () => {
                window.openModal('patientSignup');
            });
        }
    };

    // 14. Helper Function: logout (For Admin/Doctor)
    window.logout = function() {
        localStorage.removeItem("userRole");
        localStorage.removeItem("token");
        // Redirect to the root page
        window.location.href = "/";
    };

    // 15. Helper Function: logoutPatient (For Logged Patient)
    window.logoutPatient = function() {
        localStorage.removeItem("userRole"); // Clear role state
        localStorage.removeItem("token");    // Clear patient token
        // Redirect to the general patient dashboard to allow re-login/signup
        window.location.href = "/pages/patientDashboard.html";
    };


    // 16. Render the Header: This is called by renderContent() in util.js
    // renderHeader();