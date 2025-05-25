import React, { useState } from 'react';
import { CheckCircle2, Circle, Info } from 'lucide-react';
import Card from '../common/Card';

interface EmergencyItem {
  id: string;
  name: string;
  description?: string;
  checked: boolean;
}

interface EmergencyKitCardProps {
  disasterType?: 'flood' | 'fire' | 'earthquake' | 'general';
}

const EmergencyKitCard: React.FC<EmergencyKitCardProps> = ({ 
  disasterType = 'general' 
}) => {
  // Base items for all emergency kits
  const baseItems: EmergencyItem[] = [
    { id: 'water', name: 'Water (1 gallon per person per day)', checked: false },
    { id: 'food', name: 'Non-perishable food', checked: false },
    { id: 'firstaid', name: 'First aid kit', checked: false },
    { id: 'medications', name: 'Medications', checked: false },
    { id: 'flashlight', name: 'Flashlight and batteries', checked: false },
    { id: 'phone', name: 'Mobile phone with charger', checked: false },
    { id: 'documents', name: 'Important documents', description: 'ID, insurance, bank details in waterproof container', checked: false },
    { id: 'cash', name: 'Cash and coins', checked: false },
    { id: 'whistle', name: 'Emergency whistle', checked: false },
  ];
  
  // Additional items based on disaster type
  const disasterSpecificItems: Record<string, EmergencyItem[]> = {
    flood: [
      { id: 'raincoat', name: 'Raincoat or poncho', checked: false },
      { id: 'boots', name: 'Waterproof boots', checked: false },
      { id: 'plastic', name: 'Plastic sheeting and duct tape', description: 'For creating barriers against water', checked: false },
    ],
    fire: [
      { id: 'mask', name: 'N95 masks', description: 'To filter smoke particles', checked: false },
      { id: 'fireproof', name: 'Fire-resistant blanket', checked: false },
      { id: 'gloves', name: 'Heat-resistant gloves', checked: false },
    ],
    earthquake: [
      { id: 'helmet', name: 'Hard hat or helmet', checked: false },
      { id: 'gloves', name: 'Work gloves', checked: false },
      { id: 'crowbar', name: 'Crowbar or other tools', description: 'For moving debris', checked: false },
    ],
    general: [
      { id: 'clothing', name: 'Change of clothes', checked: false },
      { id: 'blanket', name: 'Emergency blanket', checked: false },
      { id: 'radio', name: 'Battery-powered or hand-crank radio', checked: false },
    ],
  };
  
  // Combine base items with disaster-specific items
  const initialItems = [...baseItems, ...(disasterSpecificItems[disasterType] || [])];
  const [items, setItems] = useState<EmergencyItem[]>(initialItems);
  const [showInfo, setShowInfo] = useState<string | null>(null);
  
  const toggleItem = (id: string) => {
    setItems(
      items.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };
  
  const progress = Math.round(
    (items.filter(item => item.checked).length / items.length) * 100
  );
  
  return (
    <Card title="Emergency Kit Checklist">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium">
            {disasterType.charAt(0).toUpperCase() + disasterType.slice(1)} Preparation
          </h3>
          <span className="text-sm font-medium text-primary-600">{progress}% Complete</span>
        </div>
        <div className="w-full bg-neutral-200 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      
      <ul className="space-y-2">
        {items.map(item => (
          <li key={item.id} className="flex items-start">
            <button
              onClick={() => toggleItem(item.id)}
              className="flex-shrink-0 mt-0.5"
            >
              {item.checked ? (
                <CheckCircle2 className="h-5 w-5 text-success-500" />
              ) : (
                <Circle className="h-5 w-5 text-neutral-300" />
              )}
            </button>
            <div className="ml-3 flex-1">
              <div className="flex items-center">
                <span className={`${item.checked ? 'line-through text-neutral-500' : 'text-neutral-800'}`}>
                  {item.name}
                </span>
                {item.description && (
                  <button
                    onClick={() => setShowInfo(showInfo === item.id ? null : item.id)}
                    className="ml-1 text-neutral-400 hover:text-neutral-600"
                  >
                    <Info className="h-4 w-4" />
                  </button>
                )}
              </div>
              {showInfo === item.id && item.description && (
                <p className="text-sm text-neutral-600 mt-1">{item.description}</p>
              )}
            </div>
          </li>
        ))}
      </ul>
      
      {progress === 100 && (
        <div className="mt-4 p-3 bg-success-50 text-success-800 rounded-md border border-success-200">
          <p className="font-medium flex items-center">
            <CheckCircle2 className="h-5 w-5 mr-1" />
            Your emergency kit is complete!
          </p>
        </div>
      )}
    </Card>
  );
};

export default EmergencyKitCard;