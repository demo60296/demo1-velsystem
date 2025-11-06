# ExpenseTrace - Personal Finance Management Application

ExpenseTrace is a comprehensive personal finance management application built with React, TypeScript, and modern web technologies. It helps users track expenses, manage budgets, analyze spending patterns, and maintain financial health through intuitive interfaces and powerful analytics.

## 🌟 Features

### 💰 Expense & Income Tracking
- **Multi-category transactions**: Organize expenses and income with customizable categories
- **Multiple account types**: Support for bank accounts, wallets, credit cards, and cash
- **Payment modes**: Track different payment methods (UPI, debit cards, cheque, internet banking)
- **Transfer tracking**: Monitor money transfers between accounts
- **Tag system**: Add custom tags to transactions for better organization

### 📊 Analytics & Insights
- **Visual analytics**: Beautiful charts and graphs showing spending patterns
- **Category-wise breakdown**: Detailed analysis of spending by categories
- **Account-wise analysis**: Track spending and income across different accounts
- **Time-based analysis**: Weekly, monthly, yearly, and custom date range analysis
- **Statistical insights**: Average spending, transaction counts, and trends

### 🎯 Budget Management
- **Monthly & yearly budgets**: Set and track budgets for different time periods
- **Category-wise limits**: Set spending limits for individual categories
- **Budget progress tracking**: Visual progress indicators and alerts
- **Budget analysis**: Detailed breakdown of budget vs actual spending

### 💳 Account Management
- **Multiple account types**: Bank accounts, digital wallets, credit cards, cash
- **Payment mode linking**: Associate payment methods with accounts
- **Balance tracking**: Monitor account balances and credit limits
- **Account summaries**: Overview of available funds and outstanding amounts

### 📅 Debt Management
- **Lending & borrowing**: Track money lent to others and borrowed from others
- **Payment records**: Detailed history of debt payments and receipts
- **Due date tracking**: Monitor payment due dates
- **Debt summaries**: Overview of total payable and receivable amounts

### ⚙️ Customization & Settings
- **Currency support**: Multiple international currencies
- **Number formatting**: Different number display formats (millions, lakhs, compact)
- **Time format**: 12-hour or 24-hour time display
- **Decimal precision**: Customizable decimal places
- **Daily reminders**: Optional daily expense tracking reminders

### 📱 User Experience
- **Responsive design**: Optimized for desktop, tablet, and mobile devices
- **Dark/light themes**: Comfortable viewing in any lighting condition
- **Intuitive navigation**: Easy-to-use sidebar navigation with organized sections
- **Real-time updates**: Instant data synchronization across all views
- **Custom date/time pickers**: User-friendly date and time selection components

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development with excellent IDE support
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **React Router DOM** - Client-side routing and navigation
- **React Hook Form** - Performant forms with easy validation
- **React Query (TanStack Query)** - Powerful data fetching and caching
- **Recharts** - Beautiful and responsive charts for data visualization
- **Lucide React** - Modern icon library with consistent design

### Development Tools
- **Vite** - Fast build tool and development server
- **ESLint** - Code linting and quality enforcement
- **TypeScript ESLint** - TypeScript-specific linting rules
- **PostCSS** - CSS processing and optimization
- **Autoprefixer** - Automatic CSS vendor prefixing

### State Management & Data Flow
- **React Query** - Server state management and caching
- **React Context** - Global state for authentication and notifications
- **Custom hooks** - Reusable business logic and API interactions

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/expensetrace-reactjs.git
   cd expensetrace-reactjs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment.

## 📁 Project Structure

