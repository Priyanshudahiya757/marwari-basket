import api from './api';

export async function fetchMyOrders(token) {
  const res = await api.get('/orders/my', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function fetchOrderById(id, token) {
  const res = await api.get(`/orders/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
} 