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
  - Bun (latest version, install from https://bun.sh/)
  - Node.js (optional, for compatibility, but Bun is preferred)

- **Git**:
  - Git installed for cloning and managing the repository

## Repository Structure

The project is organized as a monorepo with both backend and frontend in the same repository:

```
drone-medic-service/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/example/dronemedicservice/
│   │   │   ├── resources/application.properties
│   ├── pom.xml
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── DroneList.jsx
│   │   │   ├── DeliveryForm.jsx
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
   cd drone-medic-service
   ```

2. **Configure MongoDB Atlas**:
   - Create a MongoDB Atlas account and set up a cluster.
   - Obtain the MongoDB connection string (e.g., `mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority`).
   - Open the `backend/src/main/resources/application.properties` file and update the following properties:
     ```properties
     spring.data.mongodb.uri=<your-mongodb-atlas-connection-string>
     spring.data.mongodb.database=<your-database-name>
     ```
   - Replace `<your-mongodb-atlas-connection-string>` with your MongoDB Atlas connection string and `<your-database-name>` with the name of your database (e.g., `drone_medic_db`).

3. **Install Dependencies**:
   - Navigate to the backend directory:
     ```bash
     cd backend
     ```
   - Run the following command to download dependencies:
     ```bash
     mvn clean install
     ```

### Running from Terminal

1. From the `backend` directory, run the Spring Boot application:
   ```bash
   mvn spring-boot:run
   ```

2. The backend will start on `http://localhost:8080` (or the port specified in `application.properties` if customized).

### Running from an IDE

1. Open the `backend` folder in your preferred IDE (e.g., IntelliJ IDEA, Eclipse).
2. Import the project as a Maven project.
3. Locate the main application class (e.g., `DroneMedicApplication.java`) in `backend/src/main/java/com/example/dronemedicservice`.
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
   - The frontend will be available at `http://localhost:3000` (or another port if specified).

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

The backend exposes RESTful API endpoints that the frontend uses to fetch and manage data related to drones and medical deliveries.

### Backend Endpoints

The backend provides the following endpoints (adjust based on your actual implementation):

- **GET /api/drones**:
  - **Description**: Retrieves a list of all drones.
  - **Response**: JSON array of drone objects (e.g., `{ id, model, status, batteryLevel }`).
  - **Example**: `GET http://localhost:8080/api/drones`

- **GET /api/drones/{id}**:
  - **Description**: Retrieves details of a specific drone by ID.
  - **Response**: JSON object of a single drone.
  - **Example**: `GET http://localhost:8080/api/drones/123`

- **POST /api/deliveries**:
  - **Description**: Creates a new delivery request.
  - **Request Body**: JSON object (e.g., `{ droneId, destination, payload }`).
  - **Response**: JSON object of the created delivery.
  - **Example**: `POST http://localhost:8080/api/deliveries`

- **GET /api/deliveries**:
  - **Description**: Retrieves a list of all deliveries.
  - **Response**: JSON array of delivery objects (e.g., `{ id, droneId, destination, status }`).
  - **Example**: `GET http://localhost:8080/api/deliveries`

### Frontend Data Fetching

The frontend uses the `fetch` API to interact with the backend endpoints. Below is an example of how the frontend fetches and displays data (in `frontend/src/components/DroneList.jsx`):

```jsx
import React, { useEffect, useState } from 'react';

function DroneList() {
  const [drones, setDrones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDrones = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/drones');
        const data = await response.json();
        setDrones(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching drones:', error);
        setLoading(false);
      }
    };
    fetchDrones();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl">Drones</h2>
      <ul>
        {drones.map((drone) => (
          <li key={drone.id} className="py-2">
            {drone.model} - {drone.status} (Battery: {drone.batteryLevel}%)
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DroneList;
```

### Explanation of Frontend-Backend Integration

- **Fetching Drones**:
  - The `DroneList` component uses the `fetch` API to call `GET /api/drones` when the component mounts (via `useEffect`).
  - The response is stored in the `drones` state and rendered as a list.

- **Creating a Delivery**:
  - A form component (e.g., `DeliveryForm.jsx`) collects user input (e.g., drone ID, destination) and sends a `POST` request to `/api/deliveries`.
  - Example:
    ```jsx
    const handleSubmit = async (e) => {
      e.preventDefault();
      const delivery = { droneId: '123', destination: 'Hospital A', payload: 'Medical Supplies' };
      await fetch('http://localhost:8080/api/deliveries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(delivery),
      });
    };
    ```

- **Fetching Deliveries**:
  - Similar to the drone list, a `DeliveryList` component can fetch `GET /api/deliveries` to display delivery statuses.

- **CORS Configuration**:
  - Ensure the backend is configured to allow CORS requests from the frontend (`http://localhost:3000`). Add the following to your Spring Boot `application.properties` if needed:
    ```properties
    spring.web.cors.allowed-origins=http://localhost:3000
    ```