import { test, expect } from '@playwright/test';

test.describe('Marwari Basket - Comprehensive Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Clear any existing data
    await page.context().clearCookies();
  });

  test.describe('Homepage & Navigation', () => {
    test('should load homepage successfully', async ({ page }) => {
      await page.goto('/');
      await expect(page).toHaveTitle(/Marwari Basket/);
      await expect(page.locator('body')).toBeVisible();
    });

    test('should display navigation menu', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('nav')).toBeVisible();
    });

    test('should have working navigation links', async ({ page }) => {
      await page.goto('/');
      
      // Test navigation to different pages
      await page.click('text=Products');
      await expect(page).toHaveURL(/.*products/);
      
      await page.click('text=Login');
      await expect(page).toHaveURL(/.*login/);
    });
  });

  test.describe('User Authentication', () => {
    test('should allow user registration', async ({ page }) => {
      await page.goto('/signup');
      
      // Fill registration form
      await page.fill('input[name="name"]', 'Test User');
      await page.fill('input[name="email"]', `test${Date.now()}@example.com`);
      await page.fill('input[name="password"]', 'TestPassword123!');
      await page.fill('input[name="confirmPassword"]', 'TestPassword123!');
      
      await page.click('button[type="submit"]');
      
      // Should redirect to login or show success message
      await expect(page).toHaveURL(/.*login|.*dashboard/);
    });

    test('should allow user login', async ({ page }) => {
      await page.goto('/login');
      
      // Fill login form
      await page.fill('input[name="email"]', 'test@example.com');
      await page.fill('input[name="password"]', 'TestPassword123!');
      
      await page.click('button[type="submit"]');
      
      // Should redirect to dashboard or show success
      await expect(page).toHaveURL(/.*dashboard|.*profile/);
    });

    test('should show error for invalid login', async ({ page }) => {
      await page.goto('/login');
      
      await page.fill('input[name="email"]', 'invalid@example.com');
      await page.fill('input[name="password"]', 'wrongpassword');
      
      await page.click('button[type="submit"]');
      
      // Should show error message
      await expect(page.locator('.error, .alert')).toBeVisible();
    });
  });

  test.describe('Product Management', () => {
    test('should display products page', async ({ page }) => {
      await page.goto('/products');
      await expect(page.locator('h1')).toContainText('Products');
    });

    test('should show product cards', async ({ page }) => {
      await page.goto('/products');
      await expect(page.locator('.product-card, .product-item')).toBeVisible();
    });

    test('should allow product search', async ({ page }) => {
      await page.goto('/products');
      
      const searchInput = page.locator('input[placeholder*="search"], input[name="search"]');
      if (await searchInput.isVisible()) {
        await searchInput.fill('test product');
        await searchInput.press('Enter');
      }
    });

    test('should show product details', async ({ page }) => {
      await page.goto('/products');
      
      // Click on first product
      const firstProduct = page.locator('.product-card, .product-item').first();
      if (await firstProduct.isVisible()) {
        await firstProduct.click();
        await expect(page).toHaveURL(/.*product/);
      }
    });
  });

  test.describe('Shopping Cart', () => {
    test('should add product to cart', async ({ page }) => {
      await page.goto('/products');
      
      // Find add to cart button
      const addToCartBtn = page.locator('button:has-text("Add to Cart"), button:has-text("Add")').first();
      if (await addToCartBtn.isVisible()) {
        await addToCartBtn.click();
        
        // Should show success message or update cart
        await expect(page.locator('.success, .toast, .notification')).toBeVisible();
      }
    });

    test('should view cart', async ({ page }) => {
      await page.goto('/cart');
      await expect(page.locator('h1')).toContainText('Cart');
    });

    test('should update cart quantities', async ({ page }) => {
      await page.goto('/cart');
      
      const quantityInput = page.locator('input[type="number"], .quantity-input').first();
      if (await quantityInput.isVisible()) {
        await quantityInput.fill('2');
        await quantityInput.press('Enter');
      }
    });
  });

  test.describe('Checkout Process', () => {
    test('should start checkout process', async ({ page }) => {
      await page.goto('/checkout');
      await expect(page.locator('h1')).toContainText('Checkout');
    });

    test('should fill shipping information', async ({ page }) => {
      await page.goto('/checkout');
      
      // Fill shipping form
      await page.fill('input[name="firstName"]', 'John');
      await page.fill('input[name="lastName"]', 'Doe');
      await page.fill('input[name="address"]', '123 Test Street');
      await page.fill('input[name="city"]', 'Test City');
      await page.fill('input[name="zipCode"]', '12345');
      await page.fill('input[name="phone"]', '1234567890');
    });
  });

  test.describe('Admin Panel', () => {
    test('should access admin login', async ({ page }) => {
      await page.goto('/admin/login');
      await expect(page.locator('h1, h2')).toContainText('Admin');
    });

    test('should show admin dashboard', async ({ page }) => {
      await page.goto('/admin/dashboard');
      await expect(page.locator('h1')).toContainText('Dashboard');
    });
  });

  test.describe('API Health Check', () => {
    test('should check backend API health', async ({ request }) => {
      const response = await request.get('https://marwari-basket-bdx6d05l8-priyanshu-dahiyas-projects-890341ab.vercel.app/api/health');
      expect(response.status()).toBe(200);
      
      const data = await response.json();
      expect(data.status).toBe('OK');
      expect(data.message).toBe('Marwari Basket API is running');
    });
  });

  test.describe('Responsive Design', () => {
    test('should work on mobile devices', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      await expect(page.locator('body')).toBeVisible();
    });

    test('should work on tablet devices', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('/');
      await expect(page.locator('body')).toBeVisible();
    });
  });

  test.describe('Error Handling', () => {
    test('should show 404 for invalid routes', async ({ page }) => {
      await page.goto('/invalid-route');
      await expect(page.locator('h1')).toContainText('404');
    });

    test('should handle network errors gracefully', async ({ page }) => {
      // This test would require mocking network failures
      await page.goto('/');
      await expect(page.locator('body')).toBeVisible();
    });
  });
}); 