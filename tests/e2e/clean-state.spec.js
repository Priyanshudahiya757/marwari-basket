import { test, expect } from '@playwright/test';

test.describe('Clean State Test', () => {
  test('should show products page with API error (no products)', async ({ page }) => {
    await page.goto('/products');
    await expect(page.locator('h1')).toContainText('Products');
    
    // Should show "Failed to load products" message when API fails
    await expect(page.locator('h3:has-text("Failed to load products")')).toBeVisible();
    await expect(page.locator('p:has-text("Failed to load products. Please try again.")')).toBeVisible();
  });

  test('should show empty cart', async ({ page }) => {
    await page.goto('/cart');
    await expect(page.locator('h1')).toContainText('Shopping Cart');
    
    // Should show empty cart message
    await expect(page.locator('text=Your cart is empty')).toBeVisible();
    await expect(page.locator('text=Start shopping to add products to your cart')).toBeVisible();
    await expect(page.locator('text=Browse Products')).toBeVisible();
  });

  test('should show clean homepage', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Marwari Basket/);
    await expect(page.locator('body')).toBeVisible();
    
    // Should show "No products available" message
    await expect(page.locator('text=No products available')).toBeVisible();
    await expect(page.locator('text=Products will appear here once added to the database')).toBeVisible();
  });

  test('should show login page', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('body')).toBeVisible();
  });

  test('should show signup page', async ({ page }) => {
    await page.goto('/signup');
    await expect(page.locator('body')).toBeVisible();
  });
}); 