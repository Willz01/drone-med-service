import {useEffect, useState} from "react";
import DroneCard from "@/components/DroneCard.tsx";
import {Toaster} from "sonner";

function IdleDronesPage(){
    document.title = "Idle Drones";

    const [drones, setDroneList] = useState([]);

    useEffect(() => {
        async function loadDrones() {
            try {
                const res = await fetch("http://localhost:8080/api/v1/drone/available"); // get all drones
                const data = await res.json();
                setDroneList(data);
            } catch (error) {
                console.error("Error fetching drones:", error);
            }
        }
        loadDrones();
    }, [drones]);

    return(
        <>
            <div className="max-w-6xl mx-auto min-h-screen px-8 py-20">
                <h1 className="text-3xl font-bold text-center">Idle (available drones) </h1>
                <h3 className="dark text-center text-md mb-6 text-accent">All available drones for loading</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {drones && drones.length > 0 ? (
                        drones.map(({batteryCapacity, loadedMeds, serialNumber, state, weightClass, weightLimit}) => (
                            <>
                                <DroneCard
                                    key={serialNumber} // Assuming serialNumber is unique
                                    batteryLevel={batteryCapacity}
                                    weightLimit={weightLimit}
                                    serialNumber={serialNumber}
                                    state={state}
                                    weightClass={weightClass}
                                    loadedMeds={loadedMeds}
                                />

                            </>
                        ))

                    ) : (
                        <p className="text-center text-gray-500 col-span-full">No drones available</p>
                    )}
                </div>

                <Toaster theme={"dark"} position="top-right" />

            </div>
        </>
    )
}

export default IdleDronesPage;