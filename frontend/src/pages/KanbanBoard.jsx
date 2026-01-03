import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Clock, User, AlertCircle, Wrench, Loader2 } from 'lucide-react'
import { useRequests } from '../hooks/useData'
import { requestAPI } from '../services/api'
import { format, isPast, isToday } from 'date-fns'
import {
  // DndContext,
  // closestCenter,
  // KeyboardSensor,
  // PointerSensor,
  // useSensor,
  // useSensors,
  // DragOverlay,
  // useDroppable,

  
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  useDroppable,
  pointerWithin,


} from '@dnd-kit/core'

import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const KanbanBoard = () => {
  const { requests: initialRequests, loading } = useRequests()
  const [requests, setRequests] = useState([])
  const [activeId, setActiveId] = useState(null)

  useEffect(() => {
    if (initialRequests) {
      setRequests(initialRequests)
    }
  }, [initialRequests])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const columns = [
    { id: 'New', label: 'New', color: 'blue' },
    { id: 'In Progress', label: 'In Progress', color: 'yellow' },
    { id: 'Repaired', label: 'Repaired', color: 'green' },
    { id: 'Scraped', label: 'Scrap', color: 'gray' },
  ]

  const getRequestsByStatus = (status) => {
    return requests.filter((req) => req.status === status)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    )
  }

  const isOverdue = (scheduledAt, status) => {
    if (status === 'Repaired' || status === 'Scraped') return false
    return isPast(new Date(scheduledAt)) && !isToday(new Date(scheduledAt))
  }

  const handleDragStart = (event) => {
    setActiveId(event.active.id)
  }

   const handleDragEnd = ({ active, over }) => {
  setActiveId(null)
  if (!over) return

  const activeId = active.id
  const overId = over.id

  const activeItem = requests.find(
    r => (r._id || r.id) === activeId
  )

  if (!activeItem) return

  let newStatus = null

  // Dropped on column
  if (columns.some(col => col.id === overId)) {
    newStatus = overId
  }

  // Dropped on another card
  const overItem = requests.find(
    r => (r._id || r.id) === overId
  )
  if (overItem) {
    newStatus = overItem.status
  }

  if (!newStatus || newStatus === activeItem.status) return

  const requestId = activeItem._id || activeItem.id

  // Backend update
  requestAPI.update(requestId, { status: newStatus }).catch(console.error)

  // UI update
  setRequests(prev =>
    prev.map(req =>
      (req._id || req.id) === requestId
        ? { ...req, status: newStatus }
        : req
    )
  )
}


  const handleDragCancel = () => {
    setActiveId(null)
  }

  const activeRequest = activeId ? requests.find((req) => {
    const reqId = req._id || req.id
    return reqId === activeId
  }) : null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Kanban Board</h1>
          <p className="text-gray-600 dark:text-gray-400">Drag and drop requests to update their status</p>
        </div>
      </div>

      {/* Kanban Columns */}
      <DndContext
        sensors={sensors}
        collisionDetection={pointerWithin}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
          {columns.map((column) => {
            const columnRequests = getRequestsByStatus(column.id)
            return (
              <KanbanColumn
                key={column.id}
                column={column}
                requests={columnRequests}
                isOverdue={isOverdue}
                columnId={column.id}
              />
            )
          })}
        </div>

        <DragOverlay>
          {activeRequest ? (
            <RequestCard
              request={activeRequest}
              isOverdue={isOverdue(activeRequest.scheduledAt, activeRequest.status)}
              isDragging={true}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}

const KanbanColumn = ({ column, requests, isOverdue, columnId }) => {
  const colorClasses = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300',
    yellow: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-300',
    green: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300',
    gray: 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300',
  }

  const requestIds = requests.map((req) => req._id || req.id)
  const { setNodeRef , isOver} = useDroppable({
    id: columnId,
  })

 return (
  <div className="flex-shrink-0 w-80">
    {/* Column Header */}
    <div
      className={`rounded-xl border-2 ${colorClasses[column.color]} ${
        isOver ? 'ring-2 ring-primary-500 ring-offset-2' : ''
      } p-4 mb-4 transition-all`}
    >
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-lg">{column.label}</h2>
        <span className="bg-white/60 dark:bg-gray-800/60 px-2 py-1 rounded-full text-sm font-medium">
          {requests.length}
        </span>
      </div>
    </div>

    {/* Column Body (DROPPABLE AREA) */}
    <div
      ref={setNodeRef}
      className="space-y-4 min-h-[400px]"
    >
      <SortableContext
        items={requestIds}
        strategy={verticalListSortingStrategy}
      >
        {requests.length === 0 ? (
          <EmptyColumnState columnId={columnId} />
        ) : (
          requests.map((request) => (
            <SortableRequestCard
              key={request._id || request.id}
              request={request}
              columnId={columnId}
              isOverdue={isOverdue(request.scheduledAt, request.status)}
            />
          ))
        )}
      </SortableContext>
    </div>
  </div>
)

}

