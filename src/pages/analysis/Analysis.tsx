import { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3
} from 'lucide-react';
import { useFormatters } from '../../hooks/useFormatters';
import { useAnalysisSummary, AnalysisParams } from '../../hooks/useAnalysis';
import DateRangeModal from '../../components/DateRangeModal';
import SkeletonBlock from '../../components/SkeletonBlock';
import SummaryCard from './components/SummaryCard';
import CategoryCard from './components/CategoryCard';
import AccountCard from './components/AccountCard';
import PieChartSection from './components/PieChartSection';
import NavigationBar from './components/NavigationBar'; // ⬅️ new

const tabs = ['Week', 'Month', 'Year', 'Custom'];

const getWeekDates = (date: Date) => {
  const startOfWeek = new Date(date);
  const day = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - day;
  startOfWeek.setDate(diff);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  return { start: startOfWeek, end: endOfWeek };
};

function Analysis() {
  const { formatCurrency } = useFormatters();
  const [activeTab, setActiveTab] = useState(1);
  const [isDateRangeModalOpen, setIsDateRangeModalOpen] = useState(false);

  const currentDate = new Date();
  const [currentWeek, setCurrentWeek] = useState(currentDate);
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  const [customParams, setCustomParams] = useState<Partial<AnalysisParams>>({});
  const [customDisplayText, setCustomDisplayText] = useState('Custom');

  const formatDisplayDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return date.toLocaleDateString();
  };

  const getAnalysisParams = (): AnalysisParams => {
    switch (activeTab) {
      case 0: {
        const { start, end } = getWeekDates(currentWeek);
        const format = (d: Date) => d.toISOString().split('T')[0];
        return { type: 1, from: format(start), to: format(end) };
      }
      case 1:
        return { type: 2, month: currentMonth, year: currentYear };
      case 2:
        return { type: 3, year: currentYear };
      case 3:
        return { type: customParams.type === 'all' ? 'all' : 4, ...customParams };
      default:
        return { type: 2, month: currentMonth, year: currentYear };
    }
  };

  const { data: analysisData, isLoading, isFetching } = useAnalysisSummary(getAnalysisParams());

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(newWeek.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeek(newWeek);
  };
  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (currentMonth === 1) {
        setCurrentMonth(12);
        setCurrentYear(currentYear - 1);
      } else setCurrentMonth(currentMonth - 1);
    } else {
      if (currentMonth === 12) {
        setCurrentMonth(1);
        setCurrentYear(currentYear + 1);
      } else setCurrentMonth(currentMonth + 1);
    }
  };
  const navigateYear = (direction: 'prev' | 'next') => {
    setCurrentYear(currentYear + (direction === 'next' ? 1 : -1));
  };

  const handleCustomDateRange = (params: Partial<AnalysisParams>) => {
    setActiveTab(3);
    setCustomParams(params);
    if (params.type === 'all') setCustomDisplayText('All Time');
    else if (params.type === 4 && params.from && params.to)
      setCustomDisplayText(`${formatDisplayDate(params.from)} - ${formatDisplayDate(params.to)}`);
    else setCustomDisplayText('Custom Range');
  };

  const getDisplayText = () => {
    switch (activeTab) {
      case 0: {
        const { start, end } = getWeekDates(currentWeek);
        return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
      }
      case 1: {
        const monthNames = [
          'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return `${monthNames[currentMonth - 1]} ${currentYear}`;
      }
      case 2:
        return currentYear.toString();
      case 3:
        return customDisplayText;
      default:
        return '';
    }
  };

  const getAccountIcon = (type: number) => {
    switch (type) {
      case 1: return '🏦';
      case 2: return '👛';
      case 3: return '💳';
      case 4: return '💵';
      default: return '🏦';
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

  const getCategoryColorHex = (colorName: string): string => {
    const colorMap: Record<string, string> = {
      indigo: '#6366F1', teal: '#14B8A6', yellow: '#F59E0B', orange: '#F97316', maroon: '#991B1B', pink: '#EC4899',
      lime: '#84CC16', violet: '#8B5CF6', rose: '#F43F5E', slate: '#64748B', sky: '#0EA5E9', purple: '#A855F7',
      stone: '#78716C', red: '#EF4444', green: '#22C55E', blue: '#3B82F6', amber: '#F59E0B', cyan: '#06B6D4',
      emerald: '#10B981', fuchsia: '#D946EF', gray: '#6B7280', zinc: '#71717A', brown: '#92400E', magenta: '#BE185D',
      bronze: '#A16207', peach: '#FED7AA', lavender: '#DDD6FE', mint: '#BBF7D0', olive: '#365314', navy: '#1E3A8A',
      gold: '#FBBF24', charcoal: '#374151', coral: '#FCA5A5', aqua: '#A7F3D0', plum: '#6B21A8', mustard: '#D97706',
      ruby: '#B91C1C', sapphire: '#1E3A8A', topaz: '#FDE047'
    };
    return colorMap[colorName] || '#6B7280';
  };

  const spendingChartData = analysisData?.spendingCategory?.map(item => ({
    name: item.category.name, value: item.amount, color: getCategoryColorHex(item.category.color),
  })) || [];
  const incomeChartData = analysisData?.incomeCategory?.map(item => ({
    name: item.category.name, value: item.amount, color: getCategoryColorHex(item.category.color),
  })) || [];

  const balance = (analysisData?.income || 0) - (analysisData?.spending || 0);
  const showMainLoading = isLoading && !analysisData;
  const showCustomLoading = activeTab === 3 && isFetching;

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Analysis</h1>
        <p className="text-sm text-gray-500">Detailed insights into your spending patterns</p>
      </div>

      {/* Tabs */}
      <div className="flex justify-evenly gap-2 bg-gray-100 rounded-full p-1 sm:w-fit mb-4">
        {tabs.map((tab, index) => {
          const active = activeTab === index;
          return (
            <button
              key={tab}
              onClick={() => {
                if (index === 3) setIsDateRangeModalOpen(true);
                else setActiveTab(index);
              }}
              className={`w-full px-4 py-2 rounded-full text-sm font-medium transition ${active ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-900'
                }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Date Navigation */}
      <NavigationBar
        displayText={getDisplayText()}
        onPrevious={() => {
          if (activeTab === 0) navigateWeek('prev');
          else if (activeTab === 1) navigateMonth('prev');
          else if (activeTab === 2) navigateYear('prev');
        }}
        onNext={() => {
          if (activeTab === 0) navigateWeek('next');
          else if (activeTab === 1) navigateMonth('next');
          else if (activeTab === 2) navigateYear('next');
        }}
        disabled={activeTab === 3}
        isLoading={showCustomLoading}
      />

      {/* Summary Cards */}
      {showMainLoading ? (
        <div className="grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((i) => <SkeletonBlock key={i} />)}
        </div>
      ) : (
        <div className={`grid gap-4 sm:grid-cols-3 transition-opacity ${showCustomLoading ? 'opacity-50' : ''}`}>
          <SummaryCard
            title="Total Spending"
            amount={`${(analysisData?.spending || 0) >= 0 ? '+' : ''}${formatCurrency(analysisData?.spending || 0)}`}
            icon={TrendingDown}
            variant="spending"
          />
          <SummaryCard
            title="Total Income"
            amount={`${(analysisData?.income || 0) >= 0 ? '+' : ''}${formatCurrency(analysisData?.income || 0)}`}
            icon={TrendingUp}
            variant="income"
          />
          <SummaryCard
            title="Balance"
            amount={`${balance >= 0 ? '+' : ''}${formatCurrency(Math.abs(balance))}`}
            icon={DollarSign}
            variant="balance"
            showPlus
          />
        </div>
      )}

      <div className={`mt-4 space-y-2 sm:space-y-4 transition-opacity ${showCustomLoading ? 'opacity-50' : ''}`}>

        {/* Spending Categories */}
        {showMainLoading || showCustomLoading ? (
          <div>
            <SkeletonBlock height="h-6 w-1/3 mb-4" />
            <SkeletonBlock height="h-64 mb-4" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => <SkeletonBlock key={i} height="h-24" />)}
            </div>
          </div>
        ) : spendingChartData.length > 0 && (
          <div
            className={`${isFetching && !showCustomLoading ? "relative" : ""}`}
          >
            {isFetching && !showCustomLoading && (
              <div className="absolute top-2 right-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
              </div>
            )}
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              Category-wise Spending
            </h3>


            <>
              {/* Chart */}
              <PieChartSection
                data={spendingChartData}
                total={formatCurrency(analysisData?.spending || 0)}
                variant="spending"
                formatCurrency={formatCurrency}
              />

              {/* Category List - now 3/3 layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {analysisData?.spendingCategory?.map((item, index) => {
                  const percentage =
                    ((item.amount / (analysisData?.spending || 1)) * 100).toFixed(1);
                  return (
                    <CategoryCard
                      key={index}
                      icon={item.category.icon}
                      color={item.category.color}
                      name={item.category.name}
                      amount={formatCurrency(item.amount)}
                      percentage={percentage}
                      variant="spending"
                    />
                  );
                })}
              </div>
            </>
          </div>
        )}

        {/* Income Categories */}
        {showMainLoading || showCustomLoading ? (
          <div>
            <SkeletonBlock height="h-6 w-1/3 mb-4" />
            <SkeletonBlock height="h-64 mb-4" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => <SkeletonBlock key={i} height="h-24" />)}
            </div>
          </div>
        ) : incomeChartData.length > 0 && (
          <div
            className={`${isFetching && !showCustomLoading ? "relative" : ""}`}
          >
            {isFetching && !showCustomLoading && (
              <div className="absolute top-2 right-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
              </div>
            )}
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              Category-wise Income
            </h3>
            <>
              {/* Chart */}
              <PieChartSection
                data={incomeChartData}
                total={formatCurrency(analysisData?.income || 0)}
                variant="income"
                formatCurrency={formatCurrency}
              />

              {/* Category List - now 3/3 layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {analysisData?.incomeCategory?.map((item, index) => {
                  const percentage =
                    ((item.amount / (analysisData?.income || 1)) * 100).toFixed(1);
                  return (
                    <CategoryCard
                      key={index}
                      icon={item.category.icon}
                      color={item.category.color}
                      name={item.category.name}
                      amount={formatCurrency(item.amount)}
                      percentage={percentage}
                      variant="income"
                    />
                  );
                })}
              </div>
            </>
          </div>
        )}

        {/* Payment Modes */}
        {showMainLoading || showCustomLoading ? (
          <div>
            <SkeletonBlock height="h-6 w-1/3 mb-4" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => <SkeletonBlock key={i} height="h-24" />)}
            </div>
          </div>
        ) : (
          ((analysisData?.spendingAccount?.length ?? 0) > 0 || (analysisData?.incomeAccount?.length ?? 0) > 0 || (analysisData?.transfersAccount?.length ?? 0) > 0) && (
            <div className={`${isFetching && !showCustomLoading ? "relative" : ""}`}>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-4">
                Payment Modes
              </h3>
              <div className="space-y-4">
                {/* Spending Accounts */}
                {((analysisData?.spendingAccount?.length ?? 0) > 0) && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                      Spending Accounts
                    </h4>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {analysisData?.spendingAccount.map((item, i) => (
                        <AccountCard
                          key={`sp-${i}`}
                          icon={getAccountIcon(item.accountResponseDto.type)}
                          name={item.accountResponseDto.name}
                          typeName={getAccountTypeName(item.accountResponseDto.type)}
                          amount={formatCurrency(item.amount)}
                          percentage={((item.amount / (analysisData?.spending || 1)) * 100).toFixed(1)}
                          variant="spending"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Income Accounts */}
                {((analysisData?.incomeAccount?.length ?? 0) > 0) && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                      Income Accounts
                    </h4>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {analysisData?.incomeAccount.map((item, i) => (
                        <AccountCard
                          key={`in-${i}`}
                          icon={getAccountIcon(item.accountResponseDto.type)}
                          name={item.accountResponseDto.name}
                          typeName={getAccountTypeName(item.accountResponseDto.type)}
                          amount={formatCurrency(item.amount)}
                          percentage={((item.amount / (analysisData?.income || 1)) * 100).toFixed(1)}
                          variant="income"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Transfer Accounts */}
                {((analysisData?.transfersAccount?.length ?? 0) > 0) && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                      Transfer Accounts
                    </h4>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {analysisData?.transfersAccount.map((item, i) => (
                        <AccountCard
                          key={`tr-${i}`}
                          icon={getAccountIcon(item.accountResponseDto.type)}
                          name={item.accountResponseDto.name}
                          typeName={getAccountTypeName(item.accountResponseDto.type)}
                          amount={formatCurrency(item.amount)}
                          variant="transfer"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        )}

        {/* Statistics */}
        {showMainLoading || showCustomLoading ? (
          <div>
            <SkeletonBlock height="h-6 w-1/3 mb-4" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => <SkeletonBlock key={i} height="h-24" />)}
            </div>
          </div>
        ) : (
          <div
            className={`${isFetching && !showCustomLoading ? "relative" : ""
              }`}
          >

            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
              Statistics
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Transactions */}
              <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-4 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-full bg-indigo-100">
                      <BarChart3 className="w-5 h-5 text-indigo-600" />
                    </div>
                    <h4 className="text-sm font-medium text-gray-700">Transactions</h4>
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  <span className="text-2xl font-bold text-gray-900">{analysisData?.numberOfTransactions || 0}</span> Total transactions
                </p>
              </div>

              {/* Average Spending */}
              <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-4 flex flex-col">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Average Spending
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-600">Per Day</span>
                    <span className="text-sm font-semibold text-red-600">
                      {formatCurrency(analysisData?.averageSpendingPerDay || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-600">Per Transaction</span>
                    <span className="text-sm font-semibold text-red-600">
                      {formatCurrency(analysisData?.averageSpendingPerTransaction || 0)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Average Income */}
              <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-4 flex flex-col">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Average Income
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-600">Per Day</span>
                    <span className="text-sm font-semibold text-green-600">
                      {formatCurrency(analysisData?.averageIncomePerDay || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-600">Per Transaction</span>
                    <span className="text-sm font-semibold text-green-600">
                      {formatCurrency(analysisData?.averageIncomePerTransaction || 0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      <DateRangeModal
        isOpen={isDateRangeModalOpen}
        onClose={() => setIsDateRangeModalOpen(false)}
        onApply={handleCustomDateRange}
      />
    </div>
  );
}

export default Analysis;