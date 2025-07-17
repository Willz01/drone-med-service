import { useEffect, useState } from "react";
import DroneCard from "@/components/DroneCard.tsx";
import {saveEventToLocalStorage} from "@/routes/DroneEvents.tsx";

function DronesPage() {
    document.title = "Drones";

    const [drones, setDroneList] = useState([]);

    useEffect(() => {
        async function loadDrones() {
            try {
                const res = await fetch("http://localhost:8080/api/v1/drones"); // get all drones
                const data = await res.json();
                setDroneList(data);
                saveEventToLocalStorage(`Fetched all drones[LOADED, LOADING, IDLE, etc]`);
            } catch (error) {
                console.error("Error fetching drones:", error);
            }
        }
        loadDrones();
    }, []);



    return (
        <div className="max-w-6xl mx-auto min-h-screen px-8 py-20">
            <h1 className="text-3xl font-bold text-center">All Drones</h1>
            <h3 className="dark text-center text-accent mb-6 text-md ">All drones of different state[LOADING, LOADED & IDLE]</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {drones && drones.length > 0 ? (
                    drones.map(({batteryCapacity, loadedMeds, serialNumber, state, weightClass, weightLimit}) => (
                        <DroneCard
                            key={serialNumber} // Assuming serialNumber is unique
                            batteryLevel={batteryCapacity}
                            weightLimit={weightLimit}
                            serialNumber={serialNumber}
                            state={state}
                            weightClass={weightClass}
                            loadedMeds={loadedMeds}
                        />
                    ))
                ) : (
                    <p className="text-center text-gray-500 col-span-full">No drones available</p>
                )}
            </div>
            <div className="mt-3 text-accent">
                <h3 className="dark text-center text-md text-accent">LOADING - YELLOW</h3>
                <h3 className="dark text-center text-md  text-accent">LOADED - RED</h3>
                <h3 className="dark text-center text-md text-accent">IDLE - GREEN</h3>
            </div>
        </div>
    );
}

export default DronesPage;