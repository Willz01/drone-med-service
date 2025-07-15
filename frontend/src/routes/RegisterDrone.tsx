import {useState} from "react";
import {Card, CardHeader, CardTitle, CardContent, CardDescription} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select.tsx";
import {Button} from "@/components/ui/button.tsx";
import {toast} from "sonner";


function RegisterDronePage() {
    document.title = "Register Drone";

    const [formData, setFormData] = useState({
        weightClass: "",
    });

    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        console.log("Registering drone:", formData);


        fetch("http://localhost:8080/api/v1/drone/register", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(formData),
        }).then(() => {
            toast("Drone Registered", {
                description: "New " + formData.weightClass + " drone registered.",
                duration: 2000,
            })
        });


        setInterval(() => {
            document.location.href = "/idle-drones"
        }, 3000)


    };

    return (
        <div className="flex items-center justify-center mt-60 ">
            <Card className="w-full max-w-md border border-gray-200 shadow-lg rounded-lg">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">
                        Register Drone
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <CardDescription>
                        <h3 className="dark text-center text-md mb-2 text-gray-600"> Add new drone by selecting a drone weight class </h3>
                    </CardDescription>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            {/*  <Label htmlFor="weightClass" className="block text-md font-medium text-gray-700">

                            </Label>*/}
                            <Select
                                value={formData.weightClass}
                                onValueChange={(value) =>
                                    setFormData({...formData, weightClass: value})
                                }>
                                <SelectTrigger className="rounded-lg max-w-full mask-add">
                                    <SelectValue placeholder="Select Drone weight class"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Weight Class</SelectLabel>
                                        <SelectItem value="HEAVY_WEIGHT">HEAVY WEIGHT DRONE (500 grams)</SelectItem>
                                        <SelectItem value="MIDDLE_WEIGHT">MIDDLE WEIGHT DRONE (400 grams)</SelectItem>
                                        <SelectItem value="LIGHT_WEIGHT">LIGHT WEIGHT DRONE (200 grams)</SelectItem>
                                        <SelectItem value="CRUISER_WEIGHT">CRUISER WEIGHT DRONE (100 grams)</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                        >
                            Register Drone
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

export default RegisterDronePage;