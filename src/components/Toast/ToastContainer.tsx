import { useToast } from '../../contexts/ToastContext';
import ToastItem from './ToastItem';

export default function ToastContainer() {
  const { toasts } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      className="
        fixed top-2 right-2
        sm:top-3 sm:right-3
        md:top-4 md:right-4
        lg:top-5 lg:right-5
        z-50 space-y-2
        w-auto max-w-sm sm:max-w-md md:max-w-lg
      "
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}