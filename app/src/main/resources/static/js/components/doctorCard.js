/*
Import the overlay function for booking appointments from loggedPatient.js

  Import the deleteDoctor API function to remove doctors (admin role) from docotrServices.js

  Import function to fetch patient details (used during booking) from patientServices.js

  Function to create and return a DOM element for a single doctor card
    Create the main container for the doctor card
    Retrieve the current user role from localStorage
    Create a div to hold doctor information
    Create and set the doctor’s name
    Create and set the doctor's specialization
    Create and set the doctor's email
    Create and list available appointment times
    Append all info elements to the doctor info container
    Create a container for card action buttons
    === ADMIN ROLE ACTIONS ===
      Create a delete button
      Add click handler for delete button
     Get the admin token from localStorage
        Call API to delete the doctor
        Show result and remove card if successful
      Add delete button to actions container
   
    === PATIENT (NOT LOGGED-IN) ROLE ACTIONS ===
      Create a book now button
      Alert patient to log in before booking
      Add button to actions container
  
    === LOGGED-IN PATIENT ROLE ACTIONS === 
      Create a book now button
      Handle booking logic for logged-in patient   
        Redirect if token not available
        Fetch patient data with token
        Show booking overlay UI with doctor and patient info
      Add button to actions container
   
  Append doctor info and action buttons to the car
  Return the complete doctor card element
*/
export function createDoctorCard(doctor) {
    // 1. Create the Main Card Container
    const card = document.createElement("div");
    card.classList.add("doctor-card");
    // Attach doctor ID for easy DOM manipulation (e.g., after deletion)
    card.dataset.doctorId = doctor.id;

    // 2. Fetch the User’s Role
    const role = localStorage.getItem("userRole");

    // 3. Create Doctor Info Section
    const infoDiv = document.createElement("div");
    infoDiv.classList.add("doctor-info");

    // Doctor Image (Placeholder/Icon)
    const image = document.createElement("img");
    image.src = doctor.profilePic || "../assets/images/doctor-placeholder.png"; // Use placeholder if none provided
    image.alt = `Profile picture of Dr. ${doctor.name}`;
    image.classList.add("doctor-profile-pic");
    infoDiv.appendChild(image);

    // Name
    const name = document.createElement("h3");
    name.textContent = doctor.name;

    // Specialization
    const specialization = document.createElement("p");
    specialization.classList.add("doctor-specialty");
    specialization.textContent = `Specialty: ${doctor.specialty}`;

    // Email
    const email = document.createElement("p");
    email.classList.add("doctor-email");
    email.textContent = `Email: ${doctor.email}`;

    // Availability
    const availability = document.createElement("p");
    availability.classList.add("doctor-availability");
    // Assuming doctor.availableTimes is an array of strings (e.g., ["Mon AM", "Wed PM"])
    const times = Array.isArray(doctor.availableTimes) ? doctor.availableTimes.join(", ") : doctor.availableTimes || "N/A";
    availability.textContent = `Availability: ${times}`;

    // Append Info elements
    infoDiv.appendChild(name);
    infoDiv.appendChild(specialization);
    infoDiv.appendChild(email);
    infoDiv.appendChild(availability);

    // 4. Create Button Container
    const actionsDiv = document.createElement("div");
    actionsDiv.classList.add("card-actions");
    actionsDiv.setAttribute("role", "group"); // Accessibility

    // 5. Conditionally Add Buttons Based on Role

    if (role === "admin") {
        // Admin: Delete Button
        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Delete";
        removeBtn.classList.add("danger-btn"); // Red/danger style

        removeBtn.addEventListener("click", () => {
            // Confirm deletion using a custom modal/message box
            window.showMessageBox(
                "Confirm Deletion",
                `Are you sure you want to delete Dr. ${doctor.name}? This action cannot be undone.`,
                async (confirmed) => {
                    if (confirmed) {
                        // Assumes window.deleteDoctor is defined elsewhere for API interaction
                        const success = await window.deleteDoctor(doctor.id);
                        if (success) {
                            card.remove(); // Remove card from DOM on successful deletion
                            window.showMessageBox("Success", `${doctor.name} has been deleted.`);
                        } else {
                            window.showMessageBox("Error", `Failed to delete ${doctor.name}. Please try again.`);
                        }
                    }
                },
                true // Is a confirmation box
            );
        });
        actionsDiv.appendChild(removeBtn);

    } else if (role === "patient") {
        // Patient (not logged in): Book Now (requires login)
        const bookNow = document.createElement("button");
        bookNow.textContent = "Book Now";
        bookNow.classList.add("primary-btn");

        bookNow.addEventListener("click", () => {
            // Use custom message box instead of alert()
            window.showMessageBox("Action Required", "You need to log in or sign up as a patient to book an appointment.");
        });
        actionsDiv.appendChild(bookNow);

    } else if (role === "loggedPatient") {
        // Logged-in Patient: Book Now (initiates booking process)
        const bookNow = document.createElement("button");
        bookNow.textContent = "Book Now";
        bookNow.classList.add("primary-btn");

        bookNow.addEventListener("click", async (e) => {
            const token = localStorage.getItem("token");

            if (!token) {
                window.showMessageBox("Error", "Authentication token missing. Please log in again.");
                return;
            }

            // Assume window.getPatientData is an async function to fetch patient profile
            const patientData = await window.getPatientData(token);

            if (patientData) {
                // Assumes window.showBookingOverlay is a function defined elsewhere
                window.showBookingOverlay(e, doctor, patientData);
            } else {
                window.showMessageBox("Error", "Could not retrieve patient data. Cannot proceed with booking.");
            }
        });
        actionsDiv.appendChild(bookNow);
    }

    // 6. Final Assembly
    card.appendChild(infoDiv);

    // Only append actions if there are buttons to show (i.e., not for a doctor viewing their own profile)
    if (actionsDiv.children.length > 0) {
        card.appendChild(actionsDiv);
    }

    // 7. Return the final card
    return card;
}