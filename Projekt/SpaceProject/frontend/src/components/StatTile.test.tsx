import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { StatTile } from './StatTile'

describe('StatTile', () => {
  it('renders the label and value', () => {
    render(<StatTile label="Surface Gravity" value="3.71 m/s²" />)

    expect(screen.getByText('Surface Gravity')).toBeInTheDocument()
    expect(screen.getByText('3.71 m/s²')).toBeInTheDocument()
  })

  it('renders an icon when one is provided', () => {
    render(
      <StatTile label="Mass" value="1.0" hint="in kilograms" icon={<span data-testid="tile-icon" />} />,
    )

    expect(screen.getByTestId('tile-icon')).toBeInTheDocument()
  })
})
