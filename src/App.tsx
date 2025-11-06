import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense, lazy } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastProvider } from './contexts/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import PrivateLayout from './components/Layout/PrivateLayout';
import LoadingSpinner from './components/LoadingSpinner';
import PrivacyPolicyPage from './page/PrivacyPolicyPage';
import TermsAndConditionsPage from './page/TermsAndConditionsPage';

// Lazy load components
const LandingPage = lazy(() => import('./page/LandingPage'));
const Auth = lazy(() => import('./page/Auth'));
const Dashboard = lazy(() => import('./features/dashboard/Dashboard'));
const Analysis = lazy(() => import('./features/analysis/Analysis'));
const About = lazy(() => import('./page/About'));
const PlaceholderPage = lazy(() => import('./components/PlaceholderPage'));
const Categories = lazy(() => import('./features/categories/Categories'));
const CategoryForm = lazy(() => import('./features/categories/CategoryForm'));
const Tags = lazy(() => import('./features/tags/Tags'));
const ScheduledTransactions = lazy(() => import('./features/scheduledTransactions/ScheduledTransactions'));
const ScheduledTransactionForm = lazy(() => import('./features/scheduledTransactions/ScheduledTransactionForm'));
const Budgets = lazy(() => import('./features/budget/Budgets'));
const BudgetForm = lazy(() => import('./features/budget/BudgetForm'));
const BudgetAnalysis = lazy(() => import('./features/budget/BudgetAnalysis'));
const Accounts = lazy(() => import('./features/account/Accounts'));
const AccountForm = lazy(() => import('./features/account/AccountForm'));
const AccountDetail = lazy(() => import('./features/account/AccountDetail'));
const Transactions = lazy(() => import('./features/transaction/Transactions'));
const TransactionForm = lazy(() => import('./features/transaction/TransactionForm'));
const Debts = lazy(() => import('./features/debt/Debts'));
const DebtForm = lazy(() => import('./features/debt/DebtForm'));
const DebtRecords = lazy(() => import('./features/debt/record/DebtRecords'));
const DebtRecordForm = lazy(() => import('./features/debt/record/DebtRecordForm'));
const Settings = lazy(() => import('./features/settings/Settings'));
const CalendarView = lazy(() => import('./features/views/CalendarView'));
const DayView = lazy(() => import('./features/views/DayView'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <Suspense fallback={<LoadingSpinner />}>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={
                <PublicRoute>
                  <LandingPage />
                </PublicRoute>
              } />
              <Route path="/log-in-or-create-account" element={
                <PublicRoute>
                  <Auth />
                </PublicRoute>
              } />

              {/* Protected Routes */}
              <Route path="/" element={
                <ProtectedRoute>
                  <PrivateLayout />
                </ProtectedRoute>
              }>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="analysis" element={<Analysis />} />
                <Route path="accounts" element={<Accounts />} />
                <Route path="accounts/add" element={<AccountForm />} />
                <Route path="accounts/edit/:id" element={<AccountForm />} />
                <Route path="accounts/detail/:id" element={<AccountDetail />} />
                <Route path="transactions" element={<Transactions />} />
                <Route path="transactions/add" element={<TransactionForm />} />
                <Route path="transactions/edit/:id" element={<TransactionForm />} />
                <Route path="tags" element={<Tags />} />
                <Route path="budgets" element={<Budgets />} />
                <Route path="budgets/add" element={<BudgetForm />} />
                <Route path="budgets/edit/:id" element={<BudgetForm />} />
                <Route path="budgets/analysis/:budgetId" element={<BudgetAnalysis />} />
                <Route path="categories" element={<Categories />} />
                <Route path="categories/add" element={<CategoryForm />} />
                <Route path="categories/edit/:id" element={<CategoryForm />} />
                <Route path="scheduled" element={<ScheduledTransactions />} />
                <Route path="scheduled/add" element={<ScheduledTransactionForm />} />
                <Route path="scheduled/edit/:id" element={<ScheduledTransactionForm />} />
                <Route path="debts" element={<Debts />} />
                <Route path="debts/add" element={<DebtForm />} />
                <Route path="debts/edit/:id" element={<DebtForm />} />
                <Route path="debts/:debtId/records" element={<DebtRecords />} />
                <Route path="debts/:debtId/records/add" element={<DebtRecordForm />} />
                <Route path="debts/:debtId/records/edit/:recordId" element={<DebtRecordForm />} />
                <Route path="views/day" element={<DayView />} />
                <Route path="views/calendar" element={<CalendarView />} />
                <Route path="views/custom" element={
                  <PlaceholderPage
                    title="Custom Views"
                    description="Create and manage custom views of your financial data"
                  />
                } />
                <Route path="settings" element={<Settings />} />

              </Route>
              <Route path="about" element={<About />} />
              <Route path="privacy" element={<PrivacyPolicyPage />} />
              <Route path="terms" element={<TermsAndConditionsPage />} />
              {/* Redirect to dashboard for authenticated users */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
          <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            className="!top-4 !right-4"
            toastClassName="!rounded-lg !shadow-lg"
            closeButton={false}
          />
        </Suspense>
      </ToastProvider>
    </QueryClientProvider>
  );
}

export default App;