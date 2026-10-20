import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PlanetOrb } from './PlanetOrb'

describe('PlanetOrb', () => {
  it('exposes an accessible label for the body', () => {
    render(<PlanetOrb planetId="mars" />)

    expect(screen.getByRole('img', { name: 'mars planet visual' })).toBeInTheDocument()
  })

  it('renders a ring for ringed bodies', () => {
    const { container } = render(<PlanetOrb planetId="saturn" />)

    expect(container.querySelectorAll('div')).toHaveLength(2)
  })
})
