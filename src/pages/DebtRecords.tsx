import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, ChevronLeft, ChevronRight, TrendingUp, TrendingDown, DollarSign, Building2, Wallet, CreditCard, Banknote, Smartphone, FileText, Globe } from 'lucide-react';
import { 
  useDebt, 
  useDebtRecords, 
  usePaidRecords, 
  useReceivedRecords, 
  useAdjustmentRecords,
  useDebtRecordSummary,
  useDeleteDebtRecord 
} from '../hooks/useDebts';
import { DEBT_RECORD_TYPES } from '../types/debt';
import DebtRecordTypeModal from '../components/DebtRecordTypeModal';
import { useFormatters } from '../hooks/useFormatters';
import ConfirmationModal from '../components/ConfirmationModal';

const tabs = ['All', 'Paid', 'Received'];

function DebtRecords() {
  const { debtId } = useParams<{ debtId: string }>();
  const [activeTab, setActiveTab] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [isRecordTypeModalOpen, setIsRecordTypeModalOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<{ id: string; description: string } | null>(null);

  const { data: debt } = useDebt(debtId || '');
  const { data: allRecords, isLoading: allLoading } = useDebtRecords(debtId || '', currentPage, pageSize);
  const { data: paidRecords, isLoading: paidLoading } = usePaidRecords(debtId || '', currentPage, pageSize);
  const { data: receivedRecords, isLoading: receivedLoading } = useReceivedRecords(debtId || '', currentPage, pageSize);
  const { data: summary } = useDebtRecordSummary(debtId || '');
  const deleteRecord = useDeleteDebtRecord();
  const { formatCurrency } = useFormatters();

  // Get current data based on active tab
  const getCurrentData = () => {
    switch (activeTab) {
      case 1:
        return { data: paidRecords, isLoading: paidLoading };
      case 2:
        return { data: receivedRecords, isLoading: receivedLoading };
      default:
        return { data: allRecords, isLoading: allLoading };
    }
  };

  const { data: currentData, isLoading } = getCurrentData();
  const records = currentData?.content || [];
  const totalPages = currentData?.totalPages || 0;
  const totalElements = currentData?.totalElements || 0;

  const handleDeleteRecord = async () => {
    if (recordToDelete) {
      try {
        await deleteRecord.mutateAsync(recordToDelete.id);
        setRecordToDelete(null);
      } catch (error) {
        console.error('Failed to delete record:', error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getRecordTypeColor = (type: string) => {
    switch (type) {
      case '1': // Paid
        return 'text-red-600';
      case '2': // Received
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const getRecordTypeIcon = (type: string) => {
    switch (type) {
      case '1': // Paid
        return <TrendingDown className="w-5 h-5 text-red-600" />;
      case '2': // Received
        return <TrendingUp className="w-5 h-5 text-green-600" />;
      default:
        return <DollarSign className="w-5 h-5 text-gray-600" />;
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
      case 1: // UPI
        return <Smartphone className="w-3 h-3 text-blue-600" />;
      case 2: // Debit Card
        return <CreditCard className="w-3 h-3 text-purple-600" />;
      case 3: // Cheque
        return <FileText className="w-3 h-3 text-gray-600" />;
      case 4: // Internet Banking
        return <Globe className="w-3 h-3 text-green-600" />;
      default:
        return <CreditCard className="w-3 h-3 text-gray-600" />;
    }
  };

  const getAccountTypeName = (type: number) => {
    switch (type) {
      case 1: return 'Bank Account';
      case 2: return 'Wallet';
      case 3: return 'Credit Card';
      case 4: return 'Cash';
      default: return 'Account';
    }
  };

  const getPaymentModeTypeName = (type: number) => {
    switch (type) {
      case 1: return 'UPI';
      case 2: return 'Debit Card';
      case 3: return 'Cheque';
      case 4: return 'Internet Banking';
      default: return 'Payment Mode';
    }
  };
  if (!debtId) {
    return (
      <div className="p-3 sm:p-4 lg:p-6 max-w-7xl mx-auto">
        <div className="text-center py-12">
          <p className="text-gray-500">Debt ID not found</p>
          <Link to="/debts" className="text-indigo-600 hover:text-indigo-700 mt-2 inline-block">
            Back to Debts
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-3 sm:p-4 lg:p-6 max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
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
    <div className="p-3 sm:p-4 lg:p-6 max-w-7xl mx-auto min-h-screen">
      <div className="mb-8">
        <Link
          to="/debts"
          className="flex items-center text-gray-600 hover:text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
          Back to Debts
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Records</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              {debt ? `Debt with ${debt.personName}` : 'Debt records'}
            </p>
          </div>
          <button
            onClick={() => setIsRecordTypeModalOpen(true)}
            className="mt-3 sm:mt-0 inline-flex items-center px-3 sm:px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm sm:text-base"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
            Add Record
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
        {debt?.type === '2' ? (
          // Borrowing - show Total Payable
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Payable</p>
                <p className="text-xl sm:text-2xl font-bold text-red-600">
                  {formatCurrency(debt?.remainingAmount || 0)}
                </p>
              </div>
              <div className="bg-red-100 rounded-full p-2 sm:p-3">
                <TrendingDown className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
              </div>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Amount you owe</p>
          </div>
        ) : (
          // Lending - show Total Receivable
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Receivable</p>
                <p className="text-xl sm:text-2xl font-bold text-green-600">
                  {formatCurrency(debt?.remainingAmount || 0)}
                </p>
              </div>
              <div className="bg-green-100 rounded-full p-2 sm:p-3">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
              </div>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Amount you will receive</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Total Received</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {formatCurrency(summary?.totalReceived || 0)}
              </p>
            </div>
            <div className="bg-blue-100 rounded-full p-2 sm:p-3">
              <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            </div>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Money received so far</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-100 rounded-lg p-1 mb-4 sm:mb-6">
        {tabs.map((tab, index) => {
          const active = activeTab === index;
          return (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(index);
                setCurrentPage(0);
              }}
              className={`flex-1 text-xs sm:text-sm font-medium rounded-lg py-2 transition-all duration-200 ${
                active
                  ? "bg-white shadow text-black"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Records List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">
            {tabs[activeTab]} Records ({totalElements})
          </h2>
        </div>

        {records.length === 0 ? (
          <div className="p-6 sm:p-8 text-center">
            <DollarSign className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
              No {tabs[activeTab].toLowerCase()} records yet
            </h3>
            <p className="text-sm sm:text-base text-gray-500 mb-3 sm:mb-4">
              Start tracking by adding your first record
            </p>
            <button
              onClick={() => setIsRecordTypeModalOpen(true)}
              className="inline-flex items-center px-3 sm:px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm sm:text-base"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              Add Record
            </button>
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-200">
              {records.map((record) => (
                <div key={record.id} className="p-3 sm:p-4 lg:p-6 flex items-center justify-between gap-2 sm:gap-3 lg:gap-4">
                  <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4 flex-1 min-w-0">
                    <div className="flex-shrink-0">
                      {getRecordTypeIcon(record.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-1 sm:space-x-2 mb-1">
                        <p className="text-sm sm:text-base font-medium text-gray-900 truncate">
                          {record.description}
                        </p>
                        <span className={`inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                          record.type === '1' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {DEBT_RECORD_TYPES[record.type]}
                        </span>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 lg:space-x-4 text-xs sm:text-sm text-gray-500">
                        <span>{formatDate(record.date)}</span>
                        {record.account && (
                          <span className="hidden sm:inline flex items-center">
                            • {getAccountIcon(record.account.type)} 
                            <span className="ml-1 truncate">{record.account.name}</span>
                          </span>
                        )}
                        {record.paymentMode && (
                          <span className="hidden md:inline flex items-center">
                            • {getPaymentModeIcon(record.paymentMode.type)} 
                            <span className="ml-1 truncate">{record.paymentMode.name}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
                    <div className="text-right">
                      <p className={`text-sm sm:text-base font-semibold ${getRecordTypeColor(record.type)}`}>
                        {record.type === '1' ? '-' : '+'}
                        {formatCurrency(record.amount)}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <Link
                        to={`/debts/${debtId}/records/edit/${record.id}`}
                        className="p-1.5 sm:p-2 text-gray-400 hover:text-indigo-600 transition-colors rounded-md hover:bg-gray-50"
                      >
                        <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                      </Link>
                      <button
                        onClick={() => setRecordToDelete({ id: record.id, description: record.description })}
                        disabled={deleteRecord.isPending}
                        className="p-1.5 sm:p-2 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50 rounded-md hover:bg-gray-50"
                      >
                        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="p-4 sm:p-6 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                  <div className="text-xs sm:text-sm text-gray-700 text-center sm:text-left">
                    Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements} records
                  </div>
                  
                  <div className="flex items-center justify-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                      disabled={currentPage === 0}
                      className="p-1.5 sm:p-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    
                    <span className="px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm font-medium">
                      Page {currentPage + 1} of {totalPages}
                    </span>
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                      disabled={currentPage >= totalPages - 1}
                      className="p-1.5 sm:p-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Record Type Selection Modal */}
      <DebtRecordTypeModal
        isOpen={isRecordTypeModalOpen}
        onClose={() => setIsRecordTypeModalOpen(false)}
        debtId={debtId}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!recordToDelete}
        onClose={() => setRecordToDelete(null)}
        onConfirm={handleDeleteRecord}
        title="Delete Record"
        message={`Are you sure you want to delete "${recordToDelete?.description}" record? This action cannot be undone.`}
        confirmText="Delete Record"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
        isPending={deleteRecord.isPending}
      />
    </div>
  );
}

export default DebtRecords;