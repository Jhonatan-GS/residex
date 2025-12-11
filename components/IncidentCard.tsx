"use client";

import { useState } from "react";
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  Wrench,
  Flame,
  CheckCircle2,
  FileText,
} from "lucide-react";
import { type Incident } from "@/lib/data/incidents";
import ResolutionDialog from "./ResolutionDialog";

interface IncidentCardProps {
  incident: Incident;
}

// Helper functions moved here to avoid passing functions from Server to Client Component
const getPriorityClass = (priority: string) => {
  switch (priority) {
    case "High":
      return "priority-critical";
    case "Medium":
      return "priority-warning";
    case "Pending":
      return "priority-info";
    default:
      return "priority-success";
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case "Fire":
      return <Flame className="w-5 h-5" />;
    case "Security":
      return <AlertTriangle className="w-5 h-5" />;
    default:
      return <Wrench className="w-5 h-5" />;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case "Fire":
      return "bg-red-500/20 text-red-400";
    case "Security":
      return "bg-amber-500/20 text-amber-400";
    default:
      return "bg-blue-500/20 text-blue-400";
  }
};

export default function IncidentCard({ incident }: IncidentCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <div className={`incident-card ${getPriorityClass(incident.priority)}`}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${getTypeColor(incident.type)}`}
            >
              {getTypeIcon(incident.type)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-[var(--foreground)] truncate">
                  {incident.type} Issue
                </h3>
                <span className="text-[var(--foreground-muted)]">•</span>
                <span className="text-sm text-[var(--foreground-muted)]">
                  {incident.location}
                </span>
              </div>
              <p className="text-[var(--foreground-muted)] text-sm mb-3 line-clamp-2">
                {incident.description}
              </p>

              {/* Resolution Notes - Show if resolved */}
              {incident.status === "Resolved" && incident.resolutionNotes && (
                <div className="mb-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <div className="flex items-start gap-2">
                    <FileText className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-emerald-400 mb-1">
                        Notas de Resolución:
                      </p>
                      <p className="text-xs text-[var(--foreground-muted)]">
                        {incident.resolutionNotes}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 text-xs text-[var(--foreground-subtle)] flex-wrap">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Creado:{" "}
                  {new Date(incident.createdAt).toLocaleTimeString("es-ES", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                {incident.resolvedAt && (
                  <span className="flex items-center gap-1 text-emerald-400">
                    <CheckCircle2 className="w-3 h-3" />
                    Resuelto:{" "}
                    {new Date(incident.resolvedAt).toLocaleTimeString("es-ES", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                )}
                <span>ID: #{incident.id}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span
              className={`badge ${
                incident.status === "Resolved"
                  ? "badge-success"
                  : incident.priority === "High"
                  ? "badge-critical"
                  : incident.priority === "Medium"
                  ? "badge-warning"
                  : "badge-info"
              }`}
            >
              {incident.status === "Resolved" ? (
                <>
                  <CheckCircle2 className="w-3 h-3" />
                  Resolved
                </>
              ) : (
                incident.priority
              )}
            </span>
            {incident.status !== "Resolved" && (
              <button
                onClick={() => setIsDialogOpen(true)}
                className="w-9 h-9 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 flex items-center justify-center transition-colors group"
                title="Mark as Resolved"
              >
                <CheckCircle className="w-4 h-4 text-emerald-400 group-hover:text-emerald-300" />
              </button>
            )}
          </div>
        </div>
      </div>

      <ResolutionDialog
        incidentId={incident.id}
        incidentType={incident.type}
        incidentLocation={incident.location}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </>
  );
}

