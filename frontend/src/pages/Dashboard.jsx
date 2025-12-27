import { motion } from 'framer-motion'
import { TrendingUp, AlertCircle, CheckCircle2, Clock } from 'lucide-react'
import { mockRequests, mockEquipment } from '../data/mockData'
import { format } from 'date-fns'

const Dashboard = () => {
  // Calculate stats from mock data
  const stats = {
    totalRequests: mockRequests.length,
    inProgress: mockRequests.filter(r => r.status === 'In Progress').length,
    completed: mockRequests.filter(r => r.status === 'Repaired').length,
    overdue: mockRequests.filter(r => {
      const scheduled = new Date(r.scheduledAt)
      const now = new Date()
      return scheduled < now && r.status !== 'Repaired' && r.status !== 'Scraped'
    }).length,
  }

  const recentRequests = mockRequests.slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Hero Section with Spline placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-primary-500 to-primary-700 dark:from-primary-600 dark:to-primary-800 rounded-2xl p-8 text-white shadow-lg"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
            <p className="text-primary-100 text-lg">
              Track and manage your equipment maintenance efficiently
            </p>
          </div>
          {/* TODO: Add Spline 3D element here for visual enhancement */}
          <div className="hidden lg:block w-32 h-32 bg-white/10 rounded-full flex items-center justify-center">
            <TrendingUp className="w-16 h-16 text-white/80" />
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={AlertCircle}
          label="Total Requests"
          value={stats.totalRequests}
          color="blue"
          trend="+12%"
        />
        <StatCard
          icon={Clock}
          label="In Progress"
          value={stats.inProgress}
          color="yellow"
          trend="+5%"
        />
        <StatCard
          icon={CheckCircle2}
          label="Completed"
          value={stats.completed}
          color="green"
          trend="+8%"
        />
        <StatCard
          icon={AlertCircle}
          label="Overdue"
          value={stats.overdue}
          color="red"
          trend="-3%"
        />
      </div>

      {/* Recent Requests */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Recent Requests</h2>
        <div className="space-y-3">
          {recentRequests.map((request) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-gray-100">{request.subject}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {format(new Date(request.scheduledAt), 'MMM dd, yyyy • h:mm a')}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    request.priority === 'High'
                      ? 'bg-red-100 text-red-700'
                      : request.priority === 'Medium'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {request.priority}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    request.status === 'New'
                      ? 'bg-blue-100 text-blue-700'
                      : request.status === 'In Progress'
                      ? 'bg-yellow-100 text-yellow-700'
                      : request.status === 'Repaired'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {request.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

const StatCard = ({ icon: Icon, label, value, color, trend }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <span className="text-sm font-medium text-green-600">{trend}</span>
      </div>
      <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">{value}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
    </motion.div>
  )
}

export default Dashboard

