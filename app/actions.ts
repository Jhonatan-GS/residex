"use server";

import { revalidatePath } from "next/cache";

// MOCK DATABASE
// In a real app, this would be a SQL DB

// Mock tenant ID - In a real app, this would come from authentication
const MOCK_TENANT_ID = "tenant-123";

let incidents = [
    {
        id: 1,
        type: "Maintenance",
        description: "Elevator 3 is making a grinding noise",
        location: "Lobby",
        priority: "High",
        status: "Open",
        createdAt: "2023-10-01T10:00:00Z",
        tenantId: MOCK_TENANT_ID,
    },
    {
        id: 2,
        type: "Security",
        description: "Side door propped open",
        location: "Garage B",
        priority: "Medium",
        status: "Resolved",
        createdAt: "2023-10-02T14:30:00Z",
        resolvedAt: "2023-10-02T15:00:00Z",
        resolutionNotes: "Door secured and lock mechanism replaced",
        notified: true,
        tenantId: MOCK_TENANT_ID,
    },
];

// Tenant notifications storage
let tenantNotifications: Array<{
    id: number;
    tenantId: string;
    incidentId: number;
    title: string;
    message: string;
    resolutionNotes?: string;
    read: boolean;
    createdAt: string;
    status: "Open" | "Resolved";
    incidentType: string;
    location: string;
}> = [];

export async function getIncidents() {
    return incidents;
}

// Create notification when incident is created
function createIncidentNotification(
    incidentId: number,
    incidentType: string,
    location: string,
    tenantId: string
) {
    // Get the next available ID
    const nextId = tenantNotifications.length > 0 
        ? (Math.max(...tenantNotifications.map(n => n.id)) + 1)
        : 1;
    
    const notification = {
        id: nextId,
        tenantId,
        incidentId,
        title: `${incidentType} Issue Reported`,
        message: `Your ${incidentType} issue at ${location} has been reported and is being reviewed.`,
        read: false,
        createdAt: new Date().toISOString(),
        status: "Open" as const,
        incidentType,
        location,
    };
    
    tenantNotifications.unshift(notification);
    return notification;
}

export async function submitIncident(formData: FormData) {
    const type = formData.get("type") as string;
    const description = formData.get("description") as string;
    const location = formData.get("location") as string;

    const newIncident = {
        id: incidents.length + 1,
        type,
        description,
        location,
        priority: "Pending", // Needs AI Triage
        status: "Open",
        createdAt: new Date().toISOString(),
        tenantId: MOCK_TENANT_ID, // Associate with tenant
    };

    incidents.unshift(newIncident);

    // Create notification for tenant when incident is created
    createIncidentNotification(
        newIncident.id,
        type,
        location,
        MOCK_TENANT_ID
    );

    revalidatePath("/");
    return { success: true, incidentId: newIncident.id };
}

// Mock function to send notification to tenant when incident is resolved
export async function sendNotification(
    incidentId: number,
    incidentType: string,
    location: string,
    resolutionNotes: string,
    tenantId: string
) {
    const message = `Your ${incidentType} issue at ${location} has been resolved. ${resolutionNotes ? `Notes: ${resolutionNotes}` : ""}`;
    
    console.log("📧 [MOCK NOTIFICATION] Sending notification to tenant:");
    console.log(`   Incident ID: ${incidentId}`);
    console.log(`   Type: ${incidentType}`);
    console.log(`   Location: ${location}`);
    console.log(`   Message: ${message}`);
    console.log(`   Timestamp: ${new Date().toISOString()}`);
    
    // Find existing notification for this incident and update it
    const existingNotification = tenantNotifications.find(
        (n) => n.incidentId === incidentId && n.tenantId === tenantId
    );
    
    if (existingNotification) {
        // Update existing notification
        existingNotification.title = `${incidentType} Issue Resolved`;
        existingNotification.message = `Your ${incidentType} issue at ${location} has been resolved.`;
        existingNotification.resolutionNotes = resolutionNotes;
        existingNotification.status = "Resolved";
        existingNotification.read = false; // Mark as unread when resolved
        existingNotification.createdAt = new Date().toISOString(); // Update timestamp
    } else {
        // Create new notification if it doesn't exist (shouldn't happen normally)
        // Get the next available ID
        const nextId = tenantNotifications.length > 0 
            ? Math.max(...tenantNotifications.map(n => n.id)) + 1
            : 1;
        
        const notification = {
            id: nextId,
            tenantId,
            incidentId,
            title: `${incidentType} Issue Resolved`,
            message: `Your ${incidentType} issue at ${location} has been resolved.`,
            resolutionNotes,
            read: false,
            createdAt: new Date().toISOString(),
            status: "Resolved" as const,
            incidentType,
            location,
        };
        
        tenantNotifications.unshift(notification);
    }
    
    // In a real app, this would send an email, SMS, or push notification
    return { success: true, message };
}

