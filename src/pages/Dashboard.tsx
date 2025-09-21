import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, CreditCard, Target, Calendar, ArrowUpDown, Building2, Wallet, Banknote, Edit, Trash2 } from 'lucide-react';
import { useFormatters } from '../hooks/useFormatters';
import { useRecentTransactions, useTransactionSummary } from '../hooks/useDashboard';
import { useDeleteTransaction } from '../hooks/useTransactions';
import { TRANSACTION_TYPES } from '../types/transaction';
import { DEBT_TRANSACTION_TYPES } from '../types/debt';
import CategoryIcon from '../components/CategoryIcon';
import ConfirmationModal from '../components/ConfirmationModal';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const monthlyData = [
  { name: 'Jan', spending: 2400, budget: 3000 },
  { name: 'Feb', spending: 2800, budget: 3000 },
  { name: 'Mar', spending: 2200, budget: 3000 },
  { name: 'Apr', spending: 3100, budget: 3000 },
  { name: 'May', spending: 2900, budget: 3000 },
  { name: 'Jun', spending: 2600, budget: 3000 },
];

const categoryData = [
  { name: 'Food', value: 35, color: '#8B5CF6' },
  { name: 'Transportation', value: 20, color: '#10B981' },
  { name: 'Shopping', value: 15, color: '#F59E0B' },
  { name: 'Entertainment', value: 12, color: '#EF4444' },
  { name: 'Utilities', value: 10, color: '#3B82F6' },
  { name: 'Other', value: 8, color: '#6B7280' },
];

