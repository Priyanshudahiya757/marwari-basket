import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main className="pt-28 min-h-screen bg-gradient-to-br from-yellow-50 via-white to-pink-50 font-sans flex items-center justify-center">
      <section className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-md text-center">
        <h1 className="text-6xl font-extrabold text-pink-600 mb-4">404</h1>
        <p className="text-lg text-neutral-700 mb-8">Oops! The page you are looking for does not exist.</p>
        <Link to="/" className="bg-gradient-to-r from-pink-600 to-yellow-400 text-white px-8 py-3 rounded-full font-semibold hover:scale-105 transition shadow">Go to Home</Link>
      </section>
    </main>
  );
} 