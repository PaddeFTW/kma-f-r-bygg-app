import { useEffect, useState } from 'react'
import { Link as RouterLink, Navigate, useNavigate, useParams } from 'react-router-dom'
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import VerticalLayout from '../../layouts/VerticalLayout'
import { useUsers } from '../../context/UsersContext'
import { PLANS, ROLES, STATUS_OPTIONS, roleMeta, statusColor, statusLabel } from './usersData'

export default function UserDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getUser, updateUser, deleteUser } = useUsers()
  const user = getUser(id)
  const [form, setForm] = useState(user)

  useEffect(() => {
    setForm(user)
  }, [user])

  if (!user) {
    return <Navigate to="/users" replace />
  }

  const handleSave = () => {
    updateUser(id, form)
    navigate('/users')
  }

  const handleDelete = () => {
    deleteUser(id)
    navigate('/users')
  }

  const meta = roleMeta[form.role] || roleMeta.Subscriber

  return (
    <VerticalLayout>
      <Button component={RouterLink} to="/users" startIcon={<ArrowBackIcon />} sx={{ mb: 4 }}>
        Back to list
      </Button>

      <Grid container spacing={6}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center', pt: 8, pb: 6 }}>
              <Avatar
                src={form.avatar}
                alt={form.fullName}
                sx={{ width: 120, height: 120, mx: 'auto', mb: 4 }}
              />
              <Typography variant="h5" sx={{ mb: 0.5 }}>
                {form.fullName}
              </Typography>
              <Chip
                size="small"
                label={form.role}
                sx={{
                  mb: 4,
                  fontWeight: 500,
                  borderRadius: '4px',
                  bgcolor: `${meta.color}1F`,
                  color: meta.color,
                }}
              />

              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 6, mb: 6 }}>
                <Box>
                  <Typography variant="h6">1.23k</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Task Done
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h6">568</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Project Done
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ textAlign: 'left', px: 2 }}>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  Details
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <DetailRow label="Username" value={form.username} />
                <DetailRow label="Billing Email" value={form.email} />
                <DetailRow label="Status">
                  <Chip
                    size="small"
                    label={statusLabel[form.status]}
                    color={statusColor[form.status]}
                    sx={{ fontWeight: 500, borderRadius: '4px', height: 24 }}
                  />
                </DetailRow>
                <DetailRow label="Role" value={form.role} />
                <DetailRow label="Tax ID" value="Tax-8894" />
                <DetailRow label="Contact" value={form.phone || '—'} />
                <DetailRow label="Language" value="English" />
                <DetailRow label="Country" value={form.country || '—'} />
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 6 }}>
                <Button variant="contained" onClick={handleSave}>
                  Edit
                </Button>
                <Button variant="outlined" color="error" onClick={handleDelete}>
                  Suspend
                </Button>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ mt: 6 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Plan Overview
              </Typography>
              <Box
                sx={{
                  p: 4,
                  borderRadius: 1.5,
                  bgcolor: (t) => (t.palette.mode === 'dark' ? 'rgba(140,87,255,0.12)' : 'rgba(140,87,255,0.08)'),
                  mb: 3,
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Days
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    26 of 30 Days
                  </Typography>
                </Box>
                <Box
                  sx={{
                    height: 6,
                    borderRadius: 1,
                    bgcolor: 'action.hover',
                    overflow: 'hidden',
                    mb: 1,
                  }}
                >
                  <Box sx={{ width: '86%', height: '100%', bgcolor: 'primary.main' }} />
                </Box>
                <Typography variant="caption" color="text.disabled">
                  4 days remaining
                </Typography>
              </Box>
              <Typography variant="body2" fontWeight={500} sx={{ mb: 0.5 }}>
                {form.plan || 'Basic'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Enjoy unlimited access and exclusive features with our {form.plan || 'Basic'} plan.
              </Typography>
              <Button fullWidth variant="contained">
                Upgrade Plan
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardContent sx={{ p: 6 }}>
              <Typography variant="h5" sx={{ mb: 4 }}>
                Edit User Information
              </Typography>
              <Grid container spacing={4}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={form.fullName}
                    onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Username"
                    value={form.username}
                    onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Billing Email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Contact"
                    value={form.phone || ''}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Role</InputLabel>
                    <Select
                      label="Role"
                      value={form.role}
                      onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                    >
                      {ROLES.map((r) => (
                        <MenuItem key={r} value={r}>
                          {r}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
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
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Plan</InputLabel>
                    <Select
                      label="Plan"
                      value={form.plan || 'Basic'}
                      onChange={(e) => setForm((f) => ({ ...f, plan: e.target.value }))}
                    >
                      {PLANS.map((p) => (
                        <MenuItem key={p} value={p}>
                          {p}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Company"
                    value={form.company || ''}
                    onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Country"
                    value={form.country || ''}
                    onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
                  />
                </Grid>
              </Grid>

              <Box sx={{ display: 'flex', gap: 3, mt: 6, alignItems: 'center' }}>
                <Button variant="contained" startIcon={<CheckCircleOutlineIcon />} onClick={handleSave}>
                  Save Changes
                </Button>
                <Button variant="outlined" color="secondary" onClick={() => setForm(user)}>
                  Reset
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </VerticalLayout>
  )
}

function DetailRow({ label, value, children }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 110 }}>
        {label}:
      </Typography>
      {children || (
        <Typography variant="body2" fontWeight={500}>
          {value}
        </Typography>
      )}
    </Box>
  )
}
