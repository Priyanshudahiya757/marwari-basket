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
      const res = await api.post('/api/auth/login', {
        emailOrMobile,
        password,
      });
      
      // Check if user is admin
      if (res.data.user && res.data.user.role === 'admin') {
        setUserToken(res.data.token);
        toast.success('Admin login successful!');
        navigate('/admin'); // Redirect to admin dashboard
      } else {
        toast.error('Access denied. Admin privileges required.');
        // Don't set token or redirect for non-admin users
      }
    } catch {
      // Error handled by Axios interceptor
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
      <input
        type="text"
        placeholder="Email or Mobile"
        className="w-full mb-4 px-4 py-2 border rounded"
        value={emailOrMobile}
        onChange={(e) => setEmailOrMobile(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full mb-4 px-4 py-2 border rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit" className="w-full bg-red-600 text-white py-2 rounded font-semibold mb-2" disabled={formLoading}>
        {formLoading ? 'Logging in...' : 'Admin Login'}
      </button>
      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">Only admin users can access this panel</p>
      </div>
    </form>
  );
}

export default AdminLoginForm; 