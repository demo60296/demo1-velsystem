import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus,
  Edit,
  Trash2,
  User,
  Calendar,
  ChevronLeft,
  ChevronRight,
  HandCoins,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import {
  useDebts,
  useLendingDebts,
  useBorrowingDebts,
  useDeleteDebt,
  useDebtSummary,
} from '../hooks/useDebts';
import { DEBT_TYPES } from '../types/debt';
import DebtTypeModal from '../components/DebtTypeModal';
import { useFormatters } from '../hooks/useFormatters';
import ConfirmationModal from '../components/ConfirmationModal';

const tabs = ['All', 'Lending', 'Borrowing'];

function Debts() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [isDebtTypeModalOpen, setIsDebtTypeModalOpen] = useState(false);
  const [debtToDelete, setDebtToDelete] = useState<{ id: string; name: string } | null>(null);

  const { data: allDebts, isLoading: allLoading } = useDebts(currentPage, pageSize);
  const { data: lendingDebts, isLoading: lendingLoading } = useLendingDebts(currentPage, pageSize);
  const { data: borrowingDebts, isLoading: borrowingLoading } = useBorrowingDebts(currentPage, pageSize);
  const { data: summary } = useDebtSummary();
  const deleteDebt = useDeleteDebt();
  const { formatCurrency } = useFormatters();

  const getCurrentData = () => {
    switch (activeTab) {
      case 1:
        return { data: lendingDebts, isLoading: lendingLoading };
      case 2:
        return { data: borrowingDebts, isLoading: borrowingLoading };
      default:
        return { data: allDebts, isLoading: allLoading };
    }
  };

  const { data: currentData, isLoading } = getCurrentData();
  const debts = currentData?.content || [];
  const totalPages = currentData?.totalPages || 0;
  const totalElements = currentData?.totalElements || 0;

  const handleDeleteDebt = async () => {
    if (debtToDelete) {
      try {
        await deleteDebt.mutateAsync(debtToDelete.id);
        setDebtToDelete(null);
      } catch (error) {
        console.error('Failed to delete debt:', error);
      }
    }
  };

  const handleDebtTypeSelect = (type: '1' | '2') => {
    navigate('/debts/add', { state: { debtType: type } });
  };

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString();

  const getDebtTypeColor = (type: string) => {
    switch (type) {
      case '1': return 'bg-green-100 text-green-700';
      case '2': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getDebtTypeIcon = (type: string) => {
    switch (type) {
      case '1': return <TrendingUp className="w-5 h-5" />;
      case '2': return <TrendingDown className="w-5 h-5" />;
      default: return <HandCoins className="w-5 h-5" />;
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {[1, 2].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 lg:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Debts</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Track money you've lent and borrowed</p>
        </div>
        <button
          onClick={() => setIsDebtTypeModalOpen(true)}
          className="mt-3 sm:mt-0 inline-flex items-center px-3 sm:px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-xs sm:text-sm"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
          Add Debt
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Payable</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(summary?.totalPayable ?? 0)}</p>
            </div>
            <div className="bg-red-100 rounded-full p-3">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-1">Money you owe to others</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Receivable</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(summary?.totalReceivable ?? 0)}</p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-1">Money others owe to you</p>
        </div>
      </div>

      <div className="flex bg-gray-100 rounded-lg p-1 mb-6 sm:mb-8">
        {tabs.map((tab, index) => {
          const active = activeTab === index;
          return (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(index);
                setCurrentPage(0);
              }}
              className={`flex-1 text-xs sm:text-sm font-medium rounded-lg py-2 transition-all duration-200 ${active ? "bg-white shadow text-black" : "text-gray-500 hover:text-black"
                }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {tabs[activeTab]} Debts ({totalElements})
          </h2>
        </div>

        {debts.length === 0 ? (
          <div className="p-8 text-center">
            <HandCoins className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
              No {tabs[activeTab].toLowerCase()} debts yet
            </h3>
            <p className="text-sm sm:text-base text-gray-500 mb-4">
              Start tracking your debts by adding your first entry
            </p>
            <button
              onClick={() => setIsDebtTypeModalOpen(true)}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Debt
            </button>
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-200">
              {debts.map((debt) => (
                <div key={debt.id} className="p-4 sm:p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex items-start space-x-4 flex-1 min-w-0">
                    <div className={`p-3 rounded-lg ${getDebtTypeColor(debt.type)}`}>
                      {getDebtTypeIcon(debt.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <p className="font-medium text-gray-900 truncate">
                          {debt.personName}
                        </p>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDebtTypeColor(debt.type)}`}>
                          {DEBT_TYPES[debt.type]}
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          Due: {formatDate(debt.dueDate)}
                        </div>
                        {debt.additionalDetail && (
                          <span className="hidden sm:inline truncate">• {debt.additionalDetail}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-end lg:items-center justify-between sm:justify-end sm:space-x-4">
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(debt.remainingAmount || 0)}
                      </p>
                      <p className="text-sm text-gray-500">
                        of {formatCurrency(debt.totalAmount || 0)}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/debts/${debt.id}/records`}
                        className="p-2 text-gray-400 hover:text-indigo-600 transition-colors rounded-md hover:bg-gray-50"
                        title="View Records"
                      >
                        <User className="w-5 h-5" />
                      </Link>
                      <Link
                        to={`/debts/edit/${debt.id}`}
                        className="p-2 text-gray-400 hover:text-indigo-600 transition-colors rounded-md hover:bg-gray-50"
                      >
                        <Edit className="w-5 h-5" />
                      </Link>
                      <button
                        onClick={() => setDebtToDelete({ id: debt.id, name: debt.personName })}
                        disabled={deleteDebt.isPending}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50 rounded-md hover:bg-gray-50"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="p-4 sm:p-6 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-gray-700">
                    Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements} debts
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                      disabled={currentPage === 0}
                      className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    <span className="px-3 py-2 text-sm font-medium">
                      Page {currentPage + 1} of {totalPages}
                    </span>

                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                      disabled={currentPage >= totalPages - 1}
                      className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <DebtTypeModal
        isOpen={isDebtTypeModalOpen}
        onClose={() => setIsDebtTypeModalOpen(false)}
        onSelect={handleDebtTypeSelect}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!debtToDelete}
        onClose={() => setDebtToDelete(null)}
        onConfirm={handleDeleteDebt}
        title="Delete Debt"
        message={`Are you sure you want to delete debt with "${debtToDelete?.name}"? This action cannot be undone and will also delete all associated records.`}
        confirmText="Delete Debt"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
        isPending={deleteDebt.isPending}
      />
    </div>
  );
}

export default Debts;
