import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  AlertTriangle, 
  Bell, 
  MapPin, 
  Shield, 
  Clock, 
  Users, 
  Settings, 
  Check, 
  X, 
  Flag, 
  ChevronRight,
  Truck,
  CheckCircle,
  BarChart2,
  AreaChart
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useIncidents } from '../contexts/IncidentContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import IncidentCard from '../components/common/IncidentCard';
import IncidentModeration from '../components/admin/IncidentModeration';
import Alert from '../components/common/Alert';

const DashboardAdmin: React.FC = () => {
  const { user } = useAuth();
  const { incidents, safeZones, loading } = useIncidents();
  const [pendingReports, setPendingReports] = useState(0);
  const adminUser = user as any; // Type casting for demo

  useEffect(() => {
    // Count pending reports
    if (incidents.length > 0) {
      setPendingReports(
        incidents.filter(incident => 
          incident.status === 'reported' && !incident.verifiedBy
        ).length
      );
    }
  }, [incidents]);

  const handleApproveIncident = (id: string) => {
    console.log('Approved incident:', id);
    // In a real app, we would update the incident status
  };

  const handleDenyIncident = (id: string, reason: string) => {
    console.log('Denied incident:', id, 'Reason:', reason);
    // In a real app, we would update the incident status
  };

  const handleFlagIncident = (id: string, reason: string) => {
    console.log('Flagged incident:', id, 'Reason:', reason);
    // In a real app, we would update the incident status
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-neutral-900 sm:text-3xl sm:truncate">
              Admin Control Center
            </h2>
            <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
              <div className="mt-2 flex items-center text-sm text-neutral-500">
                <Shield className="flex-shrink-0 mr-1.5 h-5 w-5 text-neutral-400" />
                Access Level: {adminUser?.accessLevel === 'city' ? 'City-wide' : adminUser?.accessLevel}
              </div>
              <div className="mt-2 flex items-center text-sm text-neutral-500">
                <Clock className="flex-shrink-0 mr-1.5 h-5 w-5 text-neutral-400" />
                Last system check: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <Button
              variant="outline"
              leftIcon={<Bell className="h-5 w-5" />}
              className="mr-2"
            >
              System Alerts
            </Button>
            <Button
              variant="primary"
              leftIcon={<Settings className="h-5 w-5" />}
            >
              System Settings
            </Button>
          </div>
        </div>
        
        {pendingReports > 0 && (
          <div className="mt-6">
            <Alert
              variant="warning"
              title="Pending Reports"
              message={`There are ${pendingReports} incident reports awaiting moderation.`}
              icon={<AlertTriangle className="h-5 w-5 text-warning-500" />}
              closable
            />
          </div>
        )}
        
        <div className="mt-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
            
            <Card className="border-l-4 border-l-secondary-500">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-8 w-8 text-secondary-500" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-neutral-500 truncate">
                      Active Personnel
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-neutral-900">
                        42
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </Card>
            
            <Card className="border-l-4 border-l-warning-500">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Shield className="h-8 w-8 text-warning-500" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-neutral-500 truncate">
                      Safe Zones
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-neutral-900">
                        {safeZones.filter(z => z.status === 'open').length}/
                        {safeZones.length}
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
                      System Status
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-neutral-900">
                        Operational
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
            {/* Pending Moderation */}
            <Card title="Reports Pending Moderation">
              {loading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
                  <p className="mt-2 text-neutral-500">Loading reports...</p>
                </div>
              ) : incidents.filter(i => i.status === 'reported' && !i.verifiedBy).length > 0 ? (
                <div className="space-y-6">
                  {incidents
                    .filter(i => i.status === 'reported' && !i.verifiedBy)
                    .slice(0, 1)
                    .map(incident => (
                      <div key={incident.id}>
                        <IncidentCard incident={incident} />
                        <div className="mt-4">
                          <IncidentModeration 
                            incident={incident}
                            onApprove={handleApproveIncident}
                            onDeny={handleDenyIncident}
                            onFlag={handleFlagIncident}
                          />
                        </div>
                      </div>
                    ))}
                  {incidents.filter(i => i.status === 'reported' && !i.verifiedBy).length > 1 && (
                    <Link
                      to="/admin/moderation"
                      className="inline-flex items-center text-primary-600 hover:text-primary-500"
                    >
                      View all pending reports
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  )}
                </div>
              ) : (
                <p className="text-neutral-500 text-center py-4">No reports pending moderation</p>
              )}
            </Card>
            
            {/* System Analytics */}
            <Card title="System Analytics">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <h4 className="text-sm font-medium text-neutral-500 flex items-center mb-2">
                    <BarChart2 className="h-4 w-4 mr-1" />
                    Incident Distribution
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center text-sm mb-1">
                        <span>Flood</span>
                        <span className="font-medium">35%</span>
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-2">
                        <div className="bg-secondary-500 h-2 rounded-full" style={{ width: '35%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center text-sm mb-1">
                        <span>Fire</span>
                        <span className="font-medium">25%</span>
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-2">
                        <div className="bg-error-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center text-sm mb-1">
                        <span>Accident</span>
                        <span className="font-medium">20%</span>
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-2">
                        <div className="bg-warning-500 h-2 rounded-full" style={{ width: '20%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center text-sm mb-1">
                        <span>Other</span>
                        <span className="font-medium">20%</span>
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-2">
                        <div className="bg-neutral-500 h-2 rounded-full" style={{ width: '20%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-neutral-500 flex items-center mb-2">
                    <AreaChart className="h-4 w-4 mr-1" />
                    Response Time
                  </h4>
                  <div className="p-3 bg-neutral-50 rounded-md">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">Average Response Time</span>
                      <span className="font-medium text-primary-600">18.5 min</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">Fastest Response</span>
                      <span className="font-medium text-success-600">4.2 min</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Critical Incidents Avg</span>
                      <span className="font-medium text-error-600">10.3 min</span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Link
                      to="/admin/analytics"
                      className="inline-flex items-center text-primary-600 hover:text-primary-500"
                    >
                      View detailed analytics
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          </div>
          
          {/* Right Column */}
          <div className="space-y-6">
            {/* Admin Actions */}
            
            
            {/* Recent Activity */}
            <Card title="Recent Admin Activity">
              <div className="flow-root h-[15rem]">
                <ul className="-mb-8">
                  <li>
                    <div className="relative pb-8">
                      <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-neutral-200" aria-hidden="true"></span>
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-success-500 flex items-center justify-center ring-8 ring-white">
                            <Check className="h-5 w-5 text-white" />
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-neutral-800">
                              Approved incident report <span className="font-medium">#incident-2</span>
                            </p>
                          </div>
                          <div className="text-right text-xs text-neutral-500">
                            <span>10m ago</span>
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
                            <Flag className="h-5 w-5 text-white" />
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-neutral-800">
                              Added new safe zone at <span className="font-medium">Electronic City</span>
                            </p>
                          </div>
                          <div className="text-right text-xs text-neutral-500">
                            <span>1h ago</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                  
                  <li>
                    <div className="relative">
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-error-500 flex items-center justify-center ring-8 ring-white">
                            <X className="h-5 w-5 text-white" />
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-neutral-800">
                              Rejected false report <span className="font-medium">#report-458</span>
                            </p>
                          </div>
                          <div className="text-right text-xs text-neutral-500">
                            <span>3h ago</span>
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

export default DashboardAdmin;