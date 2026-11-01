import { Autocomplete, IconButton, InputAdornment, Stack, TextField, Tooltip, Typography } from '@mui/material'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import { FORM_HELP } from '../../lib/formHelp'

/**
 * Autocomplete med freeSolo – förslag + fritext.
 * onChangeField får samma signatur som TextField onChange (event.target.value).
 */
export default function SuggestionAutocomplete({
  label,
  value,
  onChangeField,
  options = [],
  helpKey,
  tooltip,
  why,
  example,
  helperText,
  required,
  fullWidth = true,
  freeSolo = true,
  multiple = false,
  disabled,
  placeholder,
}) {
  const help = (helpKey && FORM_HELP[helpKey]) || {}
  const tip = [tooltip || help.tooltip, example || help.example].filter(Boolean).join(' ')
  const whyText = why || help.why

  return (
    <Stack spacing={0.5} sx={{ width: fullWidth ? '100%' : 'auto' }}>
      <Autocomplete
        freeSolo={freeSolo}
        multiple={multiple}
        options={options}
        value={value ?? (multiple ? [] : '')}
        disabled={disabled}
        onChange={(_e, next) => {
          const resolved = multiple ? next : next ?? ''
          onChangeField({ target: { value: resolved } })
        }}
        onInputChange={(_e, next, reason) => {
          if (!multiple && (reason === 'input' || reason === 'clear')) {
            onChangeField({ target: { value: next } })
          }
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            required={required}
            helperText={helperText}
            placeholder={placeholder}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {params.InputProps.endAdornment}
                  {tip ? (
                    <InputAdornment position="end">
                      <Tooltip title={tip} arrow>
                        <IconButton size="small" edge="end" tabIndex={-1} aria-label="Hjälp">
                          <HelpOutlineIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  ) : null}
                </>
              ),
            }}
          />
        )}
      />
      {whyText ? (
        <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic', px: 0.5 }}>
          Varför? {whyText}
        </Typography>
      ) : null}
    </Stack>
  )
}
