import { IconButton, InputAdornment, Stack, TextField, Tooltip, Typography } from '@mui/material'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import { FORM_HELP } from '../../lib/formHelp'

/**
 * TextField med “?”-tooltip och valfri “varför”-rad.
 * helpKey pekar på FORM_HELP, eller skicka tooltip/why/example manuellt.
 */
export default function GuidedTextField({
  helpKey,
  tooltip,
  why,
  example,
  helperText,
  InputProps,
  SelectProps,
  children,
  ...textFieldProps
}) {
  const help = (helpKey && FORM_HELP[helpKey]) || {}
  const tip = [tooltip || help.tooltip, example || help.example].filter(Boolean).join(' ')
  const whyText = why || help.why
  const mergedHelper = helperText || null
  const isSelect = Boolean(textFieldProps.select)

  return (
    <Stack spacing={0.5} sx={{ width: '100%' }}>
      <TextField
        {...textFieldProps}
        helperText={mergedHelper}
        SelectProps={SelectProps}
        InputProps={
          isSelect
            ? InputProps
            : {
                ...InputProps,
                endAdornment: tip ? (
                  <>
                    {InputProps?.endAdornment}
                    <InputAdornment position="end">
                      <Tooltip title={tip} arrow>
                        <IconButton size="small" edge="end" tabIndex={-1} aria-label="Hjälp">
                          <HelpOutlineIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  </>
                ) : (
                  InputProps?.endAdornment
                ),
              }
        }
        InputLabelProps={{
          ...textFieldProps.InputLabelProps,
          ...(tip && isSelect
            ? {
                shrink: textFieldProps.InputLabelProps?.shrink,
              }
            : null),
        }}
        // För select: tip via label-title / aria – undvik endAdornment-konflikt
        title={isSelect && tip ? tip : undefined}
      >
        {children}
      </TextField>
      {isSelect && tip ? (
        <Typography variant="caption" color="text.secondary" sx={{ px: 0.5 }}>
          {tip}
        </Typography>
      ) : null}
      {whyText ? (
        <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic', px: 0.5 }}>
          Varför? {whyText}
        </Typography>
      ) : null}
    </Stack>
  )
}
