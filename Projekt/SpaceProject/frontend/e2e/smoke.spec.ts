import { expect, test } from '@playwright/test'
import { mockSpaceApi } from './fixtures'

test('has the SpaceXplorer title', async ({ page }) => {
  await mockSpaceApi(page)
  await page.goto('/')

  await expect(page).toHaveTitle(/SpaceXplorer/)
})

test('home page opens the solar catalogue', async ({ page }) => {
  await mockSpaceApi(page)
  await page.goto('/')

  await expect(page.getByRole('heading', { name: 'Solar Catalogue' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Catalogue' })).toBeVisible()
})
