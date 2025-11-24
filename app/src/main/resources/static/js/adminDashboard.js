/*
  This script handles the admin dashboard functionality for managing doctors:
  - Loads all doctor cards
  - Filters doctors by name, time, or specialty
  - Adds a new doctor via modal form


  Attach a click listener to the "Add Doctor" button
  When clicked, it opens a modal form using openModal('addDoctor')


  When the DOM is fully loaded:
    - Call loadDoctorCards() to fetch and display all doctors


  Function: loadDoctorCards
  Purpose: Fetch all doctors and display them as cards

    Call getDoctors() from the service layer
    Clear the current content area
    For each doctor returned:
    - Create a doctor card using createDoctorCard()
    - Append it to the content div

    Handle any fetch errors by logging them


  Attach 'input' and 'change' event listeners to the search bar and filter dropdowns
  On any input change, call filterDoctorsOnChange()


  Function: filterDoctorsOnChange
  Purpose: Filter doctors based on name, available time, and specialty

    Read values from the search bar and filters
    Normalize empty values to null
    Call filterDoctors(name, time, specialty) from the service

    If doctors are found:
    - Render them using createDoctorCard()
    If no doctors match the filter:
    - Show a message: "No doctors found with the given filters."

    Catch and display any errors with an alert


  Function: renderDoctorCards
  Purpose: A helper function to render a list of doctors passed to it

    Clear the content area
    Loop through the doctors and append each card to the content area


  Function: adminAddDoctor
  Purpose: Collect form data and add a new doctor to the system

    Collect input values from the modal form
    - Includes name, email, phone, password, specialty, and available times

    Retrieve the authentication token from localStorage
    - If no token is found, show an alert and stop execution

    Build a doctor object with the form values

    Call saveDoctor(doctor, token) from the service

    If save is successful:
    - Show a success message
    - Close the modal and reload the page

    If saving fails, show an error message
*/
// Import Required Modules
import { openModal, closeModal } from '../components/modals.js';
import { getDoctors, filterDoctors, saveDoctor, deleteDoctor } from './services/doctorServices.js';
import { createDoctorCard } from '../components/doctorCard.js'; // Adjusting path to match common structure

// Global DOM references
const contentDiv = document.getElementById("content");
const searchBar = document.getElementById("searchBar");
const filterTime = document.getElementById("filterTime");
const filterSpecialty = document.getElementById("filterSpecialty");

/**
 * Utility function to render a list of doctor cards into the content area.
 * @param {Array<object>} doctors - List of doctor objects to display.
 */
function renderDoctorCards(doctors) {
    if (!contentDiv) return;

    // Clear existing content
    contentDiv.innerHTML = "";

    if (!doctors || doctors.length === 0) {
        const message = document.createElement('p');
        message.classList.add('no-records-message');
        message.textContent = "No doctors found matching the criteria.";
        contentDiv.appendChild(message);
        return;
    }

    doctors.forEach(doctor => {
        const card = createDoctorCard(doctor);
        contentDiv.appendChild(card);
    });
}

/**
 * Fetches all doctor records from the backend and renders the cards.
 */
async function loadDoctorCards() {
    // Show loading state
    if (contentDiv) {
        contentDiv.innerHTML = '<p class="loading-message">Loading doctor records...</p>';
    }

    const doctors = await getDoctors();
    renderDoctorCards(doctors);
}

/**
 * Handles input/change events on the search bar and filter dropdowns.
 * Fetches filtered results and updates the UI.
 */
async function filterDoctorsOnChange() {
    const name = searchBar ? searchBar.value.trim() : '';
    const time = filterTime ? filterTime.value : '';
    const specialty = filterSpecialty ? filterSpecialty.value : '';

    // Show filtering state
    if (contentDiv) {
        contentDiv.innerHTML = '<p class="loading-message">Filtering results...</p>';
    }

    const filteredDoctors = await filterDoctors(name, time, specialty);
    renderDoctorCards(filteredDoctors);
}

/**
 * Global function attached to the 'Add Doctor' modal form submission.
 * Collects data, verifies admin token, and calls the saveDoctor service.
 * @param {Event} event - The form submission event.
 */
window.adminAddDoctor = async function(event) {
    event.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
        window.showMessageBox("Authentication Error", "Admin token missing. Please log in again.");
        return;
    }

    // 1. Collect form data (Assuming IDs based on typical modal structure)
    const name = document.getElementById('addDoctorName').value.trim();
    const specialty = document.getElementById('addDoctorSpecialty').value.trim();
    const email = document.getElementById('addDoctorEmail').value.trim();
    const password = document.getElementById('addDoctorPassword').value;
    const mobileNo = document.getElementById('addDoctorMobile').value.trim();

    // Collect availability checkboxes
    const availabilityCheckboxes = document.querySelectorAll('input[name="availability"]:checked');
    const availableTimes = Array.from(availabilityCheckboxes).map(cb => cb.value);

    // Basic Validation
    if (!name || !specialty || !email || !password || !mobileNo || availableTimes.length === 0) {
        window.showMessageBox("Validation Error", "Please fill in all fields and select at least one availability slot.");
        return;
    }

    const newDoctor = {
        name,
        specialty,
        email,
        password,
        mobileNo,
        availableTimes
    };

    // 2. Send POST request via service
    const result = await saveDoctor(newDoctor, token);

    if (result.success) {
        window.showMessageBox("Success", result.message, () => {
            // Close modal and refresh list
            closeModal();
            loadDoctorCards(); // Refresh the list to show the new doctor
        });
    } else {
        window.showMessageBox("Error", result.message || "Failed to add doctor. Please check inputs.");
    }
};

/**
 * Global function exposed for use by doctorCard.js when the Admin clicks 'Delete'.
 * Handles deletion and token authentication.
 * @param {string} doctorId - The ID of the doctor to delete.
 * @returns {Promise<boolean>} True if deletion was successful, false otherwise.
 */
window.deleteDoctor = async function(doctorId) {
    const token = localStorage.getItem('token');
    if (!token) {
        window.showMessageBox("Auth Error", "Session expired. Please log in.");
        return false;
    }

    const result = await deleteDoctor(doctorId, token);

    // If successful, show message handled by doctorCard, but here we trigger a refresh.
    if (result.success) {
        loadDoctorCards();
    } else {
        window.showMessageBox("Deletion Failed", result.message || "Could not delete doctor due to server error.");
    }

    return result.success;
};


// --- Initialization ---

window.addEventListener('DOMContentLoaded', () => {
    // 1. Initial Load of Doctors
    loadDoctorCards();

    // 2. Filter/Search Event Listeners
    if (searchBar) {
        searchBar.addEventListener("input", filterDoctorsOnChange);
    }
    if (filterTime) {
        filterTime.addEventListener("change", filterDoctorsOnChange);
    }
    if (filterSpecialty) {
        filterSpecialty.addEventListener("change", filterDoctorsOnChange);
    }

    // 3. Add Doctor Button Listener (to open modal)
    const addDocBtn = document.getElementById('addDocBtn');
    if (addDocBtn) {
        addDocBtn.addEventListener('click', () => {
            openModal('addDoctor');
        });
    }
});