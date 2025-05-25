import React, { createContext, useContext, useState, useEffect } from 'react';
import { Incident, SafeZone } from '../types/incident';
import { mockIncidents, mockSafeZones } from '../data/mockData';

interface IncidentContextType {
  incidents: Incident[];
  safeZones: SafeZone[];
  loading: boolean;
  addIncident: (incident: Omit<Incident, 'id'>) => Promise<Incident>;
  updateIncident: (id: string, updates: Partial<Incident>) => Promise<Incident | null>;
  getIncidentById: (id: string) => Incident | undefined;
  getSafeZoneById: (id: string) => SafeZone | undefined;
  nearestSafeZones: (lat: number, lng: number, count?: number) => SafeZone[];
}

const IncidentContext = createContext<IncidentContextType>({
  incidents: [],
  safeZones: [],
  loading: true,
  addIncident: () => Promise.resolve({} as Incident),
  updateIncident: () => Promise.resolve(null),
  getIncidentById: () => undefined,
  getSafeZoneById: () => undefined,
  nearestSafeZones: () => [],
});

export const useIncidents = () => useContext(IncidentContext);

interface IncidentProviderProps {
  children: React.ReactNode;
}

export const IncidentProvider: React.FC<IncidentProviderProps> = ({ children }) => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [safeZones, setSafeZones] = useState<SafeZone[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch
    const fetchData = async () => {
      await new Promise(resolve => setTimeout(resolve, 800));
      setIncidents(mockIncidents);
      setSafeZones(mockSafeZones);
      setLoading(false);
    };

    fetchData();
  }, []);

  const addIncident = async (incident: Omit<Incident, 'id'>): Promise<Incident> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newIncident: Incident = {
      ...incident,
      id: `incident-${Date.now()}`,
      reportedAt: new Date(),
      updatedAt: new Date(),
    };
    
    setIncidents(prev => [newIncident, ...prev]);
    return newIncident;
  };

  const updateIncident = async (id: string, updates: Partial<Incident>): Promise<Incident | null> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let updatedIncident: Incident | null = null;
    
    setIncidents(prev => {
      const updated = prev.map(incident => {
        if (incident.id === id) {
          updatedIncident = {
            ...incident,
            ...updates,
            updatedAt: new Date(),
          };
          return updatedIncident;
        }
        return incident;
      });
      return updated;
    });
    
    return updatedIncident;
  };

  const getIncidentById = (id: string): Incident | undefined => {
    return incidents.find(incident => incident.id === id);
  };

  const getSafeZoneById = (id: string): SafeZone | undefined => {
    return safeZones.find(safeZone => safeZone.id === id);
  };

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): number => {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Get nearest safe zones to a location
  const nearestSafeZones = (lat: number, lng: number, count = 3): SafeZone[] => {
    return [...safeZones]
      .filter(zone => zone.status !== 'closed')
      .map(zone => ({
        ...zone,
        distance: calculateDistance(
          lat,
          lng,
          zone.location.latitude,
          zone.location.longitude
        ),
      }))
      .sort((a, b) => (a.distance || 0) - (b.distance || 0))
      .slice(0, count);
  };

  const value = {
    incidents,
    safeZones,
    loading,
    addIncident,
    updateIncident,
    getIncidentById,
    getSafeZoneById,
    nearestSafeZones,
  };

  return (
    <IncidentContext.Provider value={value}>{children}</IncidentContext.Provider>
  );
};