export type UserRole = 'civilian' | 'authority' | 'admin';

export type AuthorityType = 'police' | 'fire' | 'medical' | 'traffic' | 'disaster';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  createdAt: Date;
  lastActive?: Date;
}

export interface CivilianUser extends User {
  role: 'civilian';
  homeAddress?: string;
  emergencyContacts?: EmergencyContact[];
  safetyStatus?: 'safe' | 'unsafe' | 'unknown';
  familyGroup?: string[];
}

export interface AuthorityUser extends User {
  role: 'authority';
  authorityType: AuthorityType;
  badgeNumber: string;
  department: string;
  jurisdiction: string;
  status: 'on-duty' | 'off-duty' | 'emergency-response';
  specialization?: string[];
}

export interface AdminUser extends User {
  role: 'admin';
  accessLevel: 'regional' | 'city' | 'super';
  departments: string[];
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}