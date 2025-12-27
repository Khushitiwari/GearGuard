import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, Plus, Clock, User, Wrench, AlertCircle, X, Loader2, Edit2, Trash2, MoreVertical } from 'lucide-react'
import { useRequests, useEquipment, useTeams, useUsers } from '../hooks/useData'
import { requestAPI } from '../services/api'
import { format, isPast, isToday } from 'date-fns'

const RequestList = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [filterPriority, setFilterPriority] = useState('All')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingRequest, setEditingRequest] = useState(null)
  const [actionMenuOpen, setActionMenuOpen] = useState(null)

  const { requests, loading, error, refetch } = useRequests()
  const { equipment } = useEquipment()
  const { teams } = useTeams()
  const { users } = useUsers()

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

  const handleCreateRequest = async (formData) => {
    try {
      const response = await requestAPI.create(formData)
      if (response.success) {
        refetch()
        setIsModalOpen(false)
      } else {
        alert(response.message || 'Failed to create request')
      }
    } catch (err) {
      alert(err.message || 'Failed to create request')
    }
  }

  const handleUpdateRequest = async (id, formData) => {
    try {
      const response = await requestAPI.update(id, formData)
      if (response.success) {
        refetch()
        setEditingRequest(null)
        setActionMenuOpen(null)
      } else {
        alert(response.message || 'Failed to update request')
      }
    } catch (err) {
      alert(err.message || 'Failed to update request')
    }
  }

  const handleDeleteRequest = async (id) => {
    if (!confirm('Are you sure you want to delete this request?')) return
    
    try {
      const response = await requestAPI.delete(id)
      if (response.success) {
        refetch()
        setActionMenuOpen(null)
      } else {
        alert(response.message || 'Failed to delete request')
      }
    } catch (err) {
      alert(err.message || 'Failed to delete request')
    }
  }

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const response = await requestAPI.update(id, { status: newStatus })
      if (response.success) {
        refetch()
        setActionMenuOpen(null)
      } else {
        alert(response.message || 'Failed to update status')
      }
    } catch (err) {
      alert(err.message || 'Failed to update status')
    }
  }

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
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 dark:bg-primary-500 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors font-medium"
        >
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
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredRequests.map((request, index) => (
                  <RequestRow 
                    key={request._id || request.id} 
                    request={request} 
                    index={index}
                    onEdit={(req) => {
                      setEditingRequest(req)
                      setIsModalOpen(true)
                    }}
                    onDelete={handleDeleteRequest}
                    onStatusUpdate={handleStatusUpdate}
                    actionMenuOpen={actionMenuOpen}
                    setActionMenuOpen={setActionMenuOpen}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* New/Edit Request Modal */}
      <AnimatePresence>
        {(isModalOpen || editingRequest) && (
          <NewRequestModal
            isOpen={isModalOpen || !!editingRequest}
            onClose={() => {
              setIsModalOpen(false)
              setEditingRequest(null)
            }}
            onSave={editingRequest ? (data) => handleUpdateRequest(editingRequest._id || editingRequest.id, data) : handleCreateRequest}
            equipment={equipment}
            teams={teams}
            users={users}
            initialData={editingRequest}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

const RequestRow = ({ request, index, onEdit, onDelete, onStatusUpdate, actionMenuOpen, setActionMenuOpen }) => {
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

  const requestId = request._id || request.id
  const isMenuOpen = actionMenuOpen === requestId

  return (
    <motion.tr
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
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
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="relative">
          <button
            onClick={() => setActionMenuOpen(isMenuOpen ? null : requestId)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <MoreVertical className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
              <button
                onClick={() => {
                  onEdit(request)
                  setActionMenuOpen(null)
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
              <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
              <div className="px-2">
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-2 py-1">Update Status</div>
                {['New', 'In Progress', 'Repaired', 'Scraped'].map((status) => (
                  <button
                    key={status}
                    onClick={() => onStatusUpdate(requestId, status)}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 ${
                      request.status === status
                        ? 'text-primary-600 dark:text-primary-400 font-medium'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
              <button
                onClick={() => {
                  onDelete(requestId)
                  setActionMenuOpen(null)
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          )}
        </div>
      </td>
    </motion.tr>
  )
}

const NewRequestModal = ({ isOpen, onClose, onSave, equipment, teams, users, initialData }) => {
  const [formData, setFormData] = useState({
    subject: initialData?.subject || '',
    description: initialData?.description || '',
    equipment: initialData?.equipment?._id || initialData?.equipment || '',
    type: initialData?.type || 'Corrective',
    team: initialData?.team?._id || initialData?.team || '',
    technician: initialData?.technician?._id || initialData?.technician || '',
    scheduledAt: initialData?.scheduledAt 
      ? format(new Date(initialData.scheduledAt), "yyyy-MM-dd'T'HH:mm")
      : format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    duration: initialData?.duration || 60,
    priority: initialData?.priority || 'Medium',
  })
  const [loading, setLoading] = useState(false)

  const technicians = users.filter(user => user.role === 'Technician' || user.role === 'Manager')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.subject || !formData.description || !formData.equipment || !formData.team || !formData.technician) {
      alert('Please fill in all required fields')
      return
    }

    setLoading(true)
    try {
      await onSave(formData)
    } catch (err) {
      alert(err.message || 'Failed to save request')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {initialData ? 'Edit Request' : 'New Maintenance Request'}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {initialData ? 'Update request details' : 'Create a new maintenance request'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Subject <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="e.g., Equipment malfunction"
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the issue..."
              rows={4}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Equipment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Equipment <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.equipment}
              onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none cursor-pointer"
            >
              <option value="">Select equipment</option>
              {equipment.map((eq) => (
                <option key={eq._id || eq.id} value={eq._id || eq.id}>
                  {eq.name} {eq.serialNumber ? `- ${eq.serialNumber}` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Type <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none cursor-pointer"
            >
              <option value="Corrective">Corrective</option>
              <option value="Preventive">Preventive</option>
            </select>
          </div>

          {/* Team */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Team <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.team}
              onChange={(e) => setFormData({ ...formData, team: e.target.value })}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none cursor-pointer"
            >
              <option value="">Select team</option>
              {teams.map((team) => (
                <option key={team._id || team.id} value={team._id || team.id}>
                  {team.teamName}
                </option>
              ))}
            </select>
          </div>

          {/* Technician */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Technician <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.technician}
              onChange={(e) => setFormData({ ...formData, technician: e.target.value })}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none cursor-pointer"
            >
              <option value="">Select technician</option>
              {technicians.map((user) => (
                <option key={user._id || user.id} value={user._id || user.id}>
                  {user.name} ({user.role})
                </option>
              ))}
            </select>
          </div>

          {/* Scheduled Date & Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Scheduled Date & Time <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              required
              value={formData.scheduledAt}
              onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Duration & Priority Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Duration (minutes) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min="15"
                step="15"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Priority <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none cursor-pointer"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-primary-600 dark:bg-primary-500 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : initialData ? 'Update Request' : 'Create Request'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
        <AlertCircle className="w-10 h-10 text-gray-400 dark:text-gray-500" />
      </div>
      <p className="text-gray-500 dark:text-gray-400 font-medium">No requests found</p>
      <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Try adjusting your search or filters</p>
    </div>
  )
}

export default RequestList
