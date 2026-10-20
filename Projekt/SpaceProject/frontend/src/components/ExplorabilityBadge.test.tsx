import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ExplorabilityBadge } from './ExplorabilityBadge'

describe('ExplorabilityBadge', () => {
  it('labels an explorable body', () => {
    render(<ExplorabilityBadge explorable />)

    expect(screen.getByText('Explorable')).toBeInTheDocument()
  })

  it('labels a blocked body', () => {
    render(<ExplorabilityBadge explorable={false} />)

    expect(screen.getByText('Not explorable')).toBeInTheDocument()
  })

  it('exposes the reason as a title for blocked bodies', () => {
    render(
      <ExplorabilityBadge explorable={false} reason="Gravity too high → you would be crushed!" />,
    )

    expect(
      screen.getByTitle('Gravity too high → you would be crushed!'),
    ).toBeInTheDocument()
  })
})
