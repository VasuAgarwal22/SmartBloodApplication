import React from 'react';
import Icon from '../../../components/AppIcon';

const QueueStatistics = ({ stats }) => {
  const statisticCards = [
    {
      label: 'Total Requests',
      value: stats?.totalRequests,
      icon: 'ListOrdered',
      color: 'primary',
      trend: stats?.requestTrend,
      trendLabel: 'vs last hour'
    },
    {
      label: 'Emergency Cases',
      value: stats?.emergencyCases,
      icon: 'AlertTriangle',
      color: 'error',
      trend: stats?.emergencyTrend,
      trendLabel: 'critical priority'
    },
    {
      label: 'Avg Processing Time',
      value: stats?.avgProcessingTime,
      icon: 'Clock',
      color: 'warning',
      trend: stats?.timeTrend,
      trendLabel: 'improvement'
    },
    {
      label: 'Algorithm Efficiency',
      value: `${stats?.algorithmEfficiency}%`,
      icon: 'Cpu',
      color: 'success',
      trend: stats?.efficiencyTrend,
      trendLabel: 'optimization'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      primary: 'bg-primary/10 text-primary',
      error: 'bg-error/10 text-error',
      warning: 'bg-warning/10 text-warning',
      success: 'bg-success/10 text-success'
    };
    return colors?.[color] || colors?.primary;
  };

  const getTrendIcon = (trend) => {
    if (trend > 0) return 'TrendingUp';
    if (trend < 0) return 'TrendingDown';
    return 'Minus';
  };

  const getTrendColor = (trend) => {
    if (trend > 0) return 'text-success';
    if (trend < 0) return 'text-error';
    return 'text-muted-foreground';
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {statisticCards?.map((stat, index) => (
        <div
          key={index}
          className="bg-card border border-border rounded-xl p-4 md:p-6 shadow-elevation-sm hover:shadow-elevation-md transition-all duration-250"
        >
          <div className="flex items-start justify-between mb-4">
            <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center ${getColorClasses(stat?.color)}`}>
              <Icon name={stat?.icon} size={24} />
            </div>
            {stat?.trend !== undefined && (
              <div className={`flex items-center gap-1 ${getTrendColor(stat?.trend)}`}>
                <Icon name={getTrendIcon(stat?.trend)} size={16} />
                <span className="text-xs font-semibold data-text">
                  {Math.abs(stat?.trend)}%
                </span>
              </div>
            )}
          </div>

          <div>
            <h3 className="text-2xl md:text-3xl font-bold mb-1 data-text">{stat?.value}</h3>
            <p className="text-sm text-muted-foreground mb-1">{stat?.label}</p>
            {stat?.trendLabel && (
              <p className="text-xs text-muted-foreground caption">{stat?.trendLabel}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default QueueStatistics;