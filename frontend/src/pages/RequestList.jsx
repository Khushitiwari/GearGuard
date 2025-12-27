import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Plus, Clock, User, Wrench, AlertCircle, X, Loader2 } from 'lucide-react'
import { useRequests } from '../hooks/useData'
import { format, isPast, isToday } from 'date-fns'

const RequestList = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [filterPriority, setFilterPriority] = useState('All')

  const { requests, loading, error } = useRequests()

  const statuses = ['All', 'New', 'In Progress', 'Repaired', 'Scraped']
  const priorities = ['All', 'Low', 'Medium', 'High']

  const filteredRequests = requests.filter((req) => {
    const equipment = typeof req.equipment === 'object' ? req.equipment : null
    const matchesSearch =
      req.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipment?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'All' || req.status === filterStatus
    const matchesPriority = filterPriority === 'All' || req.priority === filterPriority
    return matchesSearch && matchesStatus && matchesPriority
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <p className="text-red-600 dark:text-red-400">Error: {error}</p>
        <p className="text-sm text-red-500 dark:text-red-500 mt-2">
          Please make sure the backend server is running on port 4000 and you are authenticated.
        </p>
      </div>
    )
  }

  const hasActiveFilters = filterStatus !== 'All' || filterPriority !== 'All'

  const clearAllFilters = () => {
    setFilterStatus('All')
    setFilterPriority('All')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Maintenance Requests</h1>
          <p className="text-gray-600 dark:text-gray-400">View and manage all maintenance requests</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 dark:bg-primary-500 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors font-medium">
          <Plus className="w-5 h-5" />
          New Request
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Filter Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full pl-10 pr-8 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none cursor-pointer"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status === 'All' ? 'All Status' : status}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority Filter */}
            <div className="relative">
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="w-full pl-4 pr-8 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none cursor-pointer"
              >
                {priorities.map((priority) => (
                  <option key={priority} value={priority}>
                    {priority === 'All' ? 'All Priority' : `${priority} Priority`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
            >
              <X className="w-4 h-4" />
              Clear all filters
            </button>
          )}
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {filteredRequests.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Request
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Equipment
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Technician
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Scheduled
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredRequests.map((request, index) => (
                  <RequestRow key={request.id} request={request} index={index} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

const RequestRow = ({ request, index }) => {
  const equipment = typeof request.equipment === 'object' ? request.equipment : null
  const technician = typeof request.technician === 'object' ? request.technician : null
  const requester = typeof request.createdFrom === 'object' ? request.createdFrom : null
  const team = typeof request.team === 'object' ? request.team : null

  const isOverdue =
    isPast(new Date(request.scheduledAt)) &&
    !isToday(new Date(request.scheduledAt)) &&
    request.status !== 'Repaired' &&
    request.status !== 'Scraped'

  const getInitials = (name) => {
    if (!name) return '??'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <motion.tr
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer ${
        isOverdue ? 'bg-red-50/30 dark:bg-red-900/10' : ''
      }`}
    >
      <td className="px-6 py-4">
        <div>
          <div className="font-medium text-gray-900 dark:text-gray-100 mb-1">{request.subject}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{request.description}</div>
          {isOverdue && (
            <div className="flex items-center gap-1 mt-1 text-xs text-red-600 dark:text-red-400">
              <AlertCircle className="w-3 h-3" />
              <span>Overdue</span>
            </div>
          )}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <Wrench className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          <span className="text-sm text-gray-600 dark:text-gray-300">{equipment?.name || 'Unknown'}</span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            request.type === 'Preventive'
              ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
              : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
          }`}
        >
          {request.type}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            request.priority === 'High'
              ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
              : request.priority === 'Medium'
              ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
              : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
          }`}
        >
          {request.priority}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            request.status === 'New'
              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
              : request.status === 'In Progress'
              ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
              : request.status === 'Repaired'
              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          {request.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
            {technician?.avatar ? (
              <img src={technician.avatar} alt={technician.name} className="w-full h-full rounded-full" />
            ) : (
              getInitials(technician?.name)
            )}
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-300">{technician?.name || 'Unassigned'}</span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <Clock className="w-4 h-4" />
          <div>
            <div>{format(new Date(request.scheduledAt), 'MMM dd, yyyy')}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {format(new Date(request.scheduledAt), 'h:mm a')} • {request.duration} min
            </div>
          </div>
        </div>
      </td>
    </motion.tr>
  )
}

const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      {/* TODO: Consider adding a Spline 3D empty state here */}
      <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
        <AlertCircle className="w-10 h-10 text-gray-400 dark:text-gray-500" />
      </div>
      <p className="text-gray-500 dark:text-gray-400 font-medium">No requests found</p>
      <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Try adjusting your search or filters</p>
    </div>
  )
}

export default RequestList
