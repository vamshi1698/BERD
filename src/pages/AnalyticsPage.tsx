import { useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts'
import { Download, Filter, RefreshCcw } from 'lucide-react'

const daysOfMonth = Array.from({ length: 30 }, (_, i) => i + 1)

const mockIncidentData30d = daysOfMonth.map(day => ({
  name: `Day ${day}`,
  incidents: Math.floor(Math.random() * 15) + 3,
  resolved: Math.floor(Math.random() * 12) + 2,
}))

const mockResponseTimes30d = daysOfMonth.map(day => ({
  name: `Day ${day}`,
  time: Math.floor(Math.random() * 20) + 10,
}))

const mockIncidentData = [
  { name: 'Mon', incidents: 4, resolved: 3 },
  { name: 'Tue', incidents: 6, resolved: 5 },
  { name: 'Wed', incidents: 8, resolved: 6 },
  { name: 'Thu', incidents: 10, resolved: 7 },
  { name: 'Fri', incidents: 12, resolved: 10 },
  { name: 'Sat', incidents: 8, resolved: 7 },
  { name: 'Sun', incidents: 6, resolved: 5 },
]

const mockResponseTimes = [
  { name: '00:00', time: 15 },
  { name: '04:00', time: 12 },
  { name: '08:00', time: 25 },
  { name: '12:00', time: 30 },
  { name: '16:00', time: 22 },
  { name: '20:00', time: 18 },
]

interface MetricCard {
  title: string
  value: string
  change: string
  trend: 'up' | 'down'
}

const metrics: MetricCard[] = [
  { title: 'Total Incidents', value: '54', change: '+12.5%', trend: 'up' },
  { title: 'Avg Response Time', value: '18.5m', change: '-5.2%', trend: 'down' },
  { title: 'Active Alerts', value: '8', change: '+33.3%', trend: 'up' },
  { title: 'System Health', value: '98.2%', change: '+0.5%', trend: 'up' },
]

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('7d')

  function toCSV(data: any[], columns: string[]) {
    const header = columns.join(',')
    const rows = data.map(row => columns.map(col => JSON.stringify(row[col] ?? '')).join(','))
    return [header, ...rows].join('\r\n')
  }

  const incidentData = timeRange === '30d' ? mockIncidentData30d : mockIncidentData
  const responseTimes = timeRange === '30d' ? mockResponseTimes30d : mockResponseTimes

  function handleExport() {
    let csv = 'Incident Overview\n'
    csv += toCSV(incidentData, ['name', 'incidents', 'resolved'])
    csv += '\n\nResponse Times\n'
    csv += toCSV(responseTimes, ['name', 'time'])

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'analytics.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="h-[calc(100vh-4rem)] overflow-auto bg-gray-50 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">System Analytics</h2>
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={e => setTimeRange(e.target.value)}
            className="border border-gray-200 rounded-md px-3 py-1.5"
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <button className="p-2 text-gray-500 hover:text-gray-600">
            <RefreshCcw className="h-5 w-5" />
          </button>
          <button
            onClick={handleExport}
            className="flex items-center px-4 py-2 bg-[#9EC6F3] text-white rounded-md hover:bg-[#8BB5E2]"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {metrics.map(metric => (
          <div key={metric.title} className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">{metric.title}</h3>
            <div className="mt-2 flex items-baseline">
              <p className="text-3xl font-semibold text-gray-900">{metric.value}</p>
              <p className={`ml-2 text-sm ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {metric.change}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Incident Overview</h3>
            <button className="p-1 text-gray-500 hover:text-gray-600">
              <Filter className="h-4 w-4" />
            </button>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={incidentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="incidents" fill="#9FB3DF" name="Total Incidents" />
                <Bar dataKey="resolved" fill="#9EC6F3" name="Resolved" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Response Times</h3>
            <button className="p-1 text-gray-500 hover:text-gray-600">
              <Filter className="h-4 w-4" />
            </button>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={responseTimes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="time"
                  stroke="#9EC6F3"
                  name="Avg Response Time (min)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
