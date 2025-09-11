import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, ArrowUpDown, TrendingUp, TrendingDown, ChevronLeft, ChevronRight, CreditCard, Smartphone, FileText, Globe, Building2, Wallet, Banknote } from 'lucide-react';
import { useTransactions, useDeleteTransaction } from '../hooks/useTransactions';
import { TransactionFilters, TRANSACTION_TYPES } from '../types/transaction';
import { useFormatters } from '../hooks/useFormatters';
import CategoryIcon from '../components/CategoryIcon';
import ConfirmationModal from '../components/ConfirmationModal';

function Transactions() {
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [filters, setFilters] = useState<TransactionFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [transactionToDelete, setTransactionToDelete] = useState<{ id: string; description: string } | null>(null);

  const { data: transactionsData, isLoading } = useTransactions(currentPage, pageSize, {
    ...filters,
    search: searchTerm
  });
  const deleteTransaction = useDeleteTransaction();
  const { formatCurrency, formatDateTime } = useFormatters();

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(0);
    setFilters(prev => ({ ...prev, search: searchTerm }));
  };

  const getTransactionIcon = (type: number) => {
    switch (type) {
      case 1: // Expense
        return <TrendingDown className="w-5 h-5 text-red-600" />;
      case 2: // Income
        return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 3: // Transfer
        return <ArrowUpDown className="w-5 h-5 text-blue-600" />;
      default:
        return <ArrowUpDown className="w-5 h-5 text-gray-600" />;
    }
  };

  const getAmountColor = (type: number) => {
    switch (type) {
      case 1: // Expense
        return 'text-red-600';
      case 2: // Income
        return 'text-green-600';
      case 3: // Transfer
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const getAccountIcon = (type: number) => {
    switch (type) {
      case 1: // Bank
        return <Building2 className="w-4 h-4 text-blue-600" />;
      case 2: // Wallet
        return <Wallet className="w-4 h-4 text-green-600" />;
      case 3: // Credit Card
        return <CreditCard className="w-4 h-4 text-purple-600" />;
      case 4: // Cash
        return <Banknote className="w-4 h-4 text-yellow-600" />;
      default:
        return <Building2 className="w-4 h-4 text-gray-600" />;
    }
  };

  const getPaymentModeIcon = (type: number) => {
    switch (type) {
      case 1:
        return <CreditCard className="w-3 h-3 text-purple-600" />;
      case 2:
        return <Smartphone className="w-3 h-3 text-blue-600" />;
      case 3:
        return <FileText className="w-3 h-3 text-gray-600" />;
      case 4:
        return <Globe className="w-3 h-3 text-green-600" />;
      default:
        return <CreditCard className="w-3 h-3 text-gray-600" />;
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="h-12 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const transactions = transactionsData?.content || [];
  const totalPages = transactionsData?.totalPages || 0;
  const totalElements = transactionsData?.totalElements || 0;

  return (
    <div className="p-3 sm:p-4 lg:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Transactions</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Track all your financial transactions</p>
        </div>
        <Link
          to="/transactions/add"
          className="mt-3 sm:mt-0 inline-flex items-center px-3 sm:px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm sm:text-base"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
          Add Transaction
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
              />
            </div>
          </div>
        </form>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">
            All Transactions ({totalElements})
          </h2>
        </div>

        {transactions.length === 0 ? (
          <div className="p-6 sm:p-8 text-center">
            <ArrowUpDown className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
              No transactions yet
            </h3>
            <p className="text-sm sm:text-base text-gray-500 mb-4">
              Start tracking your finances by adding your first transaction
            </p>
            <Link
              to="/transactions/add"
              className="inline-flex items-center px-3 sm:px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm sm:text-base"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              Add Transaction
            </Link>
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-200">
              {transactions.map((transaction) => {
                const { date, time } = formatDateTime(transaction.date, transaction.time);
                return (
                  <div key={transaction.id} className="p-3 sm:p-4 lg:p-6 flex items-center justify-between">
                    <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4 flex-1 min-w-0">
                      <div className="flex-shrink-0">
                        {transaction.category ? (
                          <CategoryIcon
                            icon={transaction.category.icon}
                            color={transaction.category.color}
                            size="sm"
                          />
                        ) : (
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-full flex items-center justify-center">
                            {getTransactionIcon(transaction.type)}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-1 sm:space-x-2 mb-1">
                          {transaction.category && (
                            <p className="text-sm sm:text-base font-medium text-gray-900 truncate">
                              {transaction.category.name}
                            </p>
                          )}
                          <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 flex-shrink-0">
                            {TRANSACTION_TYPES[transaction.type]}
                          </span>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 lg:space-x-3 text-xs sm:text-sm text-gray-500">
                          <span>{date} at {time}</span>
                          {transaction.description && (
                            <span className="hidden sm:inline truncate flex items-center">
                              • {transaction.description}
                            </span>
                          )}

                          {transaction.account && (
                            <div className="hidden lg:flex items-center text-xs sm:text-sm text-gray-500">
                              <span className="mx-1"> • </span>
                              <span className="flex items-center">
                                {getAccountIcon(transaction.account.type)}
                                <span className="ml-1">{transaction.account.name}</span>
                              </span>
                            </div>
                          )}
                          
                          {transaction.paymentMode && (
                            <div className="hidden lg:flex items-center text-xs sm:text-sm text-gray-500">
                              <span className="mx-1"> • </span>
                              <span className="flex items-center">
                                {getPaymentModeIcon(transaction.paymentMode.type)}
                                <span className="ml-1">{transaction.paymentMode.name}</span>
                              </span>
                            </div>
                          )}

                          {transaction.type === 3 && transaction.fromAccount && (
                            <div className="hidden lg:flex items-center text-xs sm:text-sm text-gray-500">
                              <span className="mx-1"> • </span>
                              <span className="flex items-center">
                                {getAccountIcon(transaction.fromAccount.type)}
                                <span className="ml-1">{transaction.fromAccount.name}</span>
                              </span>
                            </div>
                          )}

                          {transaction.type === 3 && transaction.toAccount && (
                            <div className="hidden lg:flex items-center text-xs sm:text-sm text-gray-500">
                              <span className="mx-1"> → </span>
                              <span className="flex items-center">
                                {getAccountIcon(transaction.toAccount.type)}
                                <span className="ml-1">{transaction.toAccount.name}</span>
                              </span>
                            </div>
                          )}

                          {transaction.tags && transaction.tags.length > 0 && (
                            <span className="hidden xl:inline truncate">
                              • Tags: {transaction.tags.map(tag => tag.name).join(', ')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
                      <div className="text-right">
                        <p className={`text-sm sm:text-base font-semibold ${getAmountColor(transaction.type)}`}>
                          {formatCurrency(transaction.amount)}
                        </p>
                      </div>

                      <div className="flex items-center space-x-1 sm:space-x-2">
                        <Link
                          to={`/transactions/edit/${transaction.id}`}
                          className="p-1.5 sm:p-2 text-gray-400 hover:text-indigo-600 transition-colors rounded-md hover:bg-gray-50"
                        >
                          <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                        </Link>
                        <button
                          onClick={() => setTransactionToDelete({ id: transaction.id, description: transaction.description })}
                          disabled={deleteTransaction.isPending}
                          className="p-1.5 sm:p-2 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50 rounded-md hover:bg-gray-50"
                        >
                          <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            <div className="p-4 sm:p-6 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="text-xs sm:text-sm text-gray-700 text-center sm:text-left">
                  Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements} transactions
                </div>

                <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                    disabled={currentPage === 0}
                    className="p-1.5 sm:p-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>

                  <span className="px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm font-medium bg-gray-50 rounded-md">
                    Page {currentPage + 1} of {totalPages}
                  </span>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                    disabled={currentPage >= totalPages - 1}
                    className="p-1.5 sm:p-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!transactionToDelete}
        onClose={() => setTransactionToDelete(null)}
        onConfirm={handleDeleteTransaction}
        title="Delete Transaction"
        message={`Are you sure you want to delete "${transactionToDelete?.description}" transaction? This action cannot be undone and may affect your account balances.`}
        confirmText="Delete Transaction"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
        isPending={deleteTransaction.isPending}
      />
    </div>
  );
}

export default Transactions;