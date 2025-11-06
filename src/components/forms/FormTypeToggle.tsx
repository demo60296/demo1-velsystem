interface FormTypeToggleProps {
  tabs: string[];
  activeTab: number;
  onTabChange: (index: number) => void;
  label?: string;
  disabled?: boolean;
}

function FormTypeToggle({ tabs, activeTab, onTabChange, label = "Type", disabled = false }: FormTypeToggleProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
      <label className="block text-sm sm:text-base font-medium text-gray-700 mb-3 sm:mb-4">
        {label}
      </label>
      <div className="flex bg-gray-100 rounded-lg p-1">
        {tabs.map((tab, index) => {
          const active = activeTab === index;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => onTabChange(index)}
              disabled={disabled}
              className={`flex-1 text-xs sm:text-sm font-medium rounded-lg py-2 transition-all duration-200 ${
                active
                  ? "bg-white shadow text-black"
                  : "text-gray-500 hover:text-black"
              } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
            >
              {tab}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default FormTypeToggle;
