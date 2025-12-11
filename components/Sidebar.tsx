"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  LayoutDashboard,
  AlertTriangle,
  Users,
  FileText,
  Settings,
  BarChart3,
  Bell,
  MessageSquare,
  Calendar,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Lock,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard, enabled: true },
  { name: "Incidents", href: "#", icon: AlertTriangle, badge: 3, enabled: false },
  { name: "Residents", href: "/residents", icon: Users, enabled: true },
  { name: "Reports", href: "#", icon: FileText, enabled: false },
  { name: "Analytics", href: "#", icon: BarChart3, enabled: false },
  { name: "Messages", href: "#", icon: MessageSquare, badge: 5, enabled: false },
  { name: "Schedule", href: "#", icon: Calendar, enabled: false },
];

const secondaryNav = [
  { name: "Notifications", href: "#", icon: Bell, enabled: false },
  { name: "Settings", href: "#", icon: Settings, enabled: false },
  { name: "Help & Support", href: "#", icon: HelpCircle, enabled: false },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={`fixed left-0 top-0 z-40 h-screen bg-[var(--surface)] border-r border-[var(--border-subtle)] transition-all duration-300 flex flex-col ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-[var(--border-subtle)]">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shrink-0">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <h1 className="text-lg font-bold text-[var(--foreground)] tracking-tight">
                RESIDEX
              </h1>
              <p className="text-[10px] text-[var(--foreground-muted)] uppercase tracking-widest">
                Enterprise
              </p>
            </div>
          )}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-8 h-8 rounded-lg bg-[var(--surface-elevated)] hover:bg-[var(--border)] flex items-center justify-center transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4 text-[var(--foreground-muted)]" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-[var(--foreground-muted)]" />
          )}
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className={`mb-4 ${collapsed ? "px-2" : "px-3"}`}>
          {!collapsed && (
            <span className="text-xs font-medium text-[var(--foreground-subtle)] uppercase tracking-wider">
              Main Menu
            </span>
          )}
        </div>

        {navigation.map((item) => {
          const isActive = pathname === item.href && item.enabled;

          if (item.enabled) {
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${
                  isActive
                    ? "bg-indigo-500/10 text-indigo-400"
                    : "text-[var(--foreground-muted)] hover:bg-[var(--surface-elevated)] hover:text-[var(--foreground)]"
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-500 rounded-r-full" />
                )}
                <item.icon className={`w-5 h-5 shrink-0 ${isActive ? "text-indigo-400" : ""}`} />
                {!collapsed && (
                  <>
                    <span className="font-medium">{item.name}</span>
                    {item.badge && (
                      <span className="ml-auto bg-red-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
                {collapsed && item.badge && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </Link>
            );
          }

          // Disabled navigation item
          return (
            <div
              key={item.name}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[var(--foreground-subtle)] cursor-not-allowed opacity-60 relative"
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!collapsed && (
                <>
                  <span className="font-medium">{item.name}</span>
                  <Lock className="w-3 h-3 ml-auto text-[var(--foreground-subtle)]" />
                </>
              )}
              {collapsed && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--foreground-subtle)] rounded-full" />
              )}
            </div>
          );
        })}

        {/* Divider */}
        <div className="my-4 border-t border-[var(--border-subtle)]" />

        <div className={`mb-4 ${collapsed ? "px-2" : "px-3"}`}>
          {!collapsed && (
            <span className="text-xs font-medium text-[var(--foreground-subtle)] uppercase tracking-wider">
              Settings
            </span>
          )}
        </div>

        {secondaryNav.map((item) => {
          if (item.enabled) {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-indigo-500/10 text-indigo-400"
                    : "text-[var(--foreground-muted)] hover:bg-[var(--surface-elevated)] hover:text-[var(--foreground)]"
                }`}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {!collapsed && <span className="font-medium">{item.name}</span>}
              </Link>
            );
          }

          // Disabled navigation item
          return (
            <div
              key={item.name}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[var(--foreground-subtle)] cursor-not-allowed opacity-60"
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!collapsed && (
                <>
                  <span className="font-medium">{item.name}</span>
                  <Lock className="w-3 h-3 ml-auto text-[var(--foreground-subtle)]" />
                </>
              )}
            </div>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-3 border-t border-[var(--border-subtle)]">
        <div
          className={`flex items-center gap-3 p-3 rounded-xl bg-[var(--surface-elevated)] ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white font-semibold shrink-0">
            JD
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--foreground)] truncate">
                John Doe
              </p>
              <p className="text-xs text-[var(--foreground-muted)] truncate">
                Building Manager
              </p>
            </div>
          )}
          {!collapsed && (
            <button className="p-2 hover:bg-[var(--surface)] rounded-lg transition-colors">
              <LogOut className="w-4 h-4 text-[var(--foreground-muted)]" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
