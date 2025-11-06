import { UseFormRegisterReturn } from 'react-hook-form';

interface FormInputProps {
  label: string;
  id: string;
  type?: 'text' | 'number' | 'date' | 'time' | 'email' | 'password';
  placeholder?: string;
  error?: string;
  register?: UseFormRegisterReturn;
  min?: string;
  step?: string;
  required?: boolean;
  className?: string;
}

function FormInput({
  label,
  id,
  type = 'text',
  placeholder,
  error,
  register,
  min,
  step,
  required = false,
  className = ''
}: FormInputProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        {...register}
        type={type}
        id={id}
        placeholder={placeholder}
        min={min}
        step={step}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
      />
      {error && (
        <p className="mt-1 text-xs sm:text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

export default FormInput;
