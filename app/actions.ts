"use server";

import { incidents } from "@/lib/data/incidents";
import { submitIncident as tenantSubmitIncident } from "@/lib/services/tenant";
import { resolveIncident as adminResolveIncident } from "@/lib/services/admin";

/**
 * Server Actions - Thin wrappers that delegate to service layers
 * This file acts as the public API for Server Actions
 */

/**
 * Get all incidents
 * Public function - can be called by anyone
 */
export async function getIncidents() {
    return incidents;
}

/**
 * Submit a new incident
 * Public function - delegates to tenant service
 */
export async function submitIncident(formData: FormData) {
    return await tenantSubmitIncident(formData);
}

/**
 * Resolve an incident
 * Admin-only function - delegates to admin service
 */
export async function resolveIncident(id: number) {
    return await adminResolveIncident(id);
}
