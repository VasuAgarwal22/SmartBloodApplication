import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricCard = ({ title, value, icon, trend, trendValue, variant = 'default' }) => {
  const variantStyles = {
    default: 'border-border',
    success: 'border-success/30 bg-success/5',
    warning: 'border-warning/30 bg-warning/5',
    error: 'border-error/30 bg-error/5'
  };

  const iconColors = {
    default: 'var(--color-primary)',
    success: 'var(--color-success)',
    warning: 'var(--color-warning)',
    error: 'var(--color-error)'
  };

  const trendColors = {
    up: 'text-success',
    down: 'text-error',
    neutral: 'text-muted-foreground'
  };

  return (
    <div className={`bg-card rounded-xl border-2 p-4 md:p-6 transition-all duration-250 hover:shadow-elevation-sm ${variantStyles?.[variant]}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <p className="text-sm md:text-base text-muted-foreground mb-1 caption">{title}</p>
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-semibold data-text">{value}</h3>
        </div>
        <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
          <Icon name={icon} size={24} color={iconColors?.[variant]} />
        </div>
      </div>
      {trend && trendValue && (
        <div className="flex items-center gap-2">
          <Icon 
            name={trend === 'up' ? 'TrendingUp' : trend === 'down' ? 'TrendingDown' : 'Minus'} 
            size={16} 
            className={trendColors?.[trend]}
          />
          <span className={`text-xs md:text-sm font-medium ${trendColors?.[trend]}`}>
            {trendValue}
          </span>
          <span className="text-xs md:text-sm text-muted-foreground">vs last week</span>
        </div>
      )}
    </div>
  );
};

export default MetricCard;