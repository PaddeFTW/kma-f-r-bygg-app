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
  TextField,
  Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'

function SectionTitle({ children, helper }) {
  return (
    <Grid item xs={12}>
      <Typography variant="h6" sx={{ fontWeight: 600, mt: 1 }}>
        {children}
      </Typography>
      {helper && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {helper}
        </Typography>
      )}
    </Grid>
  )
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
      <SectionTitle helper="Befattning, namn och telefon för nödlägesorganisationen.">
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
                    <TextField
                      value={rad.befattning}
                      onChange={onOrgChange(rad._key, 'befattning')}
                      fullWidth
                      size="small"
                      placeholder="Befattning"
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      value={rad.namn}
                      onChange={onOrgChange(rad._key, 'namn')}
                      fullWidth
                      size="small"
                      placeholder="Namn"
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      value={rad.telefon}
                      onChange={onOrgChange(rad._key, 'telefon')}
                      fullWidth
                      size="small"
                      placeholder="Telefon"
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

      <SectionTitle helper="Räddningshjälp via 112.">Räddningshjälp (112)</SectionTitle>
      <Grid item xs={12}>
        <TextField
          label="Räddningshjälp (112)"
          value={form.raddningshjalp}
          onChange={onChange('raddningshjalp')}
          fullWidth
          multiline
          minRows={2}
          placeholder="Rutiner och kontakt för räddningshjälp (112)"
        />
      </Grid>

      <SectionTitle>Larmrutiner</SectionTitle>
      <Grid item xs={12}>
        <TextField
          label="Larmrutin miljöolycka"
          value={form.larmrutin_miljoolycka}
          onChange={onChange('larmrutin_miljoolycka')}
          fullWidth
          multiline
          minRows={3}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Larmrutin personskada"
          value={form.larmrutin_personskada}
          onChange={onChange('larmrutin_personskada')}
          fullWidth
          multiline
          minRows={3}
        />
      </Grid>

      <SectionTitle>Information till närboende</SectionTitle>
      <Grid item xs={12}>
        <TextField
          label="Information till närboende"
          value={form.information_narboende}
          onChange={onChange('information_narboende')}
          fullWidth
          multiline
          minRows={3}
        />
      </Grid>
    </Grid>
  )
}
