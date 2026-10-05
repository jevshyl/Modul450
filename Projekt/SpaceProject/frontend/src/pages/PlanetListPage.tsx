import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import InputAdornment from '@mui/material/InputAdornment'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Select from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import SearchIcon from '@mui/icons-material/Search'
import { DataGrid, type GridColDef, type GridRenderCellParams } from '@mui/x-data-grid'
import { usePlanets } from '../api/useSpaceApi'
import { ExplorabilityBadge } from '../components/ExplorabilityBadge'
import { PlanetOrb } from '../components/PlanetOrb'
import { EmptyState, ErrorState, LoadingState } from '../components/StateViews'
import {
  describeUnknown,
  formatGravity,
  formatMass,
  formatTemp,
  formatVolume,
} from '../theme/planetFormat'

export function PlanetListPage() {
  const { data, loading, error, reload } = usePlanets()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'explorable' | 'blocked'>('all')

  const rows = useMemo(() => {
    const planets = data ?? []
    const needle = query.trim().toLowerCase()

    return planets
      .filter((planet) => {
        const matchesQuery =
          needle.length === 0 ||
          planet.name.toLowerCase().includes(needle) ||
          planet.routeId.toLowerCase().includes(needle)

        const matchesFilter =
          filter === 'all' ||
          (filter === 'explorable' && planet.explorable) ||
          (filter === 'blocked' && !planet.explorable)

        return matchesQuery && matchesFilter
      })
      .map((planet) => ({ ...planet, id: planet.routeId }))
  }, [data, query, filter])

  const explorableCount = useMemo(() => (data ?? []).filter((p) => p.explorable).length, [data])

  const columns = useMemo<GridColDef[]>(
    () => [
      {
        field: 'name',
        headerName: 'Body',
        flex: 1.3,
        minWidth: 210,
        sortable: true,
        renderCell: (params: GridRenderCellParams) => {
          const id = params.row.id as string
          const name = params.row.name as string
          return (
            <Stack direction="row" spacing={1.5} sx={{ height: '100%', alignItems: 'center' }}>
              <PlanetOrb planetId={id} size={38} />
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="body2" sx={{ fontWeight: 700 }} noWrap>
                  {name}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {id}
                </Typography>
              </Box>
            </Stack>
          )
        },
      },
      {
        field: 'temperatureCelsius',
        headerName: 'Avg. Temp',
        flex: 0.8,
        minWidth: 120,
        type: 'number',
        valueFormatter: (value: number) => formatTemp(value),
        renderCell: (params: GridRenderCellParams) => {
          const celsius = params.row.temperatureCelsius as number
          const kelvin = params.row.temperatureKelvin as number
          const tone = celsius < -50 ? '#7dd3fc' : celsius > 120 ? '#ff9a5c' : '#4ade80'
          return (
            <Chip
              size="small"
              label={formatTemp(celsius)}
              sx={{
                color: tone,
                borderColor: `${tone}55`,
                backgroundColor: `${tone}14`,
                fontWeight: 700,
              }}
              variant="outlined"
              title={`${kelvin.toFixed(1)} K`}
            />
          )
        },
      },
      {
        field: 'gravity',
        headerName: 'Gravity',
        flex: 0.75,
        minWidth: 115,
        type: 'number',
        valueFormatter: (value: number) => formatGravity(value),
        renderCell: (params: GridRenderCellParams) => {
          const gravity = params.row.gravity as number
          const tone = gravity >= 0.1 && gravity <= 3 ? '#4ade80' : '#ff6b6b'
          return (
            <Typography variant="body2" sx={{ color: tone, fontWeight: 700 }}>
              {formatGravity(gravity)}
            </Typography>
          )
        },
      },
      {
        field: 'mass',
        headerName: 'Mass',
        flex: 0.85,
        minWidth: 130,
        type: 'number',
        valueFormatter: (value: number) => formatMass(value),
      },
      {
        field: 'volume',
        headerName: 'Volume',
        flex: 0.85,
        minWidth: 130,
        type: 'number',
        valueFormatter: (value: number) => formatVolume(value),
      },
      {
        field: 'aircraft',
        headerName: 'Shuttle',
        flex: 0.6,
        minWidth: 100,
        valueFormatter: (value: string) => describeUnknown(value, '—'),
      },
      {
        field: 'explorable',
        headerName: 'Status',
        flex: 0.7,
        minWidth: 150,
        renderCell: (params: GridRenderCellParams) => (
          <ExplorabilityBadge
            explorable={params.row.explorable as boolean}
            reason={params.row.notExplorableReason as string}
          />
        ),
      },
      {
        field: 'actions',
        headerName: '',
        width: 104,
        sortable: false,
        filterable: false,
        renderCell: (params: GridRenderCellParams) => (
          <Button
            size="small"
            variant="outlined"
            onClick={(event) => {
              event.stopPropagation()
              navigate(`/planets/${params.row.id}`)
            }}
          >
            Explore
          </Button>
        ),
      },
    ],
    [navigate],
  )

  if (loading) return <LoadingState label="Downloading celestial telemetry…" />
  if (error) return <ErrorState message={error} onRetry={reload} />
  if ((data ?? []).length === 0) {
    return (
      <EmptyState
        title="No bodies on file"
        hint="The Solar System API returned an empty catalogue."
      />
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      <Paper sx={{ p: { xs: 2, md: 3 } }}>
        <Typography variant="h1" gutterBottom>
          Solar Catalogue
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 640 }}>
          Live telemetry for every destination in the SpaceXplorer flight plan. Filter the
          catalogue, sort by any column, and open a body for the full survey.
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mt: 2.5, flexWrap: 'wrap', gap: 1 }}>
          <Chip label={`${data?.length ?? 0} destinations`} color="primary" variant="outlined" />
          <Chip
            label={`${explorableCount} explorable`}
            color="success"
            variant="outlined"
          />
          <Chip
            label={`${(data?.length ?? 0) - explorableCount} blocked`}
            color="error"
            variant="outlined"
          />
        </Stack>
      </Paper>

      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={2}
        sx={{ alignItems: { md: 'center' } }}
      >
        <TextField
          size="small"
          placeholder="Search bodies…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          sx={{ minWidth: { md: 280 } }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        />
        <Select
          size="small"
          value={filter}
          onChange={(event) => setFilter(event.target.value as typeof filter)}
          sx={{ minWidth: 180 }}
        >
          <MenuItem value="all">All destinations</MenuItem>
          <MenuItem value="explorable">Explorable only</MenuItem>
          <MenuItem value="blocked">Not explorable</MenuItem>
        </Select>
        <Box sx={{ flex: 1 }} />
        <Button variant="contained" onClick={() => navigate('/simulate')}>
          Start trip simulation
        </Button>
      </Stack>

      <Paper sx={{ height: 620, width: '100%', overflow: 'hidden' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          rowHeight={68}
          disableRowSelectionOnClick
          onRowDoubleClick={(params) => navigate(`/planets/${params.row.id}`)}
          initialState={{
            pagination: { paginationModel: { pageSize: 10, page: 0 } },
            sorting: { sortModel: [{ field: 'name', sort: 'asc' }] },
          }}
          pageSizeOptions={[5, 10, 25]}
          localeText={{ noRowsLabel: 'No bodies match your filters.' }}
          sx={{ '& .MuiDataGrid-columnHeaders': { borderTop: 0 } }}
        />
      </Paper>
    </Box>
  )
}