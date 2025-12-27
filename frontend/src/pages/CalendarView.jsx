import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, X, Plus, Wrench, Clock, User, AlertCircle, MapPin, Calendar, FileText, Loader2 } from 'lucide-react'
import { useRequests, useEquipment, useTeams, useUsers } from '../hooks/useData'
import { requestAPI } from '../services/api'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, setHours, setMinutes } from 'date-fns'

const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [selectedEquipment, setSelectedEquipment] = useState(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  
  const { requests, loading: requestsLoading, error: requestsError, refetch } = useRequests()
  const { equipment, loading: equipmentLoading } = useEquipment()
  const { teams } = useTeams()
  const { users } = useUsers()
  
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Get preventive maintenance requests
  const preventiveRequests = requests.filter(req => req.type === 'Preventive')

  const getRequestsForDate = (date) => {
    return preventiveRequests.filter(req => {
      const scheduledDate = new Date(req.scheduledAt)
      return isSameDay(scheduledDate, date)
    })
  }

  const handleDateClick = (date, event) => {
    // Check if clicking on a request item
    const clickedElement = event.target.closest('[data-request-id]')
    if (clickedElement) {
      const requestId = clickedElement.getAttribute('data-request-id')
      const request = preventiveRequests.find(r => (r._id || r.id) === requestId)
      if (request) {
        setSelectedRequest(request)
        setIsDetailsModalOpen(true)
        return
      }
    }
    
    // Check if clicking on equipment
    const equipmentElement = event.target.closest('[data-equipment-id]')
    if (equipmentElement) {
      const equipmentId = equipmentElement.getAttribute('data-equipment-id')
      const eq = equipment.find(e => (e._id || e.id) === equipmentId)
      if (eq) {
        setSelectedEquipment(eq)
        setIsDetailsModalOpen(true)
        return
      }
    }

    // Otherwise, open add request modal
    setSelectedDate(date)
    setIsModalOpen(true)
  }

  const handleAddCorrectiveMaintenance = async (formData) => {
    try {
      const response = await requestAPI.create(formData)
      if (response.success) {
        refetch()
        setIsModalOpen(false)
        setSelectedDate(null)
      } else {
        alert(response.message || 'Failed to create request')
      }
    } catch (err) {
      alert(err.message || 'Failed to create request')
    }
  }

  const goToPreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1))
  }

  // Get first day of week for the month start
  const firstDayOfWeek = monthStart.getDay()
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  if (requestsLoading || equipmentLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Calendar View</h1>
          <p className="text-gray-600 dark:text-gray-400">Preventive maintenance schedule - Click request to view details, or click empty date to add corrective maintenance</p>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={goToPreviousMonth}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <button
            onClick={goToNextMonth}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* Week Days Header */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {weekDays.map((day) => (
            <div key={day} className="text-center text-sm font-medium text-gray-600 dark:text-gray-400 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {/* Empty cells for days before month start */}
          {Array.from({ length: firstDayOfWeek }).map((_, index) => (
            <div key={`empty-${index}`} className="aspect-square" />
          ))}

          {/* Days of the month */}
          {daysInMonth.map((day) => {
            const dayRequests = getRequestsForDate(day)
            const isCurrentMonth = isSameMonth(day, currentDate)
            const isToday = isSameDay(day, new Date())

            return (
              <motion.div
                key={day.toISOString()}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={(e) => handleDateClick(day, e)}
                className={`aspect-square border border-gray-200 dark:border-gray-700 rounded-lg p-2 cursor-pointer transition-all ${
                  isToday 
                    ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-300 dark:border-primary-700' 
                    : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
                } ${!isCurrentMonth ? 'opacity-40' : ''}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-sm font-medium ${
                      isToday 
                        ? 'text-primary-700 dark:text-primary-300' 
                        : 'text-gray-900 dark:text-gray-100'
                    }`}
                  >
                    {format(day, 'd')}
                  </span>
                  {dayRequests.length > 0 && (
                    <span className="text-xs bg-primary-500 dark:bg-primary-600 text-white rounded-full w-5 h-5 flex items-center justify-center font-medium">
                      {dayRequests.length}
                    </span>
                  )}
                </div>
                <div className="space-y-1 overflow-y-auto max-h-[60px] scrollbar-hide">
                  {dayRequests.slice(0, 3).map((req) => {
                    const equipmentObj = typeof req.equipment === 'object' ? req.equipment : equipment.find(eq => (eq._id || eq.id) === req.equipment)
                    const requestId = req._id || req.id
                    const equipmentId = equipmentObj?._id || equipmentObj?.id
                    
                    return (
                      <div
                        key={requestId}
                        data-request-id={requestId}
                        data-equipment-id={equipmentId}
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedRequest(req)
                          setIsDetailsModalOpen(true)
                        }}
                        className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-1.5 py-0.5 rounded truncate cursor-pointer hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
                        title={`${equipmentObj?.name || 'Unknown'} - ${req.subject}`}
                      >
                        {equipmentObj?.name || req.subject}
                      </div>
                    )
                  })}
                  {dayRequests.length > 3 && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      +{dayRequests.length - 3} more
                    </div>
                  )}
                </div>
                {dayRequests.length === 0 && (
                  <div className="flex items-center justify-center h-full -mt-4 opacity-0 hover:opacity-100 transition-opacity">
                    <Plus className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center gap-6 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-primary-50 dark:bg-primary-900/20 border border-primary-300 dark:border-primary-700 rounded"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Today</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-100 dark:bg-purple-900/30 rounded"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Preventive Maintenance (Click to view details)</span>
          </div>
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Click empty date to add corrective maintenance</span>
          </div>
        </div>
      </div>

      {/* Add Corrective Maintenance Modal */}
      <AnimatePresence>
        {isModalOpen && selectedDate && (
          <AddCorrectiveMaintenanceModal
            selectedDate={selectedDate}
            onClose={() => {
              setIsModalOpen(false)
              setSelectedDate(null)
            }}
            onSave={handleAddCorrectiveMaintenance}
            equipment={equipment}
            teams={teams}
            users={users}
          />
        )}
      </AnimatePresence>

      {/* Request/Equipment Details Modal */}
      <AnimatePresence>
        {isDetailsModalOpen && (selectedRequest || selectedEquipment) && (
          <DetailsModal
            request={selectedRequest}
            equipment={selectedEquipment}
            allEquipment={equipment}
            teams={teams}
            users={users}
            onClose={() => {
              setIsDetailsModalOpen(false)
              setSelectedRequest(null)
              setSelectedEquipment(null)
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

const AddCorrectiveMaintenanceModal = ({ selectedDate, onClose, onSave, equipment, teams, users }) => {
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    equipment: '',
    type: 'Corrective',
    team: '',
    technician: '',
    scheduledAt: format(setHours(setMinutes(selectedDate, 0), 9), "yyyy-MM-dd'T'HH:mm"),
    duration: 60,
    priority: 'Medium',
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
              Add Corrective Maintenance
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Scheduled for {format(selectedDate, 'MMMM dd, yyyy')}
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
              {loading ? 'Creating...' : 'Add Maintenance Request'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

const DetailsModal = ({ request, equipment, allEquipment, teams, users, onClose }) => {
  if (request) {
    const equipmentObj = typeof request.equipment === 'object' ? request.equipment : allEquipment.find(eq => (eq._id || eq.id) === request.equipment)
    const technician = typeof request.technician === 'object' ? request.technician : users.find(u => (u._id || u.id) === request.technician)
    const team = typeof request.team === 'object' ? request.team : teams.find(t => (t._id || t.id) === request.team)
    const requester = typeof request.createdFrom === 'object' ? request.createdFrom : users.find(u => (u._id || u.id) === request.createdFrom)

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
                Request Details
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {request.type} Maintenance
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
          <div className="p-6 space-y-6">
            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Subject
              </label>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {request.subject}
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Description
              </label>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {request.description}
              </p>
            </div>

            {/* Equipment */}
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Equipment
              </label>
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-gray-400" />
                <span className="text-gray-900 dark:text-gray-100 font-medium">
                  {equipmentObj?.name || 'Unknown'}
                </span>
                {equipmentObj?.serialNumber && (
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    ({equipmentObj.serialNumber})
                  </span>
                )}
              </div>
              {equipmentObj?.location && (
                <div className="flex items-center gap-2 mt-1 ml-6">
                  <MapPin className="w-3 h-3 text-gray-400" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {equipmentObj.location}
                  </span>
                </div>
              )}
            </div>

            {/* Grid: Status, Priority, Type */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Status
                </label>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
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
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Priority
                </label>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    request.priority === 'High'
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                      : request.priority === 'Medium'
                      ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                      : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                  }`}
                >
                  {request.priority}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Type
                </label>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    request.type === 'Preventive'
                      ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                      : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
                  }`}
                >
                  {request.type}
                </span>
              </div>
            </div>

            {/* Scheduled Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Scheduled Date & Time
                </label>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-900 dark:text-gray-100">
                    {format(new Date(request.scheduledAt), 'MMM dd, yyyy • h:mm a')}
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Duration
                </label>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-900 dark:text-gray-100">
                    {request.duration} minutes
                  </span>
                </div>
              </div>
            </div>

            {/* Team & Technician */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Team
                </label>
                <span className="text-gray-900 dark:text-gray-100">
                  {team?.teamName || 'Unassigned'}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Technician
                </label>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-900 dark:text-gray-100">
                    {technician?.name || 'Unassigned'}
                  </span>
                </div>
              </div>
            </div>

            {/* Requested By */}
            {requester && (
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Requested By
                </label>
                <span className="text-gray-900 dark:text-gray-100">
                  {requester.name} ({requester.email})
                </span>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-primary-600 dark:bg-primary-500 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  if (equipment) {
    const owner = typeof equipment.owner === 'object' ? equipment.owner : users.find(u => (u._id || u.id) === equipment.owner)
    const assignedTeam = typeof equipment.assignedTo === 'object' ? equipment.assignedTo : teams.find(t => (t._id || t.id) === equipment.assignedTo)

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
                Equipment Details
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Equipment Information
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
          <div className="p-6 space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Equipment Name
              </label>
              <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {equipment.name}
                </p>
              </div>
            </div>

            {/* Serial Number */}
            {equipment.serialNumber && (
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Serial Number
                </label>
                <p className="text-gray-900 dark:text-gray-100 font-mono">
                  {equipment.serialNumber}
                </p>
              </div>
            )}

            {/* Location */}
            {equipment.location && (
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Location
                </label>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-900 dark:text-gray-100">
                    {equipment.location}
                  </span>
                </div>
              </div>
            )}

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Category
              </label>
              <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                {equipment.category}
              </span>
            </div>

            {/* Grid: Purchase Date, Warranty */}
            <div className="grid grid-cols-2 gap-4">
              {equipment.purchaseDate && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Purchase Date
                  </label>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900 dark:text-gray-100">
                      {format(new Date(equipment.purchaseDate), 'MMM dd, yyyy')}
                    </span>
                  </div>
                </div>
              )}
              {equipment.warrantyExpiry && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Warranty Expiry
                  </label>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900 dark:text-gray-100">
                      {format(new Date(equipment.warrantyExpiry), 'MMM dd, yyyy')}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Owner & Assigned Team */}
            <div className="grid grid-cols-2 gap-4">
              {owner && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Owner
                  </label>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900 dark:text-gray-100">
                      {owner.name}
                    </span>
                  </div>
                </div>
              )}
              {assignedTeam && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Assigned Team
                  </label>
                  <span className="text-gray-900 dark:text-gray-100">
                    {assignedTeam.teamName}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-primary-600 dark:bg-primary-500 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  return null
}

export default CalendarView
