import type { Destination, Planet, ProblemDetail } from './types'

/**
 * Defaults to a relative path so the Vite dev proxy (vite.config.ts) forwards
 * requests to the Spring Boot backend. Set VITE_API_BASE_URL to hit a remote
 * host directly — that host must then allow this origin via CORS.
 */
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

export class ApiError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function request<T>(path: string, signal?: AbortSignal): Promise<T> {
  let response: Response

  try {
    response = await fetch(`${BASE_URL}${path}`, {
      signal,
      headers: { Accept: 'application/json' },
    })
  } catch (cause) {
    if (cause instanceof DOMException && cause.name === 'AbortError') throw cause
    throw new ApiError(
      'Cannot reach the SpaceXplorer backend. Is it running on port 8080?',
      0,
    )
  }

  if (!response.ok) {
    let detail = `Request failed with status ${response.status}`
    try {
      const problem = (await response.json()) as ProblemDetail
      if (problem.detail) detail = problem.detail
      else if (problem.title) detail = problem.title
    } catch {
      // response body was not JSON, keep the default message
    }
    throw new ApiError(detail, response.status)
  }

  return (await response.json()) as T
}

export const planetApi = {
  getPlanets: (signal?: AbortSignal) => request<Planet[]>('/api/planets', signal),

  getPlanet: (routeId: string, signal?: AbortSignal) =>
    request<Planet>(`/api/planets/${encodeURIComponent(routeId)}`, signal),

  getDestinations: (signal?: AbortSignal) =>
    request<Destination[]>('/api/destinations', signal),
}