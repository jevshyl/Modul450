import PublicIcon from '@mui/icons-material/Public'
import GridViewIcon from '@mui/icons-material/GridView'
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import type { ReactNode } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

const NAV_ITEMS = [
  { to: '/planets', label: 'Catalogue', icon: <GridViewIcon /> },
  { to: '/simulate', label: 'Simulate', icon: <RocketLaunchIcon /> },
]

export function AppShell({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="sticky">
        <Toolbar sx={{ gap: 2, flexWrap: 'wrap' }}>
          <PublicIcon sx={{ color: 'primary.main' }} />
          <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.01em' }}>
            SpaceXplorer
          </Typography>

          <Box sx={{ display: 'flex', gap: 0.5, ml: 2 }}>
            {NAV_ITEMS.map((item) => {
              const active = pathname.startsWith(item.to)
              return (
                <Button
                  key={item.to}
                  component={NavLink}
                  to={item.to}
                  startIcon={item.icon}
                  color={active ? 'primary' : 'inherit'}
                  variant={active ? 'outlined' : 'text'}
                  sx={{ borderRadius: 999 }}
                >
                  {item.label}
                </Button>
              )
            })}
          </Box>

          <Box sx={{ flex: 1 }} />

          <Typography variant="caption" sx={{ color: 'text.secondary', display: { xs: 'none', sm: 'block' } }}>
            Spring Boot · Solar System API
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 }, flex: 1 }}>
        {children}
      </Container>

      <Box
        component="footer"
        sx={{ py: 3, textAlign: 'center', borderTop: '1px solid', borderColor: 'divider' }}
      >
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          Telemetry sourced from api.le-systeme-solaire.net · explorability evaluated by
          SpaceXplorer backend
        </Typography>
      </Box>
    </Box>
  )
}