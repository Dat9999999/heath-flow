## MySQL Database Design


### Table: admin
- id INT, Primary Key, Auto Increment
- username VARCHAR(30)
- password VARCHAR(30)

### Table: doctors
- id: INT, Primary Key, Auto Increment
- speciality VARCHAR(20)
- password VARCHAR(30)
- phone VARCHAR(10)
- email VARCHAR(20)
- name VARCHAR(20)

### Table: doctor_availabletimes 
- availabletime Date 
- doctorId INT, Foreign Key -> doctors(id)
- id: INT, Primary Key, Auto Increment

### Table: patients
- id: INT, Primary Key, Auto Increment
- address VARCHAR(30)
- phone VARCHAR(10)
- email VARCHAR(20) UNIQUE
- name VARCHAR(20)
- password VARCHAR(30)

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
