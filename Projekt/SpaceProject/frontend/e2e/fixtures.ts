import type { Page } from '@playwright/test'
import type { Destination, Planet } from '../src/api/types'

/**
 * Deterministic planet fixtures. Values are chosen so the suite covers both
 * explorability branches: Moon and Terra sit inside the suit tolerance bands
 * (100–500 K, 0.1–3.0 m/s²), Mars and Venus fall outside them.
 */
export const PLANETS: Planet[] = [
  {
    id: 'mars',
    routeId: 'mars',
    name: 'Mars',
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
    info: 'Planet Mars\nID: mars\nGravity: 3.71 m/s²',
  },
  {
    id: 'venus',
    routeId: 'venus',
    name: 'Venus',
    gravity: 8.87,
    temperatureKelvin: 737,
    temperatureCelsius: 463.8,
    mass: 4.87e24,
    volume: 9.28e11,
    discoveryDate: '',
    discoveredBy: '',
    explorable: false,
    notExplorableReason: 'Temperature too high even for a suit!',
    aircraft: '420',
    info: 'Planet Venus\nID: venus\nGravity: 8.87 m/s²',
  },
  {
    id: 'lune',
    routeId: 'moon',
    name: 'Moon',
    gravity: 1.62,
    temperatureKelvin: 250,
    temperatureCelsius: -23.15,
    mass: 7.35e22,
    volume: 2.2e10,
    discoveryDate: '',
    discoveredBy: '',
    explorable: true,
    notExplorableReason: '',
    aircraft: '101',
    info: 'Planet Moon\nID: lune\nGravity: 1.62 m/s²',
  },
  {
    id: 'terra',
    routeId: 'terra',
    name: 'Terra Nova',
    gravity: 1.0,
    temperatureKelvin: 288,
    temperatureCelsius: 14.85,
    mass: 5.97e24,
    volume: 1.08e12,
    discoveryDate: '2287',
    discoveredBy: 'Deep Field Survey',
    explorable: true,
    notExplorableReason: '',
    aircraft: '001',
    info: 'Planet Terra Nova\nID: terra\nGravity: 1.0 m/s²',
  },
]

export const DESTINATIONS: Destination[] = [
  { menuNumber: 1, name: 'MARS', planetId: 'mars', aircraft: '350' },
  { menuNumber: 2, name: 'VENUS', planetId: 'venus', aircraft: '420' },
  { menuNumber: 3, name: 'MOON', planetId: 'moon', aircraft: '101' },
]

/**
 * Intercepts every backend call the SPA makes, so the suite is hermetic:
 * no Spring Boot instance and no outbound Solar System API access required.
 */
export async function mockSpaceApi(page: Page) {
  await page.route('**/api/destinations', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(DESTINATIONS) }),
  )

  await page.route('**/api/planets', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(PLANETS) }),
  )

  await page.route('**/api/planets/*', (route) => {
    const routeId = new URL(route.request().url()).pathname.split('/').pop()
    const planet = PLANETS.find((p) => p.routeId === routeId)

    if (!planet) {
      return route.fulfill({
        status: 404,
        contentType: 'application/problem+json',
        body: JSON.stringify({ title: 'Not Found', detail: `No telemetry for ${routeId}` }),
      })
    }

    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(planet),
    })
  })
}
