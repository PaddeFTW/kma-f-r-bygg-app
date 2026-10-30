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
import CompanyPage from './pages/company/CompanyPage'
import ProjectsList from './pages/projects/ProjectsList'
import ProjectDetail from './pages/projects/ProjectDetail'
import KvalitetsplanerList from './pages/kvalitetsplan/KvalitetsplanerList'
import KvalitetsplanDetail from './pages/kvalitetsplan/KvalitetsplanDetail'
import MiljoplanerList from './pages/miljoplan/MiljoplanerList'
import MiljoplanDetail from './pages/miljoplan/MiljoplanDetail'
import ArbetsmiljoplanerList from './pages/arbetsmiljoplan/ArbetsmiljoplanerList'
import ArbetsmiljoplanDetail from './pages/arbetsmiljoplan/ArbetsmiljoplanDetail'
import MiljoanalyserList from './pages/miljoanalys/MiljoanalyserList'
import MiljoanalysDetail from './pages/miljoanalys/MiljoanalysDetail'
import RivningsplanerList from './pages/rivningsplan/RivningsplanerList'
import RivningsplanDetail from './pages/rivningsplan/RivningsplanDetail'

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
                path="/company"
                element={
                  <ProtectedRoute>
                    <CompanyPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/projects"
                element={
                  <ProtectedRoute>
                    <ProjectsList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/projects/:id"
                element={
                  <ProtectedRoute>
                    <ProjectDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/kvalitetsplan"
                element={
                  <ProtectedRoute>
                    <KvalitetsplanerList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/kvalitetsplan/:id"
                element={
                  <ProtectedRoute>
                    <KvalitetsplanDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/miljoplan"
                element={
                  <ProtectedRoute>
                    <MiljoplanerList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/miljoplan/:id"
                element={
                  <ProtectedRoute>
                    <MiljoplanDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/arbetsmiljoplan"
                element={
                  <ProtectedRoute>
                    <ArbetsmiljoplanerList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/arbetsmiljoplan/:id"
                element={
                  <ProtectedRoute>
                    <ArbetsmiljoplanDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/miljoanalys"
                element={
                  <ProtectedRoute>
                    <MiljoanalyserList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/miljoanalys/:id"
                element={
                  <ProtectedRoute>
                    <MiljoanalysDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/rivningsplan"
                element={
                  <ProtectedRoute>
                    <RivningsplanerList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/rivningsplan/:id"
                element={
                  <ProtectedRoute>
                    <RivningsplanDetail />
                  </ProtectedRoute>
                }
              />
              {/* Mallsidor behålls för referens, ej i sidebar */}
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
