import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Dashboard from './pages/Dashboard'
import KanbanBoard from './pages/KanbanBoard'
import CalendarView from './pages/CalendarView'
import EquipmentList from './pages/EquipmentList'
import RequestList from './pages/RequestList'
import Reports from './pages/Reports'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/kanban" element={<KanbanBoard />} />
                  <Route path="/calendar" element={<CalendarView />} />
                  <Route path="/equipment" element={<EquipmentList />} />
                  <Route path="/requests" element={<RequestList />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  )
}

export default App

