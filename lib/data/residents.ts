export interface Resident {
  id: number;
  unit: string; // e.g., "101", "202", "15A"
  floor: number;
  name: string;
  phone: string;
  email: string;
  contactHours: {
    start: string; // e.g., "09:00"
    end: string; // e.g., "18:00"
    days: string[]; // e.g., ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
  };
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  notes?: string; // Additional notes like "Prefers email contact" or "Works from home"
}

export const residents: Resident[] = [
  // Floor 1
  {
    id: 1,
    unit: "101",
    floor: 1,
    name: "María González",
    phone: "+1 (555) 123-4567",
    email: "maria.gonzalez@email.com",
    contactHours: {
      start: "09:00",
      end: "17:00",
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    },
    emergencyContact: {
      name: "Carlos González",
      phone: "+1 (555) 123-4568",
      relationship: "Spouse",
    },
    notes: "Prefers email contact during work hours",
  },
  {
    id: 2,
    unit: "102",
    floor: 1,
    name: "John Smith",
    phone: "+1 (555) 234-5678",
    email: "john.smith@email.com",
    contactHours: {
      start: "08:00",
      end: "20:00",
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    },
    emergencyContact: {
      name: "Sarah Smith",
      phone: "+1 (555) 234-5679",
      relationship: "Spouse",
    },
  },
  {
    id: 3,
    unit: "103",
    floor: 1,
    name: "Ana Rodríguez",
    phone: "+1 (555) 345-6789",
    email: "ana.rodriguez@email.com",
    contactHours: {
      start: "10:00",
      end: "18:00",
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    },
    notes: "Works from home, available most of the day",
  },
  
  // Floor 2
  {
    id: 4,
    unit: "201",
    floor: 2,
    name: "David Chen",
    phone: "+1 (555) 456-7890",
    email: "david.chen@email.com",
    contactHours: {
      start: "07:00",
      end: "19:00",
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    },
    emergencyContact: {
      name: "Lisa Chen",
      phone: "+1 (555) 456-7891",
      relationship: "Spouse",
    },
  },
  {
    id: 5,
    unit: "202",
    floor: 2,
    name: "Laura Martínez",
    phone: "+1 (555) 567-8901",
    email: "laura.martinez@email.com",
    contactHours: {
      start: "09:00",
      end: "17:00",
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    },
    emergencyContact: {
      name: "Roberto Martínez",
      phone: "+1 (555) 567-8902",
      relationship: "Brother",
    },
    notes: "Please call before visiting",
  },
  {
    id: 6,
    unit: "203",
    floor: 2,
    name: "Michael Johnson",
    phone: "+1 (555) 678-9012",
    email: "michael.johnson@email.com",
    contactHours: {
      start: "08:30",
      end: "17:30",
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    },
  },
  {
    id: 7,
    unit: "204",
    floor: 2,
    name: "Sofia Pérez",
    phone: "+1 (555) 789-0123",
    email: "sofia.perez@email.com",
    contactHours: {
      start: "10:00",
      end: "16:00",
      days: ["Monday", "Wednesday", "Friday"],
    },
    notes: "Part-time schedule, best contact on Mon/Wed/Fri",
  },
  
  // Floor 3
  {
    id: 8,
    unit: "301",
    floor: 3,
    name: "James Wilson",
    phone: "+1 (555) 890-1234",
    email: "james.wilson@email.com",
    contactHours: {
      start: "09:00",
      end: "18:00",
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    },
    emergencyContact: {
      name: "Emily Wilson",
      phone: "+1 (555) 890-1235",
      relationship: "Spouse",
    },
  },
  {
    id: 9,
    unit: "302",
    floor: 3,
    name: "Carmen López",
    phone: "+1 (555) 901-2345",
    email: "carmen.lopez@email.com",
    contactHours: {
      start: "08:00",
      end: "20:00",
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    },
    emergencyContact: {
      name: "Miguel López",
      phone: "+1 (555) 901-2346",
      relationship: "Son",
    },
    notes: "Available 24/7 for emergencies",
  },
  {
    id: 10,
    unit: "303",
    floor: 3,
    name: "Robert Brown",
    phone: "+1 (555) 012-3456",
    email: "robert.brown@email.com",
    contactHours: {
      start: "10:00",
      end: "19:00",
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    },
  },
  
  // Floor 4
  {
    id: 11,
    unit: "401",
    floor: 4,
    name: "Patricia Davis",
    phone: "+1 (555) 123-7890",
    email: "patricia.davis@email.com",
    contactHours: {
      start: "09:00",
      end: "17:00",
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    },
    emergencyContact: {
      name: "Thomas Davis",
      phone: "+1 (555) 123-7891",
      relationship: "Spouse",
    },
  },
  {
    id: 12,
    unit: "402",
    floor: 4,
    name: "Carlos Hernández",
    phone: "+1 (555) 234-8901",
    email: "carlos.hernandez@email.com",
    contactHours: {
      start: "07:00",
      end: "22:00",
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    },
    notes: "Flexible schedule, prefers text messages",
  },
  {
    id: 13,
    unit: "403",
    floor: 4,
    name: "Jennifer Taylor",
    phone: "+1 (555) 345-9012",
    email: "jennifer.taylor@email.com",
    contactHours: {
      start: "08:00",
      end: "18:00",
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    },
    emergencyContact: {
      name: "Mark Taylor",
      phone: "+1 (555) 345-9013",
      relationship: "Spouse",
    },
  },
  {
    id: 14,
    unit: "404",
    floor: 4,
    name: "Fernando García",
    phone: "+1 (555) 456-0123",
    email: "fernando.garcia@email.com",
    contactHours: {
      start: "09:30",
      end: "17:30",
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    },
  },
  
  // Floor 5
  {
    id: 15,
    unit: "501",
    floor: 5,
    name: "Amanda White",
    phone: "+1 (555) 567-1234",
    email: "amanda.white@email.com",
    contactHours: {
      start: "10:00",
      end: "18:00",
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    },
    emergencyContact: {
      name: "Daniel White",
      phone: "+1 (555) 567-1235",
      relationship: "Spouse",
    },
    notes: "Best contact via email",
  },
  {
    id: 16,
    unit: "502",
    floor: 5,
    name: "Ricardo Sánchez",
    phone: "+1 (555) 678-2345",
    email: "ricardo.sanchez@email.com",
    contactHours: {
      start: "08:00",
      end: "20:00",
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    },
  },
  {
    id: 17,
    unit: "503",
    floor: 5,
    name: "Lisa Anderson",
    phone: "+1 (555) 789-3456",
    email: "lisa.anderson@email.com",
    contactHours: {
      start: "09:00",
      end: "17:00",
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    },
    emergencyContact: {
      name: "Kevin Anderson",
      phone: "+1 (555) 789-3457",
      relationship: "Spouse",
    },
  },
];

// Helper function to get residents by floor
export function getResidentsByFloor(): Record<number, Resident[]> {
  const residentsByFloor: Record<number, Resident[]> = {};
  
  residents.forEach((resident) => {
    if (!residentsByFloor[resident.floor]) {
      residentsByFloor[resident.floor] = [];
    }
    residentsByFloor[resident.floor].push(resident);
  });
  
  // Sort residents by unit number within each floor
  Object.keys(residentsByFloor).forEach((floor) => {
    residentsByFloor[Number(floor)].sort((a, b) => {
      return a.unit.localeCompare(b.unit, undefined, { numeric: true });
    });
  });
  
  return residentsByFloor;
}

// Helper function to get total floors
export function getTotalFloors(): number {
  return Math.max(...residents.map((r) => r.floor));
}

