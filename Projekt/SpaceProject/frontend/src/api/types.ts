export interface Planet {
  id: string
  routeId: string
  name: string
  gravity: number
  temperatureKelvin: number
  temperatureCelsius: number
  mass: number
  volume: number
  discoveryDate: string | null
  discoveredBy: string | null
  explorable: boolean
  notExplorableReason: string
  aircraft: string | null
  info: string
}

export interface Destination {
  menuNumber: number
  name: string
  planetId: string
  aircraft: string
}

export interface ProblemDetail {
  title?: string
  detail?: string
  status?: number
}