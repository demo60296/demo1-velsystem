import { X, AlertTriangle } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
  confirmButtonClass?: string;
  isPending?: boolean;
}

export default function ConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm,
  title,
  message,
  confirmText,
  confirmButtonClass = "bg-red-600 hover:bg-red-700",
  isPending = false
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-3 md:p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-xs sm:max-w-sm md:max-w-md">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b">
          <h2 className="text-lg sm:text-xl font-semibold text-red-900 flex items-center">
            <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-red-600" />
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <div className="p-4 sm:p-6">
          <p className="text-xs sm:text-sm md:text-base text-gray-700 leading-relaxed">{message}</p>
        </div>

        <div className="p-4 sm:p-6 border-t">
          <div className="flex gap-2 sm:gap-3">
            <button
              onClick={onClose}
              disabled={isPending}
              className="flex-1 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-xs sm:text-sm md:text-base font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isPending}
              className={`flex-1 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-white rounded-md transition-colors text-xs sm:text-sm md:text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed ${confirmButtonClass}`}
            >
              {isPending ? 'Processing...' : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}