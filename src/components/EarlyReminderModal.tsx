import { useState } from 'react';
import { X, Bell } from 'lucide-react';
import { EARLY_REMINDER_OPTIONS } from '../types/scheduledTransaction';

interface EarlyReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentReminder: number;
  onUpdate: (reminder: number) => void;
}

export default function EarlyReminderModal({ 
  isOpen, 
  onClose, 
  currentReminder,
  onUpdate 
}: EarlyReminderModalProps) {
  const [selectedReminder, setSelectedReminder] = useState(currentReminder);

  const handleUpdate = () => {
    onUpdate(selectedReminder);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-3 md:p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-xs sm:max-w-sm md:max-w-md max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center">
            <Bell className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-indigo-600" />
            Early Reminder
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Get reminded before the transaction is due:</p>
          
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {EARLY_REMINDER_OPTIONS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setSelectedReminder(value)}
                className={`w-full p-3 text-left border-2 rounded-lg transition-all ${
                  selectedReminder === value
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm sm:text-base font-medium text-gray-900">{label}</span>
                  {selectedReminder === value && (
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