import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth/login';
    }
    return Promise.reject(err);
  }
);

export default api;

// Typed helpers
export const authApi = {
  register: (data: { email: string; password: string; name: string }) => api.post('/auth/register', data),
  login: (data: { email: string; password: string }) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
};

export const furnitureApi = {
  list: (params?: Record<string, string | number>) => api.get('/furniture', { params }),
  get: (id: number) => api.get(`/furniture/${id}`),
  categories: () => api.get('/furniture/categories'),
};

export const ordersApi = {
  create: (data: object) => api.post('/orders', data),
  list: () => api.get('/orders'),
};

export const virtualRoomApi = {
  save: (data: object) => api.post('/virtual-room', data),
  list: () => api.get('/virtual-room'),
  update: (id: number, data: object) => api.put(`/virtual-room/${id}`, data),
  getShared: (token: string) => api.get(`/virtual-room/share/${token}`),
};

export const portfolioApi = {
  list: () => api.get('/portfolio'),
};

export const designRequestApi = {
  submit: (data: object) => api.post('/design-requests', data),
};
