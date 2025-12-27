import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Dashboard from './pages/Dashboard'
import KanbanBoard from './pages/KanbanBoard'
import CalendarView from './pages/CalendarView'
import EquipmentList from './pages/EquipmentList'
import RequestList from './pages/RequestList'
import Reports from './pages/Reports'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/kanban" element={<KanbanBoard />} />
          <Route path="/calendar" element={<CalendarView />} />
          <Route path="/equipment" element={<EquipmentList />} />
          <Route path="/requests" element={<RequestList />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App

