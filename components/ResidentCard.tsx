"use client";

import { useState } from "react";
import { UserCircle, Phone, Mail, Clock, AlertCircle, FileText } from "lucide-react";
import { type Resident } from "@/lib/data/residents";

interface ResidentCardProps {
  resident: Resident;
}

export default function ResidentCard({ resident }: ResidentCardProps) {
  const [showContactOptions, setShowContactOptions] = useState(false);

  const formatContactHours = () => {
    const { start, end, days } = resident.contactHours;
    const daysAbbr = days.map((day) => day.substring(0, 3)).join(", ");
    return `${start} - ${end} (${daysAbbr})`;
  };

  const handleCall = () => {
    window.open(`tel:${resident.phone}`);
    setShowContactOptions(false);
  };
  const handleWhatsApp = () => {
    const number = resident.phone.replace(/[^0-9+]/g, "");
    const msg = encodeURIComponent(`Hello ${resident.name}, contacting about your unit ${resident.unit} via Residex dashboard`);
    window.open(`https://wa.me/${number}?text=${msg}`);
    setShowContactOptions(false);
  };

  return (
    <div className="glass rounded-xl p-4 border border-[var(--border-subtle)] hover:border-indigo-500/30 transition-all relative">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold shrink-0">
          {resident.name.split(" ").map((n) => n[0]).join("").toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-[var(--foreground)]">
              {resident.name}
            </h3>
            <span className="px-2 py-0.5 rounded-lg bg-indigo-500/20 text-indigo-400 text-xs font-medium">
              {resident.unit}
            </span>
          </div>
          <p className="text-sm text-[var(--foreground-muted)]">Floor {resident.floor}</p>
          {/* Contact Button below the name */}
          <div className="mt-1 relative w-fit z-10">
            <button
              onClick={() => setShowContactOptions((s) => !s)}
              className="mt-1 px-2 py-1 bg-emerald-500/10 hover:bg-emerald-500/30 text-emerald-700 rounded-lg text-xs font-semibold flex gap-2 items-center border border-emerald-300/30 transition-all shadow-sm focus:outline-none"
              aria-label="Contact this resident"
              type="button"
            >
              <UserCircle className="w-4 h-4 text-emerald-600" /> Contact
            </button>
            {showContactOptions && (
              <div className="absolute left-0 mt-2 bg-white rounded-xl shadow-xl border border-emerald-300/30 w-40 animate-in fade-in slide-in-from-top-2 py-1 z-30">
                <button
                  className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-emerald-50 text-emerald-700 transition-all text-sm"
                  onClick={handleCall}
                  type="button"
                >
                  <Phone className="w-4 h-4 text-emerald-400" /> Call
                </button>
                <button
                  className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-emerald-50 text-green-700 transition-all text-sm"
                  onClick={handleWhatsApp}
                  type="button"
                >
                  <svg viewBox="0 0 32 32" width="18" height="18" fill="currentColor"><path d="M16 2.984c-7.063 0-12.922 5.844-12.922 12.922 0 2.281.594 4.531 1.703 6.484l-1.172 4.297c-.109.406 0 .844.297 1.141.266.297.703.391 1.109.266l4.188-1.125c1.859 1.031 3.969 1.641 6.094 1.641 7.094 0 12.938-5.859 12.938-12.938s-5.844-12.922-12.938-12.922zM16 26.922c-1.937 0-3.859-.484-5.562-1.406l-.391-.219-2.484.672.672-2.469-.219-.406c-1.062-1.75-1.625-3.781-1.625-5.812 0-6.016 4.891-10.906 10.891-10.906 6.016 0 10.907 4.891 10.907 10.906 0 6-4.891 10.891-10.907 10.891z"/><path d="M22.172 19.984l-2.594-.594c-.344-.078-.672-.016-.938.234l-.844.859c-.266.281-.5.281-.75.188-1.109-.438-2.188-.984-3.094-1.891-.828-.813-1.454-1.718-1.89-2.859-.11-.266-.012-.484.187-.672.137-.125.281-.266.422-.406.14-.141.225-.25.34-.391.188-.234.234-.484.156-.797l-.578-2.5c-.125-.547-.234-.547-.406-.547-.031 0-.062 0-.094.001-.114.006-.256.008-.402.008-.484 0-.969.141-1.375.469-.438.359-.657.906-.657 1.453 0 .281.047.563.156.891.484 1.609 1.516 3.094 2.625 4.203 1.11 1.11 2.594 2.141 4.203 2.625.328.109.61.156.891.156.547 0 1.094-.219 1.453-.655.328-.406.484-.89.391-1.391l-.127-.539c-.031-.125-.141-.438-.547-.547z"/></svg>
                  WhatsApp
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="space-y-2 mt-2">
        <div className="flex items-center gap-2 text-sm">
          <Phone className="w-4 h-4 text-[var(--foreground-subtle)] shrink-0" />
          <a
            href={`tel:${resident.phone}`}
            className="text-[var(--foreground-muted)] hover:text-indigo-400 transition-colors text-sm"
          >
            {resident.phone}
          </a>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Mail className="w-4 h-4 text-[var(--foreground-subtle)] shrink-0" />
          <a
            href={`mailto:${resident.email}`}
            className="text-[var(--foreground-muted)] hover:text-indigo-400 transition-colors text-sm truncate"
          >
            {resident.email}
          </a>
        </div>
        <div className="flex items-start gap-2 text-sm pt-1">
          <Clock className="w-4 h-4 text-[var(--foreground-subtle)] shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-[var(--foreground-subtle)] mb-0.5 font-bold">
              Available hours:
            </p>
            <p className="text-[var(--foreground-muted)] text-xs">
              {formatContactHours()}
            </p>
          </div>
        </div>
        {resident.emergencyContact && (
          <div className="mt-3 pt-3 border-t border-[var(--border-subtle)]">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-amber-400 mb-1">
                  Emergency Contact
                </p>
                <p className="text-xs text-[var(--foreground-muted)]">
                  {resident.emergencyContact.name} ({resident.emergencyContact.relationship})
                </p>
                <a
                  href={`tel:${resident.emergencyContact.phone}`}
                  className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  {resident.emergencyContact.phone}
                </a>
              </div>
            </div>
          </div>
        )}
        {resident.notes && (
          <div className="mt-2 pt-2 border-t border-[var(--border-subtle)]">
            <div className="flex items-start gap-2">
              <FileText className="w-4 h-4 text-[var(--foreground-subtle)] shrink-0 mt-0.5" />
              <p className="text-xs text-[var(--foreground-muted)] italic">
                {resident.notes}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

