// src/pages/IncidentDetailPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Incident } from '../types/incident';
import IncidentCard from '../components/common/IncidentCard';
import { mockIncidents } from '../data/mockData';

const IncidentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [incident, setIncident] = useState<Incident | null>(null);

  useEffect(() => {
    if (id) {
      const foundIncident = mockIncidents.find(i => i.id === id) || null;

      // Optional: simulate network delay
      setTimeout(() => {
        setIncident(foundIncident);
      }, 200); 
    }
  }, [id]);

  if (!incident) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4">
      <IncidentCard incident={incident} />
    </div>
  );
};

export default IncidentDetailPage;
