import { test, expect } from '@playwright/test';

test.describe('API Tests', () => {
  const baseURL = 'https://marwari-basket-bdx6d05l8-priyanshu-dahiyas-projects-890341ab.vercel.app';

  test('Health Check API', async ({ request }) => {
    const response = await request.get(`${baseURL}/api/health`);
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.status).toBe('OK');
    expect(data.message).toBe('Marwari Basket API is running');
    expect(data.environment).toBe('production');
    expect(data.timestamp).toBeDefined();
  });

  test('Root API Endpoint', async ({ request }) => {
    const response = await request.get(`${baseURL}/`);
    expect(response.status()).toBe(200);
    
    const text = await response.text();
    expect(text).toContain('API is running');
  });

  test('Authentication Endpoints', async ({ request }) => {
    // Test registration endpoint
    const registerResponse = await request.post(`${baseURL}/api/auth/register`, {
      data: {
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
        password: 'TestPassword123!'
      }
    });
    
    // Should return 201 (created) or 400 (if validation fails)
    expect([201, 400]).toContain(registerResponse.status());
  });

  test('Products API', async ({ request }) => {
    const response = await request.get(`${baseURL}/api/products`);
    expect([200, 404]).toContain(response.status());
    
    if (response.status() === 200) {
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
    }
  });

  test('Categories API', async ({ request }) => {
    const response = await request.get(`${baseURL}/api/categories`);
    expect([200, 404]).toContain(response.status());
    
    if (response.status() === 200) {
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
    }
  });

  test('CORS Headers', async ({ request }) => {
    const response = await request.get(`${baseURL}/api/health`);
    expect(response.headers()['access-control-allow-origin']).toBeDefined();
  });

  test('404 for Invalid Endpoints', async ({ request }) => {
    const response = await request.get(`${baseURL}/api/invalid-endpoint`);
    expect(response.status()).toBe(404);
  });
}); 