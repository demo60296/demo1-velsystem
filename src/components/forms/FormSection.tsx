interface FormSectionProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

function FormSection({ title, subtitle, children, className = '' }: FormSectionProps) {
  return (
    <div className={`bg-white rounded-lg shadow p-4 sm:p-6 ${className}`}>
      {(title || subtitle) && (
        <div className="mb-3 sm:mb-4">
          {title && (
            <h3 className="text-base sm:text-lg font-medium text-gray-900">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

export default FormSection;
