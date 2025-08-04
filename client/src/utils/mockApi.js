// Mock API responses for settings endpoints
const mockApi = {}; // Empty object - no mock data

export const mockFetch = async (url, options = {}) => {
  throw new Error('Mock API disabled - using real backend');
};

// Disable mock API override
if (typeof window !== 'undefined') {
  // Don't override fetch - use real API
}

export default mockApi; 