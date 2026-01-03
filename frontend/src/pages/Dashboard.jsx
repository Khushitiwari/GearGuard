import { motion } from 'framer-motion'
import { TrendingUp, AlertCircle, CheckCircle2, Clock, Loader2 } from 'lucide-react'
import { useRequests } from '../hooks/useData'
import { format } from 'date-fns'

const Dashboard = () => {
  const { requests, loading, error } = useRequests()

  // Calculate stats from API data
  const stats = {
    totalRequests: requests.length,
    inProgress: requests.filter(r => r.status === 'In Progress').length,
    completed: requests.filter(r => r.status === 'Repaired').length,
    overdue: requests.filter(r => {
      const scheduled = new Date(r.scheduledAt)
      const now = new Date()
      return scheduled < now && r.status !== 'Repaired' && r.status !== 'Scraped'
    }).length,
  }

  const recentRequests = requests.slice(0, 5)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-red-800 dark:text-red-300 font-semibold mb-2">Connection Error</h3>
            <p className="text-red-700 dark:text-red-400 whitespace-pre-line">{error}</p>
            <div className="mt-4 space-y-2 text-sm text-red-600 dark:text-red-500">
              <p className="font-medium">Troubleshooting steps:</p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Start the backend server: <code className="bg-red-100 dark:bg-red-900/30 px-2 py-0.5 rounded">cd GearGuard/backend && npm run server</code></li>
                <li>Ensure MongoDB is running and connected</li>
                <li>Check that the backend is listening on port 4000</li>
                <li>Make sure you are logged in (authentication required)</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Hero Section with Spline placeholder */}
      <motion.div
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, ease: 'easeOut' }}
  className="relative overflow-hidden rounded-2xl p-8 md:p-10
             bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700
             dark:from-primary-600 dark:via-primary-700 dark:to-primary-800
             text-white shadow-xl"
>
  {/* Decorative blur blobs */}
  <div className="absolute -top-16 -right-16 w-56 h-56 bg-white/10 rounded-full blur-3xl" />
  <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-black/10 rounded-full blur-3xl" />

  <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
    {/* Left Content */}
    <div className="max-w-xl">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
        Welcome back!
      </h1>

      <p className="text-primary-100 text-base md:text-lg leading-relaxed">
        Here’s a quick overview of what’s happening with your equipment
        maintenance today.
      </p>

      {/* Quick highlight */}
      <div className="mt-5 inline-flex items-center gap-3 bg-white/10 backdrop-blur-md
                      border border-white/20 rounded-xl px-4 py-2">
        <TrendingUp className="w-5 h-5 text-white/80" />
        <span className="text-sm text-white/90">
          Stay on top of repairs and avoid overdue tasks
        </span>
      </div>
    </div>

    {/* Right Visual / Placeholder */}
    <div className="hidden lg:flex items-center justify-center w-44 h-44
                rounded-2xl bg-white/10 backdrop-blur-md
                border border-white/20">
  <img
    src="/public/assets/heroImg.png"
    alt="Hero Illustration"
    className="w-full h-full object-contain p-4"
  />
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

