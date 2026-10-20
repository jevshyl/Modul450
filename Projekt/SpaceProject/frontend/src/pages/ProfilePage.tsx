import {useState, type FormEvent} from 'react'
import PersonIcon from '@mui/icons-material/Person'
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'
import ExploreIcon from '@mui/icons-material/Explore'
import {
    Alert,
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Divider,
    Stack,
    TextField,
    Typography,
} from '@mui/material'

type User = {
    id: string
    username: string
    exploredPlanets: string[]
}

const API_URL = 'http://localhost:8080/api/users'
const STORAGE_KEY = 'spacexplorer-user'

export default function ProfilePage() {
    const [username, setUsername] = useState('')
    const [user, setUser] = useState<User | null>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY)
            return saved ? JSON.parse(saved) as User : null
        } catch {
            return null
        }
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    async function createUser(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setError('')

        const trimmedUsername = username.trim()

        if (!trimmedUsername) {
            setError('Please enter a username.')
            return
        }

        setLoading(true)

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({username: trimmedUsername}),
            })

            if (!response.ok) {
                if (response.status === 409) {
                    throw new Error('This username is already taken.')
                }
                if (response.status === 400) {
                    throw new Error('Please enter a valid username.')
                }
                throw new Error(`Could not create profile (${response.status}).`)
            }

            const createdUser = await response.json() as User

            setUser(createdUser)
            localStorage.setItem(STORAGE_KEY, JSON.stringify(createdUser))
            setUsername('')
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Something went wrong while creating your profile.',
            )
        } finally {
            setLoading(false)
        }
    }

    function forgetSelectedUser() {
        localStorage.removeItem(STORAGE_KEY)
        setUser(null)
        setError('')
    }

    return (
        <Box sx={{maxWidth: 760, mx: 'auto'}}>
            <Stack spacing={1} sx={{mb: 4}}>
                <Typography
                    variant="overline"
                    sx={{color: 'primary.main', fontWeight: 700}}
                >
                    SPACE EXPLORATION
                </Typography>

                <Typography
                    variant="h3"
                    sx={{color: 'primary.main', fontWeight: 800}}
                >
                    Explorer Profile
                </Typography>

                <Typography color="text.secondary">
                    Create your explorer identity and keep track of your journey
                    through the solar system.
                </Typography>
            </Stack>

            {error && (
                <Alert severity="error" sx={{mb: 3}}>
                    {error}
                </Alert>
            )}

            {user ? (
                <Card variant="outlined" sx={{borderRadius: 4}}>
                    <CardContent sx={{p: {xs: 3, sm: 4}}}>
                        <Stack spacing={3}>
                            <Stack
                                direction="row"
                                spacing={2}
                                sx={{alignItems: 'center'}}
                            >
                                <Avatar
                                    sx={{
                                        width: 64,
                                        height: 64,
                                        bgcolor: 'primary.main',
                                    }}
                                >
                                    <PersonIcon fontSize="large"/>
                                </Avatar>

                                <Box sx={{minWidth: 0}}>
                                    <Typography
                                        variant="h5"
                                        sx={{color: 'primary.main', fontWeight: 700}}
                                    >
                                        {user.username}
                                    </Typography>
                                    <Typography color="text.secondary">
                                        SpaceXplorer
                                    </Typography>
                                </Box>
                            </Stack>

                            <Divider/>

                            <Box>
                                <Typography
                                    variant="caption"
                                    sx={{color: 'text.secondar', display: "block"}}
                                >
                                    EXPLORER ID
                                </Typography>
                                <Typography sx={{overflowWrap: 'anywhere'}}>
                                    {user.id}
                                </Typography>
                            </Box>

                            <Stack
                                direction="row"
                                spacing={2}
                                sx={{alignItems: 'center'}}
                            >
                                <ExploreIcon color="primary" fontSize="large"/>
                                <Box>
                                    <Typography>
                                        {user.exploredPlanets?.length ?? 0} explored planets
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Your discoveries will appear here as you explore.
                                    </Typography>
                                </Box>
                            </Stack>

                            <Divider/>

                            <Button
                                variant="outlined"
                                color="inherit"
                                onClick={forgetSelectedUser}
                            >
                                Switch explorer
                            </Button>
                        </Stack>
                    </CardContent>
                </Card>
            ) : (
                <Card variant="outlined" sx={{borderRadius: 4}}>
                    <CardContent sx={{p: {xs: 3, sm: 4}}}>
                        <Stack spacing={3}>
                            <Avatar
                                sx={{
                                    width: 56,
                                    height: 56,
                                    bgcolor: 'primary.main',
                                }}
                            >
                                <RocketLaunchIcon fontSize="large"/>
                            </Avatar>

                            <Box>
                                <Typography variant="h5">
                                    Begin your journey
                                </Typography>
                                <Typography color="text.secondary" sx={{mt: 1}}>
                                    Choose a username to create your explorer profile.
                                </Typography>
                            </Box>

                            <Box component="form" onSubmit={createUser}>
                                <Stack spacing={2}>
                                    <TextField
                                        label="Explorer username"
                                        placeholder="e.g. CosmicAlex"
                                        value={username}
                                        onChange={(event) => setUsername(event.target.value)}
                                        fullWidth
                                        required
                                        autoComplete="username"
                                    />

                                    <Button
                                        type="submit"
                                        variant="contained"
                                        size="large"
                                        disabled={loading || !username.trim()}
                                        startIcon={
                                            loading
                                                ? <CircularProgress size={18} color="inherit"/>
                                                : <RocketLaunchIcon/>
                                        }
                                        sx={{
                                            py: 1.5,
                                            borderRadius: 3,
                                            fontWeight: 700,
                                        }}
                                    >
                                        {loading ? 'Creating profile…' : 'Create explorer'}
                                    </Button>
                                </Stack>
                            </Box>

                            <Typography variant="caption" color="text.secondary">
                                Your profile will be saved to the SpaceXplorer database.
                            </Typography>
                        </Stack>
                    </CardContent>
                </Card>
            )}
        </Box>
    )
}