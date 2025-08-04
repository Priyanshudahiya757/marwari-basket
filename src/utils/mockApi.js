// Clean Mock API - No Mock Data
// All API calls will go to the real backend

const mockApi = {};

// Clean fetch function - no mock data
export const mockFetch = async (url, options = {}) => {
  // Don't intercept any calls - let them go to real API
  throw new Error('Mock API disabled - using real backend');
};

// Don't override fetch in any environment
export default mockApi; 