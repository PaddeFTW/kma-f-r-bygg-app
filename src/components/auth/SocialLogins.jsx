import { Box, IconButton, Tooltip } from '@mui/material'
import FacebookIcon from '@mui/icons-material/Facebook'
import XIcon from '@mui/icons-material/X'
import GitHubIcon from '@mui/icons-material/GitHub'
import GoogleIcon from '@mui/icons-material/Google'

const providers = [
  { name: 'Facebook', icon: <FacebookIcon />, color: '#497CE2' },
  { name: 'X', icon: <XIcon />, color: 'text.primary' },
  { name: 'GitHub', icon: <GitHubIcon />, color: 'text.primary' },
  { name: 'Google', icon: <GoogleIcon />, color: '#DB4437' },
]

/** Social login icon row (UI placeholders; OAuth can be wired later) */
export default function SocialLogins() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1.5 }}>
      {providers.map((p) => (
        <Tooltip key={p.name} title={p.name}>
          <IconButton
            size="small"
            aria-label={p.name}
            sx={{
              color: p.color,
              '&:hover': { bgcolor: 'action.hover' },
            }}
            onClick={(e) => e.preventDefault()}
          >
            {p.icon}
          </IconButton>
        </Tooltip>
      ))}
    </Box>
  )
}
