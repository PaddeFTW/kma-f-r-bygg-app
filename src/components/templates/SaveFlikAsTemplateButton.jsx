import { useState } from 'react'
import { Button } from '@mui/material'
import BookmarkAddOutlinedIcon from '@mui/icons-material/BookmarkAddOutlined'
import SaveAsTemplateDialog from './SaveAsTemplateDialog'

/** Knapp + dialog: spara aktuell flik som företagsmall. */
export default function SaveFlikAsTemplateButton({
  companyId,
  projectId,
  projectLabel,
  flikNr,
  disabled = false,
  size = 'medium',
}) {
  const [open, setOpen] = useState(false)

  if (!companyId || !projectId || !flikNr) return null

  return (
    <>
      <Button
        type="button"
        variant="outlined"
        size={size}
        startIcon={<BookmarkAddOutlinedIcon />}
        onClick={() => setOpen(true)}
        disabled={disabled}
      >
        Spara denna flik som mall
      </Button>
      <SaveAsTemplateDialog
        open={open}
        onClose={() => setOpen(false)}
        companyId={companyId}
        projectId={projectId}
        projectLabel={projectLabel}
        mode="flik"
        flikNr={flikNr}
      />
    </>
  )
}
