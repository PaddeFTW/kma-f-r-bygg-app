import { useEffect, useMemo, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Link,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import {
  KB_AFS_2023_3_URL,
  SARSKILDA_RISKER_PUNKTER,
  SARSKILDA_RISKER_SVAR_OPTIONS,
  buildAmpPrefillFromRisker,
  getRiskHelper,
  rowsRequireAmp,
  sarskildaRiskerDefaults,
} from '../../lib/sarskildaRisker'

/**
 * 13-punktschecklista AFS 2023:3 11 kap. 12 §.
 * Ja på någon punkt → AMP krävs.
 */
export default function ProjectSarskildaRiskerSection({ projectId, companyId, onAmpRequiredChange }) {
  const { user } = useAuth()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  const ampRequired = useMemo(() => rowsRequireAmp(rows), [rows])

  useEffect(() => {
    onAmpRequiredChange?.(ampRequired)
  }, [ampRequired, onAmpRequiredChange])

  useEffect(() => {
    let mounted = true

    const load = async () => {
      setLoading(true)
      setError('')
      const { data, error: fetchError } = await supabase
        .from('project_sarskilda_risker')
        .select('*')
        .eq('project_id', projectId)
        .order('sort_order', { ascending: true })

      if (!mounted) return

      if (fetchError) {
        setError(
          fetchError.message?.includes('project_sarskilda_risker')
            ? 'Tabellen project_sarskilda_risker saknas. Kör migration 032_bas_sarskilda_risker.sql.'
            : fetchError.message,
        )
        setRows(sarskildaRiskerDefaults())
        setLoading(false)
        return
      }

      if (!data?.length) {
        setRows(sarskildaRiskerDefaults())
      } else {
        const byNr = new Map(data.map((r) => [r.punkt_nr, r]))
        setRows(
          SARSKILDA_RISKER_PUNKTER.map((p, index) => {
            const existing = byNr.get(p.punkt_nr)
            return {
              id: existing?.id,
              _key: existing?.id || `risk-${p.punkt_nr}`,
              punkt_nr: p.punkt_nr,
              benamning: existing?.benamning || p.benamning,
              svar: existing?.svar || '',
              atgard: existing?.atgard || '',
              sort_order: existing?.sort_order || index + 1,
            }
          }),
        )
      }
      setLoading(false)
    }

    if (projectId) load()
    return () => {
      mounted = false
    }
  }, [projectId])

  const handleChange = (punktNr, field) => (event) => {
    const value = event.target.value
    setRows((prev) =>
      prev.map((r) => (r.punkt_nr === punktNr ? { ...r, [field]: value } : r)),
    )
    setSaved(false)
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setSaved(false)

    try {
      for (const row of rows) {
        const payload = {
          user_id: user.id,
          company_id: companyId,
          project_id: projectId,
          sort_order: row.sort_order,
          punkt_nr: row.punkt_nr,
          benamning: row.benamning,
          svar: row.svar || '',
          atgard: (row.atgard || '').trim() || null,
          updated_at: new Date().toISOString(),
        }

        if (row.id) {
          const { error: updateError } = await supabase
            .from('project_sarskilda_risker')
            .update(payload)
            .eq('id', row.id)
          if (updateError) throw new Error(updateError.message)
        } else {
          const { data, error: insertError } = await supabase
            .from('project_sarskilda_risker')
            .insert(payload)
            .select()
            .single()
          if (insertError) throw new Error(insertError.message)
          row.id = data.id
        }
      }

      // Förifyll AMP om den finns och saknar risktext
      if (rowsRequireAmp(rows)) {
        const prefill = buildAmpPrefillFromRisker(rows)
        const { data: amps } = await supabase
          .from('arbetsmiljoplaner')
          .select('id, riskbedomning_anteckningar')
          .eq('project_id', projectId)

        for (const amp of amps || []) {
          const current = (amp.riskbedomning_anteckningar || '').trim()
          if (!current || current.startsWith('AMP krävs enligt AFS 2023:3')) {
            await supabase
              .from('arbetsmiljoplaner')
              .update({
                riskbedomning_anteckningar: prefill,
                updated_at: new Date().toISOString(),
              })
              .eq('id', amp.id)
          }
        }
      }

      setRows((prev) => [...prev])
      setSaved(true)
    } catch (err) {
      setError(err.message || 'Kunde inte spara checklistan.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <CardContent sx={{ p: 5, '&:last-child': { pb: 5 } }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Särskilda risker (AFS 2023:3)
            </Typography>
            <Typography color="text.secondary">
              11 kap. 12 § – 13 punkter. Om någon är Ja krävs arbetsmiljöplan (AMP).{' '}
              <Link href={KB_AFS_2023_3_URL} target="_blank" rel="noopener noreferrer">
                Knowledge base
              </Link>
            </Typography>
          </Box>

          {error && <Alert severity="error">{error}</Alert>}
          {saved && <Alert severity="success">Checklista sparad.</Alert>}

          {ampRequired && (
            <Alert
              severity="warning"
              icon={<WarningAmberOutlinedIcon />}
              action={
                <Button
                  component={RouterLink}
                  to={`/arbetsmiljoplan?project=${projectId}`}
                  color="inherit"
                  size="small"
                >
                  Öppna AMP
                </Button>
              }
            >
              AMP krävs – minst en särskild risk är markerad Ja. Gå vidare till arbetsmiljöplanen.
            </Alert>
          )}

          {loading ? (
            <Box sx={{ py: 4, display: 'grid', placeItems: 'center' }}>
              <CircularProgress />
            </Box>
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell width={56}>Nr</TableCell>
                  <TableCell>Risk</TableCell>
                  <TableCell width={140}>Ja/Nej</TableCell>
                  <TableCell>Åtgärd / fritext</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => {
                  const meta = getRiskHelper(row.punkt_nr)
                  return (
                    <TableRow key={row._key} hover>
                      <TableCell>{row.punkt_nr}</TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={0.75} alignItems="center">
                          <Typography variant="body2">{row.benamning}</Typography>
                          {meta ? (
                            <Tooltip
                              title={`${meta.helper} Förslag: ${meta.atgard_forslag}`}
                              arrow
                            >
                              <InfoOutlinedIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
                            </Tooltip>
                          ) : null}
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <TextField
                          select
                          size="small"
                          value={row.svar}
                          onChange={handleChange(row.punkt_nr, 'svar')}
                          fullWidth
                        >
                          {SARSKILDA_RISKER_SVAR_OPTIONS.map((opt) => (
                            <MenuItem key={opt.value || 'empty'} value={opt.value}>
                              {opt.label}
                            </MenuItem>
                          ))}
                        </TextField>
                      </TableCell>
                      <TableCell>
                        <TextField
                          size="small"
                          value={row.atgard}
                          onChange={handleChange(row.punkt_nr, 'atgard')}
                          fullWidth
                          placeholder={meta?.atgard_forslag || 'Åtgärd'}
                        />
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" onClick={handleSave} disabled={saving || loading}>
              {saving ? <CircularProgress size={20} color="inherit" /> : 'Spara checklista'}
            </Button>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  )
}
