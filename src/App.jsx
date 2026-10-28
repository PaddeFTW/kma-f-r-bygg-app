import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom'
import { ThemeModeProvider } from './context/ThemeModeContext'
import { AuthProvider } from './context/AuthContext'
import { UsersProvider } from './context/UsersContext'
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './pages/dashboards/Dashboard'
import UsersList from './pages/users/UsersList'
import UserDetail from './pages/users/UserDetail'
import Calendar from './pages/apps/calendar/Calendar'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import UppgifterList from './pages/uppgifter/UppgifterList'
import UppgiftDetail from './pages/uppgifter/UppgiftDetail'

export default function App() {
  return (
    <ThemeModeProvider>
      <AuthProvider>
        <UsersProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/users"
                element={
                  <ProtectedRoute>
                    <UsersList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/users/:id"
                element={
                  <ProtectedRoute>
                    <UserDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/apps/calendar"
                element={
                  <ProtectedRoute>
                    <Calendar />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/uppgifter"
                element={
                  <ProtectedRoute>
                    <UppgifterList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/uppgifter/:id"
                element={
                  <ProtectedRoute>
                    <UppgiftDetail />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </UsersProvider>
      </AuthProvider>
    </ThemeModeProvider>
  )
}
