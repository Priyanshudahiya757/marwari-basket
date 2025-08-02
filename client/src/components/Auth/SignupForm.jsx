import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export default function SignupForm() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '', terms: false });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  // Handle form submit
  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.password || !form.confirmPassword) {
      toast.error('All fields are required');
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (!form.terms) {
      toast.error('You must accept the terms and conditions');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      // Store JWT in localStorage (or cookie)
      localStorage.setItem('token', data.token);
      // Redirect to home or dashboard
      navigate('/');
    } catch {
      toast.error('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="pt-28 min-h-screen bg-gradient-to-br from-yellow-50 via-white to-pink-50 flex items-center justify-center font-sans">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md space-y-6">
        <h1 className="text-3xl font-serif font-bold mb-4 text-neutral-900 text-center">Sign Up</h1>
        <div>
          <label className="block font-semibold mb-1 text-neutral-800">Full Name</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} className="w-full border-2 border-yellow-200 rounded-lg px-3 py-2" placeholder="Enter your full name" />
        </div>
        <div>
          <label className="block font-semibold mb-1 text-neutral-800">Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full border-2 border-yellow-200 rounded-lg px-3 py-2" placeholder="Enter your email" />
        </div>
        <div>
          <label className="block font-semibold mb-1 text-neutral-800">Phone</label>
          <input type="tel" name="phone" value={form.phone} onChange={handleChange} className="w-full border-2 border-yellow-200 rounded-lg px-3 py-2" placeholder="Enter your phone number" />
        </div>
        <div>
          <label className="block font-semibold mb-1 text-neutral-800">Password</label>
          <input type="password" name="password" value={form.password} onChange={handleChange} className="w-full border-2 border-yellow-200 rounded-lg px-3 py-2" placeholder="Create a password" />
        </div>
        <div>
          <label className="block font-semibold mb-1 text-neutral-800">Confirm Password</label>
          <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} className="w-full border-2 border-yellow-200 rounded-lg px-3 py-2" placeholder="Confirm your password" />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" name="terms" checked={form.terms} onChange={handleChange} />
          <span className="text-sm">I accept the <a href="#" className="text-pink-600 underline">terms and conditions</a></span>
        </div>
        <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-pink-600 to-yellow-400 text-white py-3 rounded-full font-semibold text-lg hover:scale-105 transition shadow disabled:opacity-50 disabled:cursor-not-allowed">{loading ? 'Signing up...' : 'Sign Up'}</button>
        <div className="text-sm text-center mt-2">
          Already have an account? <Link to="/login" className="text-pink-600 hover:underline">Login</Link>
        </div>
      </form>
    </main>
  );
} 