import { ThemeProvider } from '@mui/material/styles'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Destination } from '../api/types'
import { useDestinations } from '../api/useSpaceApi'
import { theme } from '../theme/theme'
import { SimulationPage } from './SimulationPage'

vi.mock('../api/useSpaceApi', () => ({
  useDestinations: vi.fn(),
}))

const useDestinationsMock = vi.mocked(useDestinations)

const destinations: Destination[] = [
  { menuNumber: 1, name: 'MARS', planetId: 'mars', aircraft: '350' },
  { menuNumber: 2, name: 'VENUS', planetId: 'venus', aircraft: '420' },
  { menuNumber: 3, name: 'MOON', planetId: 'moon', aircraft: '101' },
]

function renderPage() {
  return render(
    <ThemeProvider theme={theme}>
      <MemoryRouter initialEntries={['/simulate']}>
        <SimulationPage />
      </MemoryRouter>
    </ThemeProvider>,
  )
}

describe('SimulationPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('lists the flight-plan destinations', () => {
    useDestinationsMock.mockReturnValue({
      data: destinations,
      loading: false,
      error: null,
      status: null,
      reload: vi.fn(),
    })

    renderPage()

    expect(screen.getByRole('heading', { name: 'Trip simulation' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Fly to MARS' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Fly to VENUS' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Fly to MOON' })).toBeInTheDocument()
  })

  it('shows an error state when the flight plan cannot be loaded', () => {
    useDestinationsMock.mockReturnValue({
      data: null,
      loading: false,
      error: 'Cannot reach the backend',
      status: 0,
      reload: vi.fn(),
    })

    renderPage()

    expect(screen.getByText('Transmission failed')).toBeInTheDocument()
    expect(screen.getByText('Cannot reach the backend')).toBeInTheDocument()
  })
})
