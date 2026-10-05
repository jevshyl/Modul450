import { useCallback, useEffect, useState } from 'react'
import { planetApi, ApiError } from '../api/client'
import type { Destination, Planet } from '../api/types'

interface AsyncState<T> {
  data: T | null
  loading: boolean
  error: string | null
  reload: () => void
}

function useAsync<T>(loader: (signal: AbortSignal) => Promise<T>): AsyncState<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [nonce, setNonce] = useState(0)

  const reload = useCallback(() => setNonce((n) => n + 1), [])

  useEffect(() => {
    const controller = new AbortController()
    let active = true

    setLoading(true)
    setError(null)

    loader(controller.signal)
      .then((result) => {
        if (active) setData(result)
      })
      .catch((cause: unknown) => {
        if (!active || controller.signal.aborted) return
        setError(cause instanceof ApiError ? cause.message : 'Something went wrong while loading data.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
      controller.abort()
    }
  }, [nonce, loader])

  return { data, loading, error, reload }
}

export const usePlanets = () => useAsync<Planet[]>(planetApi.getPlanets)

export const useDestinations = () => useAsync<Destination[]>(planetApi.getDestinations)

export const usePlanet = (routeId: string | undefined) => {
  const loader = useCallback(
    (signal: AbortSignal) => planetApi.getPlanet(routeId ?? '', signal),
    [routeId],
  )
  return useAsync<Planet>(loader)
}