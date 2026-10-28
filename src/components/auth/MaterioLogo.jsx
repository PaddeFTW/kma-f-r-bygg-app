import { Box, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

/** Materio brand mark used on auth pages */
export default function MaterioLogo({ to = '/', sx }) {
  return (
    <Box
      component={RouterLink}
      to={to}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1.5,
        textDecoration: 'none',
        color: 'text.primary',
        mb: 4,
        ...sx,
      }}
    >
      <Box
        component="svg"
        width={34}
        height={24}
        viewBox="0 0 32 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0.00172773 0V6.85398C0.00172773 6.85398 -0.133178 9.01207 1.98092 10.8388L13.6912 21.8638L15.6791 21.8548L15.6912 21.8428L28.0183 10.8388C30.1323 9.01207 29.9974 6.85398 29.9974 6.85398V0L15.6912 12.9433L0.00172773 0Z"
          fill="#8C57FF"
        />
        <path
          opacity="0.06"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M7.69824 16.4364L12.5199 3.23696L16.5541 7.25596L7.69824 16.4364Z"
          fill="#161616"
        />
        <path
          opacity="0.06"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M8.07751 15.9175L13.9419 4.63989L16.5849 7.28475L8.07751 15.9175Z"
          fill="#161616"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M7.77295 16.3566L23.6563 0H32V6.88383C32 6.88383 31.8262 9.17836 30.6591 10.4057L19.7824 22H13.6938L7.77295 16.3566Z"
          fill="#8C57FF"
        />
      </Box>
      <Typography
        variant="h5"
        sx={{
          fontWeight: 600,
          letterSpacing: '0.15px',
          textTransform: 'uppercase',
          lineHeight: 1,
          color: 'text.primary',
        }}
      >
        Materio
      </Typography>
    </Box>
  )
}
