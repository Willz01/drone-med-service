package drx.drone.service.drone_med_service.exception;

public class MedicationNotFoundException extends RuntimeException{
    public MedicationNotFoundException(String medID) {
        super("Medication with " + medID + " not found!");
    }
}
