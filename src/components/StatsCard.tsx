import * as Icons from 'lucide-react';

interface StatItem {
  id: number;
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: string;
}

interface StatsCardProps {
  stat: StatItem;
}

const StatsCard = ({ stat }: StatsCardProps) => {
  const Icon = Icons[stat.icon as keyof typeof Icons] as React.ComponentType<{ className?: string }>;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
          stat.trend === 'up' ? 'bg-blue-50' : 'bg-orange-50'
        }`}>
          {Icon && <Icon className={`w-6 h-6 ${
            stat.trend === 'up' ? 'text-blue-600' : 'text-orange-600'
          }`} />}
        </div>
        <span className={`flex items-center text-sm font-medium ${
          stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
        }`}>
          {stat.trend === 'up' ? (
            <Icons.TrendingUp className="w-4 h-4 mr-1" />
          ) : (
            <Icons.TrendingDown className="w-4 h-4 mr-1" />
          )}
          {stat.change}
        </span>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
      <p className="text-sm text-gray-600">{stat.title}</p>
    </div>
  );
};

export default StatsCard;