function Dashboard() {
  const { formatCurrency } = useFormatters();
  const [transactionToDelete, setTransactionToDelete] = useState<{ id: string; description: string } | null>(null);
  const [summaryRange, setSummaryRange] = useState<1 | 2 | 3>(2); // Default to month

  const { data: recentTransactions = [], isLoading: recentLoading } = useRecentTransactions();
  const { data: summary, isLoading: summaryLoading } = useTransactionSummary(summaryRange);
  const deleteTransaction = useDeleteTransaction();

  const handleDeleteTransaction = async () => {
    if (transactionToDelete) {
      try {
        await deleteTransaction.mutateAsync(transactionToDelete.id);
        setTransactionToDelete(null);
      } catch (error) {
        console.error('Failed to delete transaction:', error);
      }
    }
  };

  const getTransactionIcon = (type: number) => {
    if (type === 1) return <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />;
    if (type === 2) return <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />;
    if (type === 3) return <ArrowUpDown className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />;
    if (type === 5) return <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />;
    if (type === 6) return <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />;
    if (type === 7) return <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />;
    return <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />;
  };

  const getAmountColor = (type: number) => {
    if (type === 1 || type === 5) return 'text-red-600';
    if (type === 2 || type === 6) return 'text-green-600';
    if (type === 3 || type === 7) return 'text-blue-600';
    return 'text-gray-600';
  };

  const getAccountIcon = (type: number) => {
    switch (type) {
      case 1: return <Building2 className="w-4 h-4 text-blue-600" />;
      case 2: return <Wallet className="w-4 h-4 text-green-600" />;
      case 3: return <CreditCard className="w-4 h-4 text-purple-600" />;
      case 4: return <Banknote className="w-4 h-4 text-yellow-600" />;
      default: return <Building2 className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatDateTime = (date: string, time: string) => {
    const formattedDate = new Date(date).toLocaleDateString();
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    const formattedTime = `${displayHour}:${minutes.padStart(2, '0')} ${period}`;
    return { date: formattedDate, time: formattedTime };
  };

  const getTransactionTypeName = (type: number) => {
    if (type >= 5 && type <= 7) {
      return DEBT_TRANSACTION_TYPES[type as keyof typeof DEBT_TRANSACTION_TYPES];
    }
    return TRANSACTION_TYPES[type.toString() as keyof typeof TRANSACTION_TYPES];
  };

  const balance = (summary?.totalIncome || 0) - (summary?.totalExpense || 0);
  const savingsRate = summary?.totalIncome ? ((summary.totalIncome - summary.totalExpense) / summary.totalIncome * 100) : 0;

  return (
    <div className="p-3 sm:p-4 lg:p-6 max-w-7xl mx-auto min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">Track your expenses and financial goals</p>
      </div>

      {/* Summary Range Selector */}
      <div className="mb-6">
        <div className="flex justify-evenly gap-2 bg-gray-100 rounded-full p-1 sm:w-fit">
          {[
            { value: 1, label: 'All Time' },
            { value: 2, label: 'Month' },
            { value: 3, label: 'Year' }
          ].map((option) => {
            const active = summaryRange === option.value;
            return (
              <button
                key={option.value}
                onClick={() => setSummaryRange(option.value as 1 | 2 | 3)}
                className={`px-4 w-full py-2 rounded-full text-sm font-medium transition ${
                  active
                    ? 'bg-white shadow text-gray-900'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Stats Cards */}
      {summaryLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-200 rounded-lg shadow p-4 sm:p-6 animate-pulse h-24"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Total Spending</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{formatCurrency(summary?.totalExpense || 0)}</p>
            </div>
            <div className="bg-red-100 rounded-full p-2 sm:p-3">
              <TrendingDown className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Income</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{formatCurrency(summary?.totalIncome || 0)}</p>
            </div>
            <div className="bg-green-100 rounded-full p-2 sm:p-3">
              <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Balance</p>
              <p className={`text-xl sm:text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {balance >= 0 ? '+' : ''}{formatCurrency(Math.abs(balance))}
              </p>
            </div>
            <div className={`rounded-full p-2 sm:p-3 ${balance >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
              <DollarSign className={`h-5 w-5 sm:h-6 sm:w-6 ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Savings Rate</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{Math.max(0, savingsRate).toFixed(1)}%</p>
            </div>
            <div className="bg-purple-100 rounded-full p-2 sm:p-3">
              <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Monthly Spending vs Budget</h3>
          <div className="h-48 sm:h-64 md:h-72 lg:h-80">
            <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="spending" fill="#6366F1" />
              <Bar dataKey="budget" fill="#E5E7EB" />
            </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Spending by Category</h3>
          <div className="h-48 sm:h-64 md:h-72 lg:h-80">
            <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Recent Transactions</h3>
            <Link
              to="/transactions"
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              View All
            </Link>
          </div>
        </div>
        <div className="p-4 sm:p-6">
          {recentLoading ? (
            <div className="space-y-3 sm:space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between py-2 sm:py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="space-y-1">
                      <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
                    </div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                </div>
              ))}
            </div>
          ) : recentTransactions.length === 0 ? (
            <div className="text-center py-8">
              <ArrowUpDown className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions yet</h3>
              <p className="text-sm text-gray-500 mb-4">Start tracking your finances by adding your first transaction</p>
              <Link
                to="/transactions/add"
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
              >
                <TrendingUp className="w-4 h-4" />
                Add Transaction
              </Link>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {recentTransactions.slice(0, 5).map((transaction) => {
                const { date, time } = formatDateTime(transaction.txnDate, transaction.txnTime);
                return (
                  <div key={transaction.id} className="flex items-center justify-between py-2 sm:py-3 border-b border-gray-100 last:border-b-0 gap-2 sm:gap-3 lg:gap-4">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100">
                        {transaction.category ? (
                          <CategoryIcon
                            icon={transaction.category.icon}
                            color={transaction.category.color}
                            size="sm"
                          />
                        ) : (
                          getTransactionIcon(transaction.type)
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm sm:text-base font-medium text-gray-900 truncate">{transaction.description}</p>
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                          <span>{getTransactionTypeName(transaction.type)}</span>
                          {transaction.category && (
                            <>
                              <span>•</span>
                              <span className="truncate">{transaction.category.name}</span>
                            </>
                          )}
                          {transaction.account && (
                            <>
                              <span>•</span>
                              <div className="flex items-center gap-1">
                                {getAccountIcon(transaction.account.type)}
                                <span className="truncate">{transaction.account.name}</span>
                              </div>
                            </>
                          )}
                          {transaction.fromAccount && transaction.toAccount && (
                            <>
                              <span>•</span>
                              <div className="flex items-center gap-1">
                                {getAccountIcon(transaction.fromAccount.type)}
                                <span className="truncate">{transaction.fromAccount.name}</span>
                                <ArrowUpDown className="w-3 h-3" />
                                {getAccountIcon(transaction.toAccount.type)}
                                <span className="truncate">{transaction.toAccount.name}</span>
                              </div>
                            </>
                          )}
                          {transaction.debt && (
                            <>
                              <span>•</span>
                              <span className="truncate">Debt: {transaction.debt.personName}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 flex items-center gap-2">
                      <div>
                        <p className={`text-sm sm:text-base font-medium ${getAmountColor(transaction.type)}`}>
                          {(transaction.type === 1 || transaction.type === 5) ? '-' :
                            (transaction.type === 2 || transaction.type === 6) ? '+' : ''}
                          {formatCurrency(transaction.amount)}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600 hidden md:block">{date}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Link
                          to={`/transactions/edit/${transaction.id}`}
                          className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-indigo-600"
                        >
                          <Edit className="w-3 h-3" />
                        </Link>
                        <button
                          onClick={() => setTransactionToDelete({
                            id: transaction.id,
                            description: transaction.description
                          })}
                          disabled={deleteTransaction.isPending}
                          className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-red-600 disabled:opacity-50"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!transactionToDelete}
        onClose={() => setTransactionToDelete(null)}
        onConfirm={handleDeleteTransaction}
        title="Delete Transaction"
        message={`Are you sure you want to delete "${transactionToDelete?.description}" transaction? This action cannot be undone.`}
        confirmText="Delete Transaction"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
        isPending={deleteTransaction.isPending}
      />
    </div>
  );
}

export default Dashboard;