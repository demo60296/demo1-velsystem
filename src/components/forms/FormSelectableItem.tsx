import { Edit } from 'lucide-react';
import FormSection from './FormSection';

interface FormSelectableItemProps {
  label: string;
  onChangeClick: () => void;
  error?: string;
  children: React.ReactNode;
}

function FormSelectableItem({
  label,
  onChangeClick,
  error,
  children
}: FormSelectableItemProps) {
  return (
    <FormSection>
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <label className="block text-sm sm:text-base font-medium text-gray-700">
          {label}
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
      {children}
      {error && (
        <p className="mt-1 text-xs sm:text-sm text-red-600">{error}</p>
      )}
    </FormSection>
  );
}

export default FormSelectableItem;
