"use client";

import { useState, useEffect } from "react";
import {
  Smartphone,
  Wifi,
  Battery,
  Signal,
  Send,
  ChevronRight,
  X,
  History,
  CheckCircle2,
  Clock,
  AlertCircle,
  Bell,
  FileText,
  ArrowLeft,
} from "lucide-react";
import {
  submitIncident,
  getTenantIncidents,
  getTenantNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@/app/actions";

type View = "form" | "history" | "notifications";

export default function PhoneMockup() {
  const [isOpen, setIsOpen] = useState(true);
  const [view, setView] = useState<View>("form");
  const [incidents, setIncidents] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastNotificationCount, setLastNotificationCount] = useState(0);
  const [showNewNotificationToast, setShowNewNotificationToast] = useState(false);

  // Load incidents and notifications
  useEffect(() => {
    const initialLoad = async () => {
      try {
        const [, tenantNotifications] = await Promise.all([
          getTenantIncidents(),
          getTenantNotifications(),
        ]);
        const initialUnreadCount = (tenantNotifications || []).filter((n) => !n.read).length;
        setLastNotificationCount(initialUnreadCount);
        await loadData();
      } catch (error) {
        console.error("Error in initial load:", error);
        // Still try to load data even if initial count fails
        loadData();
      }
    };
    initialLoad();
    // Poll for new notifications every 3 seconds
    const interval = setInterval(() => {
      loadData().catch((error) => {
        console.error("Error in polling:", error);
      });
    }, 3000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async () => {
    try {
      const [tenantIncidents, tenantNotifications] = await Promise.all([
        getTenantIncidents(),
        getTenantNotifications(),
      ]);
      setIncidents(tenantIncidents || []);
      
      // Check if there are new notifications
      const newUnreadCount = (tenantNotifications || []).filter((n) => !n.read).length;
      if (newUnreadCount > lastNotificationCount && lastNotificationCount >= 0) {
        // Only show toast if we had notifications before (not on initial load)
        if (lastNotificationCount > 0) {
          setShowNewNotificationToast(true);
          setTimeout(() => setShowNewNotificationToast(false), 5000);
        }
      }
      setLastNotificationCount(newUnreadCount);
      
      setNotifications(tenantNotifications || []);
      setUnreadCount(newUnreadCount);
    } catch (error) {
      console.error("Error loading data:", error);
      // Don't update state on error to avoid breaking the UI
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await markNotificationAsRead(id);
      loadData();
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      loadData();
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const handleSubmitIncident = async (formData: FormData) => {
    try {
      await submitIncident(formData);
      await loadData();
      // Switch to history view after submitting
      setView("history");
    } catch (error) {
      console.error("Error submitting incident:", error);
      alert("Hubo un error al enviar el incidente. Por favor, intenta de nuevo.");
    }
  };

  return (
    <>
      {/* Collapsed Tab - shows when phone is hidden */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-0 z-50 flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-3 rounded-l-xl shadow-lg transition-all duration-300 hover:pr-6 ${
          isOpen ? "translate-x-full opacity-0" : "translate-x-0 opacity-100"
        }`}
      >
        <Smartphone className="w-5 h-5" />
        <span className="text-sm font-medium">Tenant App</span>
        <ChevronRight className="w-4 h-4 -rotate-180" />
      </button>

      {/* Phone Mockup */}
      <div
        className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ease-out ${
          isOpen
            ? "translate-x-0 opacity-100 scale-100"
            : "translate-x-[120%] opacity-0 scale-95"
        }`}
      >
        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute -top-2 -left-2 z-10 w-8 h-8 bg-[var(--surface)] hover:bg-[var(--surface-elevated)] border border-[var(--border-subtle)] rounded-full flex items-center justify-center shadow-lg transition-colors group"
          title="Hide phone"
        >
          <X className="w-4 h-4 text-[var(--foreground-muted)] group-hover:text-[var(--foreground)]" />
        </button>

        {/* Phone Frame */}
        <div className="phone-mockup w-[320px] rounded-[3rem] p-3 shadow-2xl border-4">
          {/* Phone Inner Screen */}
          <div className="bg-[var(--background)] rounded-[2.25rem] overflow-hidden">
            {/* Phone Status Bar */}
            <div className="bg-[var(--surface)] px-6 py-2 flex items-center justify-between">
              <span className="text-xs text-[var(--foreground-muted)]">9:41</span>
              <div className="flex items-center gap-1">
                <Signal className="w-3.5 h-3.5 text-[var(--foreground-muted)]" />
                <Wifi className="w-3.5 h-3.5 text-[var(--foreground-muted)]" />
                <Battery className="w-4 h-3.5 text-[var(--foreground-muted)]" />
              </div>
            </div>

            {/* Phone Notch */}
            <div className="relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-[var(--phone-frame)] rounded-b-2xl"></div>
            </div>

            {/* App Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-4 pt-8">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-white/80" />
                  <span className="text-xs font-medium text-white/80 uppercase tracking-wider">
                    Tenant App
                  </span>
                </div>
                {view === "form" && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setView("history")}
                      className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                      title="View History"
                    >
                      <History className="w-4 h-4 text-white" />
                    </button>
                    <button
                      onClick={() => setView("notifications")}
                      className="relative w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                      title="Notifications"
                    >
                      <Bell className="w-4 h-4 text-white" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      )}
                    </button>
                  </div>
                )}
                {view === "history" && (
                  <button
                    onClick={() => setView("form")}
                    className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                    title="Back to Form"
                  >
                    <ArrowLeft className="w-4 h-4 text-white" />
                  </button>
                )}
                {view === "notifications" && (
                  <button
                    onClick={() => setView("form")}
                    className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                    title="Back to Form"
                  >
                    <ArrowLeft className="w-4 h-4 text-white" />
                  </button>
                )}
              </div>
              <h2 className="text-lg font-bold text-white">
                {view === "form"
                  ? "Report Issue"
                  : view === "history"
                  ? "My Issues"
                  : "Notifications"}
              </h2>
            </div>

            {/* Phone Content */}
            <div className="p-4 h-[420px] overflow-y-auto">
              {view === "form" && (
                <form action={handleSubmitIncident} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[var(--foreground-muted)] mb-1.5 uppercase tracking-wider">
                    Issue Type
                  </label>
                  <select
                    name="type"
                    className="w-full p-3 bg-[var(--surface)] border border-[var(--border-subtle)] rounded-xl text-[var(--foreground)] text-sm focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Maintenance">🔧 Maintenance</option>
                    <option value="Security">🚨 Security</option>
                    <option value="Fire">🔥 Fire / Hazard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--foreground-muted)] mb-1.5 uppercase tracking-wider">
                    Location
                  </label>
                  <input
                    name="location"
                    type="text"
                    placeholder="e.g. Apt 404, Lobby"
                    className="w-full p-3 bg-[var(--surface)] border border-[var(--border-subtle)] rounded-xl text-[var(--foreground)] text-sm placeholder:text-[var(--foreground-subtle)] focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--foreground-muted)] mb-1.5 uppercase tracking-wider">
                    Description
                  </label>
                  <textarea
                    name="description"
                    placeholder="Describe the issue..."
                    className="w-full p-3 bg-[var(--surface)] border border-[var(--border-subtle)] rounded-xl text-[var(--foreground)] text-sm placeholder:text-[var(--foreground-subtle)] resize-none focus:outline-none focus:border-indigo-500"
                    rows={3}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg"
                >
                  <Send className="w-4 h-4" />
                  Submit Report
                </button>

                {/* Divider */}
                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[var(--border-subtle)]"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-[var(--background)] px-3 text-xs text-[var(--foreground-subtle)]">
                      or
                    </span>
                  </div>
                </div>

                {/* SOS Button Placeholder */}
                <div className="flex justify-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-lg shadow-red-500/30 cursor-pointer hover:scale-105 transition-transform">
                    <span className="text-white font-bold text-lg">SOS</span>
                  </div>
                </div>
                <p className="text-center text-xs text-[var(--foreground-subtle)]">
                  Hold for 3 seconds for emergency
                </p>
              </form>
              )}

              {view === "history" && (
                <div className="space-y-3">
                  {incidents.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 rounded-full bg-[var(--surface)] flex items-center justify-center mx-auto mb-4">
                        <History className="w-8 h-8 text-[var(--foreground-muted)]" />
                      </div>
                      <h3 className="text-sm font-medium text-[var(--foreground)] mb-1">
                        No Issues Reported
                      </h3>
                      <p className="text-xs text-[var(--foreground-muted)]">
                        Your reported issues will appear here
                      </p>
                    </div>
                  ) : (
                    incidents.map((incident) => (
                      <div
                        key={incident.id}
                        className={`p-3 rounded-xl border ${
                          incident.status === "Resolved"
                            ? "bg-emerald-500/10 border-emerald-500/20"
                            : "bg-[var(--surface)] border-[var(--border-subtle)]"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                              incident.status === "Resolved"
                                ? "bg-emerald-500/20"
                                : "bg-amber-500/20"
                            }`}
                          >
                            {incident.status === "Resolved" ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <Clock className="w-4 h-4 text-amber-400" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h3 className="text-sm font-semibold text-[var(--foreground)]">
                                {incident.type}
                              </h3>
                              <span
                                className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                                  incident.status === "Resolved"
                                    ? "bg-emerald-500/20 text-emerald-400"
                                    : "bg-amber-500/20 text-amber-400"
                                }`}
                              >
                                {incident.status === "Resolved" ? "Resolved" : "Open"}
                              </span>
                            </div>
                            <p className="text-xs text-[var(--foreground-muted)] mb-1">
                              {incident.location}
                            </p>
                            <p className="text-xs text-[var(--foreground-subtle)] mb-2 line-clamp-2">
                              {incident.description}
                            </p>
                            {incident.status === "Resolved" && incident.resolutionNotes && (
                              <div className="mb-2 p-2 rounded-lg bg-[var(--background)] border border-[var(--border-subtle)]">
                                <div className="flex items-start gap-2">
                                  <FileText className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-[10px] font-medium text-emerald-400 mb-0.5">
                                      Resolution Notes:
                                    </p>
                                    <p className="text-[10px] text-[var(--foreground-muted)] leading-relaxed">
                                      {incident.resolutionNotes}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                            <div className="flex items-center gap-2 text-[10px] text-[var(--foreground-subtle)]">
                              <Clock className="w-3 h-3" />
                              {new Date(incident.createdAt).toLocaleString("es-ES", {
                                day: "numeric",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                              {incident.resolvedAt && (
                                <>
                                  <span>•</span>
                                  <span className="text-emerald-400">
                                    Resolved:{" "}
                                    {new Date(incident.resolvedAt).toLocaleString("es-ES", {
                                      day: "numeric",
                                      month: "short",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {view === "notifications" && (
                <div className="space-y-3">
                  {notifications.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 rounded-full bg-[var(--surface)] flex items-center justify-center mx-auto mb-4">
                        <Bell className="w-8 h-8 text-[var(--foreground-muted)]" />
                      </div>
                      <h3 className="text-sm font-medium text-[var(--foreground)] mb-1">
                        No hay notificaciones
                      </h3>
                      <p className="text-xs text-[var(--foreground-muted)]">
                        Tus incidentes reportados aparecerán aquí
                      </p>
                    </div>
                  ) : (
                    <>
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllAsRead}
                          className="w-full text-xs text-indigo-400 hover:text-indigo-300 text-right mb-2"
                        >
                          Marcar todas como leídas
                        </button>
                      )}
                      {notifications.map((notif) => {
                        const isResolved = notif.status === "Resolved";
                        return (
                          <div
                            key={notif.id}
                            className={`p-3 rounded-xl border ${
                              notif.read
                                ? isResolved
                                  ? "bg-emerald-500/5 border-emerald-500/10"
                                  : "bg-[var(--surface)] border-[var(--border-subtle)]"
                                : isResolved
                                ? "bg-emerald-500/10 border-emerald-500/20"
                                : "bg-amber-500/10 border-amber-500/20"
                            }`}
                            onClick={() => !notif.read && handleMarkAsRead(notif.id)}
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                  isResolved
                                    ? "bg-emerald-500/20"
                                    : "bg-amber-500/20"
                                }`}
                              >
                                {isResolved ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                ) : (
                                  <Clock className="w-4 h-4 text-amber-400" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 mb-1">
                                  <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-semibold text-[var(--foreground)]">
                                      {notif.title}
                                    </h3>
                                    <p className="text-[10px] text-[var(--foreground-subtle)] mt-0.5">
                                      {notif.incidentType} • {notif.location}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-1 shrink-0">
                                    <span
                                      className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                                        isResolved
                                          ? "bg-emerald-500/20 text-emerald-400"
                                          : "bg-amber-500/20 text-amber-400"
                                      }`}
                                    >
                                      {isResolved ? "Resolved" : "Open"}
                                    </span>
                                    {!notif.read && (
                                      <span className="w-2 h-2 rounded-full bg-indigo-400 shrink-0" />
                                    )}
                                  </div>
                                </div>
                                <p className="text-xs text-[var(--foreground-muted)] mb-2">
                                  {notif.message}
                                </p>
                                {notif.resolutionNotes && (
                                  <div className="mb-2 p-2 rounded-lg bg-[var(--background)] border border-[var(--border-subtle)]">
                                    <div className="flex items-start gap-2">
                                      <FileText className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                                      <div className="flex-1 min-w-0">
                                        <p className="text-[10px] font-medium text-emerald-400 mb-0.5">
                                          Comentario del administrador:
                                        </p>
                                        <p className="text-[10px] text-[var(--foreground-muted)] leading-relaxed">
                                          {notif.resolutionNotes}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                                <div className="flex items-center gap-1 text-[10px] text-[var(--foreground-subtle)]">
                                  <Clock className="w-3 h-3" />
                                  {new Date(notif.createdAt).toLocaleString("es-ES", {
                                    day: "numeric",
                                    month: "short",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Phone Home Indicator */}
            <div className="flex justify-center py-2">
              <div className="w-32 h-1 bg-[var(--foreground-subtle)] rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Label */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-medium px-3 py-1 rounded-full shadow-lg whitespace-nowrap">
          📱 Tenant Mobile App
        </div>
      </div>

      {/* New Notification Toast */}
      {showNewNotificationToast && (
        <div className="fixed bottom-24 right-6 z-[60] animate-in slide-in-from-bottom-5 fade-in">
          <div className="phone-mockup w-[320px] rounded-2xl p-3 shadow-2xl border-4 border-emerald-500/30">
            <div className="bg-[var(--background)] rounded-xl p-4 border border-emerald-500/20">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
                  <Bell className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[var(--foreground)] mb-1">
                    Nuevo Incidente Resuelto
                  </p>
                  <p className="text-xs text-[var(--foreground-muted)]">
                    Tienes {unreadCount} nueva{unreadCount !== 1 ? "s" : ""} notificación{unreadCount !== 1 ? "es" : ""}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowNewNotificationToast(false);
                    setView("notifications");
                  }}
                  className="w-6 h-6 rounded-lg hover:bg-[var(--surface-hover)] flex items-center justify-center transition-colors shrink-0"
                >
                  <X className="w-4 h-4 text-[var(--foreground-muted)]" />
                </button>
              </div>
              <button
                onClick={() => {
                  setShowNewNotificationToast(false);
                  setView("notifications");
                }}
                className="mt-3 w-full text-xs text-emerald-400 hover:text-emerald-300 text-center font-medium"
              >
                Ver notificaciones →
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
