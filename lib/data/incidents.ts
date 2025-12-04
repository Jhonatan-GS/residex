// MOCK DATABASE
// In a real app, this would be a SQL DB
export interface Incident {
    id: number;
    type: string;
    description: string;
    location: string;
    priority: string;
    status: string;
    createdAt: string;
}

export let incidents: Incident[] = [
    {
        id: 1,
        type: "Maintenance",
        description: "Elevator 3 is making a grinding noise",
        location: "Lobby",
        priority: "High",
        status: "Open",
        createdAt: "2023-10-01T10:00:00Z",
    },
    {
        id: 2,
        type: "Security",
        description: "Side door propped open",
        location: "Garage B",
        priority: "Medium",
        status: "Resolved",
        createdAt: "2023-10-02T14:30:00Z",
    },
];

