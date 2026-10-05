import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined'
import Block from '@mui/icons-material/Block'
import Chip from '@mui/material/Chip'

interface ExplorabilityBadgeProps {
  explorable: boolean
  reason?: string
  size?: 'small' | 'medium'
}

export function ExplorabilityBadge({ explorable, reason, size = 'small' }: ExplorabilityBadgeProps) {
  return (
    <Chip
      size={size}
      icon={explorable ? <CheckCircleOutlined /> : <Block />}
      label={explorable ? 'Explorable' : 'Not explorable'}
      color={explorable ? 'success' : 'error'}
      variant={explorable ? 'filled' : 'outlined'}
      title={!explorable && reason ? reason : undefined}
      sx={{ fontWeight: 700 }}
    />
  )
}