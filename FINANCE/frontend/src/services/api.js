import axios from "axios";

// Use relative path in development (will use setupProxy.js)
// Use absolute path in production (or configure via environment variable)
const API_BASE_URL = process.env.REACT_APP_API_URL || "/backend-api";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Include cookies for session management
  timeout: 30000, // 30 seconds timeout
});

// Request interceptor to add auth headers if needed
api.interceptors.request.use(
  (config) => {
    // Log outgoing requests
    console.log(`[API Request] ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Log detailed error information for debugging
    console.error("API Error Details:", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message,
      errorCode: error.code,
      responseData: error.response?.data,
      fullError: error
    });

    // Handle timeout errors
    if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
      return Promise.reject({
        response: {
          status: 504,
          data: {
            success: false,
            message:
              "Request timeout. Please check if your backend server (XAMPP/WAMP) is running.",
          },
        },
      });
    }

    // Handle network errors
    if (error.code === "ERR_NETWORK" || !error.response) {
      return Promise.reject({
        response: {
          status: 503,
          data: {
            success: false,
            message:
              "Cannot connect to backend server. Please ensure XAMPP/WAMP Apache is running and the database is accessible.",
          },
        },
      });
    }

    // Authentication removed - no redirect on 401
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  createAccount: (data) => api.post("/auth/create_account.php", data),
  login: (data) => api.post("/auth/login.php", data),
  logout: () => api.post("/auth/logout.php"),
};

// Dashboard API
export const dashboardAPI = {
  getSalesMetrics: () => api.get("/dashboard/sales_metrics.php"),
  getSalesTrend: (months = 6) =>
    api.get(`/dashboard/sales_trend.php?months=${months}`),
  getProductsRevenue: () => api.get("/dashboard/products_revenue.php"),
  getDoctorStatistics: () => api.get("/dashboard/doctor_statistics.php"),
  getInventoryCost: () => api.get("/dashboard/inventory_cost.php"),
  getDoctorSurgeryFees: () => api.get("/dashboard/doctor_surgery_fees.php"),
  getRecentPayments: (limit = 5) =>
    api.get(`/dashboard/recent_payments.php?limit=${limit}`),
  getSuppliesExpenses: (months = 6) =>
    api.get(`/dashboard/supplies_expenses.php?months=${months}`),
  getInventoryTransactions: () =>
    api.get("/dashboard/inventory_transactions.php"),
  getDoctorDetail: (employeeId) =>
    api.get(`/dashboard/doctor_detail.php?employee_id=${employeeId}`),
  
  // Monitoring & Sales Verification APIs
  getTreatmentsCaptured: () => api.get("/monitoring/treatments_captured.php"),
  getMedicationsDispensed: () => api.get("/monitoring/medications_dispensed.php"),
  getLabTestsOrdered: () => api.get("/monitoring/lab_tests_ordered.php"),
  getInventoryDeductions: () => api.get("/monitoring/inventory_deductions.php"),
  getVerificationStatus: () => api.get("/monitoring/verification_status.php"),
};

// Employees API
export const employeesAPI = {
  getEmployees: () => api.get("/employees/get_employees.php"),
  getDepartments: () => api.get("/employees/get_departments.php"),
  createEmployee: (data) => api.post("/employees/create_employee.php", data),
  updateEmployee: (data) => api.put("/employees/update_employee.php", data),
  deleteEmployee: (id) => {
    // Handle both numeric IDs and employee_id strings
    const idParam = typeof id === "number" ? id : encodeURIComponent(id);
    return api.delete(`/employees/delete_employee.php?id=${idParam}`);
  },
};

// Invoices API
export const invoicesAPI = {
  getInvoices: (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return api.get(`/invoices/get_invoices.php?${queryParams}`);
  },
  getInvoiceDetails: (id) =>
    api.get(`/invoices/get_invoice_details.php?id=${id}`),
  createInvoice: (data) => api.post("/invoices/create_invoice.php", data),
  updateInvoice: (data) => api.put("/invoices/update_invoice.php", data),
};

// Payments API
export const paymentsAPI = {
  getPayments: (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return api.get(`/payments/get_payments.php?${queryParams}`);
  },
  updatePaymentStatus: (data) =>
    api.put("/payments/update_payment_status.php", data),
  trackTransactions: (limit = 20) =>
    api.get(`/payments/track_transactions.php?limit=${limit}`),
  createEmployeePayment: (data) =>
    api.post("/payments/create_employee_payment.php", data),
  getEmployeePayments: (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return api.get(`/payments/get_employee_payments.php?${queryParams}`);
  },
};

// Inventory API
export const inventoryAPI = {
  getItems: () => api.get("/inventory/get_items.php"),
};

// Supplier & Purchase Orders API
export const purchaseOrdersAPI = {
  createPurchaseOrder: (data) =>
    api.post("/purchase_orders/create_purchase_order.php", data),
  getPurchaseOrders: (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return api.get(`/purchase_orders/get_purchase_orders.php?${queryParams}`);
  },
};

export const supplierAPI = {
  createSupplierPayment: (data) =>
    api.post("/payments/create_supplier_payment.php", data),
  getSupplierPayments: (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return api.get(`/payments/get_supplier_payments.php?${queryParams}`);
  },
  updateSupplierDeliveryStatus: (data) =>
    api.put("/payments/update_supplier_delivery_status.php", data),
  recordDelivery: (data) =>
    api.post("/inventory/receive_delivery.php", data),
};

// Payroll API - connects to HR module
export const payrollAPI = {
  getPaidHours: (id, period, year, month) => {
    // Direct call to HR backend endpoint
    const baseURL = window.location.origin;
    const url = `${baseURL}/VET-SUPER-SYSTEM-3E/HR/backend/routes/getPaidHours.php`;
    const params = new URLSearchParams({ id, period, year, month });
    return axios.get(`${url}?${params.toString()}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
};

export default api;
