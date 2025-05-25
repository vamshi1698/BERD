import React, { useState } from 'react';
import { 
  User, 
  Clock, 
  Car, 
  Droplets, 
  AlertCircle, 
  MessageSquare,
  CheckCircle,
  AlertTriangle,
  Truck
} from 'lucide-react';
import { Incident, Resource } from '../../types/incident';
import Card from '../common/Card';
import Button from '../common/Button';

interface IncidentResponseProps {
  incident: Incident;
  onStatusChange?: (status: string) => void;
  onResourceDeploy?: (resources: Resource[]) => void;
}

const IncidentResponse: React.FC<IncidentResponseProps> = ({
  incident,
  onStatusChange,
  onResourceDeploy,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [newStatus, setNewStatus] = useState(incident.status);
  const [note, setNote] = useState('');
  
  const handleStatusChange = async (status: string) => {
    setIsLoading(true);
    setNewStatus(status);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (onStatusChange) {
      onStatusChange(status);
    }
    
    setIsLoading(false);
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'reported':
        return <AlertCircle className="h-5 w-5 text-neutral-500" />;
      case 'verified':
        return <CheckCircle className="h-5 w-5 text-secondary-500" />;
      case 'in_progress':
        return <Truck className="h-5 w-5 text-warning-500" />;
      case 'resolved':
        return <CheckCircle className="h-5 w-5 text-success-500" />;
      case 'false_alarm':
        return <AlertTriangle className="h-5 w-5 text-neutral-400" />;
      default:
        return <AlertCircle className="h-5 w-5 text-neutral-500" />;
    }
  };
  
  const handleAddNote = async () => {
    if (!note.trim()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // In a real app, we would send this to the server
    console.log('Adding note:', note);
    
    setNote('');
    setIsLoading(false);
  };
  
  const getConditionIcon = () => {
    if (incident.type === 'flood') {
      return <Droplets className="h-5 w-5 text-secondary-500" />;
    } else if (incident.type === 'accident') {
      return <Car className="h-5 w-5 text-warning-500" />;
    } else {
      return <AlertCircle className="h-5 w-5 text-error-500" />;
    }
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Incident Status Card */}
      <Card 
        title="Incident Status"
        className={`
          ${incident.status === 'resolved' ? 'border-l-4 border-l-success-500' : ''}
          ${incident.status === 'in_progress' ? 'border-l-4 border-l-warning-500' : ''}
          ${incident.status === 'verified' ? 'border-l-4 border-l-secondary-500' : ''}
          ${incident.status === 'reported' ? 'border-l-4 border-l-neutral-500' : ''}
        `}
      >
        <div className="space-y-4">
          <div className="flex items-center">
            {getStatusIcon(incident.status)}
            <div className="ml-2">
              <p className="font-medium">
                Current Status: 
                <span className="ml-1 capitalize">
                  {incident.status.replace('_', ' ')}
                </span>
              </p>
              <div className="text-sm text-neutral-500 flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                Last updated: {new Date(incident.updatedAt).toLocaleString()}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={newStatus === 'verified' ? 'secondary' : 'outline'}
              size="sm"
              leftIcon={<CheckCircle className="h-4 w-4" />}
              onClick={() => handleStatusChange('verified')}
              disabled={isLoading || incident.status === 'resolved'}
              isLoading={isLoading && newStatus === 'verified'}
              fullWidth
            >
              Verify
            </Button>
            <Button
              variant={newStatus === 'in_progress' ? 'warning' : 'outline'}
              size="sm"
              leftIcon={<Truck className="h-4 w-4" />}
              onClick={() => handleStatusChange('in_progress')}
              disabled={isLoading || incident.status === 'resolved'}
              isLoading={isLoading && newStatus === 'in_progress'}
              fullWidth
            >
              Respond
            </Button>
            <Button
              variant={newStatus === 'resolved' ? 'success' : 'outline'}
              size="sm"
              leftIcon={<CheckCircle className="h-4 w-4" />}
              onClick={() => handleStatusChange('resolved')}
              disabled={isLoading}
              isLoading={isLoading && newStatus === 'resolved'}
              fullWidth
            >
              Resolve
            </Button>
            <Button
              variant={newStatus === 'false_alarm' ? 'outline' : 'ghost'}
              size="sm"
              leftIcon={<AlertTriangle className="h-4 w-4" />}
              onClick={() => handleStatusChange('false_alarm')}
              disabled={isLoading}
              isLoading={isLoading && newStatus === 'false_alarm'}
              fullWidth
            >
              False Alarm
            </Button>
          </div>
        </div>
      </Card>
      
      {/* Resources Card */}
      <Card title="Deployed Resources">
        <div className="space-y-4">
          {incident.resources?.deployed && incident.resources.deployed.length > 0 ? (
            <ul className="space-y-2">
              {incident.resources.deployed.map(resource => (
                <li key={resource.id} className="flex items-center justify-between p-2 bg-neutral-50 rounded-md">
                  <div className="flex items-center">
                    <span className="bg-secondary-100 text-secondary-800 p-1 rounded">
                      {resource.type === 'vehicle' && <Car className="h-4 w-4" />}
                      {resource.type === 'personnel' && <User className="h-4 w-4" />}
                      {resource.type === 'medical' && <AlertCircle className="h-4 w-4" />}
                    </span>
                    <div className="ml-2">
                      <p className="text-sm font-medium">{resource.name}</p>
                      <p className="text-xs text-neutral-500">Qty: {resource.quantity}</p>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-warning-100 text-warning-800">
                    {resource.status.replace('_', ' ')}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-neutral-500 text-center py-2">No resources deployed yet</p>
          )}
          
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              // In a real app, this would open a resource deployment dialog
              if (onResourceDeploy) {
                onResourceDeploy([]);
              }
            }}
            fullWidth
          >
            Deploy Resources
          </Button>
        </div>
      </Card>
      
      {/* Conditions & Notes Card */}
      <Card title="Conditions & Notes">
        <div className="space-y-4">
          {/* Conditions */}
          {incident.weatherConditions && (
            <div className="p-3 bg-neutral-50 rounded-md">
              <h4 className="text-sm font-medium mb-2 flex items-center">
                {getConditionIcon()}
                <span className="ml-1">Current Conditions</span>
              </h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {incident.weatherConditions.rainfall !== undefined && (
                  <div>
                    <span className="text-neutral-500">Rainfall:</span>{' '}
                    <span className="font-medium">{incident.weatherConditions.rainfall} mm</span>
                  </div>
                )}
                {incident.weatherConditions.temperature !== undefined && (
                  <div>
                    <span className="text-neutral-500">Temp:</span>{' '}
                    <span className="font-medium">{incident.weatherConditions.temperature}°C</span>
                  </div>
                )}
                {incident.weatherConditions.windSpeed !== undefined && (
                  <div>
                    <span className="text-neutral-500">Wind:</span>{' '}
                    <span className="font-medium">{incident.weatherConditions.windSpeed} km/h</span>
                  </div>
                )}
                {incident.weatherConditions.visibility && (
                  <div>
                    <span className="text-neutral-500">Visibility:</span>{' '}
                    <span className="font-medium capitalize">{incident.weatherConditions.visibility}</span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Notes */}
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center">
              <MessageSquare className="h-4 w-4 mr-1" />
              Notes
            </h4>
            
            <div className="space-y-2 max-h-36 overflow-y-auto mb-3">
              {incident.notes && incident.notes.length > 0 ? (
                incident.notes.map(note => (
                  <div key={note.id} className="p-2 bg-neutral-50 rounded-md text-sm">
                    <p>{note.text}</p>
                    <div className="mt-1 flex justify-between text-xs text-neutral-500">
                      <span>{note.createdBy.substring(0, 8)}</span>
                      <span>{new Date(note.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-neutral-500 text-center py-2">No notes yet</p>
              )}
            </div>
            
            <div className="flex space-x-2">
              <input
                type="text"
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Add a note..."
                className="flex-1 px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              />
              <Button
                variant="primary"
                size="sm"
                onClick={handleAddNote}
                disabled={!note.trim() || isLoading}
                isLoading={isLoading}
              >
                Add
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default IncidentResponse;