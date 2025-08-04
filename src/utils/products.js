import api from './api';

export async function fetchProducts() {
  const res = await api.get('/products');
  return res.data;
}

export async function fetchProductById(id) {
  const res = await api.get(`/products/${id}`);
  return res.data;
} 