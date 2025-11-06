import CategoryIcon from '../../../components/CategoryIcon';

interface CategoryCardProps {
  icon: string;
  color: string;
  name: string;
  amount: string;
  percentage: string;
  variant: 'spending' | 'income';
}

function CategoryCard({ icon, color, name, amount, percentage, variant }: CategoryCardProps) {
  const barColor = variant === 'spending' ? 'bg-red-500' : 'bg-green-500';

  return (
    <div className="rounded-xl shadow p-4 hover:shadow-md transition">
      <div className="flex justify-between items-center gap-3">
        <div className="flex items-center gap-3 mb-2">
          <CategoryIcon icon={icon} color={color} size="sm" />
          <div>
            <p className="font-medium text-gray-900">{name}</p>
            <p className="text-xs text-gray-500">{amount}</p>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1 text-right">{percentage}%</p>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${barColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default CategoryCard;
