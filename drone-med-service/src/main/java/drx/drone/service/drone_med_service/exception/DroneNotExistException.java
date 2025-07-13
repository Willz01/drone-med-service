package drx.drone.service.drone_med_service.exception;

public class DroneNotExistException extends RuntimeException{
    public DroneNotExistException(String serialNumber) {
        super("Drone with " + serialNumber + " doesn't exist!");
    }
}
