import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Progress} from "@/components/ui/progress.tsx";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {useState, useEffect} from "react";
import {toast} from "sonner";
import {HoverCard, HoverCardTrigger, HoverCardContent} from "@/components/ui/hover-card.tsx";

function DroneCard({
                       serialNumber,
                       weightClass,
                       weightLimit,
                       batteryLevel,
                       state,
                       loadedMeds,
                   }: {
    serialNumber: number;
    weightClass: string;
    weightLimit: number;
    batteryLevel: number;
    state: string;
    loadedMeds: string[];
}) {

    const getStateStyles = (state: string) => {
        switch (state) {
            case "LOADING":
                return "bg-yellow-600";
            case "LOADED":
                return "bg-red-600";
            case "IDLE":
                return "bg-green-600";
            default:
                return "bg-blue-600"; // Fallback for other states (DELIVERING, DELIVERED, RETURNING)
        }
    };

    //const showLoadDroneButton = location.pathname === "/idle-drones";

    const [medFormData, setMedFormData] = useState({
        name: "",
        weight: "",
        code: "",
        img_url: "rpc://121.002.000.broad.img",
    });

    const [meds, setMeds] = useState([]);
    const [medsLoading, setMedsLoading] = useState(true);
    const [medsError, setMedsError] = useState(null);

    useEffect(() => {
        async function fetchMeds() {
            try {
                const medPromises = loadedMeds.map((medId) => loadMed(medId));
                const medData = await Promise.all(medPromises);
                setMeds(medData);
                setMedsLoading(false);
            } catch (err) {
                setMedsError(err.message);
                setMedsLoading(false);
            }
        }

        if (loadedMeds && loadedMeds.length > 0) {
            fetchMeds();
        } else {
            setMedsLoading(false);
        }
    }, [loadedMeds]);

    const loadMed = async (medId: string) => {
        const res = await fetch(`http://localhost:8080/api/v1/medications/${medId}`, {
            method: "GET",
            headers: {"Content-Type": "application/json"},
        });
        if (!res.ok) {
            throw new Error(`Failed to fetch medication ${medId}`);
        }
        return await res.json();
    };

    const handleMedSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(`http://localhost:8080/api/v1/drones/${serialNumber}/loadMeds`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(medFormData),
            });
            const data = await res.json();
            console.log(data);

            toast(data.message, {description: data.code, duration: 2000})

            setInterval(() =>{
                document.location.reload();
            }, 3000)

        } catch (error) {
           console.log(error);
        }
    };

    const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toUpperCase();
        if (/^[A-Z0-9_]*$/.test(value)) {
            setMedFormData({...medFormData, code: value});
        }
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^[A-Za-z0-9_-]*$/.test(value)) {
            setMedFormData({...medFormData, name: value});
        }
    };

    // @ts-ignore
    return (
        <Card
            className="w-full border border-gray-200 shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between gap-4">
                <CardTitle className="text-base font-semibold">Serial number: {serialNumber}</CardTitle>
            </CardHeader>
            <hr/>
            <CardContent className="flwx flex-col space-y-2">
                <div className="space-y-2">
                    <h2 className="text-sm font-semibold">Weight Class: {weightClass}</h2>
                    <h2 className="text-sm font-semibold">Weight Limit: {weightLimit} grams</h2>
                    <h3 className="text-base">Battery: {batteryLevel}%</h3>
                    <Progress value={batteryLevel} className="w-[60%]"/>
                    <h3 className={`text-base text-white ${getStateStyles(state)} px-2 py-1 rounded-md`}>
                        State: {state}
                    </h3>

                    <div>
                        <h3 className="text-base font-medium">Loaded Meds:</h3>
                        {medsLoading ? (
                            <p className="text-sm text-gray-500">Loading...</p>
                        ) : medsError ? (
                            <p className="text-sm text-red-500">Error: {medsError}</p>
                        ) : meds.length > 0 ? (
                            <div className="flex flex-wrap gap-2 mt-1">
                                {meds.map((med) => (
                                    <HoverCard key={med.id}>
                                        <HoverCardTrigger asChild>
                                              <span
                                                  className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full cursor-pointer">
                                                {med.id}
                                              </span>
                                        </HoverCardTrigger>
                                        <HoverCardContent className="w-80">
                                            <div className="flex justify-between gap-4">
                                                <div className="space-y-1">
                                                    <h4 className="text-sm font-semibold">{med.name}</h4>
                                                    <p className="text-sm">Weight: {med.weight}g</p>
                                                    <div className="text-muted-foreground text-xs">ID: {med.id}</div>
                                                    <div
                                                        className="text-muted-foreground text-xs">CODE: {med.code}</div>
                                                </div>
                                            </div>
                                        </HoverCardContent>
                                    </HoverCard>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">None</p>
                        )}
                    </div>

                    <div className="mt-auto">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline">Load medication</Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                                <form onSubmit={handleMedSubmit} className="grid gap-4">
                                    <div className="space-y-2">
                                        <h4 className="leading-none font-medium">Add Medication</h4>
                                        <p className="text-muted-foreground text-sm">Enter medication details.</p>
                                    </div>
                                    <div className="grid gap-2">
                                        <div className="grid grid-cols-3 items-center gap-4">
                                            <Label htmlFor="name">Name</Label>
                                            <Input
                                                id="name"
                                                type="text"
                                                value={medFormData.name}
                                                onChange={handleNameChange}
                                                className="col-span-2 h-8"
                                                placeholder="Enter medication name"
                                            />
                                        </div>
                                        <div className="grid grid-cols-3 items-center gap-4">
                                            <Label htmlFor="weight">Weight (g)</Label>
                                            <Input
                                                id="weight"
                                                type="number"
                                                value={medFormData.weight}
                                                onChange={(e) => setMedFormData({
                                                    ...medFormData,
                                                    weight: e.target.value
                                                })}
                                                className="col-span-2 h-8"
                                                placeholder="Enter weight in grams"
                                            />
                                        </div>
                                        <div className="grid grid-cols-3 items-center gap-4">
                                            <Label htmlFor="code">Code</Label>
                                            <Input
                                                id="code"
                                                type="text"
                                                value={medFormData.code}
                                                onChange={handleCodeChange}
                                                className="col-span-2 h-8"
                                                placeholder="Enter medication code"
                                            />
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            <span>Medication saving depends on drone weight class and limit</span>
                                        </div>
                                        <Button
                                            type="submit"
                                            variant="outline"
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg"
                                        >
                                            Add Medication
                                        </Button>
                                    </div>
                                </form>
                            </PopoverContent>
                        </Popover>
                    </div>

                </div>
            </CardContent>
        </Card>
    );
}

export default DroneCard;