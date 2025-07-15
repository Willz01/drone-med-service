import {useEffect, useState} from "react";
import MedicationCard from "@/components/MedicationCard.tsx";


export default function MedicationsPage() {

    const [medications, setMedicationsList] = useState([]);

    useEffect(() => {
        async function loadMedications() {
            try {
                const res = await fetch("http://localhost:8080/api/v1/medications"); // get all drones
                const data = await res.json();
                setMedicationsList(data);
            } catch (error) {
                console.error("Error fetching drones:", error);
            }
        }

        loadMedications();
    }, []);
    return (
        <>
            <div className="max-w-6xl mx-auto min-h-screen px-8 py-20">
                <h1 className="text-3xl font-bold mb-8 text-center">All saved medications</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {medications && medications.length > 0 ? (
                        medications.map(({name, weight, code, img_url}) => (
                            <MedicationCard
                                key={code} // Assuming serialNumber is unique
                                name={name}
                                weight={weight}
                                img_url={img_url} code={code}/>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 col-span-full">No drones available</p>
                    )}
                </div>


            </div>
        </>
    )
}