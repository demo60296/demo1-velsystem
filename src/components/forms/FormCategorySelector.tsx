import { Edit } from 'lucide-react';
import CategoryIcon from '../CategoryIcon';
import { Category } from '../../features/categories/types/category';

interface FormCategorySelectorProps {
  selectedCategory?: Category;
  onChangeClick: () => void;
  error?: string;
}

function FormCategorySelector({ selectedCategory, onChangeClick, error }: FormCategorySelectorProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <label className="block text-sm sm:text-base font-medium text-gray-700">
          Category
        </label>
        <button
          type="button"
          onClick={onChangeClick}
          className="text-indigo-600 hover:text-indigo-700 text-xs sm:text-sm flex items-center"
        >
          <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
          Change
        </button>
      </div>

      {selectedCategory ? (
        <div className="flex items-center space-x-2 sm:space-x-3 p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          <CategoryIcon icon={selectedCategory.icon} color={selectedCategory.color} size="sm" />
          <div>
            <p className="text-sm sm:text-base font-medium text-gray-900">{selectedCategory.name}</p>
            <p className="text-xs sm:text-sm text-gray-500">
              {selectedCategory.type === 1 ? 'Expense' : 'Income'} Category
            </p>
          </div>
        </div>
      ) : (
        <div className="p-3 sm:p-4 bg-gray-50 rounded-lg text-xs sm:text-sm text-gray-500">
          No category selected
        </div>
      )}

      {error && (
        <p className="mt-1 text-xs sm:text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

export default FormCategorySelector;
