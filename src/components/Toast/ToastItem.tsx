import { useState, useEffect } from 'react';
import { X, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { Toast } from '../../types/toast';

interface ToastItemProps {
  toast: Toast;
}

export default function ToastItem({ toast }: ToastItemProps) {
  const { removeToast } = useToast();
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleRemove = () => {
    setIsLeaving(true);
    setTimeout(() => removeToast(toast.id), 300);
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
      default:
        return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  const getBackgroundColor = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getTextColor = () => {
    switch (toast.type) {
      case 'success':
        return 'text-green-800';
      case 'error':
        return 'text-red-800';
      case 'warning':
        return 'text-yellow-800';
      case 'info':
        return 'text-blue-800';
      default:
        return 'text-gray-800';
    }
  };

  return (
    <div
      className={`
      transform transition-all duration-300 ease-in-out
      ${isVisible && !isLeaving
          ? 'translate-x-0 opacity-100'
          : 'translate-x-full opacity-0'
        }
      ${getBackgroundColor()}
      border rounded-lg shadow-lg
      p-1 sm:p-1 md:p-2
      w-full
    `}
    >
      <div className="flex items-start space-x-2 sm:space-x-2">
        <div className="flex-shrink-0 pt-3">{getIcon()}</div>

        <div className="flex-1 min-w-0">
          <h4 className={`text-sm sm:text-base font-medium ${getTextColor()}`}>
            {toast.title}
          </h4>

          {toast.message && (
            <p className={`text-sm sm:text-base mt-1 ${getTextColor()} opacity-90`}>
              {toast.message}
            </p>
          )}

          {toast.action && (
            <button
              onClick={toast.action.onClick}
              className={`text-sm sm:text-base font-medium mt-2 hover:underline ${getTextColor()}`}
            >
              {toast.action.label}
            </button>
          )}
        </div>

        <button
          onClick={handleRemove}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>
      </div>
    </div>
  );
}