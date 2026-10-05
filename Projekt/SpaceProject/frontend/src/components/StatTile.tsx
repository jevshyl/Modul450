import type { ReactNode } from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'

interface StatTileProps {
  label: string
  value: string
  hint?: string
  accent?: string
  icon?: ReactNode
}

export function StatTile({ label, value, hint, accent = '#6ee7ff', icon }: StatTileProps) {
  const body = (
    <Paper
      sx={{
        p: 2,
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform .18s ease, border-color .18s ease',
        '&:hover': { transform: 'translateY(-3px)', borderColor: accent },
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(420px 120px at 100% 0%, ${accent}1f, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
        {icon ? <Box sx={{ color: accent, display: 'flex', '& svg': { fontSize: 18 } }}>{icon}</Box> : null}
        <Typography variant="caption" sx={{ color: 'text.secondary', letterSpacing: '.09em', textTransform: 'uppercase', fontWeight: 700 }}>
          {label}
        </Typography>
      </Box>
      <Typography variant="h4" sx={{ fontWeight: 700, wordBreak: 'break-word' }}>
        {value}
      </Typography>
    </Paper>
  )

  return hint ? (
    <Tooltip title={hint} arrow>
      {body}
    </Tooltip>
  ) : (
    body
  )
}