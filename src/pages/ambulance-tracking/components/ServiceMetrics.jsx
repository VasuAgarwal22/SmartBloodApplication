import React from 'react';
import Icon from '../../../components/AppIcon';

const ServiceMetrics = ({ metrics }) => {
  const metricCards = [
    {
      id: 'avgResponse',
      label: 'Avg Response Time',
      value: metrics?.avgResponseTime,
      icon: 'Clock',
      color: 'text-primary bg-primary/10',
      trend: metrics?.responseTimeTrend
    },
    {
      id: 'activeAmbulances',
      label: 'Active Ambulances',
      value: metrics?.activeAmbulances,
      icon: 'Ambulance',
      color: 'text-success bg-success/10',
      trend: null
    },
    {
      id: 'completedToday',
      label: 'Completed Today',
      value: metrics?.completedToday,
      icon: 'CheckCircle',
      color: 'text-success bg-success/10',
      trend: metrics?.completedTrend
    },
    {
      id: 'availability',
      label: 'Service Availability',
      value: metrics?.availability,
      icon: 'Activity',
      color: 'text-warning bg-warning/10',
      trend: null
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {metricCards?.map((metric) => (
        <div key={metric?.id} className="bg-card rounded-xl p-4 md:p-6 border border-border shadow-elevation-sm hover:shadow-elevation-md transition-all duration-250">
          <div className="flex items-start justify-between mb-3 md:mb-4">
            <div className={`w-12 h-12 md:w-14 md:h-14 rounded-lg flex items-center justify-center ${metric?.color}`}>
              <Icon name={metric?.icon} size={24} />
            </div>
            {metric?.trend && (
              <div className={`flex items-center gap-1 text-xs md:text-sm ${
                metric?.trend > 0 ? 'text-success' : 'text-error'
              }`}>
                <Icon name={metric?.trend > 0 ? 'TrendingUp' : 'TrendingDown'} size={16} />
                <span className="font-medium">{Math.abs(metric?.trend)}%</span>
              </div>
            )}
          </div>
          
          <h3 className="text-2xl md:text-3xl font-bold mb-1 data-text">{metric?.value}</h3>
          <p className="text-xs md:text-sm text-muted-foreground">{metric?.label}</p>
        </div>
      ))}
    </div>
  );
};

export default ServiceMetrics;