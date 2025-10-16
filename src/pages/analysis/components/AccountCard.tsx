interface AccountCardProps {
  icon: string;
  name: string;
  typeName: string;
  amount: string;
  percentage?: string;
  variant: 'spending' | 'income' | 'transfer';
}

function AccountCard({ icon, name, typeName, amount, percentage, variant }: AccountCardProps) {
  const amountColorClasses = {
    spending: 'text-red-600',
    income: 'text-green-600',
    transfer: 'text-blue-600'
  };

  return (
    <div className="rounded-xl shadow p-4 flex justify-between items-center hover:shadow-md transition">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <span className="text-lg">{icon}</span>
        <div>
          <h3 className="font-medium text-gray-900 truncate">{name}</h3>
          <p className="text-xs text-gray-500">{typeName}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`text-sm font-semibold ${amountColorClasses[variant]}`}>
          {amount}
        </p>
        <p className="text-xs text-gray-500">
          {percentage ? `${percentage}%` : variant === 'transfer' ? 'Transfer' : ''}
        </p>
      </div>
    </div>
  );
}

export default AccountCard;
