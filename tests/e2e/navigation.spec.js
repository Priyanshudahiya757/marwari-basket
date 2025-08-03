import { test, expect } from '@playwright/test';

test.describe('Navigation Tests', () => {
  test('should navigate to home page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Marwari Basket/);
  });

  test('should navigate to products page', async ({ page }) => {
    await page.goto('/products');
    await expect(page.locator('h1')).toContainText('Products');
  });

  test('should navigate to login page', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('h2')).toContainText('Login to Your Account');
  });

  test('should navigate to signup page', async ({ page }) => {
    await page.goto('/signup');
    await expect(page.locator('h2')).toContainText('Create Your Account');
  });

  test('should show 404 for invalid route', async ({ page }) => {
    await page.goto('/invalid-route');
    await expect(page.locator('h1')).toContainText('404');
  });
}); 