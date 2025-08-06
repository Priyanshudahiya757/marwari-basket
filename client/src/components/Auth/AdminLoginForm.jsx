import { useState } from 'react';
import api from '../../utils/api';
import { useUser } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

function AdminLoginForm() {
  const [emailOrMobile, setEmailOrMobile] = useState('');
  const [password, setPassword] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const { login: setUserToken } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    
    try {
      console.log('Attempting admin login with:', { emailOrMobile, password: '***' });
      
      const res = await api.post('/auth/login', {
        emailOrMobile,
        password,
      });
      
      console.log('Login response:', res.data);
      
      // Check if user is admin
      if (res.data.user && res.data.user.role === 'admin') {
        setUserToken(res.data.token);
        toast.success('Admin login successful!');
        navigate('/admin'); // Redirect to admin dashboard
      } else {
        toast.error('Access denied. Admin privileges required.');
        // Don't set token or redirect for non-admin users
      }
    } catch (error) {
      console.error('Admin login error:', error);
      
      // Handle specific error cases
      if (error.response?.status === 401) {
        toast.error('Invalid credentials. Please check your email and password.');
      } else if (error.response?.status === 500) {
        toast.error('Server error. Please try again later.');
      } else {
        toast.error('Login failed. Please try again.');
      }
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Admin Login
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Access the admin dashboard
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="emailOrMobile" className="block text-sm font-medium text-gray-700">
                Email or Mobile
              </label>
              <div className="mt-1">
                <input
                  id="emailOrMobile"
                  name="emailOrMobile"
                  type="text"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  placeholder="admin@marwaribasket.com"
                  value={emailOrMobile}
                  onChange={(e) => setEmailOrMobile(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={formLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {formLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Admin Credentials</span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                Email: admin@marwaribasket.com<br />
                Password: admin123
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLoginForm; 