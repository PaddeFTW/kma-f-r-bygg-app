import { useMemo, useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined'
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined'
import PersonOffOutlinedIcon from '@mui/icons-material/PersonOffOutlined'
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined'
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined'
import DrawOutlinedIcon from '@mui/icons-material/DrawOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
import VerticalLayout from '../../layouts/VerticalLayout'
import { useUsers } from '../../context/UsersContext'
import {
  PLANS,
  ROLES,
  STATUS_OPTIONS,
  roleMeta,
  statusColor,
  statusLabel,
  userStats,
} from './usersData'

const emptyForm = {
  fullName: '',
  email: '',
  role: 'Subscriber',
  plan: 'Basic',
  billing: 'Auto Debit',
  status: 'active',
  username: '',
  phone: '',
  company: '',
  country: '',
  avatar: '/images/avatars/1.png',
}

const roleIcons = {
  Admin: ShieldOutlinedIcon,
  Author: EditNoteOutlinedIcon,
  Editor: DrawOutlinedIcon,
  Maintainer: SettingsOutlinedIcon,
  Subscriber: AccountCircleOutlinedIcon,
}

const statIcons = [
  <GroupOutlinedIcon key="t" />,
  <PersonAddAltOutlinedIcon key="p" />,
  <PersonOutlineIcon key="a" />,
  <PersonOffOutlinedIcon key="n" />,
]

function RoleCell({ role }) {
  const meta = roleMeta[role] || roleMeta.Subscriber
  const Icon = roleIcons[role] || AccountCircleOutlinedIcon
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <Box
        sx={{
          width: 30,
          height: 30,
          borderRadius: '50%',
          display: 'grid',
          placeItems: 'center',
          bgcolor: `${meta.color}1F`,
          color: meta.color,
          '& svg': { fontSize: 18 },
        }}
      >
        <Icon fontSize="inherit" />
      </Box>
      <Typography variant="body2">{role}</Typography>
    </Box>
  )
}

function StatusChip({ status }) {
  return (
    <Chip
      size="small"
      label={statusLabel[status]}
      color={statusColor[status]}
      sx={{
        fontWeight: 500,
        borderRadius: '4px',
        height: 24,
        '& .MuiChip-label': { px: 1.5 },
      }}
    />
  )
}

export default function UsersList() {
  const { users, addUser, deleteUser } = useUsers()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [planFilter, setPlanFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return users.filter((u) => {
      if (roleFilter && u.role !== roleFilter) return false
      if (planFilter && u.plan !== planFilter) return false
      if (statusFilter && u.status !== statusFilter) return false
      if (!q) return true
      return (
        u.fullName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q)
      )
    })
  }, [users, query, roleFilter, planFilter, statusFilter])

  const handleCreate = () => {
    if (!form.fullName.trim() || !form.email.trim()) return
    const id = addUser({
      ...form,
      username: form.username || `@${form.fullName.trim().toLowerCase().replace(/\s+/g, '')}`,
    })
    setOpen(false)
    setForm(emptyForm)
    navigate(`/users/${id}`)
  }

  return (
    <VerticalLayout>
      <Grid container spacing={6} sx={{ mb: 6 }}>
        {userStats.map((stat, i) => (
          <Grid item xs={12} sm={6} md={3} key={stat.title}>
            <Card>
              <CardContent sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, py: 4, '&:last-child': { pb: 4 } }}>
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    borderRadius: 1.5,
                    display: 'grid',
                    placeItems: 'center',
                    bgcolor: `${stat.color}1F`,
                    color: stat.color,
                    flexShrink: 0,
                    '& svg': { fontSize: 24 },
                  }}
                >
                  {statIcons[i]}
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="h5" sx={{ fontWeight: 500, lineHeight: 1.2 }}>
                    {stat.stats}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.title}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                    {stat.trendDir === 'up' ? (
                      <TrendingUpIcon sx={{ fontSize: 16, color: 'success.main' }} />
                    ) : (
                      <TrendingDownIcon sx={{ fontSize: 16, color: 'error.main' }} />
                    )}
                    <Typography
                      variant="caption"
                      sx={{ color: stat.trendDir === 'up' ? 'success.main' : 'error.main', fontWeight: 500 }}
                    >
                      {stat.trend}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 4,
            p: 5,
            pb: 3,
          }}
        >
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Select Role</InputLabel>
            <Select
              label="Select Role"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <MenuItem value="">Select Role</MenuItem>
              {ROLES.map((r) => (
                <MenuItem key={r} value={r}>
                  {r}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Select Plan</InputLabel>
            <Select
              label="Select Plan"
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
            >
              <MenuItem value="">Select Plan</MenuItem>
              {PLANS.map((p) => (
                <MenuItem key={p} value={p}>
                  {p}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Select Status</InputLabel>
            <Select
              label="Select Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="">Select Status</MenuItem>
              {STATUS_OPTIONS.map((s) => (
                <MenuItem key={s} value={s}>
                  {statusLabel[s]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box sx={{ flex: 1 }} />
          <TextField
            size="small"
            placeholder="Search User"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            sx={{ minWidth: 200 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
            Add New User
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  '& .MuiTableCell-head': {
                    bgcolor: 'action.hover',
                    color: 'text.secondary',
                    fontWeight: 500,
                    fontSize: '0.8125rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.2px',
                    borderBottom: 'none',
                    py: 2,
                  },
                }}
              >
                <TableCell>User</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Plan</TableCell>
                <TableCell>Billing</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((user) => (
                <TableRow
                  key={user.id}
                  hover
                  sx={{ cursor: 'pointer', '&:last-child td': { border: 0 } }}
                  onClick={() => navigate(`/users/${user.id}`)}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                      <Avatar src={user.avatar} alt={user.fullName} sx={{ width: 38, height: 38 }} />
                      <Box>
                        <Typography variant="body2" fontWeight={500} color="text.primary">
                          {user.fullName}
                        </Typography>
                        <Typography variant="body2" color="text.disabled">
                          {user.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <RoleCell role={user.role} />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{user.plan || '—'}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{user.billing || '—'}</Typography>
                  </TableCell>
                  <TableCell>
                    <StatusChip status={user.status} />
                  </TableCell>
                  <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                    <IconButton
                      size="small"
                      component={RouterLink}
                      to={`/users/${user.id}`}
                      sx={{ color: 'text.secondary' }}
                    >
                      <EditOutlinedIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" sx={{ color: 'text.secondary' }} onClick={() => deleteUser(user.id)}>
                      <DeleteOutlineOutlinedIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {!filtered.length && (
                <TableRow>
                  <TableCell colSpan={6}>
                    <Typography color="text.secondary" align="center" sx={{ py: 6 }}>
                      No users found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 4, pt: '16px !important' }}>
          <TextField
            label="Full Name"
            value={form.fullName}
            onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
            required
            fullWidth
          />
          <TextField
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            required
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel>Role</InputLabel>
            <Select label="Role" value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}>
              {ROLES.map((r) => (
                <MenuItem key={r} value={r}>
                  {r}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Plan</InputLabel>
            <Select label="Plan" value={form.plan} onChange={(e) => setForm((f) => ({ ...f, plan: e.target.value }))}>
              {PLANS.map((p) => (
                <MenuItem key={p} value={p}>
                  {p}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              label="Status"
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
            >
              {STATUS_OPTIONS.map((s) => (
                <MenuItem key={s} value={s}>
                  {statusLabel[s]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ px: 6, pb: 4 }}>
          <Button onClick={() => setOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button variant="contained" onClick={handleCreate}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </VerticalLayout>
  )
}
