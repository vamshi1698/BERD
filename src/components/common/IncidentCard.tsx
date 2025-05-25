import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Flame, Droplets, Car, Users, Stethoscope, Building, Shield, AlertTriangle, Clock 
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Incident, IncidentType, IncidentSeverity } from '../../types/incident';
import Card from './Card';

interface IncidentCardProps {
  incident: Incident;
  compact?: boolean;
}

const IncidentCard: React.FC<IncidentCardProps> = ({ incident, compact = false }) => {
  const getIncidentIcon = (type: IncidentType) => {
    switch (type) {
      case 'fire': return <Flame className="h-5 w-5 text-error-500" />;
      case 'flood': return <Droplets className="h-5 w-5 text-secondary-500" />;
      case 'accident': return <Car className="h-5 w-5 text-warning-500" />;
      case 'riot': return <Users className="h-5 w-5 text-primary-500" />;
      case 'medical': return <Stethoscope className="h-5 w-5 text-success-500" />;
      case 'infrastructure': return <Building className="h-5 w-5 text-neutral-500" />;
      case 'crime': return <Shield className="h-5 w-5 text-secondary-700" />;
      default: return <AlertTriangle className="h-5 w-5 text-warning-500" />;
    }
  };

  const getSeverityBadge = (severity: IncidentSeverity) => {
    const baseClasses = 'px-2 py-1 text-xs font-medium rounded-full';
    switch (severity) {
      case 'low': return <span className={`${baseClasses} bg-success-100 text-success-800`}>Low</span>;
      case 'medium': return <span className={`${baseClasses} bg-warning-100 text-warning-800`}>Medium</span>;
      case 'high': return <span className={`${baseClasses} bg-error-100 text-error-800`}>High</span>;
      case 'critical': return <span className={`${baseClasses} bg-error-500 text-white animate-pulse`}>Critical</span>;
    }
  };

  if (compact) {
    return (
      <Link to={`/incidents/${incident.id}`} className="block">
        <Card hoverable compact className="mb-3">
          <div className="flex items-center">
            <div className="mr-3">{getIncidentIcon(incident.type)}</div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium truncate">{incident.title}</h4>
              <div className="text-xs text-neutral-500 flex items-center mt-1">
                <Clock className="h-3 w-3 mr-1" />
                {formatDistanceToNow(new Date(incident.reportedAt), { addSuffix: true })}
              </div>
            </div>
            <div className="ml-2">{getSeverityBadge(incident.severity)}</div>
          </div>
        </Card>
      </Link>
    );
  }

  // Full detail view:
  return (
    <Card className="mb-4 p-4">
      <div className="flex items-start space-x-4">
        <div className="mt-1">{getIncidentIcon(incident.type)}</div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-semibold mb-2">{incident.title}</h2>
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="text-sm text-neutral-600">
              <Clock className="inline h-4 w-4 mr-1" />
              {new Date(incident.reportedAt).toLocaleString()}
            </span>
            <span className="text-sm">{getSeverityBadge(incident.severity)}</span>
            <span className="text-sm text-neutral-600 capitalize">{incident.status.replace('_', ' ')}</span>
          </div>
          {incident.description && (
            <p className="text-sm whitespace-pre-wrap text-neutral-800">{incident.description}</p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default IncidentCard;
