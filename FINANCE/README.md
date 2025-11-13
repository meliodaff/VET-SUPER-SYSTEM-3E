# Fur-Ever Care: Veterinary Sales & Finance Management System

A comprehensive full-stack veterinary clinic management system built with React frontend and PHP backend. The system includes admin authentication, sales analytics dashboard, employee management, invoice tracking, and payment monitoring.

## 🚀 Features

### Authentication System
- **Admin Account Creation**: Secure account registration with validation
- **Admin Login**: Email and password authentication with session management
- **Password Visibility Toggle**: User-friendly password input fields

### Dashboard Analytics
- **Sales Metrics Cards**: Today's Sales, Total Revenue, Pending Invoices, Paid Revenue
- **Sales Trend Chart**: 6-month line chart showing monthly performance
- **Products & Services Revenue**: Pie chart for veterinary services breakdown
- **Doctor Patient Statistics**: Bar chart for patient load and revenue by doctor
- **Inventory & Supplies Cost**: Bar chart with product categories and real-time data table
- **Doctor Surgery Fees**: Performance tracking for surgical procedures
- **Recent Payments**: List of recent transactions with payment methods

### Employee Management
- **Employee Directory**: Complete staff listing with search and filtering
- **Department Overview**: Staff count and salary breakdown by department
- **CRUD Operations**: Add, edit, delete employees with validation
- **Status Management**: Active/Inactive employee status tracking

### Invoice Management
- **Advanced Filtering**: By status (All, Outstanding, Paid, Overdue) and date range
- **Summary Cards**: Total Invoices, Outstanding, Overdue, Paid amounts
- **Search Functionality**: Search by invoice number, client name, or amount
- **Export to CSV**: Data export functionality
- **Pagination**: Navigate through invoice pages efficiently

### Payment Monitoring
- **Payment Statistics**: Total Payments, Total Amount, Paid, Pending, Overdue counts
- **Payment List**: Comprehensive transaction listing with status tracking
- **Action Buttons**: View Invoice, Mark Paid, Mark Pending, Mark Overdue
- **Real-time Updates**: Live data with refresh functionality
- **Status Management**: Easy payment status updates

## 🛠️ Tech Stack

### Frontend
- **React 18+** with JavaScript
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **Lucide React** for icons
- **Axios** for API communication
- **React Router DOM** for navigation

### Backend
- **PHP 8+** with MySQL
- **PDO** for database operations
- **Session-based authentication**
- **RESTful API endpoints**
- **CORS configuration**

## 📁 Project Structure

```
fur-ever-care/
├── frontend/                 # React Application
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   ├── CreateAccount.jsx
│   │   │   │   └── AdminLogin.jsx
│   │   │   ├── layout/
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   └── Header.jsx
│   │   │   ├── dashboard/
│   │   │   │   ├── SalesMetrics.jsx
│   │   │   │   ├── SalesTrend.jsx
│   │   │   │   ├── ProductsRevenue.jsx
│   │   │   │   ├── DoctorStatistics.jsx
│   │   │   │   ├── InventoryCost.jsx
│   │   │   │   ├── DoctorSurgeryFees.jsx
│   │   │   │   └── RecentPayments.jsx
│   │   │   ├── employees/
│   │   │   │   ├── EmployeeDirectory.jsx
│   │   │   │   ├── DepartmentOverview.jsx
│   │   │   │   ├── CreateEmployeeModal.jsx
│   │   │   │   └── EditEmployeeModal.jsx
│   │   │   ├── invoices/
│   │   │   │   ├── InvoiceManagement.jsx
│   │   │   │   ├── CreateInvoiceModal.jsx
│   │   │   │   └── EditInvoiceModal.jsx
│   │   │   └── payments/
│   │   │       ├── PaymentStatistics.jsx
│   │   │       └── PaymentList.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Employees.jsx
│   │   │   ├── Invoices.jsx
│   │   │   └── MonitorPayment.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── utils/
│   │   │   ├── constants.js
│   │   │   └── helpers.js
│   │   ├── App.jsx
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   └── tailwind.config.js
│
└── backend/                  # PHP Backend
    ├── config/
    │   └── database.php
    ├── api/
    │   ├── auth/
    │   │   ├── create_account.php
    │   │   ├── login.php
    │   │   └── logout.php
    │   ├── dashboard/
    │   │   ├── sales_metrics.php
    │   │   ├── sales_trend.php
    │   │   ├── products_revenue.php
    │   │   ├── doctor_statistics.php
    │   │   ├── inventory_cost.php
    │   │   ├── doctor_surgery_fees.php
    │   │   └── recent_payments.php
    │   ├── employees/
    │   │   ├── get_employees.php
    │   │   ├── get_departments.php
    │   │   ├── create_employee.php
    │   │   ├── update_employee.php
    │   │   └── delete_employee.php
    │   ├── invoices/
    │   │   ├── get_invoices.php
    │   │   ├── create_invoice.php
    │   │   └── update_invoice.php
    │   └── payments/
    │       ├── get_payments.php
    │       ├── update_payment_status.php
    │       └── track_transactions.php
    ├── utils/
    │   ├── cors.php
    │   └── response.php
    └── database/
        └── schema.sql
```

## 🗄️ Database Schema

The system uses MySQL with the following tables:

