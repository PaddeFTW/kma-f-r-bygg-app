import { Link as RouterLink } from 'react-router-dom'
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@mui/material'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import VerticalLayout from '../../layouts/VerticalLayout'
import { useAuth } from '../../context/AuthContext'

const stats = [
  { title: 'Sales', value: '245k', icon: <TrendingUpIcon />, color: '#8C57FF' },
  { title: 'Users', value: '12.5k', icon: <PeopleOutlineIcon />, color: '#56CA00' },
  { title: 'Products', value: '1.54k', icon: <Inventory2OutlinedIcon />, color: '#FFB400' },
  { title: 'Revenue', value: '$88k', icon: <AccountBalanceWalletOutlinedIcon />, color: '#16B1FF' },
]

const activity = [
  {
    title: '12 Invoices have been paid',
    time: '12 min ago',
    color: '#FF4C51',
    desc: 'Invoices have been paid to the company',
    file: 'invoices.pdf',
  },
  {
    title: 'Client Meeting',
    time: '45 min ago',
    color: '#8C57FF',
    desc: 'Project meeting with john @10:15am',
    avatar: '/images/avatars/2.png',
  },
  {
    title: 'Create a new project for client',
    time: '2 days ago',
    color: '#16B1FF',
    desc: '6 team members in a project',
    avatars: ['/images/avatars/1.png', '/images/avatars/3.png', '/images/avatars/4.png'],
  },
]

const upcoming = [
  { day: '12', month: 'Jan', title: 'Design Review', meta: 'Business · 12:56 PM', color: '#8C57FF' },
  { day: '20', month: 'Jan', title: "Doctor's Appointment", meta: 'Personal · 10:00 AM', color: '#FF4C51' },
  { day: '22', month: 'Jan', title: 'Family Trip', meta: 'Holiday · All day', color: '#56CA00' },
  { day: '25', month: 'Jan', title: 'Monthly Meetup', meta: 'ETC · All day', color: '#16B1FF' },
]

function IconBox({ color, children }) {
  return (
    <Box
      sx={{
        width: 42,
        height: 42,
        borderRadius: 1.5,
        display: 'grid',
        placeItems: 'center',
        bgcolor: `${color}1F`,
        color,
        flexShrink: 0,
        '& svg': { fontSize: 22 },
      }}
    >
      {children}
    </Box>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const displayName =
    user?.user_metadata?.username ||
    user?.email?.split('@')[0] ||
    'John'

  return (
    <VerticalLayout>
      <Grid container spacing={6}>
        {/* Congratulations */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', position: 'relative', overflow: 'visible' }}>
            <CardContent sx={{ pr: { sm: 18 }, pb: { xs: 14, sm: 5 }, pt: 5, pl: 5 }}>
              <Typography variant="h5" sx={{ mb: 1 }}>
                Congratulations {displayName}! 🎉
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                Best seller of the month
              </Typography>
              <Typography variant="h4" color="primary.main" sx={{ mb: 0.5 }}>
                $42.8k
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                78% of target 🚀
              </Typography>
              <Button variant="contained" size="small">
                View Sales
              </Button>
            </CardContent>
            <Box
              component="img"
              src="/images/pages/trophy.png"
              alt=""
              sx={{
                position: 'absolute',
                right: 20,
                bottom: 0,
                height: 140,
                pointerEvents: 'none',
              }}
            />
          </Card>
        </Grid>

        {/* Transactions */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 5, '&:last-child': { pb: 5 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 6 }}>
                <Box>
                  <Typography variant="h5" sx={{ mb: 0.5 }}>
                    Transactions
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total 48.5% Growth 😎 this month
                  </Typography>
                </Box>
                <IconButton size="small" sx={{ color: 'text.secondary', alignSelf: 'flex-start' }}>
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              </Box>
              <Grid container spacing={4}>
                {stats.map((s) => (
                  <Grid item xs={6} sm={3} key={s.title}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      <IconBox color={s.color}>{s.icon}</IconBox>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {s.title}
                        </Typography>
                        <Typography variant="h5">{s.value}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Activity Timeline */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 5, '&:last-child': { pb: 5 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5 }}>
                <Typography variant="h5">Activity Timeline</Typography>
                <IconButton size="small" sx={{ color: 'text.secondary' }}>
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              </Box>
              <Box sx={{ position: 'relative', pl: 4 }}>
                {activity.map((item, i) => (
                  <Box key={item.title} sx={{ position: 'relative', pb: i === activity.length - 1 ? 0 : 5 }}>
                    {i !== activity.length - 1 && (
                      <Box
                        sx={{
                          position: 'absolute',
                          left: -23,
                          top: 12,
                          bottom: -8,
                          width: 2,
                          bgcolor: 'divider',
                        }}
                      />
                    )}
                    <Box
                      sx={{
                        position: 'absolute',
                        left: -28,
                        top: 4,
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        bgcolor: item.color,
                        boxShadow: (t) => `0 0 0 4px ${t.palette.background.paper}`,
                      }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mb: 0.5 }}>
                      <Typography variant="body1" fontWeight={500}>
                        {item.title}
                      </Typography>
                      <Typography variant="caption" color="text.disabled" noWrap>
                        {item.time}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {item.desc}
                    </Typography>
                    {item.file && (
                      <Box
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 1.5,
                          px: 2,
                          py: 1,
                          borderRadius: 1,
                          bgcolor: 'action.hover',
                        }}
                      >
                        <Box
                          sx={{
                            width: 28,
                            height: 28,
                            borderRadius: 0.75,
                            bgcolor: 'error.main',
                            color: '#fff',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: 11,
                            fontWeight: 700,
                          }}
                        >
                          PDF
                        </Box>
                        <Typography variant="body2">{item.file}</Typography>
                      </Box>
                    )}
                    {item.avatar && <Avatar src={item.avatar} sx={{ width: 32, height: 32 }} />}
                    {item.avatars && (
                      <Box sx={{ display: 'flex' }}>
                        {item.avatars.map((src) => (
                          <Avatar
                            key={src}
                            src={src}
                            sx={{
                              width: 32,
                              height: 32,
                              ml: -1,
                              border: '2px solid',
                              borderColor: 'background.paper',
                              '&:first-of-type': { ml: 0 },
                            }}
                          />
                        ))}
                      </Box>
                    )}
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Calendar Overview */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 5, '&:last-child': { pb: 5 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h5">Calendar Overview</Typography>
                <Button component={RouterLink} to="/apps/calendar" size="small">
                  View Calendar
                </Button>
              </Box>
              <List disablePadding>
                {upcoming.map((ev) => (
                  <ListItem
                    key={ev.title}
                    disableGutters
                    sx={{
                      py: 2,
                      px: 0,
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      '&:last-of-type': { borderBottom: 0 },
                    }}
                  >
                    <ListItemAvatar sx={{ minWidth: 64 }}>
                      <Box
                        sx={{
                          width: 46,
                          height: 50,
                          borderRadius: 1.5,
                          bgcolor: `${ev.color}1F`,
                          color: ev.color,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          lineHeight: 1.15,
                        }}
                      >
                        <Typography variant="caption" sx={{ fontWeight: 500, textTransform: 'uppercase' }}>
                          {ev.month}
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                          {ev.day}
                        </Typography>
                      </Box>
                    </ListItemAvatar>
                    <ListItemText
                      primary={ev.title}
                      secondary={ev.meta}
                      primaryTypographyProps={{ variant: 'body1', fontWeight: 500 }}
                      secondaryTypographyProps={{ variant: 'body2' }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </VerticalLayout>
  )
}
