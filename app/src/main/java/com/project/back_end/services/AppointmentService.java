package com.project.back_end.services;

import com.project.back_end.models.Appointment;
import com.project.back_end.models.Doctor;
import com.project.back_end.models.Prescription;
import com.project.back_end.repo.AppointmentRepository;
import com.project.back_end.repo.DoctorRepository;
import com.project.back_end.repo.PatientRepository;
import com.project.back_end.repo.PrescriptionRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

// 1. **Add @Service Annotation**:
//    - To indicate that this class is a service layer class for handling business logic.
//    - The `@Service` annotation should be added before the class declaration to mark it as a Spring service component.
//    - Instruction: Add `@Service` above the class definition.
@Service
public class AppointmentService {
    private AppointmentRepository appointmentRepository;
    private PatientRepository patientRepository;
    private DoctorRepository doctorRepository;
    private TokenService tokenService;
    private com.project.back_end.services.Service service;

// 2. **Constructor Injection for Dependencies**:
//    - The `AppointmentService` class requires several dependencies like `AppointmentRepository`, `Service`, `TokenService`, `PatientRepository`, and `DoctorRepository`.
//    - These dependencies should be injected through the constructor.
//    - Instruction: Ensure constructor injection is used for proper dependency management in Spring.

    public AppointmentService(AppointmentRepository appointmentRepository, PatientRepository patientRepository, DoctorRepository doctorRepository, TokenService tokenService, com.project.back_end.services.Service service) {
        this.appointmentRepository = appointmentRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
        this.tokenService = tokenService;
        this.service = service;
    }


// 3. **Add @Transactional Annotation for Methods that Modify Database**:
//    - The methods that modify or update the database should be annotated with `@Transactional` to ensure atomicity and consistency of the operations.
//    - Instruction: Add the `@Transactional` annotation above methods that interact with the database, especially those modifying data.

// 4. **Book Appointment Method**:
//    - Responsible for saving the new appointment to the database.
//    - If the save operation fails, it returns `0`; otherwise, it returns `1`.
//    - Instruction: Ensure that the method handles any exceptions and returns an appropriate result code.
    public int bookAppointment(Appointment appointment){
        try{
            appointmentRepository.save(appointment);
            return 1;
        }
        catch (Exception e){
            return 0;
        }
    }
// 5. **Update Appointment Method**:
//    - This method is used to update an existing appointment based on its ID.
//    - It validates whether the patient ID matches, checks if the appointment is available for updating, and ensures that the doctor is available at the specified time.
//    - If the update is successful, it saves the appointment; otherwise, it returns an appropriate error message.
//    - Instruction: Ensure proper validation and error handling is included for appointment updates.
    @Transactional
    public ResponseEntity<Map<String,String>> updateAppointment(Appointment appointment){
        if(appointmentRepository.findById(appointment.getId()).orElse(null) == null){
            return ResponseEntity.notFound().build();
        }
        if(!service.validateAppointment(appointment)){
            return ResponseEntity.badRequest().build();
        }
        appointmentRepository.save(appointment);
        return  ResponseEntity.ok().build();
    }
// 6. **Cancel Appointment Method**:
//    - This method cancels an appointment by deleting it from the database.
//    - It ensures the patient who owns the appointment is trying to cancel it and handles possible errors.
//    - Instruction: Make sure that the method checks for the patient ID match before deleting the appointment.

    @Transactional
    public ResponseEntity<Map<String,String>> cancelAppointment(Long id, String token){
        if(appointmentRepository.findById(id).orElse(null) == null){
            return ResponseEntity.notFound().build();
        }
        appointmentRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
// 7. **Get Appointments Method**:
//    - This method retrieves a list of appointments for a specific doctor on a particular day, optionally filtered by the patient's name.
//    - It uses `@Transactional` to ensure that database operations are consistent and handled in a single transaction.
//    - Instruction: Ensure the correct use of transaction boundaries, especially when querying the database for appointments.

    @Transactional
    public Map<String, Object> getAppointment(String pname, LocalDate date, String token) {
        // base on token we can get doctorId
        Long doctorId = 1L;

        // Use the correct generic type for the map: Map<String, Object>
        Map<String, Object> map = new HashMap<>();

        // Correct time range for the entire day of 'date'
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.plusDays(1).atStartOfDay();

        // Fetch appointments
        List<Appointment> appointments = appointmentRepository
                .findByDoctorIdAndAppointmentTimeBetween(doctorId, startOfDay, endOfDay);

        for (Appointment appointment : appointments) {
            // Null check for appointment.getPatient() is good practice
            if (appointment.getPatient() == null) continue;

            String patientName = appointment.getPatient().getName();

            // 1. Filtering Logic: If pname is provided, check if the current appointment's patient name matches.
            if (pname != null && !pname.isEmpty()) {
                // Check for case-insensitive match for better user experience
                if (!pname.equalsIgnoreCase(patientName)) continue;
            }

            // 2. Mapping Logic: Add to map.
            // NOTE: This will overwrite if two distinct appointments have the same patient name.
            // The value type will be LocalDateTime.
            map.put(patientName, appointment.getAppointmentTime());
        }
        return map;
    }
// 8. **Change Status Method**:
//    - This method updates the status of an appointment by changing its value in the database.
//    - It should be annotated with `@Transactional` to ensure the operation is executed in a single transaction.
//    - Instruction: Add `@Transactional` before this method to ensure atomicity when updating appointment status.

    @Transactional
    public int changeStatus(Long id, String token) {
        Appointment appointment = appointmentRepository.findById(id).orElse(null);
        if(appointment == null){
            return 0;
        }
        appointmentRepository.updateStatus(appointment.getStatus() == 1 ? 0: 1, appointment.getId());
        return 1;
    }
}
