/*
  Import the base API URL from the config file
  Define a constant DOCTOR_API to hold the full endpoint for doctor-related actions


  Function: getDoctors
  Purpose: Fetch the list of all doctors from the API

   Use fetch() to send a GET request to the DOCTOR_API endpoint
   Convert the response to JSON
   Return the 'doctors' array from the response
   If there's an error (e.g., network issue), log it and return an empty array


  Function: deleteDoctor
  Purpose: Delete a specific doctor using their ID and an authentication token

   Use fetch() with the DELETE method
    - The URL includes the doctor ID and token as path parameters
   Convert the response to JSON
   Return an object with:
    - success: true if deletion was successful
    - message: message from the server
   If an error occurs, log it and return a default failure response


  Function: saveDoctor
  Purpose: Save (create) a new doctor using a POST request

   Use fetch() with the POST method
    - URL includes the token in the path
    - Set headers to specify JSON content type
    - Convert the doctor object to JSON in the request body

   Parse the JSON response and return:
    - success: whether the request succeeded
    - message: from the server

   Catch and log errors
    - Return a failure response if an error occurs


  Function: filterDoctors
  Purpose: Fetch doctors based on filtering criteria (name, time, and specialty)

   Use fetch() with the GET method
    - Include the name, time, and specialty as URL path parameters
   Check if the response is OK
    - If yes, parse and return the doctor data
    - If no, log the error and return an object with an empty 'doctors' array

   Catch any other errors, alert the user, and return a default empty result
*/

// Import API Base URL
import { API_BASE_URL } from "../config/config.js";

// Set Doctor API Endpoint
const DOCTOR_API = API_BASE_URL + '/doctor';

/**
 * Sends a GET request to retrieve all doctor records.
 * @returns {Promise<Array>} A list of doctor objects or an empty array on failure.
 */
export async function getDoctors() {
    try {
        const response = await fetch(DOCTOR_API, {
            method: 'GET',
        });

        if (!response.ok) {
            console.error(`Failed to fetch doctors: ${response.statusText}`);
            return [];
        }

        return await response.json();
    } catch (error) {
        console.error("Network or system error while fetching doctors:", error);
        // Returns an empty list to prevent frontend breakage
        return [];
    }
}

/**
 * Sends a DELETE request to remove a doctor by ID.
 * @param {string} id - The ID of the doctor to delete.
 * @param {string} token - The Admin authentication token.
 * @returns {Promise<{success: boolean, message: string}>} The status of the operation.
 */
export async function deleteDoctor(id, token) {
    try {
        const response = await fetch(`${DOCTOR_API}/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const message = await response.text() || "Doctor deleted successfully.";
            return { success: true, message: message };
        } else if (response.status === 404) {
            return { success: false, message: "Doctor not found." };
        } else {
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = errorData.message || response.statusText;
            return { success: false, message: `Deletion failed: ${errorMessage}` };
        }
    } catch (error) {
        console.error(`Error deleting doctor ID ${id}:`, error);
        return { success: false, message: "An unexpected network error occurred." };
    }
}

/**
 * Sends a POST request to save (add) a new doctor record.
 * @param {object} doctor - The doctor data object.
 * @param {string} token - The Admin authentication token.
 * @returns {Promise<{success: boolean, message: string}>} The status of the operation.
 */
export async function saveDoctor(doctor, token) {
    try {
        const response = await fetch(DOCTOR_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(doctor)
        });

        if (response.ok) {
            const data = await response.json();
            return { success: true, message: `Doctor ${data.name} added successfully!` };
        } else {
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = errorData.message || "Failed to add doctor.";
            return { success: false, message: errorMessage };
        }
    } catch (error) {
        console.error("Error saving new doctor:", error);
        return { success: false, message: "An unexpected network error occurred during saving." };
    }
}

/**
 * Sends a GET request to filter doctor records based on criteria.
 * @param {string} [name=''] - Doctor's name or search query.
 * @param {string} [time=''] - Availability time slot (e.g., 'AM', 'PM').
 * @param {string} [specialty=''] - Medical specialty.
 * @returns {Promise<Array>} A list of filtered doctor objects or an empty array on failure.
 */
export async function filterDoctors(name = '', time = '', specialty = '') {
    // Construct query parameters, ensuring empty values are skipped
    const params = new URLSearchParams();
    if (name) params.append('name', name);
    if (time) params.append('time', time);
    if (specialty) params.append('specialty', specialty);

    // Build the full URL
    const url = `${DOCTOR_API}/filter?${params.toString()}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
        });

        if (!response.ok) {
            console.error(`Failed to filter doctors: ${response.statusText}`);
            return [];
        }

        return await response.json();
    } catch (error) {
        console.error("Network or system error while filtering doctors:", error);
        return [];
    }
}
