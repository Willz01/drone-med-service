package drx.drone.service.drone_med_service.exception;

public class DroneOverWeightException extends RuntimeException {
    public DroneOverWeightException() {
        super("Drone weight Limit exceeded");
    }
}