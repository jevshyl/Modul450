import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'
import ScaleIcon from '@mui/icons-material/Scale'
import SpeedIcon from '@mui/icons-material/Speed'
import ThermostatIcon from '@mui/icons-material/Thermostat'
import ScienceIcon from '@mui/icons-material/Science'
import PublicIcon from '@mui/icons-material/Public'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useNavigate, useParams } from 'react-router-dom'
import { usePlanet } from '../api/useSpaceApi'
import { ExplorabilityBadge } from '../components/ExplorabilityBadge'
import { PlanetOrb } from '../components/PlanetOrb'
import { StatTile } from '../components/StatTile'
import { EmptyState, ErrorState, LoadingState } from '../components/StateViews'
import { describeUnknown, formatGravity, formatMass, formatTemp } from '../theme/planetFormat'

const MIN_SAFE_TEMP = 100
const MAX_SAFE_TEMP = 500
const MIN_SAFE_GRAVITY = 0.1
const MAX_SAFE_GRAVITY = 3

function RangeBar({
  value,
  min,
  max,
  unit,
}: {
  value: number
  min: number
  max: number
  unit: string
}) {
  const safe = value >= min && value <= max
  const color = safe ? '#4ade80' : '#ff6b6b'

  const clamp = (n: number) => Math.max(0, Math.min(n, 100))
  const span = max - min
  const markerPct = Number.isFinite(value) ? clamp(((value - min) / span) * 100) : 50
  const safeStart = clamp(((Math.min(Math.max(value, min), max) - min) / span) * 100)

  return (
    <Box sx={{ mt: 1 }}>
      <Box sx={{ position: 'relative', height: 8, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.07)' }}>
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            width: `${safeStart}%`,
            height: '100%',
            borderRadius: 999,
            background: `linear-gradient(90deg, ${color}55, ${color}22)`,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: -4,
            left: `calc(${markerPct}% - 2px)`,
            width: 4,
            height: 16,
            borderRadius: 2,
            backgroundColor: color,
            boxShadow: `0 0 10px ${color}`,
          }}
        />
      </Box>
      <Stack direction="row" sx={{ justifyContent: 'space-between', mt: 0.75 }}>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {min} {unit}
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {max} {unit}
        </Typography>
      </Stack>
    </Box>
  )
}

export function PlanetDetailPage() {
  const { routeId } = useParams<{ routeId: string }>()
  const { data: planet, loading, error, reload } = usePlanet(routeId)
  const navigate = useNavigate()

  if (loading) return <LoadingState label={`Scanning ${routeId ?? 'body'}…`} />
  if (error) return <ErrorState message={error} onRetry={reload} />
  if (!planet) {
    return (
      <EmptyState
        title="Unknown destination"
        hint={`No telemetry found for "${routeId}". It may not be in the flight plan.`}
      />
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/planets')}
        sx={{ alignSelf: 'flex-start', color: 'text.secondary' }}
      >
        Back to catalogue
      </Button>

      <Paper sx={{ p: { xs: 2.5, md: 4 }, position: 'relative', overflow: 'hidden' }}>
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(760px 320px at 88% -20%, rgba(183,140,255,0.20), transparent 65%)',
            pointerEvents: 'none',
          }}
        />
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={4}
          sx={{ position: 'relative', alignItems: { md: 'center' } }}
        >
          <PlanetOrb planetId={planet.routeId} size={168} glowing />
          <Box sx={{ flex: 1 }}>
            <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: 'wrap', gap: 1 }}>
              <Chip label={planet.routeId} size="small" color="primary" variant="outlined" />
              <ExplorabilityBadge
                explorable={planet.explorable}
                reason={planet.notExplorableReason}
                size="medium"
              />
              {planet.aircraft ? (
                <Chip label={`Shuttle ${planet.aircraft}`} size="small" variant="outlined" />
              ) : null}
            </Stack>
            <Typography variant="h1">{planet.name}</Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mt: 1, maxWidth: 560 }}>
              {planet.explorable
                ? 'Suit-rated conditions confirmed. This body is cleared for a surface excursion.'
                : planet.notExplorableReason || 'Conditions exceed human tolerance.'}
            </Typography>
          </Box>
        </Stack>
      </Paper>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatTile
            label="Avg. Temperature"
            value={formatTemp(planet.temperatureCelsius)}
            hint={`${planet.temperatureKelvin.toFixed(1)} K absolute`}
            accent="#ff9a5c"
            icon={<ThermostatIcon />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatTile
            label="Surface Gravity"
            value={formatGravity(planet.gravity)}
            hint="Earth reference is 9.81 m/s²"
            accent="#b78cff"
            icon={<SpeedIcon />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatTile
            label="Mass"
            value={formatMass(planet.mass)}
            hint={`${planet.mass.toExponential(3)} kg`}
            accent="#6ee7ff"
            icon={<ScaleIcon />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatTile
            label="Volume"
            value={`${planet.volume.toLocaleString(undefined, { maximumFractionDigits: 0 })} km³`}
            accent="#4ade80"
            icon={<PublicIcon />}
          />
        </Grid>
      </Grid>

      <Paper sx={{ p: { xs: 2.5, md: 3 } }}>
        <Stack direction="row" spacing={1} sx={{ mb: 2, alignItems: 'center' }}>
          <ScienceIcon sx={{ color: 'primary.main' }} />
          <Typography variant="h3">Suit tolerance analysis</Typography>
        </Stack>

        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          TEMPERATURE · survivable band 100–500 K
        </Typography>
        <RangeBar
          value={planet.temperatureKelvin}
          min={MIN_SAFE_TEMP}
          max={MAX_SAFE_TEMP}
          unit="K"
        />

        <Box sx={{ height: 2.5 }} />

        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          GRAVITY · survivable band 0.10–3.00 m/s²
        </Typography>
        <RangeBar
          value={planet.gravity}
          min={MIN_SAFE_GRAVITY}
          max={MAX_SAFE_GRAVITY}
          unit="m/s²"
        />

        <Divider sx={{ my: 2.5 }} />

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4}>
          <Box sx={{ minWidth: 180 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              DISCOVERED BY
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {describeUnknown(planet.discoveredBy)}
            </Typography>
          </Box>
          <Box sx={{ minWidth: 180 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              DISCOVERY DATE
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {describeUnknown(planet.discoveryDate)}
            </Typography>
          </Box>
        </Stack>
      </Paper>

      <Paper sx={{ p: { xs: 2.5, md: 3 } }}>
        <Typography variant="h3" sx={{ mb: 1.5 }}>
          Raw survey log
        </Typography>
        <Box
          component="pre"
          sx={{
            m: 0,
            p: 2,
            borderRadius: 2,
            backgroundColor: 'rgba(0,0,0,0.35)',
            border: '1px solid rgba(110,231,255,0.14)',
            color: '#9aa3c7',
            fontSize: '0.82rem',
            lineHeight: 1.6,
            overflowX: 'auto',
            whiteSpace: 'pre-wrap',
          }}
        >
          {planet.info}
        </Box>
      </Paper>

      <Button
        variant="contained"
        size="large"
        startIcon={<RocketLaunchIcon />}
        sx={{ alignSelf: 'flex-start' }}
        onClick={() => navigate(`/simulate?destination=${planet.routeId}`)}
      >
        Fly me to {planet.name}
      </Button>
    </Box>
  )
}