import { useState } from 'react';
import { X, Hash } from 'lucide-react';
import { DECIMAL_FORMATS } from '../types/settings';

interface DecimalFormatModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentFormat: number;
  onUpdate: (formatCode: number) => Promise<void>;
}

export default function DecimalFormatModal({ 
  isOpen, 
  onClose, 
  currentFormat,
  onUpdate 
}: DecimalFormatModalProps) {
  const [selectedFormat, setSelectedFormat] = useState(currentFormat);
  const [isUpdating, setIsUpdating] = useState(false);

  const getExample = (code: number) => {
    switch (code) {
      case 1: return '100';
      case 2: return '100';
      case 3: return '100.0';
      case 4: return '100.00';
      default: return '100';
    }
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      await onUpdate(selectedFormat);
      onClose();
    } catch (error) {
      console.error('Failed to update decimal format:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Hash className="w-6 h-6 mr-2 text-indigo-600" />
            Decimal Format
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-600 mb-6">Choose how decimal numbers should be displayed:</p>
          
          <div className="space-y-3">
            {Object.entries(DECIMAL_FORMATS).map(([code, label]) => (
              <button
                key={code}
                onClick={() => setSelectedFormat(Number(code))}
                className={`w-full p-4 text-left border-2 rounded-lg transition-all ${
                  selectedFormat === Number(code)
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">{label}</span>
                  {selectedFormat === Number(code) && (
                    <div className="w-4 h-4 bg-indigo-600 rounded-full"></div>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Example: {getExample(Number(code))}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 border-t">
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              disabled={isUpdating || selectedFormat === currentFormat}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdating ? 'Updating...' : 'Update'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}