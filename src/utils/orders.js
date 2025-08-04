import api from './api';

export async function fetchMyOrders() {
  const res = await api.get('/orders/my', {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  return res.data;
}

export async function fetchOrderById(id, token) {
  const res = await api.get(`/api/orders/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
} 