export type IncidentType = 
  | 'flood' 
  | 'fire' 
  | 'accident' 
  | 'riot' 
  | 'medical' 
  | 'infrastructure' 
  | 'crime' 
  | 'other';

export type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical';

export type IncidentStatus = 
  | 'reported' 
  | 'verified' 
  | 'in_progress' 
  | 'resolved' 
  | 'false_alarm';

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
  landmark?: string;
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  type: IncidentType;
  severity: IncidentSeverity;
  status: IncidentStatus;
  location: Location;
  reportedBy: string; // User ID
  reportedAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  images?: string[];
  affectedArea?: number; // radius in meters
  assignedTo?: string[]; // Authority User IDs
  verifiedBy?: string; // Authority/Admin User ID
  casualties?: {
    confirmed: number;
    estimated: number;
  };
  resources?: {
    requested: Resource[];
    deployed: Resource[];
  };
  weatherConditions?: {
    temperature?: number;
    rainfall?: number;
    windSpeed?: number;
    visibility?: 'clear' | 'moderate' | 'poor';
  };
  notes?: IncidentNote[];
}

export interface Resource {
  id: string;
  type: 'vehicle' | 'personnel' | 'equipment' | 'medical' | 'other';
  name: string;
  quantity: number;
  status: 'available' | 'in_use' | 'en_route' | 'returning';
  assignedTo?: string; // Incident ID
}

export interface IncidentNote {
  id: string;
  text: string;
  createdBy: string; // User ID
  createdAt: Date;
  updatedAt?: Date;
  visibility: 'public' | 'authority' | 'admin';
}

export interface SafeZone {
  address: any;
  id: string;
  name: string;
  location: Location;
  capacity: number;
  currentOccupancy: number;
  facilities: string[];
  contactPerson?: string;
  contactPhone?: string;
  status: 'open' | 'full' | 'closed';
  type: 'shelter' | 'medical' | 'food' | 'multi-purpose';
}