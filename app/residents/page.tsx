"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Users,
  Building2,
  Phone,
  Mail,
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import FloorSection from "@/components/FloorSection";
import { getResidentsByFloor, getTotalFloors, residents } from "@/lib/data/residents";
import { type Resident } from "@/lib/data/residents";

export default function ResidentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null);

  const residentsByFloor = getResidentsByFloor();
  const totalFloors = getTotalFloors();

  // Filter residents based on search query
  const filteredResidents = useMemo(() => {
    let filtered = residents;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (resident) =>
          resident.name.toLowerCase().includes(query) ||
          resident.unit.toLowerCase().includes(query) ||
          resident.email.toLowerCase().includes(query) ||
          resident.phone.includes(query)
      );
    }

    // Filter by floor
    if (selectedFloor !== null) {
      filtered = filtered.filter((resident) => resident.floor === selectedFloor);
    }

    return filtered;
  }, [searchQuery, selectedFloor]);

  // Group filtered residents by floor
  const filteredResidentsByFloor = useMemo(() => {
    const grouped: Record<number, Resident[]> = {};
    filteredResidents.forEach((resident) => {
      if (!grouped[resident.floor]) {
        grouped[resident.floor] = [];
      }
      grouped[resident.floor].push(resident);
    });

    // Sort residents by unit number within each floor
    Object.keys(grouped).forEach((floor) => {
      grouped[Number(floor)].sort((a, b) => {
        return a.unit.localeCompare(b.unit, undefined, { numeric: true });
      });
    });

    return grouped;
  }, [filteredResidents]);

  // Get floors to display (sorted descending)
  const floorsToDisplay = useMemo(() => {
    const floors = Object.keys(filteredResidentsByFloor).map(Number);
    return floors.sort((a, b) => b - a); // Descending order (top floor first)
  }, [filteredResidentsByFloor]);

  const totalResidents = residents.length;
  const filteredCount = filteredResidents.length;

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-[var(--foreground)] mb-1">
              Resident Directory
            </h1>
            <p className="text-[var(--foreground-muted)]">
              Manage resident profiles, unit assignments, and contact information
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="glass rounded-xl px-4 py-2 border border-[var(--border-subtle)]">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-400" />
                <span className="text-sm font-medium text-[var(--foreground)]">
                  {filteredCount} / {totalResidents}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--foreground-subtle)]" />
            <input
              type="text"
              placeholder="Search by name, unit, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[var(--surface)] border border-[var(--border-subtle)] rounded-xl text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Floor Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--foreground-subtle)]" />
            <select
              value={selectedFloor === null ? "" : selectedFloor}
              onChange={(e) =>
                setSelectedFloor(e.target.value ? Number(e.target.value) : null)
              }
              className="pl-10 pr-8 py-3 bg-[var(--surface)] border border-[var(--border-subtle)] rounded-xl text-[var(--foreground)] focus:outline-none focus:border-indigo-500 transition-colors appearance-none cursor-pointer"
            >
              <option value="">All Floors</option>
              {Array.from({ length: totalFloors }, (_, i) => i + 1)
                .reverse()
                .map((floor) => (
                  <option key={floor} value={floor}>
                    Floor {floor}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      {filteredCount === 0 ? (
        <div className="glass rounded-2xl p-12 text-center border border-[var(--border-subtle)]">
          <div className="w-16 h-16 rounded-full bg-[var(--surface)] flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-[var(--foreground-muted)]" />
          </div>
          <h3 className="text-lg font-medium text-[var(--foreground)] mb-2">
            No residents found
          </h3>
          <p className="text-[var(--foreground-muted)]">
            Try adjusting your search or filter criteria
          </p>
        </div>
      ) : (
        <div>
          {floorsToDisplay.map((floor) => (
            <FloorSection
              key={floor}
              floor={floor}
              residents={filteredResidentsByFloor[floor]}
            />
          ))}
        </div>
      )}

      {/* Quick Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass rounded-xl p-4 border border-[var(--border-subtle)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--foreground)]">
                {totalFloors}
              </p>
              <p className="text-xs text-[var(--foreground-muted)]">
                Total Floors
              </p>
            </div>
          </div>
        </div>

        <div className="glass rounded-xl p-4 border border-[var(--border-subtle)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--foreground)]">
                {totalResidents}
              </p>
              <p className="text-xs text-[var(--foreground-muted)]">
                Total Residents
              </p>
            </div>
          </div>
        </div>

        <div className="glass rounded-xl p-4 border border-[var(--border-subtle)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <Phone className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--foreground)]">
                {residents.filter((r) => r.emergencyContact).length}
              </p>
              <p className="text-xs text-[var(--foreground-muted)]">
                With Emergency Contact
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
