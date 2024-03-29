// https://playwright.dev/docs
// npm init playwright@latest

// cd tests
// npx playwright test 
// npx playwright test --ui
// npx playwright test --headed
// npx playwright test login.spec.js --headed 
// npx playwright test login.spec.js --project=chromium --headed 
// npx playwright test --project=firefox --headed --reporter=list

import { test, expect } from '@playwright/test'

test.describe('Open login page and log in as admin', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000')
    await expect(page).toHaveTitle(/Shop/)
    await expect(page.locator('#basic-navbar-nav')).toBeVisible()
  })

  test('Login', async ({ page }) => {
    await expect(page.locator('#login')).toBeVisible()
    await page.click('#login')
    
    await expect(page.locator('#email')).toBeVisible()
    await expect(page.locator('#password')).toBeVisible()
    await expect(page.locator('#sign-in')).toBeVisible()

    await page.locator('#email').pressSequentially('admin@email.com')
    await page.locator('#password').pressSequentially('12345')
    await page.click('#sign-in')

    await page.locator('.Toastify__toast-body').waitFor({state: 'visible'})
    await expect(page.locator('#username')).toContainText('admin')
  })
})