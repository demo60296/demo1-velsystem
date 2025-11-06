interface FormProgressIndicatorProps {
  steps: string[];
  currentStep: number;
}

function FormProgressIndicator({ steps, currentStep }: FormProgressIndicatorProps) {
  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex items-center">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center flex-1">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full ${
                currentStep >= index + 1
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {index + 1}
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-1 mx-4 ${
                  currentStep > index + 1 ? 'bg-indigo-600' : 'bg-gray-200'
                }`}
              ></div>
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-2">
        {steps.map((step) => (
          <span key={step} className="text-xs sm:text-sm text-gray-600">
            {step}
          </span>
        ))}
      </div>
    </div>
  );
}

export default FormProgressIndicator;
