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
      <section className="relative bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-500 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className={`text-white ${animateHero ? 'animate-fade-in' : 'opacity-0'}`}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight">
                Welcome to{' '}
                <span className="text-yellow-300">Marwari Basket</span>
              </h1>
              <p className="text-lg md:text-xl mb-6 md:mb-8 text-gray-100 leading-relaxed">
                Discover authentic Rajasthani products handpicked for you. 
                From traditional clothing to exquisite jewelry, find everything 
                that makes Rajasthan special.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/products"
                  className="bg-white text-orange-600 px-6 md:px-8 py-4 md:py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg text-center"
                >
                  Shop Now
                </Link>
                <Link
                  to="/about"
                  className="border-2 border-white text-white px-6 md:px-8 py-4 md:py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-orange-600 transition-all duration-300 text-center"
                >
                  Learn More
                </Link>
              </div>
            </div>
            <div className={`${animateHero ? 'animate-slide-in' : 'opacity-0 translate-x-12'} flex justify-center lg:justify-end`}>
              <img
                src={camelImg}
                alt="Rajasthani Camel"
                className="w-full h-auto max-w-sm md:max-w-md lg:max-w-lg"
              />
            </div>
          </div>
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