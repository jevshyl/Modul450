import { expect, test } from '@playwright/test'
import { mockSpaceApi } from './fixtures'

test.describe('Trip simulation', () => {
  test.beforeEach(async ({ page }) => {
    await mockSpaceApi(page)
    await page.goto('/simulate')
  })

  test('lists the flight-plan destinations', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Trip simulation' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Fly to MARS' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Fly to VENUS' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Fly to MOON' })).toBeVisible()
  })

  test('runs the full launch sequence for an explorable body', async ({ page }) => {
    await page.getByRole('button', { name: 'Fly to MOON' }).click()

    await expect(page.getByRole('heading', { name: 'Blast off!' })).toBeVisible({ timeout: 15_000 })
    await expect(page.getByRole('heading', { name: 'Arrived at Moon' })).toBeVisible({ timeout: 15_000 })

    await expect(page.getByRole('heading', { name: 'Exploring planet Moon!' })).toBeVisible({
      timeout: 15_000,
    })
  })

  test('reports a failed exploration attempt for a blocked body', async ({ page }) => {
    await page.getByRole('button', { name: 'Fly to MARS' }).click()

    await expect(page.getByRole('heading', { name: 'Cannot explore Mars' })).toBeVisible({
      timeout: 15_000,
    })
    await expect(page.getByText('Gravity too high → you would be crushed!').first()).toBeVisible()
  })

  test('pre-selects a destination passed via the query string', async ({ page }) => {
    await page.goto('/simulate?destination=mars')

    await expect(page.getByRole('heading', { name: 'Cannot explore Mars' })).toBeVisible({
      timeout: 15_000,
    })
  })

  test('can start a new trip after a completed one', async ({ page }) => {
    await page.getByRole('button', { name: 'Fly to MOON' }).click()
    await expect(page.getByRole('heading', { name: 'Exploring planet Moon!' })).toBeVisible({
      timeout: 15_000,
    })

    await page.getByRole('button', { name: 'New destination' }).click()

    await expect(page.getByRole('button', { name: 'Fly to MARS' })).toBeVisible()
  })
})
