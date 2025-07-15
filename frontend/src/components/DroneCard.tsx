import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Progress} from "@/components/ui/progress.tsx";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {useState} from "react";
import {toast} from "sonner";

// test

function DroneCard({serialNumber, weightClass, weightLimit, batteryLevel, state, loadedMeds}:
                   {
                       serialNumber: number,
                       weightClass: string,
                       weightLimit: number,
                       batteryLevel: number,
                       state: string,
                       loadedMeds: []
                   }) {

    const getStateStyles = (state : string) => {
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

    const showFAB = location.pathname === "/idle-drones";

    const [medFormData, setMedFormData] = useState({
        name: "",
        weight: "",
        code: "",
        img_url: "rpc://121.002.000.broad.img"
    });

    /**
     * Handle for different exception Code, DroneWeight,
     * @param e
     */
    const handleMedSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(`http://localhost:8080/api/v1/drone/${serialNumber}/loadMeds`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(medFormData),
            });
            if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
            const result = await res.json();
            console.log("Medication added:", result);

            toast("Medication Added", {
                description: `Added medication: ${medFormData.name}`,
            });

            setInterval(() => {
                document.location.href = "/medications"
            },3000)


        } catch (error) {

            console.log("Error adding medication:", error);

        }
    };

    const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toUpperCase();
        if (/^[A-Z0-9_]*$/.test(value)) {
            setMedFormData({ ...medFormData, code: value });
        }
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^[A-Za-z0-9_-]*$/.test(value)) {
            setMedFormData({ ...medFormData, name: value });
        }
    };

    return (
        <Card
            className="w-full border border-gray-200 shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between gap-4">
                <CardTitle className="text-base font-semibold">
                    Serial number: {serialNumber}
                </CardTitle>
            </CardHeader>
            <hr/>
            <CardContent>
                <div className="space-y-2">
                    <h2 className="text-sm font-semibold">Weight Class: {weightClass}</h2>
                    <h2 className="text-sm font-semibold">
                        Weight Limit: {weightLimit} grams
                    </h2>
                    <h3 className="text-base">Battery: {batteryLevel}%</h3>
                    <Progress value={batteryLevel} className="w-[60%] "/>

                    <h3
                        className={`text-base text-white ${getStateStyles(state)} px-2 py-1 rounded-md`}
                    >
                        State: {state}
                    </h3>


                    <div>
                        <h3 className="text-base font-medium">Loaded Meds:</h3>
                        {loadedMeds && loadedMeds.length > 0 ? (
                            <div className="flex flex-wrap gap-2 mt-1">
                                {loadedMeds.map((medId) => (
                                    <span
                                        key={medId}
                                        className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full"
                                    >
                                        {medId}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">None</p>
                        )}
                    </div>

                    {showFAB && (
                        <div className="">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline">Load medication</Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-80">
                                    <form onSubmit={handleMedSubmit} className="grid gap-4">
                                        <div className="space-y-2">
                                            <h4 className="leading-none font-medium">Add Medication</h4>
                                            <p className="text-muted-foreground text-sm">
                                                Enter medication details.
                                            </p>
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
                                                    onChange={(e) =>
                                                        setMedFormData({...medFormData, weight: e.target.value})
                                                    }
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
                                                <span> Medication saving depends on drone weight class and limit</span>
                                            </div>
                                            <Button
                                                type="submit"
                                                variant={"outline"}
                                                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg"
                                            >
                                                Add Medication
                                            </Button>
                                        </div>
                                    </form>
                                </PopoverContent>
                            </Popover>
                        </div>
                    )}

                </div>
            </CardContent>
        </Card>
    );
}

export default DroneCard;