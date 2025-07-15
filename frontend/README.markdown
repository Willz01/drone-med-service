# Drone Medic Service

Welcome to the Drone Medic Service, a platform for managing drone-based medical deliveries. This project is a monorepo containing both a backend (Java Spring Boot) and a frontend (Bun React) in a single Git repository. This README provides instructions on setting up and running both components, as well as details on how the frontend interacts with the backend endpoints for data fetching.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Repository Structure](#repository-structure)
- [Backend Setup and Running](#backend-setup-and-running)
  - [Configuration](#configuration)
  - [Running from Terminal](#running-from-terminal)
  - [Running from an IDE](#running-from-an-ide)
- [Frontend Setup and Running](#frontend-setup-and-running)
- [Backend Endpoints and Frontend Integration](#backend-endpoints-and-frontend-integration)

## Prerequisites

Before setting up the project, ensure you have the following installed:

- **Backend**:
  - Java 17 or later
  - Maven 3.6 or later
  - MongoDB Atlas account (for database connection)
  - An IDE (e.g., IntelliJ IDEA, Eclipse) (optional, for IDE-based running)

- **Frontend**:
  - Bun (Install from https://bun.sh/)
  - Node.js (optional, for compatibility, but Bun is preferred)

- **Git**:
  - Git installed for cloning and managing the repository

## Repository Structure

The project is organized as a monorepo with both backend and frontend in the same repository:

```
drone-med-service/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/example/drone-med-service/
│   │   │   │   ├──── src/main/java
│   │   │   │   │     ├──── config/
│   │   │   │   │     ├──── controller/
│   │   │   │   │     ├──── dto/
│   │   │   │   │     ├──── exception/
│   │   │   │   │     ├──── model/
│   │   │   │   │     ├──── repository/
│   │   │   │   │     ├──── service/
│   │   │   ├── resources/application.properties
│   ├── pom.xml
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── DroneCard.tsx
│   │   │   ├── MedicationCard.tsx
│   ├── package.json
│   ├── bun.lockb
├── .gitignore
├── README.md
```

## Backend Setup and Running

The backend is a Java Spring Boot application that connects to a MongoDB Atlas database for storing and retrieving drone and delivery data.

### Configuration

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd drone-med-service
   ```

2. **Configure MongoDB Atlas**:
   - Create a MongoDB Atlas account and set up a cluster.
   - Get the MongoDB connection string (e.g., `mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority`).
   - Open the `backend/src/main/resources/application.properties` file and update the following properties:
     ```properties
     spring.data.mongodb.uri=<your-mongodb-atlas-connection-string>
     spring.data.mongodb.database=<your-database-name>
     ```
   - Replace `<your-mongodb-atlas-connection-string>` with your MongoDB Atlas connection string and `<your-database-name>` with the name of your database (e.g., `drone_medic_db`).

3. **Install Dependencies**:
   - Run the following command to download dependencies:
     ```bash
     mvn clean install
     ```

### Running from Terminal

1. In the `drone-med-service` directory, run the Spring Boot application:
   ```bash
   mvn spring-boot:run
   ```

2. The backend will start on `http://localhost:8080` (or the port specified in `application.properties` if customized).

### Running from an IDE

1. In the `drone-med-service` folder in your preferred IDE (e.g., IntelliJ IDEA, Eclipse).
2. Import the project as a Maven project.
3. Locate the main application class (`DroneMedServiceApplication.java`).
4. Right-click the main class and select **Run** or **Debug** to start the application.
5. The backend will start on `http://localhost:8080`.

## Frontend Setup and Running

The frontend is a React application built with Bun for package management and runtime.

1. **Navigate to the Frontend Directory**:
   ```bash
   cd frontend
   ```

2. **Install Dependencies**:
   - Ensure Bun is installed. Install dependencies using:
     ```bash
     bun install
     ```

3. **Run the Development Server**:
   - Start the frontend development server:
     ```bash
     bun run dev
     ```
   - The frontend will be available at `http://localhost:3000`

4. **Build for Production** (optional):
   - To create a production build:
     ```bash
     bun run build
     ```
   - Serve the production build:
     ```bash
     bun run preview
     ```

## Backend Endpoints and Frontend Integration

The backend exposes RESTful API endpoints that the frontend uses to fetch and manage data related to drones and medications.

### Backend Endpoints

The backend provides the following endpoints (adjust based on your actual implementation):

- **GET api/v1/drones**:
  - **Description**: Retrieves a list of all drones.
  - **Response**: JSON array of drone objects (`{ serialNumber, weightClass, weightLimit, batteryCapacity, state, LoadedMeds }`).
  - **Example**: `GET http://localhost:8080/v1/api/drones`

- **GET api/v1/drones/{serialNumber}**:
  - **Description**: Retrieves details of a specific drone by serialNumber.
  - **Response**: JSON object of a single drone.
  - **Example**: `GET http://localhost:8080/v1/api/drones/67fff78ddd`

- **POST api/v1/drones/register**:
  - **Description**: Register a new drone.
  - **Request Body**: JSON object (`{ weightClass }`).
  - **Response**: JSON object of the created drone.
  - **Example**: `POST http://localhost:8080/v1/api/drones/register`

- **POST api/v1/drones/{serialNumber}/loadMeds**:
  - **Description**: Load drone with medications.
  - **RequestBody**: JSON object of MedRequest (`{ name, code, weight }`)
  - **Example**: `GET http://localhost:8080/v1/api/drones/67fff78ddd/loadMeds`

- **GET api/v1/drones/{serialNumber}/medications**:
    - **Description**: Get medications loaded on a particular drones.
    - **Example**: `GET http://localhost:8080/v1/api/drones/67fff78ddd/medications`
    - **Response**: JSON array of med objects loaded on the drone

- **GET api/v1/drones/available**:
    - **Description**: Get all available drone <Idle>.
    - **Example**: `GET http://localhost:8080/v1/api/drones/available`
    - **Response**: JSON list of all available drones

- **GET api/v1/drones/{serialNumber}/battery**:
    - **Description**: Get battery level of drone.
    - **Example**: `GET http://localhost:8080/v1/api/drones/67fff78ddd/battery`
    - **Response**: Battery level of drone

- **GET api/v1/drones/{serialNumber}/battery**:
    - **Description**: Get battery level of drone.
    - **Example**: `GET http://localhost:8080/v1/api/drones/67fff78ddd/battery`
    - **Response**: Battery level of drone

- **GET api/v1/medications**:
    - **Description**: Get all saved medications.
    - **Example**: `GET http://localhost:8080/v1/api/medications`
    - **Response**: JSON list of all medications
