export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-white pt-12 pb-6 px-4 mt-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
        {/* Brand & Social */}
        <div>
          <h3 className="font-serif text-2xl font-bold mb-3 text-yellow-300">Marwari Basket</h3>
          <p className="mb-4 text-neutral-300">Preserving the rich cultural heritage of Rajasthan through authentic handcrafted products. Every purchase supports local artisans and their traditional crafts.</p>
          <div className="flex gap-3 mt-2">
            <a href="#" className="w-10 h-10 flex items-center justify-center rounded-lg bg-pink-600 hover:bg-pink-700 transition" aria-label="Facebook">📘</a>
            <a href="#" className="w-10 h-10 flex items-center justify-center rounded-lg bg-pink-600 hover:bg-pink-700 transition" aria-label="Instagram">📷</a>
            <a href="#" className="w-10 h-10 flex items-center justify-center rounded-lg bg-pink-600 hover:bg-pink-700 transition" aria-label="Twitter">🐦</a>
            <a href="#" className="w-10 h-10 flex items-center justify-center rounded-lg bg-pink-600 hover:bg-pink-700 transition" aria-label="YouTube">📺</a>
          </div>
        </div>
        {/* Quick Links */}
        <div>
          <h3 className="font-serif text-lg font-bold mb-3 text-yellow-300">Quick Links</h3>
          <ul className="space-y-2">
            <li><a href="/" className="hover:text-pink-400 transition">Home</a></li>
            <li><a href="/products" className="hover:text-pink-400 transition">Products</a></li>
            <li><a href="/offers" className="hover:text-pink-400 transition">Special Offers</a></li>
            <li><a href="/about" className="hover:text-pink-400 transition">About Us</a></li>
            <li><a href="/contact" className="hover:text-pink-400 transition">Contact</a></li>
          </ul>
        </div>
        {/* Product Categories */}
        <div>
          <h3 className="font-serif text-lg font-bold mb-3 text-yellow-300">Product Categories</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-pink-400 transition">Handicrafts</a></li>
            <li><a href="#" className="hover:text-pink-400 transition">Traditional Jewelry</a></li>
            <li><a href="#" className="hover:text-pink-400 transition">Textiles & Clothing</a></li>
            <li><a href="#" className="hover:text-pink-400 transition">Blue Pottery</a></li>
            <li><a href="#" className="hover:text-pink-400 transition">Home Decor</a></li>
            <li><a href="#" className="hover:text-pink-400 transition">Art & Paintings</a></li>
          </ul>
        </div>
        {/* Contact Info */}
        <div>
          <h3 className="font-serif text-lg font-bold mb-3 text-yellow-300">Get in Touch</h3>
          <ul className="space-y-2 text-neutral-300">
            <li>📍 Mehrangarh Fort Road, Jodhpur, Rajasthan 342006</li>
            <li>📞 +91 98765 43210</li>
            <li>✉️ hello@marwaribasket.com</li>
            <li>🕒 Mon-Sat: 9:00 AM - 8:00 PM</li>
            <li>🚚 Free shipping above ₹2,000</li>
          </ul>
        </div>
      </div>
      <div className="text-center border-t border-neutral-700 pt-6 text-neutral-400">
        <p>&copy; {new Date().getFullYear()} Marwari Basket. All rights reserved. | Handcrafted with <span className="text-pink-400">❤️</span> in Rajasthan</p>
      </div>
    </footer>
  );
} 