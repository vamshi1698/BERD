import React, { useState } from 'react';
import { CheckCircle, XCircle, Flag, AlertTriangle, MessageSquare, User } from 'lucide-react';
import { Incident } from '../../types/incident';
import Card from '../common/Card';
import Button from '../common/Button';

interface IncidentModerationProps {
  incident: Incident;
  onApprove?: (id: string) => void;
  onDeny?: (id: string, reason: string) => void;
  onFlag?: (id: string, reason: string) => void;
}

const IncidentModeration: React.FC<IncidentModerationProps> = ({
  incident,
  onApprove,
  onDeny,
  onFlag,
}) => {
  const[isLoading, setIsLoading] = useState(false);
  const[actionType, setActionType] = useState<'approve' | 'deny' | 'flag' | null>(null);
  const[reason, setReason] = useState('');
  const[showReasonInput, setShowReasonInput] = useState(false);

  const handleAction = async (action: 'approve' | 'deny' | 'flag') => {
    if((action === 'deny' || action === 'flag') && !showReasonInput) {
      setActionType(action);
      setShowReasonInput(true);
      return;
    }
    if((action === 'deny' || action === 'flag') && !reason.trim()) {
      return;
    }
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (action === 'approve' && onApprove) {
      onApprove(incident.id);
    } else if (action === 'deny' && onDeny) {
      onDeny(incident.id, reason);
    } else if (action === 'flag' && onFlag) {
      onFlag(incident.id, reason);
    }
    setIsLoading(false);
    setShowReasonInput(false);
    setReason('');
    setActionType(null);
  };

  const cancelAction = () => {
    setShowReasonInput(false);
    setReason('');
    setActionType(null);
  };

  const getActionTitle = () => {
    if (actionType === 'deny') {
      return 'Deny Incident Report';
    } else if (actionType === 'flag') {
      return 'Flag Incident Report';
    }
    return '';
  };

  const getReportedByText = () => {
    if(incident.reportedBy.startsWith('civilian')) {
      return 'Civilian User';
    } else if (incident.reportedBy.startsWith('authority')) {
      return 'Authority User';
    } else {
      return 'Anonymous';
    }
  };

  return (
    <Card title="Incident Moderation">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-medium text-neutral-700">
              Reported by: <span className="text-neutral-600">{getReportedByText()}</span>
        </p>
            <p className="text-sm text-neutral-500">
              Incident ID: {incident.id}
           </p>
          </div>
          {incident.verifiedBy ? (
            <div className="flex items-center text-success-600 bg-success-50 px-2 py-1 rounded">
              <CheckCircle className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">Already Verified</span>
            </div>
          ) : (
            <div className="flex items-center text-warning-600 bg-warning-50 px-2 py-1 rounded">
              <AlertTriangle className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">Needs Verification</span>
            </div>
          )}
        </div>
        {incident.images && incident.images.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Evidence</h4>
          <div className="flex space-x-2 overflow-x-auto">
              {incident.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Incident ${incident.id} image ${index + 1}`}
                  className="h-20 w-32 object-cover rounded border border-neutral-200"
                />
              ))}
        </div>
          </div>
        )}
        <div className="p-3 bg-neutral-50 rounded-md">
          <h4 className="text-sm font-medium mb-2 flex items-center">
            <User className="h-4 w-4 mr-1" />
            Reporter Credibility
          </h4>
       <div className="flex justify-between items-center">
           <div className="w-full bg-neutral-200 rounded-full h-2">
              <div
                className="bg-success-500 h-2 rounded-full"
                style={{ width: '85%' }}
              ></div>
            </div>
            <span className="ml-2 text-sm font-medium text-success-600">85%</span>
          </div>
        <p className="mt-1 text-xs text-neutral-600">
          Based on 5 previous reports (4 confirmed, 1 unverified)
          </p>
        </div>
        {showReasonInput ? (
          <div className="space-y-3">
            <h4 className="font-medium">{getActionTitle()}</h4>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason..."
              className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              rows={3}
            />
            <div className="flex space-x-2">
              <Button
                variant={actionType === 'deny' ? 'danger' : 'warning'}
                onClick={() => handleAction(actionType as 'deny' | 'flag')}
                disabled={!reason.trim() || isLoading}
                isLoading={isLoading}
                size="sm"
              >
                {actionType === 'deny' ? 'Deny' : 'Flag'}
              </Button>
              <Button
                variant="outline"
                onClick={cancelAction}
                disabled={isLoading}
                size="sm"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex space-x-2">
            <Button
              variant="success"
              leftIcon={<CheckCircle className="h-4 w-4" />}
              onClick={() => handleAction('approve')}
              disabled={isLoading || !!incident.verifiedBy}
              isLoading={isLoading && actionType === 'approve'}
          >
            Approve
          </Button>
          <Button
              variant="danger"
              leftIcon={<XCircle className="h-4 w-4" />}
              onClick={() => handleAction('deny')}
              disabled={isLoading || !!incident.verifiedBy}
              isLoading={isLoading && actionType === 'deny'}
            >
              Deny
          </Button>
          <Button
              variant="warning"
              leftIcon={<Flag className="h-4 w-4" />}
              onClick={() => handleAction('flag')}
              disabled={isLoading}
              isLoading={isLoading && actionType === 'flag'}
            >
              Flag
            </Button>
          </div>
        )}
        <div>
          <h4 className="text-sm font-medium mb-2 flex items-center">
            <MessageSquare className="h-4 w-4 mr-1" />
            Moderation Notes
          </h4>
          <div className="p-3 bg-neutral-50 rounded-md text-sm text-neutral-500">
          <p>No moderation notes yet.</p>
        </div>
        </div>
    </div>
  </Card>
  );
};

export default IncidentModeration;