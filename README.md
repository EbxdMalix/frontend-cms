# Construction Management System - Frontend

Modern React-based frontend for the Construction Management System with comprehensive financial, inventory, and project management features.

## 🚀 Live Deployment

- **Production URL**: https://construction-management-system-soft.vercel.app/

## 📋 Features

### 🔐 Authentication & Authorization

- Secure JWT-based authentication
- Role-based access control (Admin, Manager, Accountant, User)
- Protected routes with permission checking
- Persistent login sessions

### 📊 Dashboard & Reports

- Interactive dashboard with key metrics
- Financial reports (Balance Sheet, Income Statement, Trial Balance)
- Inventory reports
- Project and customer ledgers

### 💰 Financial Management

- **Double-Entry Accounting System**
  - Automatic journal entry creation from transactions
  - Manual journal entry creation for adjustments
  - Journal entry reversal functionality
- **General Ledger**
  - Running balances for all accounts
  - Filter by date range, account, or project
  - Drill-down to source transactions
- **Chart of Accounts**
  - Five account types: Asset, Liability, Equity, Revenue, Expense
  - Opening balance support
- **Financial Statements**
  - Trial Balance (verify debits = credits)
  - Balance Sheet (Assets = Liabilities + Equity)
  - Profit & Loss Statement (Revenue - Expenses)
- **Payment Processing**
  - Cash Payment processing
  - Bank Payment processing
- **Ledgers**
  - Customer and Supplier ledgers
  - Project-based accounting

### 🏗️ Project Management

- Project creation and tracking
- Plot management
- Project ledger

### 📦 Inventory Management

- Item list management
- Purchase entry
- Sales invoice generation
- Inventory reporting

### 👥 User Management

- User CRUD operations
- Role assignment
- Status management (Active/Inactive)
- Permission-based access control

## 🛠️ Tech Stack

- **Framework**: React v19.2.0
- **Build Tool**: Vite v7.2.4
- **Styling**:
  - Tailwind CSS v4.1.17
  - Styled Components v6.1.19
- **Routing**: React Router DOM v7.9.6
- **HTTP Client**: Axios v1.13.2
- **Icons**: React Icons v5.5.0
- **Linting**: ESLint v9.39.1

## 📁 Project Structure

```
client/
├── public/                 # Static assets
├── src/
│   ├── api/               # API service layer
│   │   ├── authApi.js                # Authentication API
│   │   ├── userApi.js                # User management API
│   │   ├── journalEntryApi.js        # Journal entry API
│   │   ├── generalLedgerApi.js       # General ledger API
│   │   ├── accountTypeApi.js         # Account type API
│   │   ├── chartOfAccountApi.js      # Chart of accounts API
│   │   ├── customerApi.js            # Customer API
│   │   ├── supplierApi.js            # Supplier API
│   │   ├── projectApi.js             # Project API
│   │   ├── itemApi.js                # Item API
│   │   ├── purchaseApi.js            # Purchase API
│   │   ├── salesInvoiceApi.js        # Sales invoice API
│   │   ├── bankPaymentApi.js         # Bank payment API
│   │   ├── reportApi.js              # Report API
│   │   └── dashboardApi.js           # Dashboard API
│   ├── components/        # Reusable components
│   │   ├── Modal.jsx
│   │   ├── PermissionRoute.jsx
│   │   └── ProtectedRoute.jsx
│   ├── context/           # React Context
│   │   ├── AuthContext.jsx
│   │   └── useAuth.js
│   ├── layout/            # Layout components
│   │   ├── Header.jsx
│   │   ├── Home.jsx
│   │   ├── MainContent.jsx
│   │   └── Sidebar.jsx
│   ├── pages/             # Page components
│   │   ├── Dashboard.jsx
│   │   ├── LoginPage.jsx
│   │   ├── NotFoundPage.jsx
│   │   ├── UnauthorizedPage.jsx
│   │   └── sections/      # Feature sections
│   │       ├── Dashboard.jsx
│   │       ├── Users.jsx
│   │       ├── ChartOfAccounts.jsx
│   │       ├── CashPayment.jsx
│   │       ├── BankPayment.jsx
│   │       ├── Customers.jsx
│   │       ├── Suppliers.jsx
│   │       ├── Projects.jsx
│   │       ├── ItemList.jsx
│   │       ├── PurchaseEntry.jsx
│   │       ├── SalesInvoice.jsx
│   │       ├── JournalEntries.jsx        # 🆕 Journal entry management
│   │       ├── GeneralLedger.jsx         # 🆕 General ledger view
│   │       ├── TrialBalance.jsx          # 🆕 Trial balance report
│   │       ├── BalanceSheetReport.jsx    # 🆕 Balance sheet
│   │       ├── ProfitLossStatement.jsx   # 🆕 P&L statement
│   │       ├── CustomerLedger.jsx
│   │       ├── SupplierLedger.jsx
│   │       ├── ProjectLedger.jsx
│   │       ├── InventoryReport.jsx
│   │       ├── IncomeStatement.jsx
│   │       └── Loader.jsx
│   ├── App.jsx            # Root component
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
├── .gitignore
├── AUTH_README.md         # Authentication documentation
├── eslint.config.js
├── index.html
├── package.json
├── ROUTES.md              # Route documentation
└── vite.config.js
```

