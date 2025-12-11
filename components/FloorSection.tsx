"use client";

import { Building2 } from "lucide-react";
import { type Resident } from "@/lib/data/residents";
import ResidentCard from "./ResidentCard";

interface FloorSectionProps {
  floor: number;
  residents: Resident[];
}

export default function FloorSection({ floor, residents }: FloorSectionProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
          <Building2 className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-[var(--foreground)]">
            Floor {floor}
          </h2>
          <p className="text-sm text-[var(--foreground-muted)]">
            {residents.length} {residents.length === 1 ? "unit" : "units"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {residents.map((resident) => (
          <ResidentCard key={resident.id} resident={resident} />
        ))}
      </div>
    </div>
  );
}

