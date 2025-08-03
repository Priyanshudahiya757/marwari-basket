import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';

export default function ResetPassword() {
  const { token } = useParams();
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  // Handle form submit
  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!form.password || !form.confirmPassword) {
      setError('All fields are required');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password: form.password, confirmPassword: form.confirmPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to reset password');
      setSuccess('Password reset successful! You can now login.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="pt-28 min-h-screen bg-gradient-to-br from-yellow-50 via-white to-pink-50 flex items-center justify-center font-sans">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md space-y-6">
        <h1 className="text-3xl font-serif font-bold mb-4 text-neutral-900 text-center">Reset Password</h1>
        {error && <div className="bg-red-100 text-red-700 p-2 rounded text-center">{error}</div>}
        {success && <div className="bg-green-100 text-green-700 p-2 rounded text-center">{success}</div>}
        <div>
          <label className="block font-semibold mb-1 text-neutral-800">New Password</label>
          <input type="password" name="password" value={form.password} onChange={handleChange} className="w-full border-2 border-yellow-200 rounded-lg px-3 py-2" placeholder="Enter new password" />
        </div>
        <div>
          <label className="block font-semibold mb-1 text-neutral-800">Confirm Password</label>
          <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} className="w-full border-2 border-yellow-200 rounded-lg px-3 py-2" placeholder="Confirm new password" />
        </div>
        <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-pink-600 to-yellow-400 text-white py-3 rounded-full font-semibold text-lg hover:scale-105 transition shadow disabled:opacity-50 disabled:cursor-not-allowed">{loading ? 'Resetting...' : 'Reset Password'}</button>
        <div className="flex justify-between text-sm mt-2">
          <Link to="/login" className="text-pink-600 hover:underline">Back to login</Link>
          <Link to="/signup" className="text-pink-600 hover:underline">Create account</Link>
        </div>
      </form>
    </main>
  );
} 