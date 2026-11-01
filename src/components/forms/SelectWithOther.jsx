import { Grid, MenuItem, Stack, TextField, Typography } from '@mui/material'
import GuidedTextField from './GuidedTextField'

const OTHER_VALUE = '__other__'

/**
 * Select med valfri fritext som komplement (“Annat…” eller alwaysShowOther).
 * Sparar fortfarande ett enda string-värde via onChange(event-like).
 */
export default function SelectWithOther({
  label,
  value,
  onChange,
  options = [],
  otherLabel = 'Annat / fritext',
  alwaysShowOther = false,
  otherValue,
  onOtherChange,
  helpKey,
  tooltip,
  why,
  required,
  fullWidth = true,
  size,
  disabled,
}) {
  const optionValues = options.map((o) => (typeof o === 'string' ? o : o.value))
  const isKnown = value === '' || optionValues.includes(value)
  const selectValue = isKnown ? value : OTHER_VALUE
  const showOther = alwaysShowOther || selectValue === OTHER_VALUE

  const emit = (next) => {
    onChange({ target: { value: next } })
  }

  return (
    <Stack spacing={1.5} sx={{ width: fullWidth ? '100%' : 'auto' }}>
      <GuidedTextField
        select
        label={label}
        value={selectValue}
        onChange={(e) => {
          const next = e.target.value
          if (next === OTHER_VALUE) {
            emit(otherValue || '')
          } else {
            emit(next)
          }
        }}
        required={required}
        fullWidth={fullWidth}
        size={size}
        disabled={disabled}
        helpKey={helpKey}
        tooltip={tooltip}
        why={why}
      >
        {options.map((opt) => {
          const v = typeof opt === 'string' ? opt : opt.value
          const l = typeof opt === 'string' ? opt : opt.label
          return (
            <MenuItem key={`${v}-${l}`} value={v}>
              {l}
            </MenuItem>
          )
        })}
        <MenuItem value={OTHER_VALUE}>Annat…</MenuItem>
      </GuidedTextField>

      {showOther ? (
        <TextField
          label={otherLabel}
          value={alwaysShowOther ? otherValue ?? '' : isKnown ? '' : value}
          onChange={(e) => {
            if (alwaysShowOther && onOtherChange) onOtherChange(e)
            else emit(e.target.value)
          }}
          fullWidth={fullWidth}
          size={size}
          disabled={disabled}
        />
      ) : null}

      {alwaysShowOther ? (
        <Typography variant="caption" color="text.secondary">
          Fritext sparas i separat fält och kompletterar valet ovan.
        </Typography>
      ) : null}
    </Stack>
  )
}

/** Grid-wrapper för SelectWithOther i FormFields. */
export function SelectWithOtherGridItem(props) {
  const { xs = 12, md, ...rest } = props
  return (
    <Grid item xs={xs} md={md}>
      <SelectWithOther {...rest} />
    </Grid>
  )
}
