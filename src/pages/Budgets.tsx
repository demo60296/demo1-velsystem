import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Target, ChevronRight } from 'lucide-react';
import { useBudgetSummary } from '../hooks/useBudgets';
import { Budget } from '../types/budget';
import { MONTHS } from '../types/budget';
import { useFormatters } from '../hooks/useFormatters';

const tabs = ['Monthly', 'Yearly'];

function Budgets() {
  const [activeTab, setActiveTab] = useState(0);
  const { data: summary, isLoading } = useBudgetSummary();
  const { formatCurrency } = useFormatters();

  const getProgressPercentage = (spent: number, budget: number) => {
    return budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 75) return 'text-yellow-600';
    return 'text-green-600';
  };

  const CircularProgress = ({ percentage, size = 120 }: { percentage: number; size?: number }) => {
    const radius = (size - 8) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-gray-200"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className={getProgressColor(percentage)}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-2xl font-bold ${getProgressColor(percentage)}`}>
            {Math.round(percentage)}%
          </span>
        </div>
      </div>
    );
  };

  const LinearProgress = ({ percentage }: { percentage: number }) => {
    return (
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${percentage >= 90 ? 'bg-red-500' :
            percentage >= 75 ? 'bg-yellow-500' : 'bg-green-500'
            }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    );
  };

  const BudgetCard = ({ budget, isActive = false }: { budget: Budget; isActive?: boolean }) => {
    const percentage = getProgressPercentage(budget.totalSpent, budget.budget);

    return (
      <Link
        to={`/budgets/analysis/${budget.id}?type=${activeTab === 0 ? 'monthly' : 'yearly'}`}
        className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6"
      >
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-100 p-2 rounded-lg">
              <Target className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {activeTab === 0
                  ? `${MONTHS[budget.month! - 1]} ${budget.year}`
                  : budget.year
                }
              </h3>
              <p className="text-sm text-gray-500 capitalize">{budget.status} Budget</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {isActive && (
              <div className="ml-4 text-right">
                <Link
                  to={`/budgets/edit/${budget.id}?type=${budget.type}`}
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center text-indigo-600 hover:text-indigo-700 text-sm"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Link>
              </div>
            )}
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </div>

        <div className="flex items-center justify-center mb-4">
          {isActive ? (
            <CircularProgress percentage={percentage} size={80} />
          ) : (
            <div className="flex-1">
              <LinearProgress percentage={percentage} />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Budget:</span>
            <span className="font-medium">{formatCurrency(budget.budget)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Total Spent:</span>
            <span className="font-medium">{formatCurrency(budget.totalSpent)}</span>
          </div>
          {isActive && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Available Balance:</span>
              <span className={`font-medium ${(budget.budget - budget.totalSpent) >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                {formatCurrency((budget.budget - budget.totalSpent))}
              </span>
            </div>
          )}
        </div>
      </Link>
    );
  };

  const EmptyState = ({ type, status }: { type: string; status: string }) => (
    <div className="text-center py-8">
      <Target className="w-12 h-12 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        No {status} {type.toLowerCase()} budgets
      </h3>
      <p className="text-gray-500 mb-4">
        {status === 'active'
          ? `Create your first ${type.toLowerCase()} budget to start tracking your expenses`
          : `You don't have any ${status} ${type.toLowerCase()} budgets yet`
        }
      </p>
      {(status === 'active' || status === 'upcoming') && (
        <Link
          to="/budgets/add"
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Budget
        </Link>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="h-12 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const currentData = activeTab === 0 ? summary?.monthly : summary?.yearly;
  const budgetType = activeTab === 0 ? 'Monthly' : 'Yearly';

  return (
    <div className="p-3 sm:p-4 lg:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Budgets</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Track and manage your spending limits</p>
        </div>
        <Link
          to="/budgets/add"
          className="mt-3 sm:mt-0 inline-flex items-center px-3 sm:px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-xs sm:text-sm"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
          Add Budget
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-100 rounded-lg p-1 mb-6 sm:mb-8">
        {tabs.map((tab, index) => {
          const active = activeTab === index;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(index)}
              className={`flex-1 text-xs sm:text-sm font-medium rounded-lg py-2 transition-all duration-200 ${active
                ? "bg-white shadow text-black"
                : "text-gray-500 hover:text-black"
                }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Active Budget */}
      {currentData?.active[0] ? (
        <div className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Active {budgetType} Budget</h2>
          <BudgetCard budget={currentData.active[0]} isActive={true} />
        </div>
      ) : (
        <div className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Active {budgetType} Budget</h2>
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <EmptyState type={budgetType} status="active" />
          </div>
        </div>
      )}

      {/* Upcoming Budgets */}
      {currentData?.upcoming && currentData?.upcoming?.length > 0 ? (
        <div className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
            Upcoming {budgetType} Budgets
          </h2>
          <div className="grid gap-4">
            {currentData.upcoming.map((budget) => (
              <div key={budget.id}>
                <BudgetCard budget={budget} />
              </div>
            ))}
          </div>
        </div>
      ) : (currentData?.active && currentData?.active?.length > 0 && (
        <div className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
            Upcoming {budgetType} Budgets
          </h2>
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 sm:p-6">
              <EmptyState type={budgetType} status="upcoming" />
            </div>
          </div>
        </div>
      ))}


      {/* Past Budgets */}
      {currentData?.past && currentData.past.length > 0 && (
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Past {budgetType} Budgets</h2>
          <div className="grid gap-4">
            {currentData.past.map((budget) => (
              <div key={budget.id}>
                <BudgetCard budget={budget} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Budgets;