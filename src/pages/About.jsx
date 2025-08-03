export default function About() {
  return (
    <main className="pt-28 min-h-screen bg-gradient-to-br from-yellow-50 via-white to-pink-50 font-sans flex items-center justify-center">
      <section className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-2xl">
        <h1 className="text-3xl font-serif font-bold mb-8 text-center text-neutral-900">About Marwari Basket</h1>
        <div className="flex flex-col md:flex-row gap-6 items-center mb-8">
          <div className="w-32 h-32 bg-gradient-to-br from-yellow-200 to-pink-100 rounded-full flex items-center justify-center text-4xl font-bold text-pink-600 border-4 border-yellow-300">MB</div>
          <div className="flex-1">
            <p className="text-lg text-neutral-700 mb-2">Marwari Basket is your gateway to authentic Marwari snacks, sweets, and gifts, delivered with love from Rajasthan. We celebrate the rich culinary heritage of Marwar and bring it to your doorstep.</p>
            <p className="text-neutral-500 text-sm">Founded in 2024 | Jaipur, Rajasthan</p>
          </div>
        </div>
        <div className="mb-6">
          <h2 className="font-bold mb-2 text-neutral-900 font-serif">Our Mission</h2>
          <p className="text-neutral-700">To spread the joy of Marwari flavors across India and the world, with quality, authenticity, and care in every box.</p>
        </div>
        <div>
          <h2 className="font-bold mb-2 text-neutral-900 font-serif">Our Values</h2>
          <ul className="list-disc pl-6 text-neutral-700">
            <li>Authenticity</li>
            <li>Quality</li>
            <li>Customer Delight</li>
            <li>Tradition & Innovation</li>
          </ul>
        </div>
      </section>
    </main>
  );
} 