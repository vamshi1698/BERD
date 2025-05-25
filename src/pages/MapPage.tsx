import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Layers, 
  Filter, 
  Plus, 
  ChevronDown, 
  AlertTriangle,
  Navigation,
  Home,
  Search,
  X,
  MapPin,
  Info,
  Eye,
  EyeOff,
  Flame,
  Droplets,
  Car,
  Users,
  Stethoscope,
  Zap,
  Shield,
  HelpCircle,
  ExternalLink,
  Compass
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useIncidents } from '../contexts/IncidentContext';
import EmergencyMap from '../components/common/Map';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import SOSButton from '../components/civilian/SOSButton';

type LayerKey = 'incidents' | 'safeZones' | 'traffic' | 'weather';

// Legend configuration for different incident types
const INCIDENT_LEGENDS = {
  flood: { icon: Droplets, color: 'text-blue-600', bgColor: 'bg-blue-100', label: 'Flood' },
  fire: { icon: Flame, color: 'text-red-600', bgColor: 'bg-red-100', label: 'Fire' },
  accident: { icon: Car, color: 'text-orange-600', bgColor: 'bg-orange-100', label: 'Accident' },
  riot: { icon: Users, color: 'text-purple-600', bgColor: 'bg-purple-100', label: 'Civil Unrest' },
  medical: { icon: Stethoscope, color: 'text-pink-600', bgColor: 'bg-pink-100', label: 'Medical Emergency' },
  infrastructure: { icon: Zap, color: 'text-yellow-600', bgColor: 'bg-yellow-100', label: 'Infrastructure' },
  crime: { icon: Shield, color: 'text-gray-600', bgColor: 'bg-gray-100', label: 'Crime' },
  other: { icon: HelpCircle, color: 'text-indigo-600', bgColor: 'bg-indigo-100', label: 'Other' }
};

const SEVERITY_COLORS = {
  low: 'bg-green-500',
  medium: 'bg-yellow-500',
  high: 'bg-orange-500',
  critical: 'bg-red-500'
};

