import { useEffect, useState } from 'react';
import { fetchProducts } from '../../utils/products';
import { useUser } from '../../context/UserContext';
import { toast } from 'react-hot-toast';
import api from '../../utils/api';

function AdminProducts() {
  const { token } = useUser();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({
    name: '', price: '', description: '', image: '', stock: '', category: '',
  });
  const [addLoading, setAddLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '', price: '', description: '', image: '', stock: '', category: '',
  });
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError('');
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (err) {
        setError('Failed to load products.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [token]);

  const handleEdit = (product) => {
    setEditId(product._id);
    setEditForm({
      name: product.name,
      price: product.price,
      description: product.description,
      image: product.image,
      stock: product.stock,
      category: product.category,
    });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      const res = await api.put(`/api/products/${editId}`, {
        ...editForm,
        price: Number(editForm.price),
        stock: Number(editForm.stock),
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts((prev) => prev.map((p) => (p._id === editId ? res.data : p)));
      setEditId(null);
      setEditForm({ name: '', price: '', description: '', image: '', stock: '', category: '' });
      toast.success('Product updated!');
    } catch (err) {
      // Error handled by Axios interceptor
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete product "${product.name}"?`)) return;
    try {
      await api.delete(`/api/products/${product._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts((prev) => prev.filter((p) => p._id !== product._id));
      toast.success('Product deleted!');
    } catch (err) {
      // Error handled by Axios interceptor
    }
  };

  const handleAddChange = (e) => {
    setAddForm({ ...addForm, [e.target.name]: e.target.value });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setAddLoading(true);
    try {
      const res = await api.post('/products', {
        ...addForm,
        price: Number(addForm.price),
        stock: Number(addForm.stock),
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts((prev) => [res.data, ...prev]);
      setShowAdd(false);
      setAddForm({ name: '', price: '', description: '', image: '', stock: '', category: '' });
      toast.success('Product added!');
    } catch (err) {
      // Error handled by Axios interceptor
    } finally {
      setAddLoading(false);
    }
  };

  if (loading) return <div className="text-center py-10 text-lg text-pink-600">Loading products...</div>;
  if (error) return <div className="text-center text-red-600 py-10">{error}</div>;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-yellow-100">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-serif font-bold text-neutral-900">All Products</h2>
        <button className="bg-gradient-to-r from-yellow-400 to-pink-600 text-white px-4 py-2 rounded font-semibold shadow hover:scale-105 transition" onClick={() => setShowAdd(true)}>
          + Add Product
        </button>
      </div>
      {showAdd && (
        <form onSubmit={handleAddProduct} className="mb-8 bg-yellow-50 p-6 rounded-2xl shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input name="name" value={addForm.name} onChange={handleAddChange} placeholder="Name" className="border-2 border-yellow-200 rounded px-3 py-2" required />
            <input name="price" value={addForm.price} onChange={handleAddChange} placeholder="Price" type="number" min={0} className="border-2 border-yellow-200 rounded px-3 py-2" required />
            <input name="stock" value={addForm.stock} onChange={handleAddChange} placeholder="Stock" type="number" min={0} className="border-2 border-yellow-200 rounded px-3 py-2" required />
            <input name="category" value={addForm.category} onChange={handleAddChange} placeholder="Category" className="border-2 border-yellow-200 rounded px-3 py-2" required />
            <input name="image" value={addForm.image} onChange={handleAddChange} placeholder="Image URL" className="border-2 border-yellow-200 rounded px-3 py-2" />
          </div>
          <textarea name="description" value={addForm.description} onChange={handleAddChange} placeholder="Description" className="border-2 border-yellow-200 rounded px-3 py-2 w-full mb-4" rows={2} required />
          <div className="flex gap-4">
            <button type="submit" className="bg-gradient-to-r from-yellow-400 to-pink-600 text-white px-4 py-2 rounded font-semibold shadow hover:scale-105 transition" disabled={addLoading}>
              {addLoading ? 'Adding...' : 'Add Product'}
            </button>
            <button type="button" className="bg-gray-200 text-neutral-700 px-4 py-2 rounded font-semibold shadow" onClick={() => setShowAdd(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}
      {editId && (
        <form onSubmit={handleEditProduct} className="mb-8 bg-yellow-50 p-6 rounded-2xl shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input name="name" value={editForm.name} onChange={handleEditChange} placeholder="Name" className="border-2 border-yellow-200 rounded px-3 py-2" required />
            <input name="price" value={editForm.price} onChange={handleEditChange} placeholder="Price" type="number" min={0} className="border-2 border-yellow-200 rounded px-3 py-2" required />
            <input name="stock" value={editForm.stock} onChange={handleEditChange} placeholder="Stock" type="number" min={0} className="border-2 border-yellow-200 rounded px-3 py-2" required />
            <input name="category" value={editForm.category} onChange={handleEditChange} placeholder="Category" className="border-2 border-yellow-200 rounded px-3 py-2" required />
            <input name="image" value={editForm.image} onChange={handleEditChange} placeholder="Image URL" className="border-2 border-yellow-200 rounded px-3 py-2" />
          </div>
          <textarea name="description" value={editForm.description} onChange={handleEditChange} placeholder="Description" className="border-2 border-yellow-200 rounded px-3 py-2 w-full mb-4" rows={2} required />
          <div className="flex gap-4">
            <button type="submit" className="bg-gradient-to-r from-yellow-400 to-pink-600 text-white px-4 py-2 rounded font-semibold shadow hover:scale-105 transition" disabled={editLoading}>
              {editLoading ? 'Saving...' : 'Save Changes'}
            </button>
            <button type="button" className="bg-gray-200 text-neutral-700 px-4 py-2 rounded font-semibold shadow" onClick={() => setEditId(null)}>
              Cancel
            </button>
          </div>
        </form>
      )}
      <div className="overflow-x-auto">
        <table className="w-full mb-6 text-sm">
          <thead>
            <tr className="border-b bg-yellow-50">
              <th className="text-left py-3 px-2 font-semibold text-neutral-700">Name</th>
              <th className="text-center py-3 px-2 font-semibold text-neutral-700">Price</th>
              <th className="text-center py-3 px-2 font-semibold text-neutral-700">Stock</th>
              <th className="text-center py-3 px-2 font-semibold text-neutral-700">Category</th>
              <th className="text-center py-3 px-2 font-semibold text-neutral-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="border-b hover:bg-yellow-50/50">
                <td className="py-3 px-2">{product.name}</td>
                <td className="text-center text-pink-600 font-bold">₹{product.price}</td>
                <td className="text-center">{product.stock}</td>
                <td className="text-center">{product.category}</td>
                <td className="text-center">
                  <button onClick={() => handleEdit(product)} className="text-yellow-600 hover:underline mr-2 font-semibold">Edit</button>
                  <button onClick={() => handleDelete(product)} className="text-red-600 hover:underline font-semibold">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminProducts; 