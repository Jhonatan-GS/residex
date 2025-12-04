"use server";

import { revalidatePath } from "next/cache";
import { incidents } from "@/lib/data/incidents";

/**
 * Service for admin-related operations
 * Protected functions that only managers/admins should use
 */

/**
 * Mock authentication check
 * In a real app, this would verify the user's role/permissions
 */
function isAdmin(): boolean {
    // TODO: Implement real authentication check
    return true;
}

/**
 * Resolve an incident
 * Only admins can resolve incidents
 */
export async function resolveIncident(id: number) {
    // Check if user is admin
    if (!isAdmin()) {
        throw new Error("Unauthorized: Only admins can resolve incidents");
    }

    const incident = incidents.find((i) => i.id === id);
    if (incident) {
        incident.status = "Resolved";
    }

    // Invalidate cache to update the dashboard
    revalidatePath('/');
}

