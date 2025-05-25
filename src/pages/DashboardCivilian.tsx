import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  AlertTriangle, 
  MapPin, 
  Shield, 
  Clock, 
  ChevronRight,
  CloudSun, 
  Droplets, 
  Thermometer, 
  Wind 
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useIncidents } from '../contexts/IncidentContext';
import Card from '../components/common/Card';
import IncidentCard from '../components/common/IncidentCard';
import SafetyStatusCard from '../components/civilian/SafetyStatusCard';
import SOSButton from '../components/civilian/SOSButton';
import Alert from '../components/common/Alert';

const DashboardCivilian: React.FC = () => {
  const { user } = useAuth();
  const { incidents, safeZones, loading } = useIncidents();
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [nearbyAlert, setNearbyAlert] = useState(false);
  const [weather, setWeather] = useState<any>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [forecast, setForecast] = useState<any[]>([]);
  const civilianUser = user as any;

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
    
    // Check if there are any incidents nearby
    if (incidents.some(incident => incident.severity === 'high' || incident.severity === 'critical')) {
      setNearbyAlert(true);
    }
  }, [incidents]);

  useEffect(() => {
    if (userLocation) {
      setWeatherLoading(true);
      setWeatherError(null);
      // Fetch current weather and hourly forecast
      fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${userLocation.latitude}&longitude=${userLocation.longitude}&current_weather=true&hourly=temperature_2m,weathercode,windspeed_10m`
      )
        .then((res) => res.json())
        .then((data) => {
          setWeather(data.current_weather);
          // Prepare hourly forecast for the next 8 hours
          if (data.hourly && data.hourly.time) {
            const now = new Date();
            const forecastArr = [];
            for (let i = 0; i < data.hourly.time.length; i++) {
              const forecastTime = new Date(data.hourly.time[i]);
              if (forecastTime > now && forecastArr.length < 8) {
                forecastArr.push({
                  time: forecastTime,
                  temperature: data.hourly.temperature_2m[i],
                  windspeed: data.hourly.windspeed_10m[i],
                  weathercode: data.hourly.weathercode[i],
                });
              }
            }
            setForecast(forecastArr);
          } else {
            setForecast([]);
          }
          setWeatherLoading(false);
        })
        .catch(() => {
          setWeatherError('Unable to fetch weather data');
          setWeatherLoading(false);
        });
    }
  }, [userLocation]);

  const handleSOSActivate = () => {
    console.log('SOS activated');
    // In a real app, we would send this to the server
  };

  // Weather code to icon/label helper
  const getWeatherLabel = (code: number) => {
    switch (code) {
      case 0: return 'Clear';
      case 1:
      case 2:
      case 3: return 'Cloudy';
      case 45:
      case 48: return 'Fog';
      case 51:
      case 53:
      case 55: return 'Drizzle';
      case 61:
      case 63:
      case 65: return 'Rain';
      case 71:
      case 73:
      case 75: return 'Snow';
      case 80:
      case 81:
      case 82: return 'Showers';
      case 95: return 'Thunderstorm';
      default: return 'Unknown';
    }
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-neutral-900 sm:text-3xl sm:truncate">
              Hello, {civilianUser?.name}
            </h2>
            <div className="flex items-center mt-2">
              <MapPin className="h-5 w-5 text-neutral-500" />
              <span className="text-sm text-neutral-500 ml-1">
                {civilianUser?.homeAddress || 'Location not set'}
              </span>
            </div>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <Link to='/create'>Report Incident</Link>
          </div>
        </div>
        
        {nearbyAlert && (
          <div className="mt-6">
            <Alert
              variant="warning"
              title="Emergency Alert"
              message="There are active incidents in your area. Please stay vigilant and follow safety instructions."
              icon={<AlertTriangle className="h-5 w-5 text-warning-500" />}
              closable
              onClose={() => setNearbyAlert(false)}
            />
          </div>
        )}
        
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Safety Status */}
            <SafetyStatusCard 
              currentStatus={civilianUser?.safetyStatus || 'unknown'} 
              lastUpdated={civilianUser?.lastActive}
            />
            
            {/* Nearby Incidents */}
            <Card title="Nearby Incidents">
              {loading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
                  <p className="mt-2 text-neutral-500">Loading incidents...</p>
                </div>
              ) : incidents.length > 0 ? (
                <div className="space-y-4">
                  {incidents.slice(0, 3).map(incident => (
                    <IncidentCard key={incident.id} incident={incident} compact />
                  ))}
                  <Link
                    to="/incidents"
                    className="inline-flex items-center text-primary-600 hover:text-primary-500"
                  >
                    View all incidents
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              ) : (
                <p className="text-neutral-500 text-center py-4">No incidents reported nearby</p>
              )}
            </Card>
            
            {/* Safe Zones */}
            <Card title="Nearby Safe Zones">
              {loading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
                  <p className="mt-2 text-neutral-500">Loading safe zones...</p>
                </div>
              ) : safeZones.length > 0 ? (
                <div className="space-y-3">
                  {safeZones.slice(0, 3).map(zone => (
                    <Link key={zone.id} to={`/safe-zones/${zone.id}`} className="block">
                      <div className="flex items-center p-3 border border-neutral-200 rounded-lg hover:bg-neutral-50">
                        <Shield className="h-6 w-6 text-success-500 mr-3" />
                        <div className="flex-1">
                          <h4 className="font-medium">{zone.name}</h4>
                          <div className="flex items-center text-sm text-neutral-500">
                            <MapPin className="h-4 w-4 mr-1" />
                            {zone.location.address || 'Address not available'}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                            zone.status === 'open' 
                              ? 'bg-success-100 text-success-800' 
                              : zone.status === 'full'
                              ? 'bg-warning-100 text-warning-800'
                              : 'bg-neutral-100 text-neutral-800'
                          }`}>
                            {zone.status}
                          </span>
                          <p className="text-xs text-neutral-500 mt-1">
                            {zone.currentOccupancy}/{zone.capacity}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                  <Link
                    to="/map"
                    className="inline-flex items-center text-primary-600 hover:text-primary-500"
                  >
                    View all safe zones
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              ) : (
                <p className="text-neutral-500 text-center py-4">No safe zones found nearby</p>
              )}
            </Card>
          </div>
          
          {/* Right Column */}
          <div className="space-y-6">
            {/* Quick Actions */}

            {/* Weather Widget */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-base font-semibold mb-2 flex items-center">
                <CloudSun className="h-5 w-5 mr-2 text-primary-500" />
                Current Weather
              </h3>
              {weatherLoading ? (
                <div className="text-neutral-500">Loading weather...</div>
              ) : weatherError ? (
                <div className="text-red-500">{weatherError}</div>
              ) : weather ? (
                <>
                  <div className="flex items-center space-x-6 mb-4">
                    <div className="flex items-center">
                      <Thermometer className="h-5 w-5 mr-1 text-orange-500" />
                      <span className="font-medium">{weather.temperature}°C</span>
                    </div>
                    <div className="flex items-center">
                      <Wind className="h-5 w-5 mr-1 text-blue-400" />
                      <span>{weather.windspeed} km/h</span>
                    </div>
                    <div className="flex items-center">
                      <Droplets className="h-5 w-5 mr-1 text-cyan-500" />
                      <span>{getWeatherLabel(weather.weathercode)}</span>
                    </div>
                  </div>
                  {/* Hourly Forecast */}
                  {forecast.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-neutral-700 mb-2 flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        Upcoming Hours
                      </h4>
                      <div className="flex flex-col overflow-x-auto space-x-4 gap-[2rem] pb-2">
                        {forecast.map((hour, idx) => (
                          <div
                            key={idx}
                            className="flex flex-col items-center bg-neutral-50 rounded p-2 min-w-[80%]"
                          >
                            <span className="text-xs text-neutral-500">
                              {hour.time.getHours()}:00
                            </span>
                            <span className="font-semibold">{hour.temperature}°C</span>
                            <span className="text-xs">{getWeatherLabel(hour.weathercode)}</span>
                            <span className="text-xs text-blue-400">{hour.windspeed} km/h</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-neutral-500">Weather data not available</div>
              )}
            </div>

            {/* Emergency Kit */}

            {/* Family Members */}
          </div>
        </div>
      </div>
      
      {/* SOS Button */}
      <SOSButton onActivate={handleSOSActivate} />
    </div>
  );
};

export default DashboardCivilian;