import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Edit } from 'lucide-react';
import { useForm } from 'react-hook-form';
import {
  useCreateMonthlyBudget,
  useCreateYearlyBudget,
  useUpdateMonthlyBudget,
  useUpdateYearlyBudget,
  useBudgetAnalysis
} from '../../hooks/useBudgets';
import { useCategoriesByType } from '../../hooks/useCategories';
import { CreateMonthlyBudgetData, CreateYearlyBudgetData, CategoryLimit } from '../../types/budget';
import CategorySelectModal from '../../components/CategorySelectModal';
import CategoryIcon from '../../components/CategoryIcon';
import { formatCurrency } from '../../utils/formatters';
import MonthYearPicker from '../../components/MonthYearPicker';
import YearPicker from '../../components/YearPicker';

const tabs = ['Monthly', 'Yearly'];

interface FormData {
  type: 'monthly' | 'yearly';
  year: number;
  month?: number;
  totalLimit: number;
  selectedCategories: string[];
  categoryLimits: { [categoryId: string]: number };
}

export default function BudgetForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEditing = Boolean(id);
  const budgetType = searchParams.get('type') as 'monthly' | 'yearly' || 'monthly';
  const [activeTab, setActiveTab] = useState(budgetType === 'monthly' ? 0 : 1);
  const [step, setStep] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [selectAll, setSelectAll] = useState(false);

  const { data: categories = [] } = useCategoriesByType(1); // Expense categories
  const { data: budgetData } = useBudgetAnalysis(id || '', budgetType);
  const createMonthlyBudget = useCreateMonthlyBudget();
  const createYearlyBudget = useCreateYearlyBudget();
  const updateMonthlyBudget = useUpdateMonthlyBudget();
  const updateYearlyBudget = useUpdateYearlyBudget();

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      type: budgetType,
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      totalLimit: 0,
      selectedCategories: [],
      categoryLimits: {}
    }
  });

  const watchedValues = watch();
  const remainingBudget = watchedValues.totalLimit - Object.values(watchedValues.categoryLimits || {}).reduce((sum, limit) => sum + (limit || 0), 0);

  useEffect(() => {
    if (isEditing && budgetData) {
      setValue('year', budgetData.year);
      if (budgetData.month) setValue('month', budgetData.month);
      setValue('totalLimit', budgetData.budget);

      const categoryIds = budgetData.categories.map(cat => cat.categoryId);
      setSelectedCategories(categoryIds);
      setValue('selectedCategories', categoryIds);

      const limits: { [key: string]: number } = {};
      budgetData.categories.forEach(cat => {
        limits[cat.categoryId] = cat.limit;
      });
      setValue('categoryLimits', limits);
    }
  }, [isEditing, budgetData, setValue]);

  useEffect(() => {
    const newType = activeTab === 0 ? 'monthly' : 'yearly';
    setValue('type', newType);
  }, [activeTab, setValue]);

  const handleCategorySelection = (categoryIds: string[]) => {
    setSelectedCategories(categoryIds);
    setValue('selectedCategories', categoryIds);

    const currentLimits = watchedValues.categoryLimits || {};
    const newLimits: { [key: string]: number } = {};
    categoryIds.forEach(id => {
      newLimits[id] = currentLimits[id] || 0;
    });
    setValue('categoryLimits', newLimits);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      handleCategorySelection([]);
    } else {
      handleCategorySelection(categories.map(cat => cat.id));
    }
    setSelectAll(!selectAll);
  };

  const onSubmit = async (data: FormData) => {
    try {
      const categoryLimits: CategoryLimit[] = selectedCategories.map(categoryId => ({
        categoryId,
        categoryLimit: data.categoryLimits[categoryId] || 0
      }));

      if (data.type === 'monthly') {
        const budgetData: CreateMonthlyBudgetData = {
          year: data.year,
          month: data.month!,
          totalLimit: data.totalLimit,
          categoryLimits
        };

        if (isEditing && id) {
          await updateMonthlyBudget.mutateAsync({ id, data: budgetData });
        } else {
          await createMonthlyBudget.mutateAsync(budgetData);
        }
      } else {
        const budgetData: CreateYearlyBudgetData = {
          year: data.year,
          totalLimit: data.totalLimit,
          categoryLimits
        };

        if (isEditing && id) {
          await updateYearlyBudget.mutateAsync({ id, data: budgetData });
        } else {
          await createYearlyBudget.mutateAsync(budgetData);
        }
      }
    } catch (error) {
      console.error('Failed to save budget:', error);
    }
  };

  const handleNext = () => setStep(2);
  const handleBack = () => step === 1 ? navigate('/budgets') : setStep(1);
  const isPending = createMonthlyBudget.isPending || createYearlyBudget.isPending ||
    updateMonthlyBudget.isPending || updateYearlyBudget.isPending;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <button
          onClick={handleBack}
          className="flex items-center text-gray-600 hover:text-gray-900 text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          {step === 1 ? 'Back to Budgets' : 'Back to Budget Details'}
        </button>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          {isEditing ? 'Edit Budget' : step === 1 ? 'Create Budget' : 'Set Category Limits'}
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          {isEditing
            ? 'Update budget details'
            : step === 1
              ? 'Set up your budget parameters'
              : 'Optionally set limits for individual categories'}
        </p>
      </div>

      {/* Progress Indicator */}
      {!isEditing && (
        <div className="space-y-2">
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}`}>1</div>
            <div className={`flex-1 h-1 mx-4 ${step >= 2 ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}`}>2</div>
          </div>
          <div className="flex justify-between text-xs sm:text-sm text-gray-600">
            <span>Budget Details</span>
            <span>Category Limits</span>
          </div>
        </div>
      )}

      <form className="space-y-6">
        {/* Step 1: Budget Details */}
        {(step === 1 || isEditing) && (
          <>
            {!isEditing && (
              <div className="bg-white rounded-xl shadow p-4 sm:p-6 space-y-3">
                <label className="block text-sm sm:text-base font-medium text-gray-700">Budget Type</label>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  {tabs.map((tab, i) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(i)}
                      className={`flex-1 py-2 rounded-lg text-sm sm:text-base font-medium transition-all duration-200 ${activeTab === i ? 'bg-white shadow text-black' : 'text-gray-500 hover:text-black'}`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl shadow p-4 sm:p-6 space-y-3">
              {activeTab === 0 ? (
                <MonthYearPicker
                  month={watchedValues.month || new Date().getMonth() + 1}
                  year={watchedValues.year}
                  onMonthChange={month => setValue('month', month)}
                  onYearChange={year => setValue('year', year)}
                  label="Budget Period"
                  required
                />
              ) : (
                <YearPicker
                  year={watchedValues.year}
                  onYearChange={year => setValue('year', year)}
                  label="Budget Year"
                  required
                />
              )}
              {(errors.month || errors.year) && <p className="text-red-600 text-xs">{errors.month?.message || errors.year?.message}</p>}
            </div>

            <div className="bg-white rounded-xl shadow p-4 sm:p-6 space-y-2">
              <label className="block text-sm sm:text-base font-medium text-gray-700">Total Budget Limit</label>
              <input
                {...register('totalLimit', {
                  required: 'Budget limit is required',
                  min: { value: 1, message: 'Budget must be greater than 0' }
                })}
                type="number"
                step="0.01"
                placeholder="0.00"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
              />
              {errors.totalLimit && <p className="text-red-600 text-xs">{errors.totalLimit.message}</p>}
            </div>

            <div className="bg-white rounded-xl shadow p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <label className="text-sm sm:text-base font-medium text-gray-700">Included Categories</label>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    {selectedCategories.length === categories.length ? 'All categories' : `${selectedCategories.length} categories included`}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(true)}
                  className="text-indigo-600 hover:text-indigo-700 text-xs sm:text-sm flex items-center"
                >
                  <Edit className="w-4 h-4 sm:w-5 sm:h-5 mr-1" /> Change
                </button>
              </div>

              {selectedCategories.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                  {selectedCategories.map(id => {
                    const cat = categories.find(c => c.id === id);
                    if (!cat) return null;
                    return (
                      <div key={id} className="flex items-center space-x-2 bg-gray-50 p-2 rounded-lg">
                        <CategoryIcon icon={cat.icon} color={cat.color} size="sm" />
                        <span className="text-xs sm:text-sm font-medium text-gray-900 truncate">{cat.name}</span>
                      </div>
                    );
                  })}
                </div>
              ) : <div className="text-center text-gray-500 py-3 text-sm">No categories selected</div>}
            </div>
          </>
        )}

        {/* Step 2: Category Limits */}
        {(step === 2 || isEditing) && (
          <div className="bg-white rounded-xl shadow p-4 sm:p-6 space-y-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Total Budget:</span>
              <span>{formatCurrency(watchedValues.totalLimit)}</span>
            </div>
            <div className="flex justify-between text-sm font-medium">
              <span>Remaining:</span>
              <span className={remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'}>
                {formatCurrency(remainingBudget)}
              </span>
            </div>

            {selectedCategories.length > 0 ? (
              <div className="space-y-3">
                {selectedCategories.map(id => {
                  const cat = categories.find(c => c.id === id);
                  if (!cat) return null;
                  return (
                    <div key={id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                      <CategoryIcon icon={cat.icon} color={cat.color} />
                      <p className="flex-1 text-sm font-medium text-gray-900">{cat.name}</p>
                      <input
                        {...register(`categoryLimits.${id}`, { min: { value: 0, message: 'Limit cannot be negative' } })}
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className="w-24 px-2 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  );
                })}
              </div>
            ) : <div className="text-center py-6 text-gray-500 text-sm">No categories selected for budget limits</div>}
          </div>
        )}

        {/* Error Messages */}
        {(createMonthlyBudget.error || createYearlyBudget.error || updateMonthlyBudget.error || updateYearlyBudget.error) && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm">
            Failed to save budget. Please try again.
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={step === 1 && !isEditing ? handleNext : handleSubmit(onSubmit)}
            disabled={isPending || (step === 1 && (!watchedValues.totalLimit || watchedValues.totalLimit <= 0))}
            className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base font-medium transition-colors"
          >
            {isPending ? 'Saving...' : step === 1 ? 'Next: Set Category Limits' : isEditing ? 'Update Budget' : 'Create Budget'}
          </button>
          <button
            type="button"
            onClick={handleBack}
            className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base font-medium"
          >
            {step === 1 || isEditing ? 'Cancel' : 'Back'}
          </button>
        </div>
      </form>

      {/* Category Selection Modal */}
      <CategorySelectModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        categories={categories}
        onSelect={() => {}}
        title="Select Categories for Budget"
        multiSelect
        selectedCategories={selectedCategories}
        onMultiSelect={handleCategorySelection}
        showSelectAll
        onSelectAll={handleSelectAll}
        selectAll={selectAll}
      />
    </div>
  );
}