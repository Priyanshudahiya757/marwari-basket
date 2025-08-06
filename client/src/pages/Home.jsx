import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../utils/products';
import ProductCard from '../components/ProductCard';
import camelImg from '../assets/camel.png';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [animateHero, setAnimateHero] = useState(false);

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      setLoading(true);
      try {
        const data = await fetchProducts();
        console.log('📦 Products API response:', data);
        
        // Safe handling of API response
        const products = data?.products || data || [];
        
        if (!Array.isArray(products)) {
          console.warn('⚠️ Products is not an array:', products);
          setFeaturedProducts([]);
          return;
        }
        
        const featured = products
          .sort((a, b) => (b.rating || 0) - (a.rating || 0))
          .slice(0, 8);
        setFeaturedProducts(featured);
        console.log('✅ Loaded featured products:', featured.length);
      } catch (error) {
        console.error('❌ Failed to load featured products:', error);
        setFeaturedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedProducts();
    
    // Trigger hero animation after a short delay
    const timer = setTimeout(() => setAnimateHero(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative flex flex-row items-center justify-between gap-4 px-4 py-8 md:py-14 bg-gradient-to-r from-orange-100 via-yellow-50 to-white rounded-xl shadow mt-4 mb-8 overflow-hidden"
        style={{ minHeight: '320px' }}
      >
        {/* Left: Description & Buttons */}
        <div className="flex-1 flex flex-col justify-center gap-3 z-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-orange-700 font-serif mb-2 drop-shadow-sm">Marwari Basket</h1>
          <p className="text-base md:text-lg leading-snug text-gray-700 mb-3 max-w-md">
            Discover authentic Rajasthani products handpicked for you. From traditional clothing to exquisite jewelry, find everything that makes Rajasthan special.
          </p>
          <div className="flex flex-row gap-3 mt-2">
            <Link
              to="/products"
              className="bg-orange-500 text-white rounded-full px-4 py-1.5 text-sm font-semibold uppercase tracking-wide shadow hover:bg-orange-600 transition-transform hover:scale-105 text-center"
            >
              Shop Now
            </Link>
            <Link
              to="/about"
              className="border border-orange-500 text-orange-500 rounded-full px-4 py-1.5 text-sm font-semibold uppercase tracking-wide text-center hover:bg-orange-50 transition"
            >
              Learn More
            </Link>
          </div>
        </div>
        {/* Right: Camel Image visually merged with background */}
        <div className="flex-shrink-0 flex items-center justify-center md:ml-8 z-0 relative">
          <div className="absolute -right-8 md:right-0 top-1/2 -translate-y-1/2 w-44 h-44 md:w-64 md:h-64 rounded-full bg-gradient-to-br from-orange-200 via-yellow-100 to-white opacity-80 blur-2xl" />
          <img
            src={camelImg}
            alt="Rajasthani Camel"
            className="w-32 h-32 md:w-56 md:h-56 object-contain rounded-xl shadow-lg border-4 border-orange-100 bg-white/60"
            style={{ mixBlendMode: 'multiply', zIndex: 1 }}
          />
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg">
              Explore our curated collection of authentic Rajasthani products across different categories
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Categories will be loaded from API */}
            <div className="text-center py-8">
              <p className="text-gray-500">Categories will be loaded from the database</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg">
              Handpicked products that showcase the best of Rajasthani craftsmanship
            </p>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id || product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🛍️</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Products Available</h3>
              <p className="text-gray-500 mb-4">Check back soon for our latest collection!</p>
              <Link
                to="/products"
                className="inline-block bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Browse All Products
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Marwari Basket?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We bring you the authentic taste of Rajasthan with quality assurance and traditional craftsmanship
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🏺</div>
              <h3 className="text-xl font-semibold mb-2">Authentic Products</h3>
              <p className="text-gray-600">
                Every product is sourced directly from skilled artisans and traditional craftsmen of Rajasthan
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-xl font-semibold mb-2">Quality Assured</h3>
              <p className="text-gray-600">
                We ensure that every product meets our high standards of quality and authenticity
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">
                Quick and reliable delivery across India with secure packaging and tracking
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-pink-500">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Experience Rajasthan?
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Start your journey with authentic Rajasthani products today
          </p>
          <Link
            to="/products"
            className="bg-white text-orange-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Start Shopping
          </Link>
        </div>
      </section>
    </div>
  );
} 