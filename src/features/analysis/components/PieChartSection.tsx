import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

interface ChartData {
  name: string;
  value: number;
  color: string;
}

interface PieChartSectionProps {
  data: ChartData[];
  total: string;
  variant: 'spending' | 'income';
  formatCurrency: (value: number) => string;
}

function PieChartSection({ data, total, variant, formatCurrency }: PieChartSectionProps) {
  const totalColor = variant === 'spending' ? 'text-red-600' : 'text-green-600';

  return (
    <div className="relative h-72 flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={100}
            innerRadius={60}
            dataKey="value"
            label={({ percent }) => `${((percent ?? 0) * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => [
              formatCurrency(Number(value)),
              name,
            ]}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <p className="text-sm text-gray-500">Total</p>
        <p className={`text-xl font-bold ${totalColor}`}>
          {total}
        </p>
      </div>
    </div>
  );
}

export default PieChartSection;
