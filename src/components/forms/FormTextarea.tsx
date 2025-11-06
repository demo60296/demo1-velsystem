import { UseFormRegisterReturn } from 'react-hook-form';

interface FormTextareaProps {
  label: string;
  id: string;
  placeholder?: string;
  error?: string;
  register?: UseFormRegisterReturn;
  rows?: number;
  required?: boolean;
  className?: string;
}

function FormTextarea({
  label,
  id,
  placeholder,
  error,
  register,
  rows = 3,
  required = false,
  className = ''
}: FormTextareaProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea
        {...register}
        id={id}
        rows={rows}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
      />
      {error && (
        <p className="mt-1 text-xs sm:text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

export default FormTextarea;
