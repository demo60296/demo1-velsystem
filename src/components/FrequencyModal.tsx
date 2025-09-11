import { useState } from 'react';
import { X, RefreshCw } from 'lucide-react';
import { FREQUENCY_OPTIONS, FrequencyType } from '../types/scheduledTransaction';

interface FrequencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentFrequency: FrequencyType;
  onUpdate: (frequency: FrequencyType) => void;
}

export default function FrequencyModal({ 
  isOpen, 
  onClose, 
  currentFrequency,
  onUpdate 
}: FrequencyModalProps) {
  const [selectedFrequency, setSelectedFrequency] = useState(currentFrequency);

  const handleUpdate = () => {
    onUpdate(selectedFrequency);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-3 md:p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-xs sm:max-w-sm md:max-w-md">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center">
            <RefreshCw className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-indigo-600" />
            Frequency
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <div className="p-4 sm:p-6">
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Choose how often this transaction should repeat:</p>
          
          <div className="space-y-2 sm:space-y-3">
            {Object.entries(FREQUENCY_OPTIONS).map(([value, label]) => (
              <button
                key={value}
                onClick={() => setSelectedFrequency(value as FrequencyType)}
                className={`w-full p-3 sm:p-4 text-left border-2 rounded-lg transition-all ${
                  selectedFrequency === value
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm sm:text-base font-medium text-gray-900">{label}</span>
                  {selectedFrequency === value && (
                    <div className="w-4 h-4 bg-indigo-600 rounded-full"></div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 sm:p-6 border-t">
          <div className="flex space-x-2 sm:space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-3 sm:px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm sm:text-base font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              className="flex-1 px-3 sm:px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm sm:text-base font-medium"
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}