export default function Contact() {
  return (
    <main className="pt-28 min-h-screen bg-gradient-to-br from-yellow-50 via-white to-pink-50 font-sans flex items-center justify-center">
      <section className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-lg">
        <h1 className="text-3xl font-serif font-bold mb-8 text-center text-neutral-900">Contact Us</h1>
        <form className="space-y-6 mb-8">
          <input className="w-full border-2 border-yellow-200 rounded-lg px-3 py-2" placeholder="Your Name" />
          <input className="w-full border-2 border-yellow-200 rounded-lg px-3 py-2" placeholder="Your Email" />
          <textarea className="w-full border-2 border-yellow-200 rounded-lg px-3 py-2" rows={4} placeholder="Your Message" />
          <button className="w-full bg-gradient-to-r from-pink-600 to-yellow-400 text-white py-3 rounded-full font-semibold text-lg hover:scale-105 transition shadow">Send Message</button>
        </form>
        <div className="text-center text-neutral-500 text-sm">
          <div>Marwari Basket Pvt. Ltd.</div>
          <div>Jaipur, Rajasthan, India</div>
          <div>Email: support@marwaribasket.com</div>
        </div>
      </section>
    </main>
  );
} 