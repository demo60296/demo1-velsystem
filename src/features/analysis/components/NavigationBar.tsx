import { ChevronLeft, ChevronRight } from 'lucide-react';

interface NavigationBarProps {
  displayText: string;
  onPrevious: () => void;
  onNext: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}

function NavigationBar({ displayText, onPrevious, onNext, disabled = false, isLoading = false }: NavigationBarProps) {
  return (
    <div className={`bg-white rounded-xl shadow p-2 mb-4 flex items-center justify-between ${isLoading ? 'opacity-50' : ''}`}>
      <button
        onClick={onPrevious}
        disabled={disabled}
        className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-5 h-5 text-gray-600" />
      </button>
      <div className="text-center">
        <h2 className="text-lg font-semibold text-gray-900">{displayText}</h2>
      </div>
      <button
        onClick={onNext}
        disabled={disabled}
        className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronRight className="w-5 h-5 text-gray-600" />
      </button>
    </div>
  );
}

export default NavigationBar;
