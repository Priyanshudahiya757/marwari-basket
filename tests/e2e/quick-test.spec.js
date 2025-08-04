import { test, expect } from '@playwright/test';

test.describe('Quick Frontend Test', () => {
  test('should load homepage with correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Marwari Basket/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('should navigate to products page', async ({ page }) => {
    await page.goto('/products');
    await expect(page.locator('h1')).toContainText('Products');
  });

  test('should navigate to cart page', async ({ page }) => {
    await page.goto('/cart');
    await expect(page.locator('h1')).toContainText('Shopping Cart');
  });

  test('should navigate to login page', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('body')).toBeVisible();
  });

  test('should navigate to signup page', async ({ page }) => {
    await page.goto('/signup');
    await expect(page.locator('body')).toBeVisible();
  });
}); 