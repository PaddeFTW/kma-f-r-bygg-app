import { useState } from 'react'
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom'
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Tooltip,
  useMediaQuery,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import MenuIcon from '@mui/icons-material/Menu'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined'
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined'
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined'
import RecyclingOutlinedIcon from '@mui/icons-material/RecyclingOutlined'
import HealthAndSafetyOutlinedIcon from '@mui/icons-material/HealthAndSafetyOutlined'
import ArchitectureOutlinedIcon from '@mui/icons-material/ArchitectureOutlined'
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined'
import ChecklistOutlinedIcon from '@mui/icons-material/ChecklistOutlined'
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined'
import PrecisionManufacturingOutlinedIcon from '@mui/icons-material/PrecisionManufacturingOutlined'
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined'
import ScienceOutlinedIcon from '@mui/icons-material/ScienceOutlined'
import EmergencyOutlinedIcon from '@mui/icons-material/EmergencyOutlined'
import ContactPhoneOutlinedIcon from '@mui/icons-material/ContactPhoneOutlined'
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined'
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined'
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined'
import HomeRepairServiceOutlinedIcon from '@mui/icons-material/HomeRepairServiceOutlined'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import MonitorHeartOutlinedIcon from '@mui/icons-material/MonitorHeartOutlined'
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined'
import LogoutIcon from '@mui/icons-material/Logout'
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined'
import { useThemeMode } from '../context/ThemeModeContext'
import { useAuth } from '../context/AuthContext'
import MaterioLogo from '../components/auth/MaterioLogo'

const drawerWidth = 260

const menuItems = [
  { text: 'Dashboard', path: '/', icon: <DashboardOutlinedIcon /> },
  { text: 'Företag', path: '/company', icon: <BusinessOutlinedIcon /> },
  { text: 'Projekt', path: '/projects', icon: <FolderOutlinedIcon /> },
  { text: 'Kvalitetsplan', path: '/kvalitetsplan', icon: <VerifiedOutlinedIcon /> },
  { text: 'Miljöplan', path: '/miljoplan', icon: <RecyclingOutlinedIcon /> },
  { text: 'Arbetsmiljöplan', path: '/arbetsmiljoplan', icon: <HealthAndSafetyOutlinedIcon /> },
  { text: 'Bygghandlingar', path: '/bygghandlingar', icon: <ArchitectureOutlinedIcon /> },
  { text: 'Kontrollplan', path: '/kontrollplan', icon: <FactCheckOutlinedIcon /> },
  { text: 'Egenkontroll', path: '/egenkontroll', icon: <ChecklistOutlinedIcon /> },
  { text: 'Egenkontroll UE', path: '/egenkontroll-ue', icon: <AssignmentTurnedInOutlinedIcon /> },
  { text: 'Maskiner UE', path: '/maskiner-ue', icon: <PrecisionManufacturingOutlinedIcon /> },
  { text: 'ÄTA / Avvikelse', path: '/ata', icon: <ReportProblemOutlinedIcon /> },
  { text: 'Säkerhetsdatablad', path: '/sakerhetsdatablad', icon: <ScienceOutlinedIcon /> },
  { text: 'Nödlägesberedskap', path: '/nodlage', icon: <EmergencyOutlinedIcon /> },
  { text: 'Anhöriglista', path: '/anhoriglista', icon: <ContactPhoneOutlinedIcon /> },
  { text: 'Krisberedskap', path: '/krisberedskap', icon: <GroupsOutlinedIcon /> },
  { text: 'Skyddsrond', path: '/skyddsrond', icon: <SecurityOutlinedIcon /> },
  { text: 'Ekonomi', path: '/ekonomi', icon: <AccountBalanceOutlinedIcon /> },
  { text: 'Arbetsplatsbesiktning', path: '/arbetsplatsbesiktning', icon: <HomeRepairServiceOutlinedIcon /> },
  { text: 'Slutbesiktning', path: '/slutbesiktning', icon: <DescriptionOutlinedIcon /> },
  { text: 'Uppföljning AM', path: '/uppfoljning-am', icon: <MonitorHeartOutlinedIcon /> },
  { text: 'Uppföljning Kvalitet', path: '/uppfoljning-kvalitet', icon: <WorkspacePremiumOutlinedIcon /> },
]

