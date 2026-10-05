import { useCallback, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff'
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'
import TouchAppIcon from '@mui/icons-material/TouchApp'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Grid from '@mui/material/Grid'
import LinearProgress from '@mui/material/LinearProgress'
import Paper from '@mui/material/Paper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Stepper from '@mui/material/Stepper'
import Typography from '@mui/material/Typography'
import { ApiError, planetApi } from '../api/client'
import type { Destination, Planet } from '../api/types'
import { useDestinations } from '../api/useSpaceApi'
import { ExplorabilityBadge } from '../components/ExplorabilityBadge'
import { PlanetOrb } from '../components/PlanetOrb'
import { EmptyState, ErrorState, LoadingState } from '../components/StateViews'
import { describeUnknown, formatGravity, formatMass, formatTemp } from '../theme/planetFormat'

type Phase = 'select' | 'countdown' | 'launch' | 'arrival' | 'exploring' | 'complete'

const PHASES: Phase[] = ['select', 'countdown', 'launch', 'arrival', 'exploring', 'complete']

const STEP_LABELS: Record<Phase, string> = {
  select: 'Select',
  countdown: 'Countdown',
  launch: 'Blast off',
  arrival: 'Arrival',
  exploring: 'Exploration',
  complete: 'Complete',
}

const COUNTDOWN_FROM = 5

export function SimulationPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { data: destinations, loading: loadingDestinations, error: destinationsError, reload } =
    useDestinations()

  const [phase, setPhase] = useState<Phase>('select')
  const [selected, setSelected] = useState<Planet | null>(null)
  const [destination, setDestination] = useState<Destination | null>(null)
  const [count, setCount] = useState(COUNTDOWN_FROM)
  const [loadingPlanet, setLoadingPlanet] = useState(false)
  const [planetError, setPlanetError] = useState<string | null>(null)
  const [picked, setPicked] = useState(false)
  const timers = useRef<number[]>([])

  const clearTimers = useCallback(() => {
    timers.current.forEach((id) => window.clearTimeout(id))
    timers.current = []
  }, [])

  useEffect(() => clearTimers, [clearTimers])

  const runCountdown = useCallback(() => {
    const beat = (n: number) => {
      if (n > 0) {
        setCount(n)
        timers.current.push(window.setTimeout(() => beat(n - 1), 850))
        return
      }

      setPhase('launch')
      timers.current.push(
        window.setTimeout(() => {
          setPhase('arrival')
          timers.current.push(
            window.setTimeout(() => {
              setPhase('exploring')
              timers.current.push(window.setTimeout(() => setPhase('complete'), 1400))
            }, 1600),
          )
        }, 2200),
      )
    }
    beat(COUNTDOWN_FROM)
  }, [])

  const beginTrip = useCallback(
    async (destination: Destination) => {
      clearTimers()
      setDestination(destination)
      setSelected(null)
      setPlanetError(null)
      setLoadingPlanet(true)
      setCount(COUNTDOWN_FROM)
      setPhase('countdown')

      try {
        const planet = await planetApi.getPlanet(destination.planetId)
        setSelected(planet)
        setLoadingPlanet(false)
        runCountdown()
      } catch (cause) {
        setLoadingPlanet(false)
        setPlanetError(
          cause instanceof ApiError ? cause.message : 'Could not load telemetry for that body.',
        )
        setPhase('select')
      }
    },
    [clearTimers, runCountdown],
  )

  const targetDestination = searchParams.get('destination')

  useEffect(() => {
    if (!targetDestination || picked || !destinations) return

    const match = destinations.find((d) => d.planetId === targetDestination.toLowerCase())
    if (!match) return

    setPicked(true)
    void beginTrip(match)
  }, [beginTrip, destinations, picked, targetDestination])

  const reset = () => {
    clearTimers()
    setPhase('select')
    setSelected(null)
    setDestination(null)
    setCount(COUNTDOWN_FROM)
    setPicked(false)
    setSearchParams({})
  }

  if (loadingDestinations) return <LoadingState label="Loading flight plan…" />
  if (destinationsError) return <ErrorState message={destinationsError} onRetry={reload} />
  if ((destinations ?? []).length === 0) {
    return <EmptyState title="No destinations available" hint="The flight plan is empty." />
  }

  const activeStep = Math.max(0, PHASES.indexOf(phase))
  const launchProgress = Math.min(100, (activeStep / (PHASES.length - 1)) * 100)

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      <Paper sx={{ p: { xs: 2.5, md: 3 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <RocketLaunchIcon sx={{ color: 'primary.main' }} />
          <Typography variant="h1" component="h1">
            Trip simulation
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 640 }}>
          Pick a destination from the flight plan and run the full launch sequence — countdown,
          blast-off, arrival and a surface exploration attempt.
        </Typography>
      </Paper>

      <Paper sx={{ p: { xs: 2.5, md: 3 } }}>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 2 }}>
          {PHASES.map((step) => (
            <Step key={step}>
              <StepLabel>{STEP_LABELS[step]}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <LinearProgress
          variant="determinate"
          value={launchProgress}
          sx={{ height: 6, borderRadius: 999 }}
        />
      </Paper>

      {planetError ? (
        <ErrorState message={planetError} onRetry={() => destination && beginTrip(destination)} />
      ) : null}

      {phase === 'select' ? (
        <Grid container spacing={2}>
          {(destinations ?? []).map((dest) => (
            <Grid key={dest.planetId} size={{ xs: 12, sm: 6, md: 4 }}>
              <DestinationCard
                destination={dest}
                busy={loadingPlanet && destination?.planetId === dest.planetId}
                onLaunch={() => {
                  setPicked(true)
                  void beginTrip(dest)
                }}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper sx={{ p: { xs: 3, md: 5 }, textAlign: 'center', minHeight: 380 }}>
          <PhaseDisplay
            phase={phase}
            count={count}
            planet={selected}
            onReset={reset}
          />
        </Paper>
      )}
    </Box>
  )
}

function DestinationCard({
  destination,
  busy,
  onLaunch,
}: {
  destination: Destination
  busy: boolean
  onLaunch: () => void
}) {
  return (
    <Paper
      sx={{
        p: 2.5,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        transition: 'transform .18s ease, border-color .18s ease',
        '&:hover': { transform: 'translateY(-4px)', borderColor: 'primary.main' },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <PlanetOrb planetId={destination.planetId} size={62} />
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h4">{destination.name}</Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Shuttle {destination.aircraft}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ flex: 1 }} />
      <Button
        fullWidth
        variant="contained"
        startIcon={busy ? undefined : <FlightTakeoffIcon />}
        disabled={busy}
        onClick={onLaunch}
      >
        {busy ? 'Preparing…' : `Fly to ${destination.name}`}
      </Button>
    </Paper>
  )
}

function PhaseDisplay({
  phase,
  count,
  planet,
  onReset,
}: {
  phase: Phase
  count: number
  planet: Planet | null
  onReset: () => void
}) {
  if (!planet && phase !== 'countdown') {
    return <LoadingState label="Fetching destination telemetry…" />
  }

  if (phase === 'countdown') {
    return (
      <Box sx={{ py: 4 }}>
        <Typography variant="h2" sx={{ mb: 1 }}>
          {count > 0 ? count : 'Liftoff'}
        </Typography>
        <Typography variant="h4" sx={{ color: 'text.secondary', fontWeight: 400 }}>
          {planet ? `Preparing shuttle for ${planet.name}` : 'Preparing shuttle…'}
        </Typography>
      </Box>
    )
  }

  if (phase === 'launch') {
    return (
      <Box sx={{ py: 4 }}>
        <RocketLaunchIcon sx={{ fontSize: 64, color: 'primary.main', mb: 1 }} />
        <Typography variant="h2">Blast off!</Typography>
        <Typography variant="h4" sx={{ color: 'text.secondary', fontWeight: 400 }}>
          Engines at full thrust
        </Typography>
      </Box>
    )
  }

  if (phase === 'arrival' && planet) {
    return (
      <Box sx={{ py: 2 }}>
        <PlanetOrb planetId={planet.routeId} size={132} glowing sx={{ mx: 'auto', mb: 2 }} />
        <Typography variant="h2">Arrived at {planet.name}</Typography>
        <Typography variant="h4" sx={{ color: 'text.secondary', fontWeight: 400 }}>
          {formatTemp(planet.temperatureCelsius)} · {formatGravity(planet.gravity)} ·{' '}
          {formatMass(planet.mass)}
        </Typography>
      </Box>
    )
  }

  if (phase === 'exploring' && planet) {
    return (
      <Box sx={{ py: 2 }}>
        <TouchAppIcon sx={{ fontSize: 58, color: 'secondary.main', mb: 1 }} />
        <Typography variant="h2">Deploying survey drone…</Typography>
        <Typography variant="h4" sx={{ color: 'text.secondary', fontWeight: 400 }}>
          Reading surface conditions
        </Typography>
      </Box>
    )
  }

  if (phase === 'complete' && planet) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, py: 2 }}>
        <PlanetOrb planetId={planet.routeId} size={132} glowing />
        <ExplorabilityBadge
          explorable={planet.explorable}
          reason={planet.notExplorableReason}
          size="medium"
        />
        <Typography variant="h2" sx={{ mt: 1 }}>
          {planet.explorable
            ? `Exploring planet ${planet.name}!`
            : `Cannot explore ${planet.name}`}
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 520 }}>
          {planet.explorable
            ? 'Conditions are within human tolerance. Welcome to the surface.'
            : planet.notExplorableReason}
        </Typography>

        <StackChips planet={planet} />

        <Box sx={{ display: 'flex', gap: 1.5, mt: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button variant="contained" onClick={onReset}>
            New destination
          </Button>
        </Box>
      </Box>
    )
  }

  return <LoadingState />
}

function StackChips({ planet }: { planet: Planet }) {
  return (
    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
      <Chip label={`Shuttle ${describeUnknown(planet.aircraft, '—')}`} size="small" variant="outlined" />
      <Chip
        label={`Discovered by ${describeUnknown(planet.discoveredBy)}`}
        size="small"
        variant="outlined"
      />
    </Box>
  )
}