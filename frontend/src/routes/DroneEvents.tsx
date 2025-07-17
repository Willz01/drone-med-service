import {Card, CardContent} from "@/components/ui/card"
import {format} from "date-fns"
import {v4 as uuidv4} from 'uuid';
import {useEffect, useState} from "react";


export type EventMessage = {
    id: string
    message: string
    timeStamp: string // ISO string "2025-07-17T22:21:00Z"
}


function fetchEventMessages(): EventMessage[] {
    try {
        const stored = localStorage.getItem("eventMessages")
        if (stored) {
            return JSON.parse(stored) as EventMessage[]
        }
        // mock eventMessages
        const initialData: EventMessage[] = [
            {id: "56HYUHF-89", message: "Drone Alpha loaded successfully", timeStamp: "2025-07-17T22:21:00Z"},
            {id: "76YOOMG-90", message: "Drone Beta dispatched for delivery", timeStamp: "2025-07-17T22:20:00Z"},
            {id: "44ROOOF-99", message: "Drone Gamma returned to base", timeStamp: "2025-07-17T22:19:00Z"},
        ]
        localStorage.setItem("eventMessages", JSON.stringify(initialData))
        return initialData
    } catch (error) {
        console.error("No event", error)
        return []
    }
}

export function saveEventToLocalStorage(message: string): void {
    try {
        const stored = localStorage.getItem("eventMessages")
        const events: EventMessage[] = stored ? JSON.parse(stored) : []
        const newEvent: EventMessage = {
            id:  uuidv4(),
            message: message,
            timeStamp: new Date().toISOString(),
        }
        events.push(newEvent)
        localStorage.setItem("eventMessages", JSON.stringify(events))
    } catch (error) {
        console.error("Failed to save event to localStorage:", error)
    }
}

export default function DroneEvents() {
    document.title = "Events"
    const [messages, setMessages] = useState<EventMessage[]>([])

    useEffect(() => {
        const data = fetchEventMessages()
        setMessages(data)
    }, [])

    return (
        <div className="flex justify-center">
            <div className="w-full max-w-5xl mx-auto p-4">
                <h1 className="text-2xl font-bold mb-6 text-center">Event Messages</h1>
                <div className="space-y-4">
                    {messages.map((message) => (
                        <Card key={message.id} className="w-full">
                            <CardContent className="flex items-center justify-between p-4">
                                <div className="flex-1">
                                    <p className="font-semibold text-xs ">ID: {message.id}</p>
                                </div>
                                <div className="flex-1">
                                    <p>{message.message}</p>
                                </div>
                                <div className="flex-1 text-right">
                                    <p className="text-sm text-muted-foreground">
                                        {format(new Date(message.timeStamp), "MMM d, yyyy, h:mm a")}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {messages.length === 0 && (
                        <p className="text-center text-muted-foreground">No event messages. Make something happen!</p>
                    )}
                </div>
            </div>
        </div>
    )
}
