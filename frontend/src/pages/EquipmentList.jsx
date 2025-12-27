import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Plus, Wrench, MapPin, Calendar, Users, X, Loader2 } from 'lucide-react'
import { useEquipment, useTeams } from '../hooks/useData'
import { format } from 'date-fns'

const EquipmentList = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('All')
  const [filterTeam, setFilterTeam] = useState('All')
  const [filterWarrantyStatus, setFilterWarrantyStatus] = useState('All')
  const [filterOwner, setFilterOwner] = useState('All')

  const { equipment, loading: equipmentLoading, error: equipmentError } = useEquipment()
  const { teams, loading: teamsLoading } = useTeams()

  const categories = ['All', ...new Set(equipment.map(eq => eq.category))]
  const teamsList = ['All', ...teams.map(team => team._id || team.id)]
  const owners = ['All', ...new Set(equipment.map(eq => {
    if (typeof eq.owner === 'object' && eq.owner?._id) {
      return eq.owner._id
    }
    return eq.owner
  }))]
  const warrantyStatuses = ['All', 'Valid', 'Expiring Soon', 'Expired']

  const getWarrantyStatus = (equipment) => {
    const expiryDate = new Date(equipment.warrantyExpiry)
    const now = new Date()
    const daysUntilExpiry = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24))
    
    if (expiryDate < now) return 'Expired'
    if (daysUntilExpiry <= 90) return 'Expiring Soon'
    return 'Valid'
  }

  const filteredEquipment = equipment.filter((eq) => {
    const matchesSearch =
      eq.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.location?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = filterCategory === 'All' || eq.category === filterCategory
    const assignedToId = typeof eq.assignedTo === 'object' ? eq.assignedTo?._id || eq.assignedTo?.id : eq.assignedTo
    const matchesTeam = filterTeam === 'All' || assignedToId === filterTeam
    const matchesWarranty = filterWarrantyStatus === 'All' || getWarrantyStatus(eq) === filterWarrantyStatus
    const ownerId = typeof eq.owner === 'object' ? eq.owner?._id || eq.owner?.id : eq.owner
    const matchesOwner = filterOwner === 'All' || ownerId === filterOwner
    
    return matchesSearch && matchesCategory && matchesTeam && matchesWarranty && matchesOwner
  })

  if (equipmentLoading || teamsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    )
  }

  if (equipmentError) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-red-800 dark:text-red-300 font-semibold mb-2">Connection Error</h3>
            <p className="text-red-700 dark:text-red-400 whitespace-pre-line">{equipmentError}</p>
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

  const hasActiveFilters = filterCategory !== 'All' || filterTeam !== 'All' || filterWarrantyStatus !== 'All' || filterOwner !== 'All'

  const clearAllFilters = () => {
    setFilterCategory('All')
    setFilterTeam('All')
    setFilterWarrantyStatus('All')
    setFilterOwner('All')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Equipment</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage and track all equipment</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 dark:bg-primary-500 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors font-medium">
          <Plus className="w-5 h-5" />
          Add Equipment
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
              placeholder="Search equipment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Filter Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full pl-10 pr-8 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none cursor-pointer"
              >
                <option value="All">All Categories</option>
                {categories.filter(cat => cat !== 'All').map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Assigned Team Filter */}
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
              <select
                value={filterTeam}
                onChange={(e) => setFilterTeam(e.target.value)}
                className="w-full pl-10 pr-8 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none cursor-pointer"
              >
                <option value="All">All Teams</option>
                {teamsList.filter(team => team !== 'All').map((teamId) => {
                  const team = teams.find(t => (t._id || t.id) === teamId)
                  return (
                    <option key={teamId} value={teamId}>
                      {team?.teamName || 'Unknown'}
                    </option>
                  )
                })}
              </select>
            </div>

            {/* Warranty Status Filter */}
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
              <select
                value={filterWarrantyStatus}
                onChange={(e) => setFilterWarrantyStatus(e.target.value)}
                className="w-full pl-10 pr-8 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none cursor-pointer"
              >
                {warrantyStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status === 'All' ? 'All Warranty Status' : status}
                  </option>
                ))}
              </select>
            </div>

            {/* Owner Filter */}
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
              <select
                value={filterOwner}
                onChange={(e) => setFilterOwner(e.target.value)}
                className="w-full pl-10 pr-8 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none cursor-pointer"
              >
                <option value="All">All Owners</option>
                {owners.filter(owner => owner !== 'All').map((ownerId) => {
                  const owner = equipment.find(eq => {
                    const eqOwnerId = typeof eq.owner === 'object' ? eq.owner?._id || eq.owner?.id : eq.owner
                    return eqOwnerId === ownerId
                  })?.owner
                  const ownerName = typeof owner === 'object' ? owner?.name : 'Unknown'
                  return (
                    <option key={ownerId} value={ownerId}>
                      {ownerName || 'Unknown'}
                    </option>
                  )
                })}
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

      {/* Equipment Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {filteredEquipment.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Equipment
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Serial Number
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Warranty
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Assigned Team
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredEquipment.map((equipment, index) => (
                  <EquipmentRow key={equipment.id} equipment={equipment} index={index} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

const EquipmentRow = ({ equipment: eq, index }) => {
  const assignedToId = typeof eq.assignedTo === 'object' ? eq.assignedTo?._id || eq.assignedTo?.id : eq.assignedTo
  const team = typeof eq.assignedTo === 'object' ? eq.assignedTo : null
  const owner = typeof eq.owner === 'object' ? eq.owner : null

  const isWarrantyExpired = new Date(eq.warrantyExpiry) < new Date()
  const isWarrantyExpiringSoon =
    new Date(eq.warrantyExpiry) > new Date() &&
    new Date(eq.warrantyExpiry) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)

  return (
    <motion.tr
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
            <Wrench className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-medium text-gray-900 dark:text-gray-100">{eq.name}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Owner: {owner?.name || 'Unknown'}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
          {eq.category}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <MapPin className="w-4 h-4" />
          {eq.location}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <code className="text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
          {eq.serialNumber}
        </code>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          <div>
            <div className="text-sm text-gray-900 dark:text-gray-100">
              {format(new Date(eq.warrantyExpiry), 'MMM dd, yyyy')}
            </div>
            {isWarrantyExpired && (
              <div className="text-xs text-red-600 dark:text-red-400 font-medium">Expired</div>
            )}
            {isWarrantyExpiringSoon && (
              <div className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">Expiring Soon</div>
            )}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {team ? (
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            <span className="text-sm text-gray-600 dark:text-gray-300">{team.teamName || 'Unknown'}</span>
          </div>
        ) : (
          <span className="text-sm text-gray-400 dark:text-gray-500">Unassigned</span>
        )}
      </td>
    </motion.tr>
  )
}

const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      {/* TODO: Consider adding a Spline 3D empty state here */}
      <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
        <Wrench className="w-10 h-10 text-gray-400 dark:text-gray-500" />
      </div>
      <p className="text-gray-500 dark:text-gray-400 font-medium">No equipment found</p>
      <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Try adjusting your search or filters</p>
    </div>
  )
}

export default EquipmentList
