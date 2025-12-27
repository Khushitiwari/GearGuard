import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  KanbanSquare,
  Calendar,
  Wrench,
  FileText,
  ChevronLeft,
  ChevronRight,
  BarChart3,
} from 'lucide-react'

const menuItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/kanban', icon: KanbanSquare, label: 'Kanban Board' },
  { path: '/calendar', icon: Calendar, label: 'Calendar' },
  { path: '/equipment', icon: Wrench, label: 'Equipment' },
  { path: '/requests', icon: FileText, label: 'Requests' },
  { path: '/reports', icon: BarChart3, label: 'Reports' },
]

const Sidebar = ({ isOpen, onToggle }) => {
  return (
    <>
      <motion.aside
        initial={false}
        animate={{
          width: isOpen ? '256px' : '80px',
        }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col h-screen fixed left-0 top-0 z-40 shadow-sm"
      >
        {/* Logo/Brand */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <Wrench className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-gray-900 dark:text-gray-100 text-lg">GearGuard</span>
            </motion.div>
          )}
          {!isOpen && (
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center mx-auto">
              <Wrench className="w-5 h-5 text-white" />
            </div>
          )}
          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle sidebar"
          >
            {isOpen ? (
              <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 scrollbar-hide">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 font-medium'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
                      }`
                    }
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {isOpen && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-sm"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </NavLink>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Footer */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 border-t border-gray-200 dark:border-gray-700"
          >
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
              <p className="font-medium text-gray-700 dark:text-gray-300">GearGuard</p>
              <p>Maintenance Tracker</p>
            </div>
          </motion.div>
        )}
      </motion.aside>
      {/* Spacer for fixed sidebar */}
      <div style={{ width: isOpen ? '256px' : '80px' }} className="flex-shrink-0" />
    </>
  )
}

export default Sidebar

