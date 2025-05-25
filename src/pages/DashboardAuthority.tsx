import React, { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import { 
  Flame, 
  Droplets, 
  Car, 
  Users, 
  Stethoscope, 
  Building, 
  Shield, 
  AlertTriangle,
  Clock
} from 'lucide-react';
import { 
  Bell, 
  Calendar, 
  ChevronRight,
  Truck,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useIncidents } from '../contexts/IncidentContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import IncidentCard from '../components/common/IncidentCard';
import Alert from '../components/common/Alert';
import { IncidentSeverity, IncidentType } from '../types/incident';
const getIncidentIcon = (type: IncidentType) => {
    switch (type) {
      case 'fire':
        return <Flame className="h-5 w-5 text-error-500" />;
      case 'flood':
        return <Droplets className="h-5 w-5 text-secondary-500" />;
      case 'accident':
        return <Car className="h-5 w-5 text-warning-500" />;
      case 'riot':
        return <Users className="h-5 w-5 text-primary-500" />;
      case 'medical':
        return <Stethoscope className="h-5 w-5 text-success-500" />;
      case 'infrastructure':
        return <Building className="h-5 w-5 text-neutral-500" />;
      case 'crime':
        return <Shield className="h-5 w-5 text-secondary-700" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-warning-500" />;
    }
  };

  const getSeverityBadge = (severity: IncidentSeverity) => {
    const baseClasses = 'px-2 py-1 text-xs font-medium rounded-full';
    switch (severity) {
      case 'low':
        return <span className={`${baseClasses} bg-success-100 text-success-800`}>Low</span>;
      case 'medium':
        return <span className={`${baseClasses} bg-warning-100 text-warning-800`}>Medium</span>;
      case 'high':
        return <span className={`${baseClasses} bg-error-100 text-error-800`}>High</span>;
      case 'critical':
        return (
          <span className={`${baseClasses} bg-error-500 text-white animate-pulse`}>
            Critical
          </span>
        );
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = 'px-2 py-1 text-xs font-medium rounded-full';
    switch (status) {
      case 'reported':
        return <span className={`${baseClasses} bg-neutral-100 text-neutral-800`}>Reported</span>;
      case 'verified':
        return <span className={`${baseClasses} bg-secondary-100 text-secondary-800`}>Verified</span>;
      case 'in_progress':
        return <span className={`${baseClasses} bg-warning-100 text-warning-800`}>In Progress</span>;
      case 'resolved':
        return <span className={`${baseClasses} bg-success-100 text-success-800`}>Resolved</span>;
      case 'false_alarm':
        return <span className={`${baseClasses} bg-neutral-100 text-neutral-600`}>False Alarm</span>;
    }
  };
const DashboardAuthority: React.FC = () => {
  const { user } = useAuth();
  const { incidents, loading } = useIncidents();
  const [unassignedIncidents, setUnassignedIncidents] = useState(0);
  const [criticalIncidents, setCriticalIncidents] = useState(0);
  const authorityUser = user as any; 

  useEffect(() => {
    if (incidents.length > 0) {
      setUnassignedIncidents(
        incidents.filter(incident => 
          !incident.assignedTo || incident.assignedTo.length === 0
        ).length
      );
      
      setCriticalIncidents(
        incidents.filter(incident => 
          incident.severity === 'critical' || incident.severity === 'high'
        ).length
      );
    }
  }, [incidents]);

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-neutral-900 sm:text-3xl sm:truncate">
              Officer Dashboard
            </h2>
            <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
              <div className="mt-2 flex items-center text-sm text-neutral-500">
                <Users className="flex-shrink-0 mr-1.5 h-5 w-5 text-neutral-400" />
                {authorityUser?.department || 'Department not set'}
              </div>
              <div className="mt-2 flex items-center text-sm text-neutral-500">
                <Clock className="flex-shrink-0 mr-1.5 h-5 w-5 text-neutral-400" />
                Shift: 08:00 - 20:00
              </div>
              <div className="mt-2 flex items-center text-sm">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  authorityUser?.status === 'on-duty' 
                    ? 'bg-success-100 text-success-800' 
                    : 'bg-warning-100 text-warning-800'
                }`}>
                  {authorityUser?.status === 'on-duty' ? 'On Duty' : 'Off Duty'}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <Button
              variant="outline"
              leftIcon={<Bell className="h-5 w-5" />}
              className="mr-2"
            >
              Alerts
            </Button>
            <Button
              variant="primary"
              leftIcon={<Calendar className="h-5 w-5" />}
            >
              Schedule
            </Button>
          </div>
        </div>
        
        {criticalIncidents > 0 && (
          <div className="mt-6">
            <Alert
              variant="error"
              title="Critical Incidents"
              message={`There are ${criticalIncidents} critical incidents that require immediate attention.`}
              icon={<AlertTriangle className="h-5 w-5 text-error-500" />}
              closable
            />
          </div>
        )}
        
        <div className="mt-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {/* Stats Cards */}
            <Card className="border-l-4 border-l-primary-500">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-8 w-8 text-primary-500" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-neutral-500 truncate">
                      Active Incidents
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-neutral-900">
                        {incidents.filter(i => 
                          i.status === 'in_progress' || i.status === 'verified'
                        ).length}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </Card>
            
            <Card className="border-l-4 border-l-warning-500">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Truck className="h-8 w-8 text-warning-500" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-neutral-500 truncate">
                      Assigned to You
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-neutral-900">
                        {incidents.filter(i => 
                          i.assignedTo && i.assignedTo.includes(authorityUser?.id || '')
                        ).length}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </Card>
            
            <Card className="border-l-4 border-l-success-500">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-8 w-8 text-success-500" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-neutral-500 truncate">
                      Resolved Today
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-neutral-900">
                        {incidents.filter(i => 
                          i.status === 'resolved' && 
                          new Date(i.updatedAt).toDateString() === new Date().toDateString()
                        ).length}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </Card>
          </div>
        </div>
        
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column - Incidents */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Assigned Incidents */}
            <Card title="Assigned to You">
              {loading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
                  <p className="mt-2 text-neutral-500">Loading incidents...</p>
                </div>
              ) : incidents.filter(i => 
                i.assignedTo && i.assignedTo.includes(authorityUser?.id || '')
              ).length > 0 ? (
                <div className="space-y-4">
                  {incidents
                    .filter(i => i.assignedTo && i.assignedTo.includes(authorityUser?.id || ''))
                    .map(incident => (
                      <Link to={`/incidents/${incident.id}`} key={incident.id} className="block">
      <Card hoverable className="mb-4">
        <div className="flex flex-col sm:flex-row items-start">
          <div className="mr-0 sm:mr-4 mt-1">{getIncidentIcon(incident.type)}</div>
          <div className="flex-1 w-full min-w-0">
            <div className="flex flex-col sm:flex-row sm:justify-between w-full">
              <h3 className="text-lg font-medium truncate">{incident.title}</h3>
              <div className="flex space-x-2 mt-2 sm:mt-0">
                {getSeverityBadge(incident.severity)}
                {getStatusBadge(incident.status)}
              </div>
            </div>
            
            <p className="mt-2 text-neutral-600 line-clamp-2">{incident.description}</p>
            
            <div className="mt-3 flex flex-col sm:flex-row sm:justify-between sm:items-center text-sm text-neutral-500 gap-1">
              <div className="truncate">
                {incident.location.address || 'Location not specified'}
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {formatDistanceToNow(new Date(incident.reportedAt), { addSuffix: true })}
              </div>
            </div>
            
            {incident.images && incident.images.length > 0 && (
              <div className="mt-3 flex space-x-2 overflow-x-auto">
                {incident.images.slice(0, 3).map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Incident ${incident.id} image ${index + 1}`}
                    className="h-16 w-24 object-cover rounded flex-shrink-0"
                  />
                ))}
                {incident.images.length > 3 && (
                  <div className="h-16 w-24 bg-neutral-100 rounded flex items-center justify-center text-neutral-500 flex-shrink-0">
                    +{incident.images.length - 3} more
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Card>
    </Link>
                    ))}
                </div>
              ) : (
                <p className="text-neutral-500 text-center py-4">No incidents currently assigned to you</p>
              )}
            </Card>
            
            {/* Unassigned Incidents */}
            {unassignedIncidents > 0 && (
              <Card title="Unassigned Incidents">
                <div className="space-y-4">
                  {incidents
                    .filter(i => !i.assignedTo || i.assignedTo.length === 0)
                    .slice(0, 2)
                    .map(incident => (
                      <IncidentCard key={incident.id} incident={incident} />
                    ))}
                  {unassignedIncidents > 2 && (
                    <Link
                      to="/incidents?filter=unassigned"
                      className="inline-flex items-center text-primary-600 hover:text-primary-500"
                    >
                      View all unassigned incidents
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  )}
                </div>
              </Card>
            )}
          </div>
          
          {/* Right Column */}
          <div className="space-y-6">
            {/* Team Status */}
            <Card title="Team Status">
              <div className="space-y-3">
                <div className="flex items-center p-2 border border-neutral-200 rounded-lg">
                  <div className="h-8 w-8 bg-secondary-100 text-secondary-800 rounded-full flex items-center justify-center mr-3">
                    KP
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">Dr. Kavita Patel</h4>
                    <div className="flex items-center">
                      <span className="inline-block w-2 h-2 rounded-full bg-success-500 mr-1"></span>
                      <span className="text-xs text-success-600">On Duty</span>
                    </div>
                  </div>
                  <div className="text-right text-xs text-neutral-500">
                    <div>Koramangala</div>
                    <div>Medical</div>
                  </div>
                </div>
                
                <div className="flex items-center p-2 border border-neutral-200 rounded-lg">
                  <div className="h-8 w-8 bg-secondary-100 text-secondary-800 rounded-full flex items-center justify-center mr-3">
                    SR
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">Suresh Rao</h4>
                    <div className="flex items-center">
                      <span className="inline-block w-2 h-2 rounded-full bg-success-500 mr-1"></span>
                      <span className="text-xs text-success-600">On Duty</span>
                    </div>
                  </div>
                  <div className="text-right text-xs text-neutral-500">
                    <div>Indiranagar</div>
                    <div>Police</div>
                  </div>
                </div>
                
                <div className="flex items-center p-2 border border-neutral-200 rounded-lg">
                  <div className="h-8 w-8 bg-secondary-100 text-secondary-800 rounded-full flex items-center justify-center mr-3">
                    MJ
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">Manish Joshi</h4>
                    <div className="flex items-center">
                      <span className="inline-block w-2 h-2 rounded-full bg-neutral-400 mr-1"></span>
                      <span className="text-xs text-neutral-600">Off Duty</span>
                    </div>
                  </div>
                  <div className="text-right text-xs text-neutral-500">
                    <div>Whitefield</div>
                    <div>Fire</div>
                  </div>
                </div>
                
                
              </div>
            </Card>
            
            {/* Resources */}
            <Card title="Available Resources">
              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 border border-neutral-200 rounded-lg">
                  <div className="flex items-center">
                    <Truck className="h-5 w-5 text-secondary-500 mr-2" />
                    <span>Emergency Vehicles</span>
                  </div>
                  <div className="font-medium">8/12</div>
                </div>
                
                <div className="flex justify-between items-center p-2 border border-neutral-200 rounded-lg">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-secondary-500 mr-2" />
                    <span>Response Teams</span>
                  </div>
                  <div className="font-medium">5/7</div>
                </div>
                
                <div className="flex justify-between items-center p-2 border border-neutral-200 rounded-lg">
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-secondary-500 mr-2" />
                    <span>Medical Kits</span>
                  </div>
                  <div className="font-medium">15/20</div>
                </div>
                
                
              </div>
            </Card>
            
            {/* Recent Activity */}
            <Card title="Recent Activity">
              <div className="flow-root">
                <ul className="-mb-8">
                  <li>
                    <div className="relative pb-8">
                      <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-neutral-200" aria-hidden="true"></span>
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-success-500 flex items-center justify-center ring-8 ring-white">
                            <CheckCircle className="h-5 w-5 text-white" />
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-neutral-800">
                              Incident <span className="font-medium">#incident-3</span> resolved
                            </p>
                          </div>
                          <div className="text-right text-xs text-neutral-500">
                            <span>2h ago</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                  
                  <li>
                    <div className="relative pb-8">
                      <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-neutral-200" aria-hidden="true"></span>
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-warning-500 flex items-center justify-center ring-8 ring-white">
                            <Truck className="h-5 w-5 text-white" />
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-neutral-800">
                              Assigned to <span className="font-medium">Flooding at Outer Ring Road</span>
                            </p>
                          </div>
                          <div className="text-right text-xs text-neutral-500">
                            <span>3h ago</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                  
                  <li>
                    <div className="relative">
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-secondary-500 flex items-center justify-center ring-8 ring-white">
                            <Bell className="h-5 w-5 text-white" />
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-neutral-800">
                              Shift started
                            </p>
                          </div>
                          <div className="text-right text-xs text-neutral-500">
                            <span>8h ago</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAuthority;