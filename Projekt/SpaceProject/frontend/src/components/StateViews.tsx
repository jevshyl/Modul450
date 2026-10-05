import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'

export function LoadingState({ label = 'Contacting mission control…' }: { label?: string }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, py: 10 }}>
      <CircularProgress size={44} thickness={4} />
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        {label}
      </Typography>
    </Box>
  )
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <Alert
      severity="error"
      sx={{ borderRadius: 3, alignItems: 'center' }}
      action={
        onRetry ? (
          <Button color="inherit" size="small" onClick={onRetry}>
            Retry
          </Button>
        ) : undefined
      }
    >
      <AlertTitle>Transmission failed</AlertTitle>
      {message}
    </Alert>
  )
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <Box sx={{ textAlign: 'center', py: 10, color: 'text.secondary' }}>
      <RocketLaunchIcon sx={{ fontSize: 46, opacity: 0.5, mb: 1 }} />
      <Typography variant="h4" sx={{ color: 'text.primary', mb: 0.5 }}>
        {title}
      </Typography>
      {hint ? <Typography variant="body2">{hint}</Typography> : null}
    </Box>
  )
}