const MapPage: React.FC = () => {
  const { user } = useAuth();
  const { incidents, safeZones } = useIncidents();
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [selectedIncident, setSelectedIncident] = useState<string | null>(null);
  const [selectedSafeZone, setSelectedSafeZone] = useState<string | null>(null);
  const [activeLayersPanel, setActiveLayersPanel] = useState(false);
  const [activeFiltersPanel, setActiveFiltersPanel] = useState(false);
  const [showLegend, setShowLegend] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  const [layers, setLayers] = useState<Record<LayerKey, boolean>>({
    incidents: true,
    safeZones: true,
    traffic: false,
    weather: false
  });
  
  const [filters, setFilters] = useState({
    incidentTypes: {
      flood: true,
      fire: true,
      accident: true,
      riot: true,
      medical: true,
      infrastructure: true,
      crime: true,
      other: true
    },
    severity: {
      low: true,
      medium: true,
      high: true,
      critical: true
    }
  });

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        error => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  // Real-time search functionality
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    const results: any[] = [];

    // Search incidents
    incidents.forEach(incident => {
      if (
        incident.title.toLowerCase().includes(query) ||
        incident.description.toLowerCase().includes(query) ||
        incident.type.toLowerCase().includes(query) ||
        incident.location.address?.toLowerCase().includes(query)
      ) {
        results.push({
          ...incident,
          type: 'incident',
          searchType: 'Incident'
        });
      }
    });

    // Search safe zones
    safeZones.forEach(zone => {
      if (
        zone.name.toLowerCase().includes(query) ||
        zone.location?.address?.toLowerCase().includes(query) ||
        zone.facilities.some(facility => facility.toLowerCase().includes(query))
      ) {
        results.push({
          ...zone,
          type: 'safeZone',
          searchType: 'Safe Zone'
        });
      }
    });

    return results.slice(0, 10); // Limit to 10 results
  }, [searchQuery, incidents, safeZones]);

  useEffect(() => {
    setShowSearchResults(searchQuery.trim().length > 0);
  }, [searchQuery]);

  const toggleFilter = (category: string, type: string) => {
    setFilters(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [type]: !prev[category as keyof typeof prev][type as keyof typeof prev[keyof typeof prev]]
      }
    }));
  };

  const handleIncidentClick = (incident: any) => {
    setSelectedIncident(incident.id);
    setSelectedSafeZone(null);
  };

  const handleSafeZoneClick = (safeZone: any) => {
    setSelectedSafeZone(safeZone.id);
    setSelectedIncident(null);
  };

  const handleSearchResultClick = (result: any) => {
    if (result.type === 'incident') {
      setSelectedIncident(result.id);
      setSelectedSafeZone(null);
    } else if (result.type === 'safeZone') {
      setSelectedSafeZone(result.id);
      setSelectedIncident(null);
    }
    setSearchQuery('');
    setShowSearchResults(false);
  };

  // Filter incidents based on selected filters
  const filteredIncidents = incidents.filter(incident => {
    return (
      filters.incidentTypes[incident.type as keyof typeof filters.incidentTypes] &&
      filters.severity[incident.severity as keyof typeof filters.severity]
    );
  });

  const selectedIncidentData = incidents.find(i => i.id === selectedIncident);
  const selectedSafeZoneData = safeZones.find(z => z.id === selectedSafeZone);

  function toggleLayer(layer: LayerKey): void {
    setLayers(prev => ({
      ...prev,
      [layer]: !prev[layer]
    }));
  }

  // Google Maps Navigation Functions
  const openGoogleMapsNavigation = (destination: { latitude: number; longitude: number }, destinationType: 'incident' | 'safeZone' = 'incident') => {
    const { latitude, longitude } = destination;
    
    // Check if user location is available for better routing
    if (userLocation) {
      const origin = `${userLocation.latitude},${userLocation.longitude}`;
      const dest = `${latitude},${longitude}`;
      
      // For incidents, we want to navigate away (find alternate routes)
      if (destinationType === 'incident') {
        // Open Google Maps with avoid options
        const url = `https://www.google.com/maps/dir/${origin}/${dest}?avoid=tolls,ferries&travelmode=driving`;
        window.open(url, '_blank');
      } else {
        // For safe zones, direct navigation
        const url = `https://www.google.com/maps/dir/${origin}/${dest}?travelmode=driving`;
        window.open(url, '_blank');
      }
    } else {
      // If no user location, just open the destination
      const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
      window.open(url, '_blank');
    }
  };

  const getAlternateRoute = (incidentLocation: { latitude: number; longitude: number }) => {
    if (!userLocation) {
      alert('Location permission required for route planning');
      return;
    }

    // Open Google Maps with multiple waypoints to avoid the incident area
    const origin = `${userLocation.latitude},${userLocation.longitude}`;
    const incident = `${incidentLocation.latitude},${incidentLocation.longitude}`;
    
    // Calculate a point that avoids the incident (simplified approach)
    const avoidLat = incidentLocation.latitude + 0.01; // Offset to avoid incident area
    const avoidLng = incidentLocation.longitude + 0.01;
    const waypoint = `${avoidLat},${avoidLng}`;
    
    const url = `https://www.google.com/maps/dir/${origin}/${waypoint}?avoid=tolls,ferries&travelmode=driving`;
    window.open(url, '_blank');
  };

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col">
      {/* Header with Search */}
      <div className="flex-none bg-white border-b border-neutral-200 p-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold text-neutral-900">Emergency Map</h2>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Layers className="h-4 w-4" />}
              rightIcon={<ChevronDown className="h-4 w-4" />}
              onClick={() => {
                setActiveLayersPanel(!activeLayersPanel);
                setActiveFiltersPanel(false);
              }}
            >
              Layers
            </Button>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Filter className="h-4 w-4" />}
              rightIcon={<ChevronDown className="h-4 w-4" />}
              onClick={() => {
                setActiveFiltersPanel(!activeFiltersPanel);
                setActiveLayersPanel(false);
              }}
            >
              Filters
            </Button>
            <Button
              variant="outline"
              size="sm"
              leftIcon={showLegend ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              onClick={() => setShowLegend(!showLegend)}
            >
              Legend
            </Button>
            {user?.role === 'civilian' && (
              <Link to="/incidents/report">
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<Plus className="h-4 w-4" />}
                >
                  Report
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search incidents, safe zones, or locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setShowSearchResults(false);
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Search Results */}
          {showSearchResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-neutral-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
              {searchResults.map((result, index) => (
                <button
                  key={`${result.type}-${result.id}-${index}`}
                  onClick={() => handleSearchResultClick(result)}
                  className="w-full px-4 py-3 text-left hover:bg-neutral-50 border-b border-neutral-100 last:border-b-0 flex items-center space-x-3"
                >
                  <div className="flex-shrink-0">
                    {result.type === 'incident' ? (
                      <div className={`p-1.5 rounded-full ${INCIDENT_LEGENDS[result.incidentType as keyof typeof INCIDENT_LEGENDS]?.bgColor || 'bg-gray-100'}`}>
                        {React.createElement(INCIDENT_LEGENDS[result.incidentType as keyof typeof INCIDENT_LEGENDS]?.icon || HelpCircle, {
                          className: `h-4 w-4 ${INCIDENT_LEGENDS[result.incidentType as keyof typeof INCIDENT_LEGENDS]?.color || 'text-gray-600'}`
                        })}
                      </div>
                    ) : (
                      <div className="p-1.5 rounded-full bg-green-100">
                        <Home className="h-4 w-4 text-green-600" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-sm">{result.title || result.name}</span>
                      <span className="text-xs text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full">
                        {result.searchType}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600 truncate mt-0.5">
                      {result.description || result.address || 'No description'}
                    </p>
                  </div>
                  <MapPin className="h-4 w-4 text-neutral-400 flex-shrink-0" />
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Layers Panel */}
        {activeLayersPanel && (
          <div className="mt-2 p-3 bg-white border border-neutral-200 rounded-md shadow-md">
            <h3 className="font-medium mb-2">Map Layers</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={layers.incidents}
                  onChange={() => toggleLayer('incidents')}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                />
                <span className="ml-2 text-sm">Incidents</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={layers.safeZones}
                  onChange={() => toggleLayer('safeZones')}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                />
                <span className="ml-2 text-sm">Safe Zones</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={layers.traffic}
                  onChange={() => toggleLayer('traffic')}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                />
                <span className="ml-2 text-sm">Traffic</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={layers.weather}
                  onChange={() => toggleLayer('weather')}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                />
                <span className="ml-2 text-sm">Weather</span>
              </label>
            </div>
          </div>
        )}
        
        {/* Filters Panel */}
        {activeFiltersPanel && (
          <div className="mt-2 p-3 bg-white border border-neutral-200 rounded-md shadow-md">
            <h3 className="font-medium mb-2">Incident Filters</h3>
            <div className="grid grid-cols-2 gap-x-4">
              <div>
                <h4 className="text-sm font-medium mb-1">Type</h4>
                <div className="space-y-1">
                  {Object.keys(filters.incidentTypes).map(type => (
                    <label key={type} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.incidentTypes[type as keyof typeof filters.incidentTypes]}
                        onChange={() => toggleFilter('incidentTypes', type)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                      />
                      <span className="ml-2 text-xs capitalize">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Severity</h4>
                <div className="space-y-1">
                  {Object.keys(filters.severity).map(severity => (
                    <label key={severity} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.severity[severity as keyof typeof filters.severity]}
                        onChange={() => toggleFilter('severity', severity)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                      />
                      <span className="ml-2 text-xs capitalize">{severity}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex-1 flex overflow-hidden">
        {/* Main Map */}
        <div className="flex-1 relative">
          <EmergencyMap 
            incidents={layers.incidents ? filteredIncidents : []}
            safeZones={layers.safeZones ? safeZones : []}
            userLocation={userLocation || undefined}
            onIncidentClick={handleIncidentClick}
            onSafeZoneClick={handleSafeZoneClick}
            height="100%"
          />

          {/* Integrated Map Legends */}
          <div className="absolute top-4 left-4 space-y-2">
            {/* Quick Legend Bar */}
            <div className="bg-white/90 backdrop-blur-sm border border-neutral-200 rounded-lg shadow-sm p-3">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-xs font-medium">Critical</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-xs font-medium">High</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-xs font-medium">Medium</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-xs font-medium">Low</span>
                </div>
              </div>
            </div>

            {/* Emergency Types Legend */}
            <div className="bg-white/90 backdrop-blur-sm border border-neutral-200 rounded-lg shadow-sm p-3">
              <h4 className="text-xs font-semibold text-neutral-700 mb-2">Emergency Types</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <div className="p-1 bg-red-100 rounded-full">
                    <Flame className="h-3 w-3 text-red-600" />
                  </div>
                  <span className="text-xs">Fire</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="p-1 bg-blue-100 rounded-full">
                    <Droplets className="h-3 w-3 text-blue-600" />
                  </div>
                  <span className="text-xs">Flood</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="p-1 bg-orange-100 rounded-full">
                    <Car className="h-3 w-3 text-orange-600" />
                  </div>
                  <span className="text-xs">Accident</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="p-1 bg-pink-100 rounded-full">
                    <Stethoscope className="h-3 w-3 text-pink-600" />
                  </div>
                  <span className="text-xs">Medical</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="p-1 bg-purple-100 rounded-full">
                    <Users className="h-3 w-3 text-purple-600" />
                  </div>
                  <span className="text-xs">Unrest</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="p-1 bg-gray-100 rounded-full">
                    <Shield className="h-3 w-3 text-gray-600" />
                  </div>
                  <span className="text-xs">Crime</span>
                </div>
              </div>
            </div>

            {/* Map Symbols Legend */}
            <div className="bg-white/90 backdrop-blur-sm border border-neutral-200 rounded-lg shadow-sm p-3">
              <h4 className="text-xs font-semibold text-neutral-700 mb-2">Map Symbols</h4>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <div className="p-1 bg-green-100 rounded-full">
                    <Home className="h-3 w-3 text-green-600" />
                  </div>
                  <span className="text-xs">Safe Zone</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="p-1 bg-blue-100 rounded-full">
                    <MapPin className="h-3 w-3 text-blue-600" />
                  </div>
                  <span className="text-xs">Your Location</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="p-1 bg-yellow-100 rounded-full">
                    <AlertTriangle className="h-3 w-3 text-yellow-600" />
                  </div>
                  <span className="text-xs">Active Incident</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Compass */}
          <div className="absolute bottom-20 right-4">
            <div className="bg-white/90 backdrop-blur-sm border border-neutral-200 rounded-full p-3 shadow-lg">
              <Compass className="h-6 w-6 text-neutral-600" />
            </div>
          </div>
          
          {/* Info Panel */}
          {(selectedIncident || selectedSafeZone) && (
            <div className="absolute bottom-4 left-4 right-4 max-w-md mx-auto">
              {selectedIncidentData && (
                <Card className="shadow-lg border-l-4 border-l-primary-500">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">{selectedIncidentData.title}</h3>
                    <button 
                      onClick={() => setSelectedIncident(null)} 
                      className="text-neutral-400 hover:text-neutral-500"
                    >
                      ×
                    </button>
                  </div>
                  <p className="text-sm text-neutral-600 mt-1 mb-3">
                    {selectedIncidentData.description}
                  </p>
                  <div className="flex justify-between">
                    <Link to={`/incidents/${selectedIncidentData.id}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<AlertTriangle className="h-4 w-4" />}
                      >
                        Details
                      </Button>
                    </Link>
                    {user?.role === 'civilian' && (
                      <Button
                        variant="secondary"
                        size="sm"
                        leftIcon={<Navigation className="h-4 w-4" />}
                        onClick={() => getAlternateRoute(selectedIncidentData.location)}
                      >
                        Avoid Route
                      </Button>
                    )}
                  </div>
                  
                  {/* Google Maps Navigation */}
                  <div className="mt-2 pt-2 border-t border-neutral-200">
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<ExternalLink className="h-4 w-4" />}
                        onClick={() => openGoogleMapsNavigation(selectedIncidentData.location, 'incident')}
                        className="flex-1"
                      >
                        View in Maps
                      </Button>
                      {user?.role === 'civilian' && (
                        <Button
                          variant="secondary"
                          size="sm"
                          leftIcon={<Compass className="h-4 w-4" />}
                          onClick={() => getAlternateRoute(selectedIncidentData.location)}
                          className="flex-1"
                        >
                          Get Directions
                        </Button>
                      )}
                    {user?.role === 'authority' && (
                      <Link to={`/incidents/${selectedIncidentData.id}/respond`}>
                        <Button
                          variant="primary"
                          size="sm"
                          leftIcon={<Navigation className="h-4 w-4" />}
                        >
                          Respond
                        </Button>
                      </Link>
                    )}
                    </div>
                  </div>
                </Card>
              )}
              
              {selectedSafeZoneData && (
                <Card className="shadow-lg border-l-4 border-l-success-500">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">{selectedSafeZoneData.name}</h3>
                    <button 
                      onClick={() => setSelectedSafeZone(null)} 
                      className="text-neutral-400 hover:text-neutral-500"
                    >
                      ×
                    </button>
                  </div>
                  <div className="flex justify-between items-center mt-1 mb-2">
                    <span className="text-sm text-neutral-600">
                      Capacity: {selectedSafeZoneData.currentOccupancy}/{selectedSafeZoneData.capacity}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      selectedSafeZoneData.status === 'open' 
                        ? 'bg-success-100 text-success-800' 
                        : selectedSafeZoneData.status === 'full'
                        ? 'bg-warning-100 text-warning-800'
                        : 'bg-neutral-100 text-neutral-800'
                    }`}>
                      {selectedSafeZoneData.status}
                    </span>
                  </div>
                  <div className="text-xs space-x-1 mb-3">
                    {selectedSafeZoneData.facilities.map((facility, index) => (
                      <span 
                        key={index}
                        className="inline-block bg-neutral-100 text-neutral-800 px-2 py-0.5 rounded-full"
                      >
                        {facility}
                      </span>
                    ))}
                  </div>
               
                  
                  {/* Google Maps Integration */}
                  <div className="mt-2 pt-2 border-t  border-neutral-200">
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<ExternalLink className="h-4 w-4" />}
                      onClick={() => openGoogleMapsNavigation(selectedSafeZoneData.location, 'safeZone')}
                      className="w-full hover:bg-[rgb(36,141,102)] hover:text-white"
                    >
                      Open in Google Maps
                    </Button>
                  </div>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* SOS Button for Civilians */}
      {user?.role === 'civilian' && <SOSButton />}
    </div>
  );
};

export default MapPage;
