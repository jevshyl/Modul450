import { afterEach, describe, expect, it, vi } from 'vitest'
import { ApiError, planetApi } from './client'

function jsonResponse(body: unknown, init: { ok?: boolean; status?: number } = {}) {
  return {
    ok: init.ok ?? true,
    status: init.status ?? 200,
    json: async () => body,
  } as unknown as Response
}

describe('planetApi', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('requests the planet catalogue with a JSON accept header', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse([{ routeId: 'mars' }]))
    vi.stubGlobal('fetch', fetchMock)

    const planets = await planetApi.getPlanets()

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/planets',
      expect.objectContaining({ headers: { Accept: 'application/json' } }),
    )
    expect(planets).toHaveLength(1)
  })

  it('encodes the route id when fetching a single body', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ routeId: 'mars' }))
    vi.stubGlobal('fetch', fetchMock)

    await planetApi.getPlanet('terra nova')

    expect(fetchMock).toHaveBeenCalledWith('/api/planets/terra%20nova', expect.anything())
  })

  it('surfaces the problem detail from a failing response', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse(
        { title: 'Not Found', detail: 'No telemetry for krypton' },
        { ok: false, status: 404 },
      ),
    )
    vi.stubGlobal('fetch', fetchMock)

    await expect(planetApi.getPlanet('krypton')).rejects.toMatchObject({
      name: 'ApiError',
      status: 404,
      message: 'No telemetry for krypton',
    })
  })

  it('reports a network failure as an unreachable backend', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'))
    vi.stubGlobal('fetch', fetchMock)

    const error = (await planetApi.getPlanets().catch((cause: unknown) => cause)) as ApiError

    expect(error).toBeInstanceOf(ApiError)
    expect(error.status).toBe(0)
    expect(error.message).toContain('backend')
  })
})
