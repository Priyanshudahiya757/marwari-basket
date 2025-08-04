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
        const products = data.products || data || [];
        
        // Get top-rated products as featured (or just first 8 if no ratings)
        const featured = products
          .sort((a, b) => (b.rating || 0) - (a.rating || 0))
          .slice(0, 8);
        setFeaturedProducts(featured);
      } catch (error) {
        console.error('Failed to load featured products:', error);
        setFeaturedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedProducts();
    
    // Trigger hero animation on component mount
    const timer = setTimeout(() => setAnimateHero(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Restored with Camel */}
      <section className="relative flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto px-4 py-16 gap-10 bg-gradient-to-br from-yellow-50 via-white to-pink-50">
        <div className="flex-1 z-10">
          <h1 
            className={`text-4xl md:text-5xl font-serif font-extrabold text-neutral-900 mb-6 drop-shadow-lg transition-all duration-1000 ease-out ${
              animateHero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Authentic Rajasthani Heritage
          </h1>
          <p 
            className={`text-lg md:text-xl text-neutral-700 mb-8 transition-all duration-1000 ease-out delay-300 ${
              animateHero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Discover handcrafted treasures from the royal state of Rajasthan, where tradition meets timeless elegance.
          </p>
          <Link to="/products">
            <button 
              className={`bg-gradient-to-r from-pink-600 to-yellow-400 text-white font-bold px-8 py-3 rounded-xl text-lg shadow-lg hover:scale-105 transition-all flex items-center gap-2 duration-1000 ease-out delay-600 ${
                animateHero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              Explore Collection <span className="text-xl">→</span>
            </button>
          </Link>
        </div>
        <div className="flex-1 flex justify-center items-center relative">
          {/* 3D Camel PNG Illustration */}
          <img 
            src={camelImg} 
            alt="Rajasthani Camel" 
            className={`w-72 h-72 object-contain drop-shadow-xl animate-[float_6s_ease-in-out_infinite] transition-all duration-1000 ease-out delay-900 ${
              animateHero ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
            }`}
          />
        </div>
        <div className="absolute inset-0 pointer-events-none" style={{backgroundImage: "url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')", opacity: 0.2, zIndex: 0}}></div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our curated collection of authentic Rajasthani products across different categories
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Categories will be loaded from API */}
            <div className="text-center py-8">
              <p className="text-gray-500">Categories will be loaded from the database</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our handpicked selection of the finest Rajasthani products
            </p>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border p-4 animate-pulse">
                  <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                  <div className="space-y-2">
                    <div className="bg-gray-200 h-4 rounded"></div>
                    <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                    <div className="bg-gray-200 h-4 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id || product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products available</h3>
              <p className="text-gray-600 mb-4">Products will appear here once added to the database</p>
              <Link 
                to="/products" 
                className="bg-gradient-to-r from-pink-600 to-yellow-400 text-white px-6 py-3 rounded-full font-semibold text-lg hover:scale-105 transition shadow"
              >
                Browse All Products
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">About Marwari Basket</h2>
              <p className="text-gray-600 mb-6">
                We are passionate about bringing the authentic flavors and traditions of Rajasthan to your doorstep. 
                Our carefully curated collection features handcrafted products that tell the story of this vibrant state.
              </p>
              <p className="text-gray-600 mb-8">
                From traditional textiles to exquisite jewelry, each item in our collection is sourced directly from 
                skilled artisans who have been preserving these crafts for generations.
              </p>
              <Link to="/about">
                <button className="bg-gradient-to-r from-pink-600 to-yellow-400 text-white font-bold px-6 py-3 rounded-lg hover:scale-105 transition-all">
                  Learn More
                </button>
              </Link>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-yellow-100 to-pink-100 rounded-lg p-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900 mb-2">100%</div>
                  <div className="text-lg text-gray-600">Authentic Products</div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">50+</div>
                    <div className="text-sm text-gray-600">Artisans</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">1000+</div>
                    <div className="text-sm text-gray-600">Happy Customers</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-pink-600 to-yellow-400">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Stay Updated</h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter for the latest products, exclusive offers, and Rajasthani culture insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-pink-600"
            />
            <button className="bg-white text-pink-600 font-bold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
} 