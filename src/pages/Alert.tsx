import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import type { IncidentType } from '../types/incident';
import { mockIncidents } from '../data/mockData';

type IncidentFormData = {
  title: string;
  description: string;
  type: IncidentType;
  severity: string;
  status: string;
  location: {
    latitude: string;
    longitude: string;
    address: string;
    landmark: string;
  };
  reportedBy: string;
  verifiedBy: string;
  images: string[];
  affectedArea: string;
  assignedTo: string[];
  casualties: {
    confirmed: string;
    estimated: string;
  };
  resources: {
    requested: string[];
    deployed: string[];
  };
  weatherConditions: {
    rainfall: string;
    visibility: string;
  };
  notes: string[];
};

const initialFormData: IncidentFormData = {
  title: '',
  description: '',
  type: '' as IncidentType,
  severity: '',
  status: 'reported',
  location: {
    latitude: '',
    longitude: '',
    address: '',
    landmark: ''
  },
  reportedBy: '',
  verifiedBy: '',
  images: [''],
  affectedArea: '',
  assignedTo: [''],
  casualties: {
    confirmed: '',
    estimated: ''
  },
  resources: {
    requested: [],
    deployed: []
  },
  weatherConditions: {
    rainfall: '',
    visibility: ''
  },
  notes: []
};

const CivilianIncidentForm: React.FC = () => {
  const [formData, setFormData] = useState<IncidentFormData>(initialFormData);
  const [geoLoading, setGeoLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({
          ...prev,
          location: {
            ...prev.location,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString()
          }
        }));
        setGeoLoading(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        setGeoLoading(false);
      }
    );
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    path: string[] | null = null
  ) => {
    const { name, value } = e.target;

    if (path) {
      setFormData(prev => {
        const updated = { ...prev };
        let ref: any = updated;
        for (let i = 0; i < path.length - 1; i++) {
          ref = ref[path[i]];
        }
        ref[path[path.length - 1]] = value;
        return updated;
      });
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newIncident = {
      id: uuidv4(),
      ...formData,
      reportedAt: new Date(),
      updatedAt: new Date(),
      location: {
        ...formData.location,
        latitude: parseFloat(formData.location.latitude).toString(),
        longitude: parseFloat(formData.location.longitude).toString()
      },
      affectedArea: parseFloat(formData.affectedArea).toString(),
      casualties: {
        confirmed: parseInt(formData.casualties.confirmed).toString(),
        estimated: parseInt(formData.casualties.estimated).toString()
      }
    };

    mockIncidents.push(newIncident);
    navigate('/dashboard');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded-lg mt-6">
      <h2 className="text-2xl font-semibold mb-4">Report an Incident</h2>
      {geoLoading ? (
        <p className="text-gray-600">Getting your location...</p>
      ) : (
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <input name="title" value={formData.title} onChange={handleChange} placeholder="Title" className="border p-2" required />
          <select name="type" value={formData.type} onChange={handleChange} className="border p-2" required>
            <option value="">Select Type</option>
            <option value="flood">Flood</option>
            <option value="fire">Fire</option>
            <option value="accident">Accident</option>
            <option value="riot">Riot</option>
            <option value="medical">Medical</option>
            <option value="infrastructure">Infrastructure</option>
            <option value="crime">Crime</option>
            <option value="other">Other</option>
          </select>

          <select name="severity" value={formData.severity} onChange={handleChange} className="border p-2" required>
            <option value="">Select Severity</option>
            <option value="low">Low</option>
            <option value="moderate">Moderate</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>

          <input name="reportedBy" value={formData.reportedBy} onChange={handleChange} placeholder="Reported By" className="border p-2" required />
          <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="border p-2 col-span-2" />

          <input value={formData.location.latitude} placeholder="Latitude" disabled className="border p-2 bg-gray-100 text-gray-500" />
          <input value={formData.location.longitude} placeholder="Longitude" disabled className="border p-2 bg-gray-100 text-gray-500" />
          <input name="address" value={formData.location.address} onChange={e => handleChange(e, ['location', 'address'])} placeholder="Address" className="border p-2" required />
          <input name="landmark" value={formData.location.landmark} onChange={e => handleChange(e, ['location', 'landmark'])} placeholder="Landmark" className="border p-2" />

          <input type="number" name="affectedArea" value={formData.affectedArea} onChange={handleChange} placeholder="Affected Area (sq.m)" className="border p-2" />
          <input type="number" name="confirmed" value={formData.casualties.confirmed} onChange={e => handleChange(e, ['casualties', 'confirmed'])} placeholder="Confirmed Casualties" className="border p-2" />
          <input type="number" name="estimated" value={formData.casualties.estimated} onChange={e => handleChange(e, ['casualties', 'estimated'])} placeholder="Estimated Casualties" className="border p-2" />

          <input name="rainfall" value={formData.weatherConditions.rainfall} onChange={e => handleChange(e, ['weatherConditions', 'rainfall'])} placeholder="Rainfall (mm)" className="border p-2" />
          <input name="visibility" value={formData.weatherConditions.visibility} onChange={e => handleChange(e, ['weatherConditions', 'visibility'])} placeholder="Visibility" className="border p-2" />

          <input
            name="images"
            value={formData.images.join(', ')}
            onChange={e => setFormData({ ...formData, images: e.target.value.split(',').map(s => s.trim()) })}
            placeholder="Image URLs (comma-separated)"
            className="border p-2 col-span-2"
          />

          <textarea
            name="notes"
            value={formData.notes.join('\n')}
            onChange={e => setFormData({ ...formData, notes: e.target.value.split('\n') })}
            placeholder="Notes (one per line)"
            className="border p-2 col-span-2"
          />

          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded col-span-2">
            Submit Incident
          </button>
        </form>
      )}
    </div>
  );
};

export default CivilianIncidentForm;
