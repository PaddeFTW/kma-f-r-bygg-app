import {
  Box,
  Button,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { SectionHeader, GuidedTextField } from '../../components/forms'

function SectionTitle({ children, helper, why }) {
  return <SectionHeader helper={helper} why={why}>{children}</SectionHeader>
}

/**
 * Flik 18 – Nödlägesberedskap.
 * Innehåll enligt docs/kma-underlag/flikar-17-21-sakerhet-rond.md.
 */
export default function NodlageFormFields({
  form,
  onChange,
  onOrgChange,
  onAddOrg,
  onRemoveOrg,
}) {
  return (
    <Grid container spacing={2}>
      <SectionTitle
        helper="Befattning, namn och telefon för nödlägesorganisationen."
        why="Organisationen visar vem som leder larm, kontakt och åtgärder när något akut händer."
      >
        Organisation
      </SectionTitle>
      <Grid item xs={12}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Befattning</TableCell>
              <TableCell>Namn</TableCell>
              <TableCell>Telefon</TableCell>
              <TableCell align="right" width={56} />
            </TableRow>
          </TableHead>
          <TableBody>
            {form.organisation.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4}>
                  <Typography variant="body2" color="text.secondary">
                    Inga personer tillagda ännu.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              form.organisation.map((rad) => (
                <TableRow key={rad._key}>
                  <TableCell>
                    <GuidedTextField
                      helpKey="nodlage_befattning"
                      value={rad.befattning}
                      onChange={onOrgChange(rad._key, 'befattning')}
                      fullWidth
                      size="small"
                      compact
                      placeholder="Befattning"
                    />
                  </TableCell>
                  <TableCell>
                    <GuidedTextField
                      helpKey="contact_name"
                      value={rad.namn}
                      onChange={onOrgChange(rad._key, 'namn')}
                      fullWidth
                      size="small"
                      compact
                      placeholder="Namn"
                    />
                  </TableCell>
                  <TableCell>
                    <GuidedTextField
                      value={rad.telefon}
                      onChange={onOrgChange(rad._key, 'telefon')}
                      fullWidth
                      size="small"
                      compact
                      placeholder="Telefon"
                      tooltip="Telefonnummer som fungerar vid nödläge."
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      aria-label="Ta bort"
                      onClick={() => onRemoveOrg(rad._key)}
                      color="error"
                      size="small"
                    >
                      <DeleteOutlineIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <Box sx={{ mt: 1.5 }}>
          <Button startIcon={<AddIcon />} onClick={onAddOrg} size="small">
            Lägg till person
          </Button>
        </Box>
      </Grid>

      <SectionTitle
        helper="Räddningshjälp via 112."
        why="Rutinen ska vara enkel att följa även under stress."
      >
        Räddningshjälp (112)
      </SectionTitle>
      <Grid item xs={12}>
        <GuidedTextField
          helpKey="nodlage_larmrutin"
          label="Räddningshjälp (112)"
          value={form.raddningshjalp}
          onChange={onChange('raddningshjalp')}
          fullWidth
          multiline
          minRows={2}
          placeholder="Rutiner och kontakt för räddningshjälp (112)"
        />
      </Grid>

      <SectionTitle why="Larmrutinerna förklarar vad som ska göras direkt vid miljöolycka eller personskada.">
        Larmrutiner
      </SectionTitle>
      <Grid item xs={12}>
        <GuidedTextField
          helpKey="nodlage_larmrutin"
          label="Larmrutin miljöolycka"
          value={form.larmrutin_miljoolycka}
          onChange={onChange('larmrutin_miljoolycka')}
          fullWidth
          multiline
          minRows={3}
        />
      </Grid>
      <Grid item xs={12}>
        <GuidedTextField
          helpKey="nodlage_larmrutin"
          label="Larmrutin personskada"
          value={form.larmrutin_personskada}
          onChange={onChange('larmrutin_personskada')}
          fullWidth
          multiline
          minRows={3}
        />
      </Grid>

      <SectionTitle why="Förberedda budskap minskar osäkerhet för närboende vid störning eller olycka.">
        Information till närboende
      </SectionTitle>
      <Grid item xs={12}>
        <GuidedTextField
          label="Information till närboende"
          value={form.information_narboende}
          onChange={onChange('information_narboende')}
          fullWidth
          multiline
          minRows={3}
          tooltip="Beskriv vad som ska informeras, av vem och via vilken kanal."
          why="Informationen hjälper projektet att agera snabbt och konsekvent mot närboende."
        />
      </Grid>
    </Grid>
  )
}
