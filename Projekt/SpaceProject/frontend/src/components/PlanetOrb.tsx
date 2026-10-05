import { Box, type BoxProps } from '@mui/material'
import { paletteFor } from '../theme/planetFormat'

interface PlanetOrbProps extends Omit<BoxProps, 'children'> {
  planetId: string
  size?: number
  glowing?: boolean
}

/**
 * Pure-CSS planet sphere. Gradient stops approximate each body's real
 * surface colour so the UI needs no image assets.
 */
export function PlanetOrb({ planetId, size = 96, glowing = false, sx, ...rest }: PlanetOrbProps) {
  const palette = paletteFor(planetId)

  return (
    <Box
      role="img"
      aria-label={`${planetId} planet visual`}
      sx={{
        position: 'relative',
        width: size,
        height: size,
        borderRadius: '50%',
        flexShrink: 0,
        background: `radial-gradient(circle at 30% 26%, ${palette.light} 0%, ${palette.mid} 42%, ${palette.deep} 100%)`,
        boxShadow: glowing
          ? `0 0 42px ${palette.mid}66, inset -10px -12px 26px rgba(0,0,0,0.55)`
          : 'inset -7px -9px 20px rgba(0,0,0,0.5)',
        ...sx,
      }}
      {...rest}
    >
      {palette.ring ? (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: size * 1.85,
            height: size * 0.42,
            transform: 'translate(-50%, -50%) rotate(-16deg)',
            border: `2px solid ${palette.ring}`,
            borderRadius: '50%',
            pointerEvents: 'none',
          }}
        />
      ) : null}
    </Box>
  )
}