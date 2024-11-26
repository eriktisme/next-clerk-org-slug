import { test, expect } from '@playwright/test'

test('has sign in page', async ({ page }) => {
  await page.goto('sign-in')

  await expect(page).toHaveTitle(/Sign In/)
})

test('has sign up page', async ({ page }) => {
  await page.goto('sign-up')

  await expect(page).toHaveTitle(/Sign Up/)
})
