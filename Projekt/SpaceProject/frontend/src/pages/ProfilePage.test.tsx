import { ThemeProvider } from '@mui/material/styles'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { theme } from '../theme/theme'
import ProfilePage from './ProfilePage'

const fetchMock = vi.fn()

const STORAGE_KEY = 'spacexplorer-user'
const API_URL = 'http://localhost:8080/api/users'
const USER_ID = '22222222-2222-2222-2222-222222222222'

type StoredUser = { id: string; username: string; exploredPlanets: string[] }

function user(exploredPlanets: string[] = []): StoredUser {
  return { id: USER_ID, username: 'Alice', exploredPlanets }
}

function response(status: number, body: unknown = {}) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
    text: async () => '',
  }
}

function storeUser(stored: StoredUser) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stored))
}

function renderPage() {
  return render(
    <ThemeProvider theme={theme}>
      <ProfilePage />
    </ThemeProvider>,
  )
}

describe('ProfilePage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    vi.stubGlobal('fetch', fetchMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  describe('without a saved explorer', () => {
    it('shows the create-profile form', () => {
      renderPage()

      expect(screen.getByRole('heading', { name: 'Explorer Profile' })).toBeInTheDocument()
      expect(screen.getByText('Begin your journey')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Create explorer' })).toBeDisabled()
      expect(fetchMock).not.toHaveBeenCalled()
    })

    it('enables the button once a username is typed', () => {
      renderPage()

      fireEvent.change(screen.getByLabelText(/Explorer username/), {
        target: { value: 'Alice' },
      })

      expect(screen.getByRole('button', { name: 'Create explorer' })).toBeEnabled()
    })

    it('creates a profile and shows it', async () => {
      fetchMock.mockResolvedValue(response(201, user()))
      renderPage()

      fireEvent.change(screen.getByLabelText(/Explorer username/), {
        target: { value: '  Alice  ' },
      })
      fireEvent.click(screen.getByRole('button', { name: 'Create explorer' }))

      expect(await screen.findByText('Alice')).toBeInTheDocument()
      expect(screen.getByText(USER_ID)).toBeInTheDocument()

      const [url, options] = fetchMock.mock.calls[0]
      expect(url).toBe(API_URL)
      expect(options.method).toBe('POST')
      expect(JSON.parse(options.body)).toEqual({ username: 'Alice' })

      expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')).toEqual(user())
    })

    it('shows a message when the username is already taken', async () => {
      fetchMock.mockResolvedValue(response(409))
      renderPage()

      fireEvent.change(screen.getByLabelText(/Explorer username/), {
        target: { value: 'Alice' },
      })
      fireEvent.click(screen.getByRole('button', { name: 'Create explorer' }))

      expect(await screen.findByText('This username is already taken.')).toBeInTheDocument()
      expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
    })

    it('shows a message when the username is invalid', async () => {
      fetchMock.mockResolvedValue(response(400))
      renderPage()

      fireEvent.change(screen.getByLabelText(/Explorer username/), {
        target: { value: 'Alice' },
      })
      fireEvent.click(screen.getByRole('button', { name: 'Create explorer' }))

      expect(await screen.findByText('Please enter a valid username.')).toBeInTheDocument()
    })

    it('shows a generic message for other server errors', async () => {
      fetchMock.mockResolvedValue(response(500))
      renderPage()

      fireEvent.change(screen.getByLabelText(/Explorer username/), {
        target: { value: 'Alice' },
      })
      fireEvent.click(screen.getByRole('button', { name: 'Create explorer' }))

      expect(await screen.findByText('Could not create profile (500).')).toBeInTheDocument()
    })

    it('shows an error when the backend cannot be reached', async () => {
      fetchMock.mockRejectedValue(new Error('Failed to fetch'))
      renderPage()

      fireEvent.change(screen.getByLabelText(/Explorer username/), {
        target: { value: 'Alice' },
      })
      fireEvent.click(screen.getByRole('button', { name: 'Create explorer' }))

      expect(await screen.findByText('Failed to fetch')).toBeInTheDocument()
    })
  })

  describe('with a saved explorer', () => {
    it('shows the explorer and an empty-state hint when nothing was explored', async () => {
      storeUser(user())
      fetchMock.mockResolvedValue(response(200, user()))

      renderPage()

      expect(screen.getByText('Alice')).toBeInTheDocument()
      expect(screen.getByText('Explored planets')).toBeInTheDocument()
      expect(
        screen.getByText('Your discoveries will appear here as you explore.'),
      ).toBeInTheDocument()
      await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1))
    })

    it('lists the explored planets', async () => {
      storeUser(user(['mars', 'venus']))
      fetchMock.mockResolvedValue(response(200, user(['mars', 'venus'])))

      renderPage()

      expect(screen.getByText('2 planets visited')).toBeInTheDocument()
      expect(screen.getByText('mars')).toBeInTheDocument()
      expect(screen.getByText('venus')).toBeInTheDocument()
      await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1))
    })

    it('uses the singular form for one explored planet', async () => {
      storeUser(user(['mars']))
      fetchMock.mockResolvedValue(response(200, user(['mars'])))

      renderPage()

      expect(screen.getByText('1 planet visited')).toBeInTheDocument()
      await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1))
    })

    it('refreshes the explored planets from the backend', async () => {
      storeUser(user())
      fetchMock.mockResolvedValue(response(200, user(['earth'])))

      renderPage()

      expect(await screen.findByText('1 planet visited')).toBeInTheDocument()
      expect(screen.getByText('earth')).toBeInTheDocument()
      expect(fetchMock.mock.calls[0][0]).toBe(`${API_URL}/${USER_ID}`)
      expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}').exploredPlanets).toEqual([
        'earth',
      ])
    })

    it('returns to the create form when the backend no longer knows the explorer', async () => {
      storeUser(user(['mars']))
      fetchMock.mockResolvedValue(response(404))

      renderPage()

      expect(await screen.findByText('Begin your journey')).toBeInTheDocument()
      expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
    })

    it('keeps the saved explorer when the backend is unreachable', async () => {
      storeUser(user(['mars']))
      fetchMock.mockRejectedValue(new Error('Failed to fetch'))

      renderPage()

      await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1))
      expect(screen.getByText('Alice')).toBeInTheDocument()
      expect(screen.getByText('mars')).toBeInTheDocument()
      expect(localStorage.getItem(STORAGE_KEY)).not.toBeNull()
    })

    it('lets the explorer switch profiles', async () => {
      storeUser(user())
      fetchMock.mockResolvedValue(response(200, user()))

      renderPage()
      await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1))

      fireEvent.click(screen.getByRole('button', { name: 'Switch explorer' }))

      expect(await screen.findByText('Begin your journey')).toBeInTheDocument()
      expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
    })
  })
})
