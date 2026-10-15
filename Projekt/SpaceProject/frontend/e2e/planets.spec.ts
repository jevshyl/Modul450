import { expect, test } from '@playwright/test'
import { mockSpaceApi } from './fixtures'

test.describe('Solar catalogue', () => {
  test.beforeEach(async ({ page }) => {
    await mockSpaceApi(page)
    await page.goto('/planets')
  })

  test('lists every destination returned by the API', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Solar Catalogue' })).toBeVisible()

    const grid = page.getByRole('grid')
    await expect(grid.getByText('Mars', { exact: true })).toBeVisible()
    await expect(grid.getByText('Venus', { exact: true })).toBeVisible()
    await expect(grid.getByText('Moon', { exact: true })).toBeVisible()
    await expect(grid.getByText('Terra Nova', { exact: true })).toBeVisible()
  })

  test('shows explorability status per body', async ({ page }) => {
    const grid = page.getByRole('grid')
    await expect(grid.getByText('Explorable', { exact: true })).toHaveCount(2)
    await expect(grid.getByText('Not explorable', { exact: true })).toHaveCount(2)
  })

  test('filters down to explorable bodies only', async ({ page }) => {
    await page.getByRole('combobox').first().click()
    await page.getByRole('option', { name: 'Explorable only' }).click()

    const grid = page.getByRole('grid')
    await expect(grid.getByText('Moon', { exact: true })).toBeVisible()
    await expect(grid.getByText('Terra Nova', { exact: true })).toBeVisible()
    await expect(grid.getByText('Mars', { exact: true })).toBeHidden()
    await expect(grid.getByText('Venus', { exact: true })).toBeHidden()
  })

  test('filters down to blocked bodies only', async ({ page }) => {
    await page.getByRole('combobox').first().click()
    await page.getByRole('option', { name: 'Not explorable' }).click()

    const grid = page.getByRole('grid')
    await expect(grid.getByText('Mars', { exact: true })).toBeVisible()
    await expect(grid.getByText('Venus', { exact: true })).toBeVisible()
    await expect(grid.getByText('Terra Nova', { exact: true })).toBeHidden()
  })

  test('search narrows the catalogue by name', async ({ page }) => {
    await page.getByPlaceholder('Search bodies…').fill('ven')

    const grid = page.getByRole('grid')
    await expect(grid.getByText('Venus', { exact: true })).toBeVisible()
    await expect(grid.getByText('Mars', { exact: true })).toBeHidden()
  })

  test('shows an empty state when nothing matches', async ({ page }) => {
    await page.getByPlaceholder('Search bodies…').fill('nothing-matches-this')

    await expect(page.getByText('No bodies match your filters.')).toBeVisible()
  })
})

test.describe('Planet detail', () => {
  test.beforeEach(async ({ page }) => {
    await mockSpaceApi(page)
  })

  test('opens from the catalogue and renders telemetry', async ({ page }) => {
    await page.goto('/planets')
    await page.getByRole('grid').getByRole('button', { name: 'Explore' }).first().click()

    await expect(page).toHaveURL(/\/planets\/mars$/)
    await expect(page.getByRole('heading', { name: 'Mars', level: 1 })).toBeVisible()
    // Gravity is rendered both in the stat tile and the raw survey log.
    await expect(page.getByText('3.71 m/s²').first()).toBeVisible()
    await expect(page.getByText('-63.1 °C').first()).toBeVisible()
  })

  test('explains why a body cannot be explored', async ({ page }) => {
    await page.goto('/planets/mars')

    await expect(page.getByText('Not explorable')).toBeVisible()
    await expect(page.getByText('Gravity too high → you would be crushed!').first()).toBeVisible()
  })

  test('confirms a body that is cleared for exploration', async ({ page }) => {
    await page.goto('/planets/moon')

    await expect(page.getByText('Explorable')).toBeVisible()
    await expect(
      page.getByText('Suit-rated conditions confirmed. This body is cleared for a surface excursion.'),
    ).toBeVisible()
  })

  test('renders the raw survey log', async ({ page }) => {
    await page.goto('/planets/mars')
    await expect(page.getByText('Raw survey log')).toBeVisible()
    await expect(page.getByText('Planet Mars')).toBeVisible()
  })

  test('shows an unknown-destination state for an unresolvable route', async ({ page }) => {
    await page.goto('/planets/does-not-exist')

    await expect(page.getByText('Unknown destination')).toBeVisible()
  })
})

test.describe('Accessibility basics', () => {
  test('catalogue page exposes a single h1', async ({ page }) => {
    await mockSpaceApi(page)
    await page.goto('/planets')

    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
  })
})