export async function resolveIncident(id: number, resolutionNotes?: string) {
    const incident = incidents.find((i) => i.id === id);
    if (incident) {
        incident.status = "Resolved";
        incident.resolvedAt = new Date().toISOString();
        incident.resolutionNotes = resolutionNotes || "";
        
        // Automatically send notification to tenant if tenantId exists
        if (incident.tenantId) {
            await sendNotification(
                incident.id,
                incident.type,
                incident.location,
                resolutionNotes || "Issue has been resolved.",
                incident.tenantId
            );
        }
        
        // Mark as notified
        incident.notified = true;
        
        revalidatePath("/");
        return { success: true, notified: true };
    }

    return { success: false, notified: false };
}

// Get incidents for a specific tenant
export async function getTenantIncidents(tenantId: string = MOCK_TENANT_ID) {
    try {
        return incidents.filter((incident) => incident.tenantId === tenantId);
    } catch (error) {
        console.error("Error getting tenant incidents:", error);
        return [];
    }
}

// Sync notifications with existing incidents (for initial setup)
// This should only run once to initialize notifications for existing incidents
let syncInitialized = false;

function syncNotificationsWithIncidents() {
    // Only sync once to avoid duplicate notifications
    if (syncInitialized) {
        return;
    }
    
    try {
        incidents.forEach((incident) => {
            if (incident.tenantId) {
                // Check if notification already exists for this incident
                const existingNotif = tenantNotifications.find(
                    (n) => n.incidentId === incident.id && n.tenantId === incident.tenantId
                );
                
                if (!existingNotif) {
                    // Get the next available ID
                    const nextId = tenantNotifications.length > 0 
                        ? (Math.max(...tenantNotifications.map(n => n.id)) + 1)
                        : 1;
                    
                    // Create notification for existing incident
                    const notification = {
                        id: nextId,
                        tenantId: incident.tenantId,
                        incidentId: incident.id,
                        title: incident.status === "Resolved" 
                            ? `${incident.type} Issue Resolved`
                            : `${incident.type} Issue Reported`,
                        message: incident.status === "Resolved"
                            ? `Your ${incident.type} issue at ${incident.location} has been resolved.`
                            : `Your ${incident.type} issue at ${incident.location} has been reported and is being reviewed.`,
                        resolutionNotes: incident.resolutionNotes ? String(incident.resolutionNotes) : undefined,
                        read: true, // Mark existing incidents as read
                        createdAt: incident.createdAt,
                        status: incident.status as "Open" | "Resolved",
                        incidentType: incident.type,
                        location: incident.location,
                    };
                    
                    tenantNotifications.push(notification);
                } else {
                    // Update existing notification if incident status changed
                    if (existingNotif.status !== incident.status) {
                        existingNotif.status = incident.status as "Open" | "Resolved";
                        existingNotif.title = incident.status === "Resolved"
                            ? `${incident.type} Issue Resolved`
                            : `${incident.type} Issue Reported`;
                        existingNotif.message = incident.status === "Resolved"
                            ? `Your ${incident.type} issue at ${incident.location} has been resolved.`
                            : `Your ${incident.type} issue at ${incident.location} has been reported and is being reviewed.`;
                        if (incident.resolutionNotes) {
                            existingNotif.resolutionNotes = incident.resolutionNotes;
                        }
                    }
                }
            }
        });
        
        syncInitialized = true;
    } catch (error) {
        console.error("Error syncing notifications:", error);
        // Don't throw, just log the error
    }
}

// Get notifications for a tenant
export async function getTenantNotifications(tenantId: string = MOCK_TENANT_ID) {
    try {
        // Sync notifications with incidents before returning (only once)
        syncNotificationsWithIncidents();
        
        const filtered = tenantNotifications
            .filter((notif) => notif.tenantId === tenantId)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        
        return filtered;
    } catch (error) {
        console.error("Error getting tenant notifications:", error);
        return [];
    }
}

// Mark notification as read
export async function markNotificationAsRead(notificationId: number) {
    try {
        const notification = tenantNotifications.find((n) => n.id === notificationId);
        if (notification) {
            notification.read = true;
        }
    } catch (error) {
        console.error("Error marking notification as read:", error);
    }
}

// Mark all notifications as read for a tenant
export async function markAllNotificationsAsRead(tenantId: string = MOCK_TENANT_ID) {
    try {
        tenantNotifications.forEach((notif) => {
            if (notif.tenantId === tenantId) {
                notif.read = true;
            }
        });
    } catch (error) {
        console.error("Error marking all notifications as read:", error);
    }
}
