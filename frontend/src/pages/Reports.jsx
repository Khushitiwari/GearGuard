import { useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, Users, Wrench, TrendingUp, PieChart, Activity } from 'lucide-react'
import { mockRequests, mockTeams, mockEquipment, getTeamById, getEquipmentById } from '../data/mockData'
import { useTheme } from '../contexts/ThemeContext'
import {
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts'

const Reports = () => {
  const { isDark } = useTheme()
  
  // Calculate requests per team
  const requestsPerTeam = mockTeams.map((team) => {
    const teamRequests = mockRequests.filter((req) => req.team === team.id)
    return {
      name: team.teamName,
      count: teamRequests.length,
      teamId: team.id,
    }
  })

  // Calculate requests per equipment category
  const categoryCounts = {}
  mockRequests.forEach((req) => {
    const equipment = getEquipmentById(req.equipment)
    if (equipment) {
      const category = equipment.category
      categoryCounts[category] = (categoryCounts[category] || 0) + 1
    }
  })

  const requestsPerCategory = Object.entries(categoryCounts).map(([category, count]) => ({
    name: category,
    count,
  }))

  // Requests by Status
  const statusCounts = {}
  mockRequests.forEach((req) => {
    statusCounts[req.status] = (statusCounts[req.status] || 0) + 1
  })
  const requestsByStatus = Object.entries(statusCounts).map(([status, count]) => ({
    name: status,
    value: count,
  }))

  // Requests by Priority
  const priorityCounts = {}
  mockRequests.forEach((req) => {
    priorityCounts[req.priority] = (priorityCounts[req.priority] || 0) + 1
  })
  const requestsByPriority = Object.entries(priorityCounts).map(([priority, count]) => ({
    name: priority,
    value: count,
  }))

  // Requests by Type (Corrective vs Preventive)
  const typeCounts = {}
  mockRequests.forEach((req) => {
    typeCounts[req.type] = (typeCounts[req.type] || 0) + 1
  })
  const requestsByType = Object.entries(typeCounts).map(([type, count]) => ({
    name: type,
    value: count,
  }))

  // Time-based trends (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    return date
  })

  const requestsByDate = last7Days.map((date) => {
    const dateStr = date.toISOString().split('T')[0]
    const count = mockRequests.filter((req) => {
      const reqDate = new Date(req.createdAt).toISOString().split('T')[0]
      return reqDate === dateStr
    }).length
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      requests: count,
    }
  })

  // Color palettes - adjust for dark mode
  const textColor = isDark ? '#d1d5db' : '#6b7280'
  const gridColor = isDark ? '#374151' : '#e5e7eb'
  const tooltipBg = isDark ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)'
  const tooltipBorder = isDark ? '#4b5563' : '#e5e7eb'
  
  const COLORS = {
    primary: ['#0ea5e9', '#0284c7', '#0369a1', '#075985'],
    status: {
      New: '#3b82f6',
      'In Progress': '#eab308',
      Repaired: '#22c55e',
      Scraped: '#6b7280',
    },
    priority: {
      Low: '#3b82f6',
      Medium: '#eab308',
      High: '#ef4444',
    },
    type: {
      Corrective: '#f97316',
      Preventive: '#a855f7',
    },
  }

  const getStatusColor = (status) => COLORS.status[status] || '#6b7280'
  const getPriorityColor = (priority) => COLORS.priority[priority] || '#6b7280'
  const getTypeColor = (type) => COLORS.type[type] || '#6b7280'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Reports & Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400">Comprehensive insights for maintenance requests</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <SummaryCard
          title="Total Requests"
          value={mockRequests.length}
          icon={BarChart3}
          color="blue"
        />
        <SummaryCard
          title="Active Teams"
          value={requestsPerTeam.filter((t) => t.count > 0).length}
          icon={Users}
          color="green"
        />
        <SummaryCard
          title="Equipment Categories"
          value={requestsPerCategory.length}
          icon={Wrench}
          color="purple"
        />
        <SummaryCard
          title="In Progress"
          value={statusCounts['In Progress'] || 0}
          icon={Activity}
          color="yellow"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Requests per Team - Bar Chart */}
        <ChartCard
          title="Requests per Team"
          icon={Users}
          description="Distribution of requests across teams"
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={requestsPerTeam}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis
                dataKey="name"
                tick={{ fill: textColor, fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis tick={{ fill: textColor, fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: tooltipBg,
                  border: `1px solid ${tooltipBorder}`,
                  borderRadius: '8px',
                  color: isDark ? '#f3f4f6' : '#111827',
                }}
              />
              <Bar dataKey="count" fill="#0ea5e9" radius={[8, 8, 0, 0]}>
                {requestsPerTeam.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS.primary[index % COLORS.primary.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Requests per Team - Pie Chart */}
        <ChartCard
          title="Team Distribution"
          icon={PieChart}
          description="Percentage breakdown by team"
        >
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={requestsPerTeam}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
              >
                {requestsPerTeam.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS.primary[index % COLORS.primary.length]} />
                ))}
              </Pie>
              <Tooltip />
            </RechartsPieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Requests per Category - Bar Chart */}
        <ChartCard
          title="Requests per Equipment Category"
          icon={Wrench}
          description="Distribution by equipment category"
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={requestsPerCategory.sort((a, b) => b.count - a.count)}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="name" tick={{ fill: textColor, fontSize: 12 }} />
              <YAxis tick={{ fill: textColor, fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: tooltipBg,
                  border: `1px solid ${tooltipBorder}`,
                  borderRadius: '8px',
                  color: isDark ? '#f3f4f6' : '#111827',
                }}
              />
              <Bar dataKey="count" fill="#a855f7" radius={[8, 8, 0, 0]}>
                {requestsPerCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={['#a855f7', '#9333ea', '#7e22ce'][index % 3]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Requests per Category - Pie Chart */}
        <ChartCard
          title="Category Distribution"
          icon={PieChart}
          description="Percentage breakdown by category"
        >
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={requestsPerCategory}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
              >
                {requestsPerCategory.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={['#a855f7', '#9333ea', '#7e22ce', '#6b21a8'][index % 4]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </RechartsPieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Requests by Status - Pie Chart */}
        <ChartCard
          title="Requests by Status"
          icon={Activity}
          description="Current status distribution"
        >
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={requestsByStatus}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {requestsByStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getStatusColor(entry.name)} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </RechartsPieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Requests by Priority - Pie Chart */}
        <ChartCard
          title="Requests by Priority"
          icon={TrendingUp}
          description="Priority level distribution"
        >
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={requestsByPriority}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {requestsByPriority.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getPriorityColor(entry.name)} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </RechartsPieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Requests by Type - Pie Chart */}
        <ChartCard
          title="Corrective vs Preventive"
          icon={PieChart}
          description="Maintenance type breakdown"
        >
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={requestsByType}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {requestsByType.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getTypeColor(entry.name)} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </RechartsPieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Time-based Trends - Line Chart */}
        <ChartCard
          title="Request Trends (Last 7 Days)"
          icon={TrendingUp}
          description="Daily request creation trend"
        >
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={requestsByDate}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="date" tick={{ fill: textColor, fontSize: 12 }} />
              <YAxis tick={{ fill: textColor, fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: tooltipBg,
                  border: `1px solid ${tooltipBorder}`,
                  borderRadius: '8px',
                  color: isDark ? '#f3f4f6' : '#111827',
                }}
              />
              <Line
                type="monotone"
                dataKey="requests"
                stroke="#0ea5e9"
                strokeWidth={3}
                dot={{ fill: '#0ea5e9', r: 5 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  )
}

const SummaryCard = ({ title, value, icon: Icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    green: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
    yellow: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">{value}</p>
      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{title}</p>
    </motion.div>
  )
}

const ChartCard = ({ title, icon: Icon, description, children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
          <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
        </div>
      </div>
      <div className="mt-4">{children}</div>
    </motion.div>
  )
}

export default Reports
