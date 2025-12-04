"use server";

import { revalidatePath } from "next/cache";
import { incidents, type Incident } from "@/lib/data/incidents";

/**
 * Service for tenant-related operations
 * Public functions that any tenant can use
 */
export async function submitIncident(formData: FormData) {
    const type = formData.get("type") as string;
    const description = formData.get("description") as string;
    const location = formData.get("location") as string;

    const newIncident: Incident = {
        id: incidents.length + 1,
        type,
        description,
        location,
        priority: "Pending", // Needs AI Triage
        status: "Open",
        createdAt: new Date().toISOString(),
    };

    incidents.unshift(newIncident);

    // Invalidate cache to update the dashboard
    revalidatePath('/');
}

