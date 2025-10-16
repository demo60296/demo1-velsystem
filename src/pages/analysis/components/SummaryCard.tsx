import { LucideIcon } from 'lucide-react';

interface SummaryCardProps {
  title: string;
  amount: string;
  icon: LucideIcon;
  variant: 'spending' | 'income' | 'balance';
  showPlus?: boolean;
}

function SummaryCard({ title, amount, icon: Icon, variant, showPlus }: SummaryCardProps) {
  const colorClasses = {
    spending: {
      text: 'text-red-600',
      bg: 'bg-red-100',
      iconColor: 'text-red-600'
    },
    income: {
      text: 'text-green-600',
      bg: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    balance: {
      text: amount.startsWith('-') ? 'text-red-600' : 'text-green-600',
      bg: amount.startsWith('-') ? 'bg-red-100' : 'bg-green-100',
      iconColor: amount.startsWith('-') ? 'text-red-600' : 'text-green-600'
    }
  };

  const colors = colorClasses[variant];

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-xl font-bold ${colors.text}`}>
            {showPlus && amount}
          </p>
        </div>
        <div className={`${colors.bg} rounded-full p-3`}>
          <Icon className={`h-5 w-5 ${colors.iconColor}`} />
        </div>
      </div>
    </div>
  );
}

export default SummaryCard;
