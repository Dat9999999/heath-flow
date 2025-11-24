/*
  Import getAllAppointments to fetch appointments from the backend
  Import createPatientRow to generate a table row for each patient appointment


  Get the table body where patient rows will be added
  Initialize selectedDate with today's date in 'YYYY-MM-DD' format
  Get the saved token from localStorage (used for authenticated API calls)
  Initialize patientName to null (used for filtering by name)


  Add an 'input' event listener to the search bar
  On each keystroke:
    - Trim and check the input value
    - If not empty, use it as the patientName for filtering
    - Else, reset patientName to "null" (as expected by backend)
    - Reload the appointments list with the updated filter


  Add a click listener to the "Today" button
  When clicked:
    - Set selectedDate to today's date
    - Update the date picker UI to match
    - Reload the appointments for today


  Add a change event listener to the date picker
  When the date changes:
    - Update selectedDate with the new value
    - Reload the appointments for that specific date


  Function: loadAppointments
  Purpose: Fetch and display appointments based on selected date and optional patient name

  Step 1: Call getAllAppointments with selectedDate, patientName, and token
  Step 2: Clear the table body content before rendering new rows

  Step 3: If no appointments are returned:
    - Display a message row: "No Appointments found for today."

  Step 4: If appointments exist:
    - Loop through each appointment and construct a 'patient' object with id, name, phone, and email
    - Call createPatientRow to generate a table row for the appointment
    - Append each row to the table body

  Step 5: Catch and handle any errors during fetch:
    - Show a message row: "Error loading appointments. Try again later."


  When the page is fully loaded (DOMContentLoaded):
    - Call renderContent() (assumes it sets up the UI layout)
    - Call loadAppointments() to display today's appointments by default
*/
// Import Required Modules
// Note: Assuming 'getAllAppointments' is meant to be the function that retrieves doctor-specific appointments.
import { getAllAppointments } from './services/appointmentRecordService.js';
import { createPatientRow } from './components/patientRows';
import { getCurrentDateString } from './util.js'; // Assuming a utility to get YYYY-MM-DD format

// --- Global Variables ---
const tableBody = document.getElementById("patientTableBody");
const searchBar = document.getElementById("searchBar");
const todayButton = document.getElementById("todayButton");
const datePicker = document.getElementById("datePicker");

// State variables
let selectedDate = getCurrentDateString(); // Initialize to today's date (YYYY-MM-DD)
let token = localStorage.getItem('token');
let patientName = null;
let doctorId = localStorage.getItem('userId'); // Assuming doctorId is stored upon successful login

/**
 * Utility function to display a single row message (e.g., loading, no records, error).
 * @param {string} message - The message to display.
 */
function displayMessageRow(message) {
    if (!tableBody) return;
    tableBody.innerHTML = `
        <tr>
            <td colspan="5" class="noPatientRecord">${message}</td>
        </tr>
    `;
}

/**
 * Fetches appointments based on the current date, search, and token, then renders the table.
 */
async function loadAppointments() {
    if (!token || !doctorId) {
        displayMessageRow("Authentication required. Please log in.");
        return;
    }

    // 1. Show loading state
    displayMessageRow("Loading appointments...");

    try {
        // 2. Fetch data from service
        // The service layer must handle constructing the correct endpoint using doctorId.
        const appointments = await getAllAppointments(selectedDate, patientName, token, doctorId);

        // 3. Clear table content
        if (tableBody) tableBody.innerHTML = "";

        // 4. Handle No Appointments
        if (!appointments || appointments.length === 0) {
            displayMessageRow(`No appointments found for ${selectedDate}${patientName ? ' matching the search query.' : '.'}`);
            return;
        }

        // 5. Render rows
        appointments.forEach(appointment => {
            // Assuming appointment object includes patient details
            const row = createPatientRow(appointment);
            if (tableBody) tableBody.appendChild(row);
        });

    } catch (error) {
        console.error("Error loading appointments:", error);
        displayMessageRow("An error occurred while fetching appointments. Please try again.");
    }
}


// --- Event Handlers ---

/**
 * Handles input change on the patient search bar.
 */
function handleSearchChange(event) {
    // Update patientName. Use null if the input is empty to avoid searching for empty string.
    const searchValue = event.target.value.trim();
    patientName = searchValue === '' ? null : searchValue;

    loadAppointments(); // Refresh the list
}

/**
 * Resets the date filter to today's date and refreshes appointments.
 */
function handleTodayButtonClick() {
    selectedDate = getCurrentDateString();

    // Update the date picker input to reflect the change
    if (datePicker) {
        datePicker.value = selectedDate;
    }

    loadAppointments(); // Refresh the list
}

/**
 * Handles change on the date picker input.
 */
function handleDatePickerChange(event) {
    selectedDate = event.target.value;
    loadAppointments(); // Refresh the list
}


// --- Initialization ---

window.addEventListener('DOMContentLoaded', () => {
    // Set the initial value of the date picker to today's date
    if (datePicker) {
        datePicker.value = selectedDate;
    }

    // 1. Bind Search Bar
    if (searchBar) {
        searchBar.addEventListener("input", handleSearchChange);
    }

    // 2. Bind Filter Controls
    if (todayButton) {
        todayButton.addEventListener("click", handleTodayButtonClick);
    }
    if (datePicker) {
        datePicker.addEventListener("change", handleDatePickerChange);
    }

    // 3. Initial Render
    // Check if the content rendering utility exists and call it first
    if (window.renderContent) {
        window.renderContent();
    }

    // Load default appointments (today's)
    loadAppointments();
});