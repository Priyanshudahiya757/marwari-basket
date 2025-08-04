import { test, expect } from '@playwright/test';

test.describe('Debug Test', () => {
  test('debug products page', async ({ page }) => {
    await page.goto('/products');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Take a screenshot
    await page.screenshot({ path: 'debug-products.png' });
    
    // Check if page has any content
    const bodyText = await page.textContent('body');
    console.log('Body text:', bodyText);
    
    // Check if there are any h1 elements
    const h1Elements = await page.locator('h1').count();
    console.log('H1 elements count:', h1Elements);
    
    // Check if page is visible
    await expect(page.locator('body')).toBeVisible();
  });

  test('debug cart page', async ({ page }) => {
    await page.goto('/cart');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Take a screenshot
    await page.screenshot({ path: 'debug-cart.png' });
    
    // Check if page has any content
    const bodyText = await page.textContent('body');
    console.log('Body text:', bodyText);
    
    // Check if there are any h1 elements
    const h1Elements = await page.locator('h1').count();
    console.log('H1 elements count:', h1Elements);
    
    // Check if page is visible
    await expect(page.locator('body')).toBeVisible();
  });
}); 