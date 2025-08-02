import React, { useState, useEffect } from 'react';
import ProductList from '../../components/admin/Products/ProductList';
import ProductForm from '../../components/admin/Products/ProductForm';
import Sidebar from '../../components/admin/Sidebar';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/admin/products');
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleCreateProduct = async (formData) => {
    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        setShowForm(false);
        fetchProducts();
      }
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  const handleUpdateProduct = async (formData) => {
    try {
      const response = await fetch(`/api/admin/products/${editingProduct._id}`, {
        method: 'PUT',
        body: formData
      });
      
      if (response.ok) {
        setShowForm(false);
        setEditingProduct(null);
        fetchProducts();
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        fetchProducts();
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleBulkAction = async (action, productIds) => {
    try {
      const response = await fetch('/api/admin/products/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action, productIds })
      });
      
      if (response.ok) {
        fetchProducts();
      }
    } catch (error) {
      console.error('Error performing bulk action:', error);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleFormSubmit = (formData) => {
    if (editingProduct) {
      handleUpdateProduct(formData);
    } else {
      handleCreateProduct(formData);
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-yellow-50 via-white to-pink-50 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-600"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="admin-main">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 flex-shrink-0">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-serif font-bold text-neutral-900">Product Management</h1>
                <p className="text-sm text-gray-500">Manage your product catalog</p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                >
                  Add Product
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto admin-scrollbar">
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-8">
            {showForm ? (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setEditingProduct(null);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <ProductForm
                  product={editingProduct}
                  onSubmit={handleFormSubmit}
                  categories={categories}
                />
              </div>
            ) : (
              <ProductList
                products={products}
                onEdit={handleEdit}
                onDelete={handleDeleteProduct}
                onBulkAction={handleBulkAction}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
} 