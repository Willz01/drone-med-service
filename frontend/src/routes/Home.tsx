import {Button} from "@/components/ui/button"
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {useEffect, useState} from "react";
import {toast} from "sonner";


function CardThing({serialNumber, weightClass, state, batteryCapacity}: {
    serialNumber: string,
    weightClass: string,
    state: string,
    batteryCapacity: string
}) {

    const handleStateTransition = async (_serialNumber: string, currentState: string) => {

        switch (currentState) {
            case "LOADED":
                // patch call
                fetch(`http://localhost:8080/api/v1/drones/${serialNumber}/setForDelivery`, {
                    method: "PATCH",
                    // headers: {"Content-Type": "application/json"},
                }).then(() => {
                    toast("Drone sent for delivery.", {
                        description:`Drone ${serialNumber} ready for delivery`  ,
                        duration: 5000,
                    })

                    //setTimeout(() => {document.location.reload()}, 2000);
                });
                break
            case "DELIVERING":
                fetch(`http://localhost:8080/api/v1/drones/${serialNumber}/deliver`, {
                    method: "PATCH",
                    // headers: {"Content-Type": "application/json"},
                }).then(() => {
                    toast("Drone out to recipient.", {
                        description:`Drone ${serialNumber} was sent for delivery.`  ,
                        duration: 5000,
                    })

                    //setTimeout(() => {document.location.reload()}, 2000);
                });
                break
            case "DELIVERED":
                fetch(`http://localhost:8080/api/v1/drones/${serialNumber}/returnDrone`, {
                    method: "PATCH",
                    // headers: {"Content-Type": "application/json"},
                }).then(() => {
                    toast("Drone out to recipient.", {
                        description:`Drone ${serialNumber} ready for delivery`  ,
                        duration: 5000,
                    })

                    //setTimeout(() => {document.location.reload()}, 2000);
                });
                break
            case "RETURNING":
                fetch(`http://localhost:8080/api/v1/drones/${serialNumber}/markIdle`, {
                    method: "PATCH",
                    // headers: {"Content-Type": "application/json"},
                }).then(() => {
                    toast("Drone marked as idle", {
                        description:`Drone ${serialNumber} has returned from delivery and is idle`  ,
                        duration: 5000,
                    })

                    //setTimeout(() => {document.location.reload()}, 2000);
                });
                break
            default:
                return
        }

    }

    function getButtonText(state: string): string {
        switch (state) {
            case "LOADED":
                return "Send for Delivery"
            case "DELIVERING":
                return "Deliver"
            case "DELIVERED":
                return "Mark for return"
            case "RETURNING":
                return "Mark IDLE"
            default:
                return "Update State"
        }
    }


    return (
        <>
            <Card key={serialNumber}>
                <CardHeader>
                    <CardTitle>
                        <p><strong>ID:</strong> {serialNumber}</p>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className={"text-sm"}><strong>State:</strong> {state}</p>
                    <p className={"text-sm"}><strong>Weight Class:</strong> {weightClass}</p>
                    <p className={"text-sm"}><strong>Battery capacity:</strong> {batteryCapacity}%</p>
                </CardContent>
                <CardFooter>
                    <Button onClick={() => handleStateTransition(serialNumber, state)}>
                        {getButtonText(state)}
                    </Button>
                </CardFooter>
            </Card>
        </>
    )
}

export function DronesHomePage() {

    document.title = "Home";

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

        getLoadedDrones()
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

        getDronesForDelivery()
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

        getDeliveredDrones()
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

        getReturningDrones()
    }, [returningDrones]);



    // Group drones by state
  /*  const groupedDrones = {
        loaded: drones.filter((drone) => drone.state === "loaded"),
        ready: drones.filter((drone) => drone.state === "ready"),
        out: drones.filter((drone) => drone.state === "out"),
        returning: drones.filter((drone) => drone.state === "returning"),
    }*/

    return (
        <div className="flex justify-center">
            <div className="w-full max-w-5xl mx-auto p-4">
                <h1 className="text-2xl font-bold mb-6 text-center">Drone Management Dashboard</h1>

                {/* Loaded Drones */}
                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Loaded Drones</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {loadedDrones.map(({batteryCapacity, serialNumber, state, weightClass}) => (
                            <CardThing serialNumber={serialNumber} weightClass={weightClass}
                                       state={state} batteryCapacity={batteryCapacity}/>
                        ))}
                    </div>
                    {loadedDrones.length === 0 && (
                        <p className="text-center text-muted-foreground">No loaded drones.</p>
                    )}
                </section>

                {/* Ready for Delivery Drones */}
                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Ready for Delivery</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {dronesForDelivery.map(({batteryCapacity, serialNumber, state, weightClass}) => (
                            <CardThing serialNumber={serialNumber} weightClass={weightClass}
                                       state={state} batteryCapacity={batteryCapacity}/>
                        ))}
                    </div>
                    {dronesForDelivery.length === 0 && (
                        <p className="text-center text-muted-foreground">No drones ready for delivery.</p>
                    )}
                </section>

                {/* Out for Delivery Drones */}
                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Out for Delivery</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {deliveredDrones.map(({batteryCapacity, serialNumber, state, weightClass}) => (
                            <CardThing serialNumber={serialNumber} weightClass={weightClass}
                                       state={state} batteryCapacity={batteryCapacity}/>
                        ))}
                    </div>
                    {deliveredDrones.length === 0 && (
                        <p className="text-center text-muted-foreground">No delivered drones.</p>
                    )}
                </section>

                {/* Returning Drones */}
                <section className="mb-8">
                    <h2 className="text-xl font sm:grid-cols-2 lg:grid-cols-3 gap-4">Returning drones</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {returningDrones.map(({batteryCapacity, serialNumber, state, weightClass}) => (
                        <CardThing serialNumber={serialNumber} weightClass={weightClass}
                                   state={state} batteryCapacity={batteryCapacity}/>
                    ))}
                    </div>
                    {returningDrones.length === 0 && (
                        <p className="text-center text-muted-foreground">No returning drones.</p>
                    )}
                </section>

            </div>
        </div>
    )
}