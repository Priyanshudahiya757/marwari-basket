import { test, expect } from '@playwright/test';

test.describe('Simple API Test', () => {
  test('Check API response status', async ({ request }) => {
    const baseURL = 'https://marwari-basket-bdx6d05l8-priyanshu-dahiyas-projects-890341ab.vercel.app';
    
    // Test health endpoint
    const healthResponse = await request.get(`${baseURL}/api/health`);
    console.log('Health Response Status:', healthResponse.status());
    console.log('Health Response Headers:', healthResponse.headers());
    
    if (healthResponse.status() === 200) {
      const data = await healthResponse.json();
      console.log('Health Response Data:', data);
    } else {
      const text = await healthResponse.text();
      console.log('Health Response Text:', text);
    }
    
    // Test root endpoint
    const rootResponse = await request.get(`${baseURL}/`);
    console.log('Root Response Status:', rootResponse.status());
    
    if (rootResponse.status() === 200) {
      const text = await rootResponse.text();
      console.log('Root Response Text:', text);
    }
  });
}); 