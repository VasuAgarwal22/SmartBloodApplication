import React from 'react';
import Icon from '../../../components/AppIcon';

const RecentActivityCard = ({ activities }) => {
  const getActivityIcon = (type) => {
    const icons = {
      request: 'Droplet',
      donation: 'Heart',
      allocation: 'CheckCircle',
      ambulance: 'Ambulance'
    };
    return icons?.[type] || 'Activity';
  };

  const getActivityColor = (type) => {
    const colors = {
      request: 'text-error',
      donation: 'text-success',
      allocation: 'text-primary',
      ambulance: 'text-warning'
    };
    return colors?.[type] || 'text-foreground';
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date?.toLocaleDateString();
  };

  return (
    <div className="bg-card rounded-xl border-2 border-border p-4 md:p-6">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h3 className="text-lg md:text-xl font-semibold">Recent Activity</h3>
        <Icon name="Activity" size={20} color="var(--color-primary)" />
      </div>
      <div className="space-y-3 md:space-y-4">
        {activities?.map((activity) => (
          <div key={activity?.id} className="flex items-start gap-3 md:gap-4 pb-3 md:pb-4 border-b border-border last:border-0 last:pb-0">
            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl bg-muted flex items-center justify-center flex-shrink-0 ${getActivityColor(activity?.type)}`}>
              <Icon name={getActivityIcon(activity?.type)} size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm md:text-base font-medium mb-1">{activity?.title}</p>
              <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">{activity?.description}</p>
              <p className="text-xs text-muted-foreground mt-1 caption">{formatTime(activity?.timestamp)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivityCard;