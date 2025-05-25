import { useState } from 'react';
import {  Calendar, Search, Filter, History } from 'lucide-react';
import { format } from 'date-fns';
import { MapContainer, TileLayer, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface Alert {
  id: string;
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  area: {
    lat: number;
    lng: number;
    radius: number; // in meters
  };
  channels: string[];
  scheduledFor: string;
  status: 'draft' | 'scheduled' | 'sent' | 'cancelled';
}

const mockAlerts: Alert[] = [
  {
    id: '1',
    title: 'Flash Flood Warning',
    message: 'Immediate evacuation required in downtown area due to rising water levels.',
    severity: 'high',
    area: {
      lat: 34.0522,
      lng: -118.2437,
      radius: 5000
    },
    channels: ['sms', 'email', 'push'],
    scheduledFor: '2024-03-22T15:00:00Z',
    status: 'scheduled'
  },
  {
    id: '2',
    title: 'Severe Weather Alert',
    message: 'Strong thunderstorms expected in the next 6 hours.',
    severity: 'medium',
    area: {
      lat: 34.0522,
      lng: -118.2437,
      radius: 10000
    },
    channels: ['sms', 'push'],
    scheduledFor: '2024-03-22T18:00:00Z',
    status: 'draft'
  }
];

export default function AlertControl() {
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [view, setView] = useState<'list' | 'create'>('list');

  return (
    <div className="h-[calc(100vh-4rem)] flex bg-gray-50">
      {/* Alert List */}
      <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Alerts</h2>
            <button
              onClick={() => setView('create')}
              className="px-4 py-2 bg-[#9EC6F3] text-white rounded-md hover:bg-[#8BB5E2]"
            >
              New Alert
            </button>
          </div>
          
          <div className="flex space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search alerts..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md"
              />
            </div>
            <button className="p-2 border border-gray-200 rounded-md">
              <Filter className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          {mockAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
                selectedAlert?.id === alert.id ? 'bg-gray-50' : ''
              }`}
              onClick={() => setSelectedAlert(alert)}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium">{alert.title}</h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {alert.message}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  alert.severity === 'high' ? 'bg-red-100 text-red-800' :
                  alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {alert.severity}
                </span>
              </div>
              <div className="flex items-center mt-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{format(new Date(alert.scheduledFor), 'MMM d, HH:mm')}</span>
                <span className="mx-2">•</span>
                <span className="capitalize">{alert.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alert Details/Create */}
      <div className="flex-1 p-6">
        {view === 'create' ? (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">Create New Alert</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-200 rounded-md px-3 py-2"
                  placeholder="Alert title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  className="w-full border border-gray-200 rounded-md px-3 py-2 h-32"
                  placeholder="Alert message"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Severity
                  </label>
                  <select className="w-full border border-gray-200 rounded-md px-3 py-2">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Schedule
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full border border-gray-200 rounded-md px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Channels
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" /> SMS
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" /> Email
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" /> Push Notification
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Area
                </label>
                <div className="h-64 bg-gray-100 rounded-lg">
                  <MapContainer
                    center={[34.0522, -118.2437]}
                    zoom={12}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Circle
                      center={[34.0522, -118.2437]}
                      radius={5000}
                      pathOptions={{ color: '#9EC6F3' }}
                    />
                  </MapContainer>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setView('list')}
                  className="px-4 py-2 border border-gray-200 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-[#9EC6F3] text-white rounded-md hover:bg-[#8BB5E2]">
                  Create Alert
                </button>
              </div>
            </div>
          </div>
        ) : selectedAlert ? (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">{selectedAlert.title}</h2>
              <div className="flex space-x-4">
                <button className="px-4 py-2 border border-gray-200 rounded-md hover:bg-gray-50">
                  Edit
                </button>
                <button className="px-4 py-2 bg-[#9EC6F3] text-white rounded-md hover:bg-[#8BB5E2]">
                  Send Now
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">Message</h3>
                <p className="text-gray-600">{selectedAlert.message}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Severity</h3>
                  <span className={`px-2 py-1 text-sm rounded-full ${
                    selectedAlert.severity === 'high' ? 'bg-red-100 text-red-800' :
                    selectedAlert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {selectedAlert.severity}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Schedule</h3>
                  <p className="text-gray-600">
                    {format(new Date(selectedAlert.scheduledFor), 'PPP p')}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">Channels</h3>
                <div className="flex space-x-2">
                  {selectedAlert.channels.map((channel) => (
                    <span
                      key={channel}
                      className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-sm"
                    >
                      {channel}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">Target Area</h3>
                <div className="h-64 bg-gray-100 rounded-lg">
                  <MapContainer
                    center={[selectedAlert.area.lat, selectedAlert.area.lng]}
                    zoom={12}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Circle
                      center={[selectedAlert.area.lat, selectedAlert.area.lng]}
                      radius={selectedAlert.area.radius}
                      pathOptions={{ color: '#9EC6F3' }}
                    />
                  </MapContainer>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">History</h3>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <History className="h-4 w-4 mr-2" />
                    Created by John Doe on {format(new Date(), 'PPP p')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select an alert to view details
          </div>
        )}
      </div>
    </div>
  );
}
