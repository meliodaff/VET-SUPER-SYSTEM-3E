import axios from 'axios';

// Use the dev proxy path to avoid CORS and preserve PHP sessions in development
// See frontend/src/setupProxy.js for the proxy target
const API_BASE_URL = '/backend-api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies for session management
  timeout: 30000, // 30 seconds timeout
});

// Request interceptor to add auth headers if needed
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle timeout errors
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      return Promise.reject({
        response: {
          status: 504,
          data: {
            success: false,
            message: 'Request timeout. Please check if your backend server (XAMPP/WAMP) is running.'
          }
        }
      });
    }
    
    // Handle network errors
    if (error.code === 'ERR_NETWORK' || !error.response) {
      return Promise.reject({
        response: {
          status: 503,
          data: {
            success: false,
            message: 'Cannot connect to backend server. Please ensure XAMPP/WAMP Apache is running.'
          }
        }
      });
    }
    
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('admin');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  createAccount: (data) => api.post('/auth/create_account.php', data),
  login: (data) => api.post('/auth/login.php', data),
  logout: () => api.post('/auth/logout.php'),
};

// Dashboard API
export const dashboardAPI = {
  getSalesMetrics: () => api.get('/dashboard/sales_metrics.php'),
  getSalesTrend: (months = 6) => api.get(`/dashboard/sales_trend.php?months=${months}`),
  getProductsRevenue: () => api.get('/dashboard/products_revenue.php'),
  getDoctorStatistics: () => api.get('/dashboard/doctor_statistics.php'),
  getInventoryCost: () => api.get('/dashboard/inventory_cost.php'),
  getDoctorSurgeryFees: () => api.get('/dashboard/doctor_surgery_fees.php'),
  getRecentPayments: (limit = 5) => api.get(`/dashboard/recent_payments.php?limit=${limit}`),
  getSuppliesExpenses: (months = 6) => api.get(`/dashboard/supplies_expenses.php?months=${months}`),
  getInventoryTransactions: () => api.get('/dashboard/inventory_transactions.php'),
  getDoctorDetail: (employeeId) => api.get(`/dashboard/doctor_detail.php?employee_id=${employeeId}`),
};

// Employees API
export const employeesAPI = {
  getEmployees: () => api.get('/employees/get_employees.php'),
  getDepartments: () => api.get('/employees/get_departments.php'),
  createEmployee: (data) => api.post('/employees/create_employee.php', data),
  updateEmployee: (data) => api.put('/employees/update_employee.php', data),
  deleteEmployee: (id) => {
    // Handle both numeric IDs and employee_id strings
    const idParam = typeof id === 'number' ? id : encodeURIComponent(id);
    return api.delete(`/employees/delete_employee.php?id=${idParam}`);
  },
};

// Invoices API
export const invoicesAPI = {
  getInvoices: (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return api.get(`/invoices/get_invoices.php?${queryParams}`);
  },
  getInvoiceDetails: (id) => api.get(`/invoices/get_invoice_details.php?id=${id}`),
  createInvoice: (data) => api.post('/invoices/create_invoice.php', data),
  updateInvoice: (data) => api.put('/invoices/update_invoice.php', data),
};

// Payments API
export const paymentsAPI = {
  getPayments: (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return api.get(`/payments/get_payments.php?${queryParams}`);
  },
  updatePaymentStatus: (data) => api.put('/payments/update_payment_status.php', data),
  trackTransactions: (limit = 20) => api.get(`/payments/track_transactions.php?limit=${limit}`),
};

export default api;
