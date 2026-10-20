import { ThemeProvider } from '@mui/material/styles'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Planet } from '../api/types'
import { usePlanet } from '../api/useSpaceApi'
import { theme } from '../theme/theme'
import { PlanetDetailPage } from './PlanetDetailPage'

vi.mock('../api/useSpaceApi', () => ({
  usePlanet: vi.fn(),
}))

const usePlanetMock = vi.mocked(usePlanet)

const mars: Planet = {
  id: 'mars',
  routeId: 'mars',
  name: 'Mars',
  gravity: 3.71,
  temperatureKelvin: 210,
  temperatureCelsius: -63.15,
  mass: 6.39e23,
  volume: 1.63e11,
  discoveryDate: '',
  discoveredBy: '',
  explorable: false,
  notExplorableReason: 'Gravity too high → you would be crushed!',
  aircraft: '350',
  info: 'Planet Mars',
}

function renderPage(routeId: string) {
  return render(
    <ThemeProvider theme={theme}>
      <MemoryRouter initialEntries={[`/planets/${routeId}`]}>
        <Routes>
          <Route path="/planets/:routeId" element={<PlanetDetailPage />} />
        </Routes>
      </MemoryRouter>
    </ThemeProvider>,
  )
}

describe('PlanetDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders telemetry for a known body', () => {
    usePlanetMock.mockReturnValue({
      data: mars,
      loading: false,
      error: null,
      status: null,
      reload: vi.fn(),
    })

    renderPage('mars')

    expect(screen.getByRole('heading', { name: 'Mars' })).toBeInTheDocument()
    expect(screen.getByText('3.71 m/s²')).toBeInTheDocument()
    expect(screen.getByText('Gravity too high → you would be crushed!')).toBeInTheDocument()
  })

  it('shows an unknown-destination state for a 404 response', () => {
    usePlanetMock.mockReturnValue({
      data: null,
      loading: false,
      error: 'No telemetry for krypton',
      status: 404,
      reload: vi.fn(),
    })

    renderPage('krypton')

    expect(screen.getByText('Unknown destination')).toBeInTheDocument()
  })
})