export default function VerticalLayout({ children }) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'))
  const [mobileOpen, setMobileOpen] = useState(false)
  const [desktopOpen, setDesktopOpen] = useState(true)
  const location = useLocation()
  const navigate = useNavigate()
  const { mode, toggleMode } = useThemeMode()
  const { user, signOut } = useAuth()

  const handleDrawerToggle = () => {
    if (isMobile) setMobileOpen((v) => !v)
    else setDesktopOpen((v) => !v)
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  const isSelected = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  const drawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Toolbar sx={{ px: 3, minHeight: '64px !important', justifyContent: 'flex-start' }}>
        <MaterioLogo to="/" sx={{ mb: 0 }} />
      </Toolbar>

      <Box sx={{ px: 2, pt: 1, pb: 1 }}>
        <Typography
          variant="overline"
          sx={{ px: 2, color: 'text.disabled', letterSpacing: '0.4px', display: 'block' }}
        >
          KMA för bygg
        </Typography>
      </Box>

      <List sx={{ flex: 1, py: 0, px: 1.5 }}>
        {menuItems.map((item) => {
          const selected = isSelected(item.path)
          return (
            <ListItemButton
              key={item.path}
              component={RouterLink}
              to={item.path}
              selected={selected}
              onClick={() => isMobile && setMobileOpen(false)}
              sx={{
                mb: 0.5,
                borderRadius: '50px',
                minHeight: 44,
                px: 2.5,
                color: selected ? '#fff' : 'text.primary',
                ...(selected && {
                  background: 'linear-gradient(72.47deg, #8C57FF 22.16%, rgba(140, 87, 255, 0.7) 76.47%)',
                  boxShadow: '0px 2px 6px 0px rgba(140, 87, 255, 0.42)',
                  '&:hover': {
                    background: 'linear-gradient(72.47deg, #8C57FF 22.16%, rgba(140, 87, 255, 0.7) 76.47%)',
                  },
                  '&.Mui-selected': {
                    background: 'linear-gradient(72.47deg, #8C57FF 22.16%, rgba(140, 87, 255, 0.7) 76.47%)',
                    color: '#fff',
                    '&:hover': {
                      background: 'linear-gradient(72.47deg, #8C57FF 22.16%, rgba(140, 87, 255, 0.7) 76.47%)',
                    },
                    '& .MuiListItemIcon-root': { color: '#fff' },
                  },
                }),
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 36,
                  color: selected ? '#fff' : 'text.secondary',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{ fontWeight: selected ? 500 : 400, fontSize: '0.9375rem' }}
              />
            </ListItemButton>
          )
        })}
      </List>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{
          width: { lg: desktopOpen ? `calc(100% - ${drawerWidth}px)` : '100%' },
          ml: { lg: desktopOpen ? `${drawerWidth}px` : 0 },
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar sx={{ gap: 1 }}>
          <IconButton color="inherit" edge="start" onClick={handleDrawerToggle}>
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <Tooltip title={mode === 'light' ? 'Mörkt tema' : 'Ljust tema'}>
            <IconButton onClick={toggleMode} color="inherit">
              {mode === 'light' ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Notiser">
            <IconButton color="inherit">
              <NotificationsNoneOutlinedIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Logga ut">
            <IconButton onClick={handleSignOut} color="inherit">
              <LogoutIcon />
            </IconButton>
          </Tooltip>
          <Avatar
            sx={{
              width: 38,
              height: 38,
              bgcolor: 'primary.main',
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            {(user?.email?.[0] || 'U').toUpperCase()}
          </Avatar>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { lg: desktopOpen ? drawerWidth : 0 }, flexShrink: { lg: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', lg: 'none' },
            '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="persistent"
          open={desktopOpen}
          sx={{
            display: { xs: 'none', lg: 'block' },
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              bgcolor: 'background.paper',
              borderRight: 0,
              boxShadow: theme.palette.mode === 'dark'
                ? '0px 3px 12px rgba(19, 17, 32, 0.4)'
                : '0px 3px 12px rgba(47, 43, 61, 0.14)',
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 3, md: 6 },
          width: { lg: desktopOpen ? `calc(100% - ${drawerWidth}px)` : '100%' },
          minHeight: '100vh',
          bgcolor: 'background.default',
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  )
}
