import {useEffect, useState} from "react";


function App() {

    // STATE == "LOADED"
    const [loadedDrones, setLoadedDrones] = useState([]);
    useEffect(() => {
        async function getLoadedDrones() {
            try {
                const res = await fetch("http://localhost:8080/api/v1/drones/loaded"); // get all drones
                const data = await res.json();
                setLoadedDrones(data);
            } catch (error) {
                console.error("Error fetching drones:", error);
            }
        }

        getLoadedDrones().then(r => console.log(r));
    }, [loadedDrones]);

    // STATE == "DELIVERING"
    const [dronesForDelivery, setDronesForDelivery] = useState([]);
    useEffect(() => {
        async function getDronesForDelivery() {
            try {
                const res = await fetch("http://localhost:8080/api/v1/drones/forDelivery"); // get all drones
                const data = await res.json();
                setDronesForDelivery(data);
            } catch (error) {
                console.error("Error fetching drones:", error);
            }
        }

        getDronesForDelivery().then(r => console.log(r));
    }, [dronesForDelivery]);

    // STATE == "DELIVERED"
    const [deliveredDrones, setDeliveredDrones] = useState([]);
    useEffect(() => {
        async function getDeliveredDrones() {
            try {
                const res = await fetch("http://localhost:8080/api/v1/drones/delivered"); // get all drones
                const data = await res.json();
                setDeliveredDrones(data);
            } catch (error) {
                console.error("Error fetching drones:", error);
            }
        }

        getDeliveredDrones().then(r => console.log(r));
    }, [deliveredDrones]);

    // STATE == "RETURNING"
    const [returningDrones, setReturningDrones] = useState([]);
    useEffect(() => {
        async function getReturningDrones() {
            try {
                const res = await fetch("http://localhost:8080/api/v1/drones/returning"); // get all drones
                const data = await res.json();
                setReturningDrones(data);
            } catch (error) {
                console.error("Error fetching drones:", error);
            }
        }

        getReturningDrones().then(r => console.log(r));
    }, [returningDrones]);


    return (
        <div className="text-center">

        </div>
    )
}

export default App
