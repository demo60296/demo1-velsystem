import { useState } from 'react';
import { X, Search, Globe } from 'lucide-react';
import { CURRENCIES } from '../types/settings';

interface CurrencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCurrency: string;
  onUpdate: (currencyCode: string) => Promise<void>;
}

export default function CurrencyModal({ 
  isOpen, 
  onClose, 
  currentCurrency,
  onUpdate 
}: CurrencyModalProps) {
  const [selectedCurrency, setSelectedCurrency] = useState(currentCurrency);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const filteredCurrencies = CURRENCIES.filter(currency =>
    currency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    currency.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
    currency.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      await onUpdate(selectedCurrency);
      onClose();
    } catch (error) {
      console.error('Failed to update currency:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Globe className="w-6 h-6 mr-2 text-indigo-600" />
            Currency
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search currencies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {filteredCurrencies.map((currency) => (
              <button
                key={currency.code}
                onClick={() => setSelectedCurrency(currency.code)}
                className={`w-full p-4 text-left border-2 rounded-lg transition-all ${
                  selectedCurrency === currency.code
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{currency.flag}</span>
                    <div>
                      <p className="font-medium text-gray-900">{currency.name}</p>
                      <p className="text-sm text-gray-500">{currency.country} • {currency.symbol}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-mono text-gray-600">{currency.code}</span>
                    {selectedCurrency === currency.code && (
                      <div className="w-4 h-4 bg-indigo-600 rounded-full"></div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {filteredCurrencies.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No currencies found matching "{searchTerm}"
            </div>
          )}
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
              disabled={isUpdating || selectedCurrency === currentCurrency}
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