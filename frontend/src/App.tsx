import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import Dashboard from './pages/Dashboard/Dashboard'
import Leads from './pages/Leads/Leads'
import Properties from './pages/Properties/Properties'
import Opportunities from './pages/Opportunities/Opportunities'
import Activities from './pages/Activities/Activities'
import Calendar from './pages/Calendar/Calendar'
import AdminPanel from './pages/Admin/AdminPanel'
import MainLayout from './layouts/MainLayout'

function App() {
  const { isAuthenticated } = useAuthStore()

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
      <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />

      {/* Protected Routes */}
      <Route
        path="/"
        element={isAuthenticated ? <MainLayout /> : <Navigate to="/login" />}
      >
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="leads" element={<Leads />} />
        <Route path="properties" element={<Properties />} />
        <Route path="opportunities" element={<Opportunities />} />
        <Route path="activities" element={<Activities />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="admin" element={<AdminPanel />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default App