const SortableRequestCard = ({ request, isOverdue , columnId }) => {
  const requestId = request._id || request.id
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: requestId,
    data: {
      type: 'request',
      request,
      columnId,
    },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <RequestCard request={request} isOverdue={isOverdue} isDragging={isDragging} />
    </div>
  )
}

const RequestCard = ({ request, isOverdue, isDragging = false }) => {
  const equipment = typeof request.equipment === 'object' ? request.equipment : null
  const technician = typeof request.technician === 'object' ? request.technician : null
  const requester = typeof request.createdFrom === 'object' ? request.createdFrom : null

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
    <motion.div
      initial={!isDragging && { opacity: 0, y: 20 }}
      animate={!isDragging && { opacity: 1, y: 0 }}
      whileHover={!isDragging && { y: -4, transition: { duration: 0.2 } }}
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border-2 p-5 transition-all ${
        isDragging
          ? 'cursor-grabbing shadow-2xl scale-105 rotate-2'
          : 'cursor-grab'
      } ${
        request.status === 'In Progress'
          ? 'border-yellow-400 dark:border-yellow-500 bg-yellow-50/30 dark:bg-yellow-900/20 hover:border-yellow-500 dark:hover:border-yellow-400 hover:shadow-md'
          : isOverdue
          ? 'border-red-300 dark:border-red-700 bg-red-50/30 dark:bg-red-900/20'
          : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-md'
      }`}
    >
      {/* Overdue Badge */}
      {isOverdue && (
        <div className="flex items-center gap-2 mb-3 text-red-600 dark:text-red-400">
          <AlertCircle className="w-4 h-4" />
          <span className="text-xs font-medium">Overdue</span>
        </div>
      )}

      {/* Subject - Primary Emphasis */}
      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 text-base leading-tight">
        {request.subject}
      </h3>

      {/* Equipment Name - Secondary Text */}
      <div className="flex items-center gap-2 mb-3 text-sm text-gray-600 dark:text-gray-400">
        <Wrench className="w-4 h-4" />
        <span className="truncate">{equipment?.name || 'Unknown Equipment'}</span>
      </div>

      {/* Priority Badge */}
      <div className="mb-3">
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
            request.priority === 'High'
              ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
              : request.priority === 'Medium'
              ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
              : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
          }`}
        >
          {request.priority} Priority
        </span>
      </div>

      {/* Footer: Technician & Date */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
            {technician?.avatar ? (
              <img src={technician.avatar} alt={technician.name} className="w-full h-full rounded-full" />
            ) : (
              getInitials(technician?.name)
            )}
          </div>
          <span className="text-xs text-gray-600 dark:text-gray-400">{technician?.name || 'Unassigned'}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
          <Clock className="w-3 h-3" />
          <span>{format(new Date(request.scheduledAt), 'MMM dd')}</span>
        </div>
      </div>

      {/* Type Badge */}
      <div className="mt-3">
        <span
          className={`text-xs px-2 py-0.5 rounded ${
            request.type === 'Preventive'
              ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
              : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
          }`}
        >
          {request.type}
        </span>
      </div>
    </motion.div>
  )
}

const EmptyColumnState = ({ columnId }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `empty-${columnId}`,
    data: {
      type: 'column',
      columnId,
    },
  })

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col items-center justify-center h-64 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-dashed transition-all ${
        isOver
          ? 'border-primary-400 dark:border-primary-500 bg-primary-50/50 dark:bg-primary-900/20'
          : 'border-gray-300 dark:border-gray-600'
      }`}
    >
      {/* TODO: Consider adding a Spline 3D empty state animation here */}
      <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-3">
        <Wrench className="w-8 h-8 text-gray-400 dark:text-gray-500" />
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400">No requests</p>
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Drop here to add</p>
    </div>
  )
}

export default KanbanBoard
