import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";

export default function MedicationCard({name, weight, code, img_url}:
                        {name: string, weight: number, code: number, img_url: string}) {
    return(
        <>
            <Card className="w-full border border-gray-200 shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center justify-between gap-4">
                    <CardTitle className="text-base font-semibold">
                        Name: {name}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <h2 className="text-sm font-semibold">Weight:  {weight} grams</h2>
                        <h3 className="text-sm">Code: {code}</h3>
                        <div>
                            <h3 className="text-sm font-medium">{img_url}</h3>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>
    )
}