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
import BygghandlingarList from './pages/bygghandlingar/BygghandlingarList'
import BygghandlingDetail from './pages/bygghandlingar/BygghandlingDetail'
import KontrollplanerList from './pages/kontrollplan/KontrollplanerList'
import KontrollplanDetail from './pages/kontrollplan/KontrollplanDetail'
import EgenkontrollerList from './pages/egenkontroll/EgenkontrollerList'
import EgenkontrollDetail from './pages/egenkontroll/EgenkontrollDetail'
import EgenkontrollerUeList from './pages/egenkontroll-ue/EgenkontrollerUeList'
import EgenkontrollUeDetail from './pages/egenkontroll-ue/EgenkontrollUeDetail'
import MaskinerUeList from './pages/maskiner-ue/MaskinerUeList'
import MaskinUeDetail from './pages/maskiner-ue/MaskinUeDetail'
import AtaList from './pages/ata/AtaList'
import AvvikelseDetail from './pages/ata/AvvikelseDetail'
import AtaDetail from './pages/ata/AtaDetail'
import AtaListaDetail from './pages/ata/AtaListaDetail'
import SakerhetsdatabladList from './pages/sakerhetsdatablad/SakerhetsdatabladList'
import SakerhetsdatabladDetail from './pages/sakerhetsdatablad/SakerhetsdatabladDetail'
import NodlageList from './pages/nodlage/NodlageList'
import NodlageDetail from './pages/nodlage/NodlageDetail'

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
                path="/bygghandlingar"
                element={
                  <ProtectedRoute>
                    <BygghandlingarList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/bygghandlingar/:id"
                element={
                  <ProtectedRoute>
                    <BygghandlingDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/kontrollplan"
                element={
                  <ProtectedRoute>
                    <KontrollplanerList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/kontrollplan/:id"
                element={
                  <ProtectedRoute>
                    <KontrollplanDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/egenkontroll"
                element={
                  <ProtectedRoute>
                    <EgenkontrollerList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/egenkontroll/:id"
                element={
                  <ProtectedRoute>
                    <EgenkontrollDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/egenkontroll-ue"
                element={
                  <ProtectedRoute>
                    <EgenkontrollerUeList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/egenkontroll-ue/:id"
                element={
                  <ProtectedRoute>
                    <EgenkontrollUeDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/maskiner-ue"
                element={
                  <ProtectedRoute>
                    <MaskinerUeList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/maskiner-ue/:id"
                element={
                  <ProtectedRoute>
                    <MaskinUeDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ata"
                element={
                  <ProtectedRoute>
                    <AtaList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ata/avvikelser/:id"
                element={
                  <ProtectedRoute>
                    <AvvikelseDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ata/ata/:id"
                element={
                  <ProtectedRoute>
                    <AtaDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ata/ata-lista/:id"
                element={
                  <ProtectedRoute>
                    <AtaListaDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/sakerhetsdatablad"
                element={
                  <ProtectedRoute>
                    <SakerhetsdatabladList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/sakerhetsdatablad/:id"
                element={
                  <ProtectedRoute>
                    <SakerhetsdatabladDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/nodlage"
                element={
                  <ProtectedRoute>
                    <NodlageList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/nodlage/:id"
                element={
                  <ProtectedRoute>
                    <NodlageDetail />
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
