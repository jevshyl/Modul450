import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError, planetApi } from './client'
import type { Planet } from './types'
import { usePlanet, usePlanets } from './useSpaceApi'

vi.mock('./client', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./client')>()
  return {
    ...actual,
    planetApi: {
      getPlanets: vi.fn(),
      getDestinations: vi.fn(),
      getPlanet: vi.fn(),
    },
  }
})

const getPlanets = vi.mocked(planetApi.getPlanets)
const getPlanet = vi.mocked(planetApi.getPlanet)

function planet(routeId: string): Planet {
  return {
    id: routeId,
    routeId,
    name: routeId,
    gravity: 1,
    temperatureKelvin: 288,
    temperatureCelsius: 14.8,
    mass: 1,
    volume: 1,
    discoveryDate: null,
    discoveredBy: null,
    explorable: true,
    notExplorableReason: '',
    aircraft: null,
    info: '',
  }
}

describe('useSpaceApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('loads the catalogue and clears the loading flag', async () => {
    getPlanets.mockResolvedValue([planet('mars')])

    const { result } = renderHook(() => usePlanets())

    expect(result.current.loading).toBe(true)
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.data).toHaveLength(1)
    expect(result.current.error).toBeNull()
  })

  it('exposes the HTTP status when a lookup fails', async () => {
    getPlanet.mockRejectedValue(new ApiError('No telemetry for krypton', 404))

    const { result } = renderHook(() => usePlanet('krypton'))

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.error).toBe('No telemetry for krypton')
    expect(result.current.status).toBe(404)
  })
})
