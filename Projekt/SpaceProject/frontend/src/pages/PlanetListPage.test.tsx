import { ThemeProvider } from '@mui/material/styles'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Planet } from '../api/types'
import { usePlanets } from '../api/useSpaceApi'
import { theme } from '../theme/theme'
import { PlanetListPage } from './PlanetListPage'

vi.mock('../api/useSpaceApi', () => ({
  usePlanets: vi.fn(),
}))

vi.mock('@mui/x-data-grid', () => {
  type Row = Record<string, unknown> & { id: string }
  type Column = {
    field: string
    renderCell?: (params: { row: Row }) => ReactNode
  }

  return {
    DataGrid: ({ rows, columns }: { rows: Row[]; columns: Column[] }) => (
      <table>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              {columns.map((column) => (
                <td key={column.field}>
                  {column.renderCell ? column.renderCell({ row }) : String(row[column.field] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    ),
  }
})

const usePlanetsMock = vi.mocked(usePlanets)

function planet(overrides: Partial<Planet> & Pick<Planet, 'id' | 'name'>): Planet {
  return {
    routeId: overrides.id,
    gravity: 3.71,
    temperatureKelvin: 210,
    temperatureCelsius: -63.1,
    mass: 6.39e23,
    volume: 1.63e11,
    discoveryDate: '',
    discoveredBy: '',
    explorable: false,
    notExplorableReason: 'Gravity too high → you would be crushed!',
    aircraft: '350',
    info: `Planet ${overrides.name}`,
    ...overrides,
  }
}

const planets: Planet[] = [
  planet({ id: 'mars', name: 'Mars' }),
  planet({ id: 'venus', name: 'Venus' }),
  planet({ id: 'moon', name: 'Moon', explorable: true, notExplorableReason: '' }),
]

function renderPage() {
  return render(
    <ThemeProvider theme={theme}>
      <MemoryRouter initialEntries={['/planets']}>
        <PlanetListPage />
      </MemoryRouter>
    </ThemeProvider>,
  )
}

describe('PlanetListPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    usePlanetsMock.mockReturnValue({
      data: planets,
      loading: false,
      error: null,
      status: null,
      reload: vi.fn(),
    })
  })

  it('renders the catalogue heading and every body', () => {
    renderPage()

    expect(screen.getByRole('heading', { name: 'Solar Catalogue' })).toBeInTheDocument()
    expect(screen.getByText('Mars')).toBeInTheDocument()
    expect(screen.getByText('Venus')).toBeInTheDocument()
    expect(screen.getByText('Moon')).toBeInTheDocument()
  })

  it('narrows the catalogue by name', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.type(screen.getByPlaceholderText('Search bodies…'), 'ven')

    expect(screen.getByText('Venus')).toBeInTheDocument()
    expect(screen.queryByText('Mars')).not.toBeInTheDocument()
  })
})
