import { useEffect, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material'
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined'
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined'
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined'
import AddIcon from '@mui/icons-material/Add'
import VerticalLayout from '../../layouts/VerticalLayout'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'

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
  const [company, setCompany] = useState(null)
  const [projects, setProjects] = useState([])
  const [projectCount, setProjectCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const displayName =
    user?.user_metadata?.username || user?.email?.split('@')[0] || 'användare'

  useEffect(() => {
    let mounted = true

    const load = async () => {
      setLoading(true)
      setError('')

      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()

      if (!mounted) return

      if (companyError) {
        setError(companyError.message)
        setCompany(null)
        setProjects([])
        setLoading(false)
        return
      }

      setCompany(companyData)

      if (!companyData) {
        setProjects([])
        setProjectCount(0)
        setLoading(false)
        return
      }

      const [listResult, countResult] = await Promise.all([
        supabase
          .from('projects')
          .select('*')
          .eq('company_id', companyData.id)
          .order('created_at', { ascending: false })
          .limit(5),
        supabase
          .from('projects')
          .select('*', { count: 'exact', head: true })
          .eq('company_id', companyData.id),
      ])

      if (!mounted) return

      if (listResult.error) setError(listResult.error.message)
      else setProjects(listResult.data || [])

      if (countResult.error) setError(countResult.error.message)
      else setProjectCount(countResult.count || 0)

      setLoading(false)
    }

    if (user?.id) load()
    return () => {
      mounted = false
    }
  }, [user?.id])

  return (
    <VerticalLayout>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2, flexWrap: 'wrap' }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 600, mb: 0.5 }}>
                Välkommen, {displayName}
              </Typography>
              <Typography color="text.secondary">
                Översikt för KMA för bygg – företag och projekt
              </Typography>
            </Box>
            <Stack direction="row" spacing={1.5} flexWrap="wrap">
              <Button
                component={RouterLink}
                to="/company"
                variant="outlined"
                startIcon={<BusinessOutlinedIcon />}
              >
                {company ? 'Redigera företag' : 'Skapa företag'}
              </Button>
              <Button
                component={RouterLink}
                to="/templates"
                variant="outlined"
                startIcon={<BookmarkBorderOutlinedIcon />}
                disabled={!company}
              >
                Mallar
              </Button>
              <Button
                component={RouterLink}
                to="/projects"
                variant="contained"
                startIcon={<AddIcon />}
                disabled={!company}
              >
                Nytt projekt
              </Button>
            </Stack>
          </Box>
        </Grid>

        {error && (
          <Grid item xs={12}>
            <Alert severity="error">{error}</Alert>
          </Grid>
        )}

        {loading ? (
          <Grid item xs={12}>
            <Box sx={{ py: 8, display: 'grid', placeItems: 'center' }}>
              <CircularProgress />
            </Box>
          </Grid>
        ) : (
          <>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ p: 5, '&:last-child': { pb: 5 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
                    <IconBox color="#8C57FF">
                      <BusinessOutlinedIcon />
                    </IconBox>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Företag
                      </Typography>
                      <Typography variant="h5">{company?.name || 'Ej skapat'}</Typography>
                    </Box>
                  </Box>
                  {company ? (
                    <Stack spacing={1}>
                      <Typography variant="body2" color="text.secondary">
                        VD
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {company.ceo_name || '—'}
                      </Typography>
                      {(company.city || company.org_number) && (
                        <Typography variant="body2" color="text.secondary" sx={{ pt: 1 }}>
                          {[company.org_number, company.city].filter(Boolean).join(' · ')}
                        </Typography>
                      )}
                      <Button component={RouterLink} to="/company" size="small" sx={{ alignSelf: 'flex-start', mt: 2 }}>
                        Öppna företagskonto
                      </Button>
                    </Stack>
                  ) : (
                    <Stack spacing={2}>
                      <Typography variant="body2" color="text.secondary">
                        Skapa ditt företagskonto för att komma igång med projekt och KMA.
                      </Typography>
                      <Button component={RouterLink} to="/company" variant="contained" size="small">
                        Skapa företag
                      </Button>
                    </Stack>
                  )}
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={8}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ p: 5, '&:last-child': { pb: 5 } }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      <IconBox color="#16B1FF">
                        <FolderOutlinedIcon />
                      </IconBox>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Projekt
                        </Typography>
                        <Typography variant="h5">{projectCount} st</Typography>
                      </Box>
                    </Box>
                    <Button component={RouterLink} to="/projects" size="small" disabled={!company}>
                      Visa alla
                    </Button>
                  </Box>

                  {!company ? (
                    <Typography color="text.secondary">Skapa företag först för att lägga till projekt.</Typography>
                  ) : projects.length === 0 ? (
                    <Stack spacing={2}>
                      <Typography color="text.secondary">Inga projekt ännu.</Typography>
                      <Button
                        component={RouterLink}
                        to="/projects"
                        variant="outlined"
                        size="small"
                        startIcon={<AddIcon />}
                        sx={{ alignSelf: 'flex-start' }}
                      >
                        Skapa projekt
                      </Button>
                    </Stack>
                  ) : (
                    <List disablePadding>
                      {projects.map((project) => (
                        <ListItem
                          key={project.id}
                          component={RouterLink}
                          to={`/projects/${project.id}`}
                          disableGutters
                          sx={{
                            py: 2,
                            px: 0,
                            textDecoration: 'none',
                            color: 'inherit',
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                            '&:last-of-type': { borderBottom: 0 },
                            '&:hover': { bgcolor: 'action.hover' },
                          }}
                        >
                          <ListItemText
                            primary={project.property_designation}
                            secondary={
                              [project.city, project.client_name, project.contract_form]
                                .filter(Boolean)
                                .join(' · ') || 'Ingen plats angiven'
                            }
                            primaryTypographyProps={{ variant: 'body1', fontWeight: 500 }}
                            secondaryTypographyProps={{ variant: 'body2' }}
                          />
                          <Typography variant="caption" color="text.disabled" noWrap>
                            {new Date(project.created_at).toLocaleDateString('sv-SE')}
                          </Typography>
                        </ListItem>
                      ))}
                    </List>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </>
        )}
      </Grid>
    </VerticalLayout>
  )
}
