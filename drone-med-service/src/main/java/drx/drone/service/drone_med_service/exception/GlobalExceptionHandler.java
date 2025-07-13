package drx.drone.service.drone_med_service.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice(basePackages = "drx.drone.service.drone_med_service")
public class GlobalExceptionHandler {

    @ExceptionHandler(DroneNotExistException.class)
    public ResponseEntity<ErrorResponse> handleDroneNotExistException(DroneNotExistException ex){
        ErrorResponse errorResponse = new ErrorResponse("DRONE_NOT_FOUND", ex.getMessage());
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(DroneOverWeightException.class)
    public ResponseEntity<ErrorResponse> handleDroneOverWeightException(DroneNotExistException ex){
        ErrorResponse errorResponse = new ErrorResponse("DRONE_WEIGHT_LIMIT", ex.getMessage());
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MedicationNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleMedicationNotFoundException(DroneNotExistException ex){
        ErrorResponse errorResponse = new ErrorResponse("MEDICATION_NOT_FOUND", ex.getMessage());
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

}

record ErrorResponse(String code, String message) {
}