```

/expense-trace/                 # repo root
├─ public/
│  └─ index.html
├─ src/
│  ├─ assets/                   # icons, images, fonts
│  ├─ styles/                   # global Tailwind config, css
│  │  └─ index.css
│  ├─ types/                    # TS types & enums (Account, Transaction, Category...)
│  │  └─ index.ts
│  ├─ utils/                    # small helpers, formatters, constants
│  │  ├─ date.ts
│  │  ├─ currency.ts
│  │  └─ validate.ts
│  ├─ api/                      # API client + endpoints
│  │  ├─ client.ts              # axios/fetch wrapper (handles auth, baseURL)
│  │  └─ endpoints/
│  │     ├─ accounts.ts
│  │     ├─ transactions.ts
│  │     └─ categories.ts
│  ├─ services/                 # business-logic wrappers (optional)
│  │  └─ reportsService.ts
│  ├─ hooks/                    # reusable hooks (useAuth, useDebounce, useFormHelpers)
│  │  ├─ useAuth.ts
│  │  ├─ usePagination.ts
│  │  └─ useFormatters.ts
│  ├─ features/                 # feature folders (domain-driven)
│  │  ├─ dashboard/
│  │  │  ├─ components/         # small components used only by dashboard
│  │  │  └─ DashboardPage.tsx
│  │  ├─ accounts/
│  │  │  ├─ components/         # AccountList, AccountForm, AccountDetails
│  │  │  ├─ hooks/              # useAccountsQuery, useAccountMutations
│  │  │  └─ index.tsx           # route entry for accounts
│  │  ├─ transactions/
│  │  │  ├─ components/         # TransactionList, TransactionForm, Filters
│  │  │  ├─ hooks/
│  │  │  └─ index.tsx
│  │  ├─ categories/
│  │  ├─ tags/
│  │  ├─ budget/
│  │  │  ├─ components/         # BudgetList (monthly/yearly), BudgetForm
│  │  │  └─ hooks/
│  │  ├─ scheduledTransactions/
│  │  ├─ debts/
│  │  └─ calendar/
│  ├─ components/               # shared UI components (Buttons, Modal, Input, Card)
│  │  ├─ ui/
│  │  │  ├─ Button.tsx
│  │  │  ├─ Modal.tsx
│  │  │  └─ Table.tsx
│  │  ├─ layout/
│  │  │  ├─ Header.tsx
│  │  │  └─ Sidebar.tsx
│  │  └─ widgets/               # small reusable widgets (SummaryCard, Sparkline)
│  ├─ context/                  # React Contexts (Auth, Theme)
│  │  └─ AuthContext.tsx
│  ├─ routes/                   # route definitions and protected route wrappers
│  │  └─ AppRoutes.tsx
│  ├─ pages/                    # top-level pages (Landing, About, Terms, Auth pages)
│  │  ├─ Landing.tsx
│  │  ├─ About.tsx
│  │  ├─ Terms.tsx
│  │  └─ NotFound.tsx
│  ├─ lib/                      # 3rd-party wrappers, analytics, feature flags
│  ├─ i18n/                     # translations if needed
│  ├─ App.tsx
│  └─ main.tsx
├─ tests/                       # E2E / integration / unit tests
├─ .env.example
├─ package.json
├─ README.md
└─ vite.config.ts
```

## 🔧 Key Components

### Custom Pickers
- **DatePicker**: Interactive calendar-based date selection
- **TimePicker**: Time selection with 12/24-hour format support based on user settings
- **MonthYearPicker**: Specialized picker for budget period selection

### Data Management
- **React Query**: Efficient data fetching, caching, and synchronization
- **Custom Hooks**: Encapsulated business logic for different domains
- **Type Safety**: Comprehensive TypeScript types for all data structures

### UI/UX Features
- **Responsive Design**: Mobile-first approach with breakpoint-specific layouts
- **Loading States**: Skeleton screens and loading indicators
- **Error Handling**: User-friendly error messages and recovery options
- **Toast Notifications**: Non-intrusive success/error notifications

## 🎨 Design System

### Color Palette
- **Primary**: Indigo (branding and primary actions)
- **Success**: Green (positive actions, income)
- **Warning**: Yellow (alerts and warnings)
- **Error**: Red (errors, expenses)
- **Neutral**: Gray scale (text, backgrounds, borders)

### Typography
- **Headings**: Bold, clear hierarchy
- **Body Text**: Readable font sizes with proper line spacing
- **Interactive Elements**: Consistent button and link styling

### Spacing & Layout
- **8px Grid System**: Consistent spacing throughout the application
- **Card-based Layout**: Clean separation of content areas
- **Responsive Breakpoints**: Mobile, tablet, and desktop optimized

## 🔐 Security Features

### Authentication
- **Secure Login/Signup**: Email and password authentication
- **Password Strength Validation**: Real-time password strength checking
- **Password Reset Flow**: Secure OTP-based password recovery

### Data Protection
- **Input Validation**: Client-side and server-side validation
- **Error Boundaries**: Graceful error handling and recovery
- **Secure API Communication**: HTTPS and proper error handling

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Mobile Devices** (320px - 768px)
- **Tablets** (768px - 1024px)
- **Desktop** (1024px+)

Key responsive features:
- Collapsible sidebar navigation
- Adaptive grid layouts
- Touch-friendly interactive elements
- Optimized typography scaling

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📊 Performance Optimizations

- **Code Splitting**: Lazy loading of route components
- **Bundle Optimization**: Vendor chunk separation
- **Image Optimization**: Efficient image loading and caching
- **Query Optimization**: Smart data fetching and caching strategies

## 🧪 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Quality

- **ESLint Configuration**: Comprehensive linting rules
- **TypeScript**: Strict type checking
- **Prettier Integration**: Consistent code formatting
- **Git Hooks**: Pre-commit quality checks

## 🚀 Deployment

The application can be deployed to various platforms:

### Netlify (Recommended)
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy automatically on push

### Vercel
1. Import project from GitHub
2. Vercel auto-detects Vite configuration
3. Deploy with zero configuration

### Traditional Hosting
1. Run `npm run build`
2. Upload `dist` folder contents to your web server
3. Configure server for SPA routing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write meaningful commit messages
- Add proper error handling
- Ensure responsive design
- Test on multiple devices

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Ezhil Selvan P**
- LinkedIn: [Ezhil Selvan P](https://www.linkedin.com/in/ezhil-selvan-p-79a80520a/)
- Email: support@expensetrace.com

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Lucide for the beautiful icon library
- All open-source contributors who made this project possible

## 📞 Support

For support, email support@expensetrace.com or create an issue in the GitHub repository.

---

**ExpenseTrace** - Take control of your finances with smart expense tracking and budgeting tools.