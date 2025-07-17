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
---
- **Frontend**:
  - Bun (Install from https://bun.sh/)
  - Node.js (optional, for compatibility, but Bun is preferred)

---
- **Git**:
  - Git installed for cloning and managing the repository

---
## Repository Structure

The project is organized as a monorepo with both backend and frontend in the same repository:

```
drone-med-service/
├── backend-service/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/example/drone-med-service/
│   │   │   │   ├── src/main/java
│   │   │   │   │   ├── config/
│   │   │   │   │   ├── controller/
│   │   │   │   │   ├── dto/
│   │   │   │   │   ├── exception/
│   │   │   │   │   ├── model/
│   │   │   │   │   ├── repository/
│   │   │   │   │   ├── service/
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

----
## Backend Endpoints and Frontend Integration

The backend exposes RESTful API endpoints that the frontend uses to fetch and manage data related to drones and medications.

### Backend Endpoints

The backend provides the following endpoints (adjust based on your actual implementation):

- **GET api/v1/drones**:
  - **Description**: Retrieves a list of all drones.
  - **Response**: JSON array of drone objects (`{ serialNumber, weightClass, weightLimit, batteryCapacity, state, LoadedMeds }`).
  - **Example**: `GET http://localhost:8080/v1/api/drones`

----
- **GET api/v1/drones/{serialNumber}**:
  - **Description**: Retrieves details of a specific drone by serialNumber.
  - **Response**: JSON object of a single drone.
  - **Example**: `GET http://localhost:8080/v1/api/drones/67fff78ddd`

----

- **POST api/v1/drones/register**:
  - **Description**: Register a new drone.
  - **Request Body**: JSON object (`{ weightClass }`).
  - **Response**: JSON object of the created drone.
  - **Example**: `POST http://localhost:8080/v1/api/drones/register`

----

- **POST api/v1/drones/{serialNumber}/loadMeds**:
  - **Description**: Load drone with medications.
  - **RequestBody**: JSON object of MedRequest (`{ name, code, weight }`)
  - **Example**: `POST http://localhost:8080/v1/api/drones/67fff78ddd/loadMeds`

----

- **GET api/v1/drones/{serialNumber}/medications**:
  - **Description**: Get medications loaded on a particular drones.
  - **Example**: `GET http://localhost:8080/v1/api/drones/67fff78ddd/medications`
  - **Response**: JSON array of med objects loaded on the drone

----

- **GET api/v1/drones/available**:
  - **Description**: Get all available drone <Idle>.
  - **Example**: `GET http://localhost:8080/v1/api/drones/available`
  - **Response**: JSON list of all available drones

----

- **GET api/v1/drones/{serialNumber}/battery**:
  - **Description**: Get battery level of drone.
  - **Example**: `GET http://localhost:8080/v1/api/drones/67fff78ddd/battery`
  - **Response**: Battery level of drone

----

- **GET api/v1/medications**:
  - **Description**: Get all saved medications.
  - **Example**: `GET http://localhost:8080/v1/api/medications`
  - **Response**: JSON list of all medications

----

- **GET api/v1/drones/loaded**:
  - **Description**: Get all loaded drones.Where **State==State.LOADED**
  - **Example**: `GET http://localhost:8080/v1/api/drones/loaded`
  - **Response**: JSON list of loaded drones

----

- **PATCH api/v1/drones/{serialNumber}/setForDelivery**:
  - **Description**: Change drone state to **DELIVERING**.
  - **Example**: `PATCH http://localhost:8080/v1/api/drones/67fff78ddd/setForDelivery`
  - **Response**: HTTP.OK

----

- **GET api/v1/drones/forDelivery**:
  - **Description**: Get all drones where **State==State.DELIVERING**.
  - **Example**: `GET http://localhost:8080/v1/api/drones/loaded`
  - **Response**: JSON list of drones ready for delivery.

----

- **PATCH api/v1/drones/{serialNumber}/deliver**:
  - **Description**: Change drone state to **DELIVERED**
  - **Example**: `PATCH http://localhost:8080/v1/api/drones/67fff78ddd/deliver`
  - **Response**: HTTP.OK

----

- **GET api/v1/drones/delivered**:
  - **Description**: Get all drones where **State==State.DELIVERED**.
  - **Example**: `GET http://localhost:8080/v1/api/drones/delivered`
  - **Response**: JSON list of delivered drones.

----

- **PATCH api/v1/drones/{serialNumber}/returnDrone**:
  - **Description**: Change drone state to **RETURNING**
  - **Example**: `PATCH http://localhost:8080/v1/api/drones/67fff78ddd/returnDrone`
  - **Response**: HTTP.OK

----

- **GET api/v1/drones/returning**:
  - **Description**: Get all drones where **State==State.DELIVERED**.
  - **Example**: `GET http://localhost:8080/v1/api/drones/returning`
  - **Response**: JSON list of returning drones.

----

- **PATCH api/v1/drones/{serialNumber}/markIdle**:
  - **Description**: Change drone state to **IDLE**
  - **Example**: `PATCH http://localhost:8080/v1/api/drones/67fff78ddd/markIdle`
  - **Response**: HTTP.OK

----

### Frontend UI

Details out each page and its functionality.

#### Drone Management Dashboard ("/")

```
The Drone Management Dashboard categorizes drones into Loaded Drones, Ready for Delivery, Out for 
Delivery, and Returning drones. Each drone card shows its ID, state (e.g., LOADED, DELIVERING), 
weight class, battery capacity, and relevant actions (e.g., "Send for Delivery," "Deliver," 
"Mark for return," "Mark IDLE"). Sections update dynamically to reflect current drone statuses, 
with empty states displayed as "No drones ready for delivery" when applicable.
```

![DashBoard](readme/manage-dash.png)
---

#### All Drones ("/drones")

```
This section provides an overview of all drones, regardless of state (LOADING, LOADED, IDLE). 
Each card includes the serial number, weight class, weight limit, battery level, current state 
(color-coded: LOADING - yellow, LOADED - red, IDLE - green), and loaded medications. 
Users can add or load medications via interactive prompts that require name, weight, 
and code inputs, with validation based on drone weight limits.
```

![All drones](readme/drones.png)
---

#### Register Drone ("/register")

```
The Register Drone section allows users to add new drones by selecting a weight class 
(e.g., CRUISER_WEIGHT). A simple form prompts the user to choose a class and confirm registration, 
integrating the new drone into the system for immediate use.
```

![Register](readme/register.png)
---

#### Idle(available drones) ("/idle-drones")

```
This section showcases drones available for tasks, listed by serial number. 
Each drone card displays its weight class (e.g., CRUISER_WEIGHT, MIDDLE_WEIGHT), 
weight limit, battery level and current state (e.g., IDLE). 
Users can initiate a "Load medication" action for idle drones, with the UI reflecting state changes 
(e.g., IDLE in green).
```

![Idle](readme/idle-drones.png)
---

#### Drone Events ()

```
This section displays real-time updates and messages related to drone activities. 
Each entry includes a unique ID, a status message (e.g., "Fetched all drones [LOADED, LOADING,
IDLE, etc]"), and a timestamp. The interface highlights events such as new medication loads with
additional details like medication codes, ensuring users stay informed about drone operations.
```

![Drone Events](readme/event.png)

#### Medication

```
This section lists all available medications in a tabular format, with columns for name, 
weight (in grams), and code. A filter option enables searching by medication name,
and pagination controls (Previous, Next) help navigate the list. Users can select medications 
for loading onto drones, with the UI updating accordingly.
```

![Medication](readme/medications.png)