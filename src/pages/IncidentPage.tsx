import { useState } from 'react';
import { Check, X, AlertTriangle, Filter, Search } from 'lucide-react';
interface Report {
  id: string;
  title: string;
  description: string;
  location: string;
  timestamp: string;
  status: 'pending' | 'approved' | 'rejected';
  severity: 'low' | 'medium' | 'high';
  source: 'citizen' | 'sensor' | 'agency';
  images?: string[];
}

const mockReports: Report[] = [
  {
    id: '1',
    title: 'Flooding on Main Street',
    description: 'Water level rising rapidly near the intersection',
    location: 'Main St & 5th Ave',
    timestamp: '2024-03-21T10:30:00Z',
    status: 'pending',
    severity: 'high',
    source: 'citizen',
    images: ['https://images.pexels.com/photos/1446076/pexels-photo-1446076.jpeg']
  },
  {
    id: '2',
    title: 'Power Lines Down',
    description: 'Multiple power lines down due to strong winds',
    location: 'Oak Road',
    timestamp: '2024-03-21T10:15:00Z',
    status: 'pending',
    severity: 'high',
    source: 'agency'
  },
  {
    id: '3',
    title: 'Traffic Signal Malfunction',
    description: 'Traffic lights not working at intersection',
    location: 'Broadway & 3rd',
    timestamp: '2024-03-21T09:45:00Z',
    status: 'pending',
    severity: 'medium',
    source: 'sensor'
  }
];

export default function ReportModeration() {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [reports, setReports] = useState<Report[]>(mockReports);

  // Filtered reports based on search and filter
  const filteredReports = reports.filter(
    (report) =>
      (filter === 'all' || report.status === filter) &&
      (
        report.title.toLowerCase().includes(search.toLowerCase()) ||
        report.description.toLowerCase().includes(search.toLowerCase()) ||
        report.location.toLowerCase().includes(search.toLowerCase())
      )
  );

  // Action handlers
  const handleApprove = () => {
    if (!selectedReport) return;
    setReports((prev) =>
      prev.map((r) =>
        r.id === selectedReport.id ? { ...r, status: 'approved' } : r
      )
    );
    setSelectedReport((prev) =>
      prev ? { ...prev, status: 'approved' } : prev
    );
  };

  const handleReject = () => {
    if (!selectedReport) return;
    setReports((prev) =>
      prev.map((r) =>
        r.id === selectedReport.id ? { ...r, status: 'rejected' } : r
      )
    );
    setSelectedReport((prev) =>
      prev ? { ...prev, status: 'rejected' } : prev
    );
  };

  const handleEscalate = () => {
    if (!selectedReport) return;
    alert('Escalate action triggered for: ' + selectedReport.title);
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex bg-gray-50">
      <div className="w-1/2 border-r border-gray-200 bg-white overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Incident Reports</h2>
            <div className="flex space-x-2">
              <button className="p-2 hover:bg-gray-100 rounded-md">
                <Filter className="h-5 w-5 text-gray-500" />
              </button>
              <select 
                className="border border-gray-200 rounded-md px-3 py-1"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Reports</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search reports..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Reports List */}
        <div className="flex-1 overflow-auto">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
                selectedReport?.id === report.id ? 'bg-gray-50' : ''
              }`}
              onClick={() => setSelectedReport(report)}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium">{report.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{report.location}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  report.severity === 'high' ? 'bg-red-100 text-red-800' :
                  report.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {report.severity}
                </span>
              </div>
              <div className="flex items-center mt-2 text-sm text-gray-500">
                <span className="capitalize">{report.source}</span>
                <span className="mx-2">•</span>
                <span>{new Date(report.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Report Details */}
      {selectedReport ? (
        <div className="w-1/2 bg-white p-6 overflow-auto">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold">{selectedReport.title}</h2>
              <p className="text-gray-500">{selectedReport.location}</p>
            </div>
            <div className="flex space-x-2">
              <button
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center"
                onClick={handleApprove}
                disabled={selectedReport.status === 'approved'}
              >
                <Check className="h-4 w-4 mr-2" />
                Approve
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center"
                onClick={handleReject}
                disabled={selectedReport.status === 'rejected'}
              >
                <X className="h-4 w-4 mr-2" />
                Reject
              </button>
              <button
                className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 flex items-center"
                onClick={handleEscalate}
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Escalate
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {selectedReport.images && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Attached Images</h3>
                <div className="grid grid-cols-2 gap-4">
                  {selectedReport.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Report image ${index + 1}`}
                      className="rounded-lg w-full h-48 object-cover"
                    />
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
              <p className="text-gray-600">{selectedReport.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Source</h3>
                <p className="text-gray-600 capitalize">{selectedReport.source}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Reported At</h3>
                <p className="text-gray-600">
                  {new Date(selectedReport.timestamp).toLocaleString()}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Actions Log</h3>
              <div className="space-y-2">
                <div className="text-sm text-gray-600">
                  <span className="text-gray-500">System</span> • Automated severity assessment: {selectedReport.severity}
                </div>
                <div className="text-sm text-gray-600">
                  <span className="text-gray-500">AI</span> • No duplicate reports found
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-1/2 flex items-center justify-center text-gray-500">
          Select a report to view details
        </div>
      )}
    </div>
  );
}