- **admins**: Admin user accounts
- **employees**: Staff information and management
- **invoices**: Invoice records and tracking
- **payments**: Payment transactions and status
- **sales**: Sales data for analytics
- **inventory**: Product and supply management

## 🚀 Setup Instructions

### Prerequisites
- **XAMPP/WAMP** or similar local server environment
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MySQL** database

### Backend Setup

1. **Place Backend Files**
   ```bash
   # Copy the backend folder to your web server directory
   # For XAMPP: C:/xampp/htdocs/backend/
   # For WAMP: C:/wamp64/www/backend/
   ```

2. **Create Database**
   - Open phpMyAdmin (http://localhost/phpmyadmin)
   - Create a new database named `fur_ever_care_db`
   - Import the SQL file: `backend/database/schema.sql`

3. **Configure Database Connection**
   - Edit `backend/config/database.php`
   - Update database credentials if needed:
   ```php
   private $host = 'localhost';
   private $db_name = 'fur_ever_care_db';
   private $username = 'root';
   private $password = '';
   ```

4. **Test Backend**
   - Start your XAMPP/WAMP server
   - Visit: `http://localhost/backend/api/dashboard/sales_metrics.php`
   - You should see JSON response (may show error due to no session, but connection should work)

### Frontend Setup

1. **Navigate to Frontend Directory**
   ```bash
   cd frontend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm start
   ```

4. **Access Application**
   - Open browser to: `http://localhost:3000`
   - The app will automatically connect to the PHP backend

### First Time Setup

1. **Create Admin Account**
   - Visit: `http://localhost:3000/create-account`
   - Fill in the registration form
   - Click "Create Account"

2. **Login**
   - Visit: `http://localhost:3000/login`
   - Use your created credentials
   - You'll be redirected to the dashboard

## 🎨 Design System

### Color Palette
- **Primary Blue**: `#3B82F6` (buttons, active states)
- **Navy Blue**: `#1E3A8A` (sidebar)
- **Purple Gradient**: `#7C3AED` to `#6366F1` (backgrounds)
- **Status Colors**:
  - Green: `#10B981` (Paid/Active)
  - Orange: `#F59E0B` (Pending)
  - Red: `#EF4444` (Overdue)
  - Teal: `#14B8A6` (metrics)

### Typography
- **Font**: Inter (Google Fonts)
- **Headers**: Bold, dark blue `#1E3A8A`
- **Body**: Regular, gray `#6B7280`
- **Metrics**: Large, bold numbers

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/create_account.php` - Create admin account
- `POST /api/auth/login.php` - Admin login
- `POST /api/auth/logout.php` - Admin logout

### Dashboard
- `GET /api/dashboard/sales_metrics.php` - Get sales metrics
- `GET /api/dashboard/sales_trend.php?months=6` - Get sales trend
- `GET /api/dashboard/products_revenue.php` - Get revenue breakdown
- `GET /api/dashboard/inventory_cost.php` - Get inventory data
- `GET /api/dashboard/recent_payments.php?limit=5` - Get recent payments

### Employees
- `GET /api/employees/get_employees.php` - Get all employees
- `GET /api/employees/get_departments.php` - Get department stats
- `POST /api/employees/create_employee.php` - Create employee
- `PUT /api/employees/update_employee.php` - Update employee
- `DELETE /api/employees/delete_employee.php?id={id}` - Delete employee

### Invoices
- `GET /api/invoices/get_invoices.php` - Get filtered invoices
- `POST /api/invoices/create_invoice.php` - Create invoice
- `PUT /api/invoices/update_invoice.php` - Update invoice

### Payments
- `GET /api/payments/get_payments.php` - Get all payments
- `PUT /api/payments/update_payment_status.php` - Update payment status

## 🔒 Security Features

- **Password Hashing**: bcrypt encryption for passwords
- **SQL Injection Prevention**: PDO prepared statements
- **XSS Protection**: Input sanitization and validation
- **Session Management**: Secure admin sessions
- **CORS Configuration**: Controlled cross-origin requests

## 📱 Responsive Design

The application is fully responsive and works on:
- **Desktop**: Full feature access with sidebar navigation
- **Tablet**: Optimized layout with collapsible sidebar
- **Mobile**: Mobile-first design with touch-friendly interface

## 🚀 Deployment

### Production Setup

1. **Backend Deployment**
   - Upload backend files to your web server
   - Configure database connection for production
   - Set up SSL certificate for HTTPS

2. **Frontend Deployment**
   ```bash
   cd frontend
   npm run build
   ```
   - Upload the `build` folder to your web server
   - Configure web server to serve React app

3. **Database Migration**
   - Export production database from development
   - Import to production MySQL server
   - Update database credentials in production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Check the documentation
- Review the API endpoints
- Check browser console for errors
- Verify database connection

## 🎯 Future Enhancements

- **Email Notifications**: Automated invoice and payment reminders
- **Advanced Reporting**: PDF report generation
- **Multi-language Support**: Internationalization
- **Mobile App**: React Native mobile application
- **API Documentation**: Swagger/OpenAPI documentation
- **Backup System**: Automated database backups
- **User Roles**: Multiple admin roles and permissions

---

**Fur-Ever Care** - Streamlining veterinary clinic management with modern technology! 🐾
