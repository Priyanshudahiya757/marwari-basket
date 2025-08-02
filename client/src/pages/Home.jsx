import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { products, categories } from '../utils/productData';
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
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Get top-rated products as featured
        const featured = products
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 8);
        setFeaturedProducts(featured);
      } catch (error) {
        console.error('Failed to load featured products:', error);
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
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/products?category=${category.id}`}
                className="group block bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="aspect-w-16 aspect-h-9 mb-4">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-48 object-cover rounded-lg group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.name}</h3>
                <p className="text-gray-600 mb-3">{category.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{category.productCount} products</span>
                  <span className="text-yellow-600 font-medium group-hover:text-yellow-700">
                    Explore →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our most popular and highly-rated products handpicked for you
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
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
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/products"
              className="bg-yellow-400 text-black px-8 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-colors duration-200"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Marwari Basket?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We bring you the finest Rajasthani craftsmanship with modern convenience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Authentic Products</h3>
              <p className="text-gray-600">
                Every product is handcrafted by skilled artisans using traditional techniques passed down through generations.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast Delivery</h3>
              <p className="text-gray-600">
                Quick and secure delivery across India with careful packaging to ensure your products arrive safely.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Customer Satisfaction</h3>
              <p className="text-gray-600">
                We're committed to your satisfaction with easy returns and excellent customer support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-yellow-400 to-orange-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Stay Updated</h2>
          <p className="text-yellow-100 mb-8 text-lg">
            Subscribe to our newsletter for exclusive offers and new product updates
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-yellow-400"
            />
            <button className="bg-white text-yellow-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
} 