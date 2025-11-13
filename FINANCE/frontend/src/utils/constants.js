// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost/backend/api',
  TIMEOUT: 10000,
};

// Application Constants
export const APP_CONFIG = {
  NAME: 'Fur-Ever Care',
  VERSION: '1.0.0',
};

// Status Options
export const STATUS_OPTIONS = {
  EMPLOYEE: ['Active', 'Inactive'],
  INVOICE: ['Outstanding', 'Paid', 'Overdue'],
  PAYMENT: ['Pending', 'Paid', 'Overdue'],
};

// Department Options
export const DEPARTMENT_OPTIONS = [
  'Medical',
  'Administration', 
  'Facilities'
];

// Payment Methods
export const PAYMENT_METHODS = [
  'Cash',
  'Credit Card',
  'Debit Card',
  'Bank Transfer',
  'Check',
  'Online Payment'
];

// Chart Colors
export const CHART_COLORS = {
  PRIMARY: '#3B82F6',
  SUCCESS: '#10B981',
  WARNING: '#F59E0B',
  ERROR: '#EF4444',
  INFO: '#14B8A6',
  PURPLE: '#7C3AED',
  PINK: '#EC4899',
  INDIGO: '#6366F1',
};

// Status Colors
export const STATUS_COLORS = {
  Active: '#10B981',
  Inactive: '#6B7280',
  Paid: '#10B981',
  Outstanding: '#F59E0B',
  Overdue: '#EF4444',
  Pending: '#F59E0B',
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50],
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM DD, YYYY',
  API: 'YYYY-MM-DD',
  DATETIME: 'MMM DD, YYYY HH:mm',
};