## 🔧 Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd client
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory (if needed):

```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 📦 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔐 User Roles & Permissions

### Admin

- Full system access
- User management
- All financial operations
- Project and inventory management

### Manager

- Project management
- Inventory management
- View financial reports
- Limited user management

### Accountant

- Full financial operations
- View inventory reports
- View project information
- No user management

### User

- View-only access to assigned projects
- Limited reporting access

## 🛣️ Routes

### Public Routes

- `/login` - Login page

### Protected Routes

#### General

- `/` - Dashboard (All authenticated users)
- `/users` - User management (Admin only)

#### Maintain (Setup)

- `/chart-of-accounts` - Chart of accounts (Admin, Accountant)
- `/customers` - Customer management
- `/suppliers` - Supplier management
- `/projects` - Project management
- `/item-list` - Inventory items

#### Operations (Transactions)

- `/purchase-entry` - Purchase entry (Purchase permission)
- `/sales-invoice` - Sales invoicing (Sales permission)
- `/cash-payment` - Cash payments (Admin, Accountant)
- `/bank-payment` - Bank payments (Admin, Accountant)

#### Accounting (Double-Entry System) 🆕

- `/journal-entries` - Journal entry management (Accounting permission)
- `/general-ledger` - General ledger view (Accounting permission)
- `/trial-balance` - Trial balance report (Accounting permission)
- `/balance-sheet-report` - Balance sheet (Accounting permission)
- `/profit-loss-statement` - Profit & Loss statement (Accounting permission)

#### Reports

- `/customer-ledger` - Customer ledger
- `/supplier-ledger` - Supplier ledger
- `/project-ledger` - Project ledger
- `/inventory-report` - Inventory report
- `/income-statement` - Income statement report

## 🔌 API Integration

The frontend communicates with the backend API through axios instances configured in the `api/` directory.

**Backend URL**:

- Development: `http://localhost:5000/api`
- Production: `https://construction-management-system-back.vercel.app/api`

## 🎨 Styling

The project uses a combination of:

- **Tailwind CSS** for utility-first styling
- **Styled Components** for component-specific styles
- Custom CSS for global styles

## 🔒 Authentication Flow

1. User enters credentials on login page
2. Frontend sends request to `/api/auth/login`
3. Backend validates and returns JWT token
4. Token stored in localStorage
5. AuthContext provides user state throughout app
6. Protected routes check authentication status
7. Axios interceptor adds token to all requests
8. Auto-logout on 401 responses

## 🚀 Deployment

This project is deployed on Vercel.

### Build Configuration

- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

### Environment Variables on Vercel

The app automatically detects production environment and uses the production API URL.

## 📱 Responsive Design

The application is fully responsive and works on:

- Desktop (1920px and above)
- Laptop (1024px - 1919px)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🧪 Testing

Testing setup is in progress. Future implementation will include:

- Unit tests with Vitest
- Component tests with React Testing Library
- E2E tests with Playwright

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 👥 Author

- GitHub: [@EbxdMalix](https://github.com/EbxdMalix)

## 🐛 Known Issues

- Test suite needs to be implemented
- Some accessibility improvements needed
- Performance optimization for large data sets

## 📞 Support

For support, please contact the development team or open an issue in the GitHub repository.

## 🔄 Updates & Changelog

### Latest Updates

- ✅ **Double-Entry Accounting System** - Complete accounting engine with automatic journal entries
- ✅ **Journal Entries** - Create, edit, reverse, and post journal entries
- ✅ **General Ledger** - View all transactions with running balances
- ✅ **Trial Balance** - Verify that debits equal credits
- ✅ **Balance Sheet** - Assets = Liabilities + Equity financial statement
- ✅ **Profit & Loss Statement** - Revenue - Expenses = Net Profit/Loss
- ✅ Fixed CORS configuration
- ✅ Updated production API URL
- ✅ Implemented role-based access control
- ✅ Added comprehensive user management
- ✅ Integrated financial reporting modules

## 📚 Additional Documentation

- [Authentication Guide](./AUTH_README.md)
- [Routes Documentation](./ROUTES.md)

## 🙏 Acknowledgments

- React team for the amazing framework
- Vite for the blazing fast build tool
- Tailwind CSS for the utility-first CSS framework
