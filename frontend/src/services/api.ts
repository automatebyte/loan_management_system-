import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  // Don't add auth header for login/register endpoints
  if (config.url?.includes('/login/') || config.url?.includes('/register/')) {
    return config;
  }
  
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Enhanced request logging for debugging
  console.log('API Request:', {
    url: config.url,
    method: config.method,
    hasAuth: !!config.headers.Authorization
  });
  
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Enhanced error logging
    console.error('API Error Details:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    
    // Clear invalid tokens
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    
    return Promise.reject(error);
  }
);

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

export const companyAPI = {
  getCompanies: () => api.get('/api/companies/'),
  createCompany: (companyData: any) => api.post('/api/companies/', companyData),
  updateCompany: (id: number, companyData: any) => api.patch(`/api/companies/${id}/`, companyData),
  getDashboardStats: () => api.get('/api/companies/dashboard_stats/'),
  getMyCompany: () => api.get('/api/companies/my_company/'),
  approveCompany: (id: number) => api.post(`/api/companies/${id}/approve/`),
  rejectCompany: (id: number) => api.post(`/api/companies/${id}/reject/`),
  getCredentials: (id: number) => api.get(`/api/companies/${id}/credentials/`),
  resetPassword: (id: number) => api.post(`/api/companies/${id}/reset_password/`),
  updatePaymentStatus: (id: number) => api.post(`/api/companies/${id}/update_payment_status/`),
  suspendService: (id: number) => api.post(`/api/companies/${id}/suspend_service/`),
  activateService: (id: number) => api.post(`/api/companies/${id}/activate_service/`),
};

export default api;