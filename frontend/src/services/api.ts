import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (credentials: { username: string; password: string }) =>
    api.post('/api/auth/login/', credentials),
  register: (userData: any) => api.post('/api/auth/register/', userData),
  profile: () => api.get('/api/auth/profile/'),
};

export const loanAPI = {
  getLoans: () => api.get('/api/loans/loans/'),
  createLoan: (loanData: any) => api.post('/api/loans/loans/', loanData),
  approveLoan: (id: number) => api.post(`/api/loans/loans/${id}/approve/`),
  disburseLoan: (id: number) => api.post(`/api/loans/loans/${id}/disburse/`),
  getProducts: () => api.get('/api/loans/products/'),
};

export default api;