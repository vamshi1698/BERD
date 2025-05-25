import React, { useState } from 'react';
import { CheckCircle, AlertCircle, HelpCircle, Clock } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import { useAuth } from '../../contexts/AuthContext';
type SafetyStatus = 'safe' | 'unsafe' | 'unknown';
// Type guard to check if user has emergencyContacts
function hasEmergencyContacts(user: any): user is { emergencyContacts: { phone: string }[] } {
  return user && Array.isArray(user.emergencyContacts);
}
 
interface WhatsAppButtonProps {
  phoneNumber: string; // e.g., '15551234567'
  fallbackMessage?: string;
}
interface SafetyStatusCardProps {
  currentStatus: SafetyStatus;
  lastUpdated?: Date;
  onStatusChange?: (status: SafetyStatus) => void;
}

  const handleClick = ({ phoneNumber, fallbackMessage }: WhatsAppButtonProps) => {
    console.log(phoneNumber, fallbackMessage);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          console.log('Latitude:', latitude, 'Longitude:', longitude);
          const locationUrl = `https://maps.google.com/?q=${latitude},${longitude}`;
          const message = `*This message is an auto generated emergency message* \n The person who sent you is in trouble  \n Here is the Location :${locationUrl}`;
          var url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
          url = url.split(" ").join("");
          console.log('WhatsApp URL:', url);
          window.location.href = url;
        },
        (error) => {
          console.error('Geolocation error:', error);
          const message = fallbackMessage || "Hi! I'm trying to share my location, but permission was denied.";
          const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
          window.location.href = url;
        }
      );
    } else {
      const message = fallbackMessage || "Hi! My device doesn't support location sharing.";
      const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
      window.location.href = url;
    }
  };
const SafetyStatusCard: React.FC<SafetyStatusCardProps> = ({
  currentStatus = 'unknown',
  lastUpdated,
  onStatusChange,
}) => {
  const [status, setStatus] = useState<SafetyStatus>(currentStatus);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const emergencyPhoneNumber = hasEmergencyContacts(user) && user.emergencyContacts[0]?.phone
  ? user.emergencyContacts[0].phone
  : '8431053364';

  const updateStatus = async (newStatus: SafetyStatus) => {
    setLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (newStatus === 'unsafe') {
    handleClick({ phoneNumber: emergencyPhoneNumber ,fallbackMessage:"automated"})
    }
    setStatus(newStatus);
    setLoading(false);
    
    if (onStatusChange) {
      onStatusChange(newStatus);
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'safe':
        return <CheckCircle className="h-8 w-8 text-success-500" />;
      case 'unsafe':
        return <AlertCircle className="h-8 w-8 text-error-500" />;
      case 'unknown':
      default:
        return <HelpCircle className="h-8 w-8 text-neutral-400" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'safe':
        return "I'm Safe";
      case 'unsafe':
        // Replace with actual phone number
        // Example usage: <WhatsAppButton phoneNumber="15551234567" />
        return "I Need Help";
      case 'unknown':
      default:
        return "Status Unknown";
    }
  };

  const getStatusDescription = () => {
    switch (status) {
      case 'safe':
        return "You've marked yourself as safe. Your contacts will be notified.";
      case 'unsafe':
        return "You've indicated you need help. Emergency services have been notified.";
      case 'unknown':
      default:
        return "Update your status to let your contacts know your situation.";
    }
  };

  return (
    <Card
      title="Safety Status"
      className={`
        ${status === 'safe' ? 'border-l-4 border-l-success-500' : ''}
        ${status === 'unsafe' ? 'border-l-4 border-l-error-500' : ''}
      `}
    >
      <div className="flex items-center mb-4">
        {getStatusIcon()}
        <div className="ml-3">
          <h3 className="font-medium text-lg">{getStatusText()}</h3>
          <p className="text-neutral-600 text-sm">{getStatusDescription()}</p>
        </div>
      </div>
      
      {lastUpdated && (
        <div className="flex items-center text-sm text-neutral-500 mb-4">
          <Clock className="h-4 w-4 mr-1" />
          Last updated: {lastUpdated.toLocaleString()}
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant={status === 'safe' ? 'success' : 'outline'}
          leftIcon={<CheckCircle className="h-4 w-4" />}
          isLoading={loading && status !== 'safe'}
          disabled={loading}
          onClick={() => updateStatus('safe')}
          fullWidth
        >
          I'm Safe
        </Button>
        <Button
          variant={status === 'unsafe' ? 'danger' : 'outline'}
          leftIcon={<AlertCircle className="h-4 w-4" />}
          isLoading={loading && status !== 'unsafe'}
          disabled={loading}
          onClick={() => updateStatus('unsafe')}
          fullWidth
        >
          Need Help
        </Button>
      </div>
    </Card>
  );
};

export default SafetyStatusCard;