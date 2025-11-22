## MySQL Database Design


### Table: user_credentials
- id: INT, Primary Key, Auto Increment
- username: VARCHAR(20), UNIQUE
- password: VARCHAR(20)
- user_type:ENUM('doctor','patient', 'admin')

### Table: admin
- id: INT, Primary Key, Auto Increment
- userId INT, Foreign Key -> user_credentials(id)

### Table: doctors
- id: INT, Primary Key, Auto Increment
- userId INT, Foreign Key -> user_credentials(id)
- specitlity VARCHAR(20) 
- license_number INT, UNQIUE
- contact_number VARCHAR(20) NOT NULL

### Table: patients
- id: INT, Primary Key, Auto Increment
- userId INT, Foreign Key -> user_credentials(id)
- insurance_policy_number VARCHAR(20), UNIQUE
- address VARCHAR(30)
- date_of_birth DATETIME, Not Null
- contact_number VARCHAR(20) Not Null

### Table: appointments
- id: INT, Primary Key, Auto Increment
- doctor_id: INT, Foreign Key → doctors(id)
- patient_id: INT, Foreign Key → patients(id)
- appointment_time: DATETIME, Not Null
- status: INT (0 = Scheduled, 1 = Completed, 2 = Cancelled)

## MongoDB Collection Design

### Collection: prescriptions

```json
{
  "_id": "ObjectId('64abc123456')",
  "patientName": "John Smith",
  "appointmentId": 51,
  "medication": "Paracetamol",
  "dosage": "500mg",
  "doctorNotes": "Take 1 tablet every 6 hours.",
  "refillCount": 2,
  "pharmacy": {
    "name": "Walgreens SF",
    "location": "Market Street"
  }
}
```

### Collection: feedbacks
```json
{
  "_id": "ObjectId('64cba789012')", // Unique ID for the feedback document
  "patientId": 1001,             // Foreign Key link to the patients collection
  "appointmentId": 51,           // Foreign Key link to the specific appointment
  "doctorId": 205,               // The doctor being reviewed
  "overallRating": 5,            // (e.g., 1-5 scale)
  "comments": "The doctor was extremely thorough and listened to my concerns. The wait time was slightly longer than expected.",
  "is_anonymous": false,
  "submissionDate": "2025-11-21T10:00:00Z"
}
```
