import { test, expect } from '@playwright/test';

test.describe('Debug Clean State', () => {
  test('debug products page content', async ({ page }) => {
    await page.goto('/products');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Take a screenshot
    await page.screenshot({ path: 'debug-clean-products.png' });
    
    // Check if page has any content
    const bodyText = await page.textContent('body');
    console.log('Body text:', bodyText);
    
    // Check if there are any h1 elements
    const h1Elements = await page.locator('h1').count();
    console.log('H1 elements count:', h1Elements);
    
    // Check if page is visible
    await expect(page.locator('body')).toBeVisible();
    
    // Check if "No products found" text exists
    const noProductsText = await page.locator('text=No products found').count();
    console.log('No products found text count:', noProductsText);
    
    // Check if "Products" text exists
    const productsText = await page.locator('text=Products').count();
    console.log('Products text count:', productsText);
  });

  test('debug homepage content', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Take a screenshot
    await page.screenshot({ path: 'debug-clean-home.png' });
    
    // Check if page has any content
    const bodyText = await page.textContent('body');
    console.log('Homepage body text:', bodyText);
    
    // Check if page is visible
    await expect(page.locator('body')).toBeVisible();
  });
}); 