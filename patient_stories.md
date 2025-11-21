
### 1. View Doctor List (Pre-Login)

**Title:**
_As a **Potential Patient (Guest)**, I want to **view a list of available doctors** without logging in, so that I can **explore options and specializations** before committing to sign up._

**Acceptance Criteria:**
1. Guests can access the "Find a Doctor" page without authentication.
2. The list displays essential doctor information (Name, Specialization, Photo).
3. Users can filter/search the doctor list.
4. Sensitive personal information (e.g., private email, phone) is hidden.

**Priority:** **High**
**Story Points:** [Estimated Effort in Points]
**Notes:**
- This feature is crucial for **SEO** and attracting new users.

---

### 2. Patient Account Sign-up

**Title:**
_As a **New Patient**, I want to **sign up** using my email and password, so that I can **book appointments** and manage my patient profile._

**Acceptance Criteria:**
1. The system requires and validates a correct, unique email format.
2. The system requires password confirmation (match check).
3. Upon successful registration, the user is redirected to the login page or their profile dashboard.
4. A new patient record is created in the database with **Role: Patient**.

**Priority:** **High**
**Story Points:** [Estimated Effort in Points]
**Notes:**
- Must include an email verification mechanism (e.g., sending a confirmation link).

---

### 3. Portal Login

**Title:**
_As a **Patient**, I want to **log into the portal**, so that I can **manage my bookings** and view my personal health information._

**Acceptance Criteria:**
1. Successful login directs the patient to the **Patient Dashboard**.
2. The system displays a clear error message for incorrect credentials.
3. The system enforces security policies for login (e.g., brute-force protection).

**Priority:** **High**
**Story Points:** [Estimated Effort in Points]
**Notes:**
- A "Forgot Password" option must be readily available.

---

### 4. Portal Logout

**Title:**
_As a **Patient**, I want to **log out of the portal**, so that I can **secure my account** and protect my personal data._

**Acceptance Criteria:**
1. The Logout button successfully terminates the user's session and redirects them to the Login page.
2. Access to sensitive data (like medical records) is blocked immediately after logout.

**Priority:** **High**
**Story Points:** [Estimated Effort in Points]
**Notes:**
- The logout link should be prominently placed in the interface.

---

### 5. Booking a 60-Minute Appointment

**Title:**
_As a **Patient**, I want to **log in and book an hour-long (60-minute) appointment** to consult with a doctor, so that I can **proactively schedule my consultation** based on my needs._

**Acceptance Criteria:**
1. The patient can select a doctor from a filtered list.
2. The system displays only **available 60-minute time slots** based on the chosen doctor's schedule.
3. Upon confirmation, the appointment is recorded, and confirmation notifications are sent to both the patient and the doctor.
4. The patient can input a brief reason/description for the appointment.

**Priority:** **High**
**Story Points:** [Estimated Effort in Points]
**Notes:**
- The system must include conflict-checking logic to prevent double-booking.

---

### 6. Viewing Upcoming Appointments

**Title:**
_As a **Patient**, I want to **view my upcoming appointments**, so that I can **prepare accordingly** and avoid missing the scheduled time._

**Acceptance Criteria:**
1. The patient can access an "My Appointments" page from the dashboard.
2. The page lists all appointments with the status `Scheduled` (Upcoming).
3. Displayed information includes: Doctor's Name, Date & Time, Specialization, and Status.
4. The patient has the option to **Cancel or Reschedule** the appointment (subject to clinic policy).

**Priority:** **High**
**Story Points:** [Estimated Effort in Points]
**Notes:**
- Clear communication of the cancellation policy must be visible on this page.
