import React from 'react';
import Icon from '../../../components/AppIcon';

const RecentActivityPanel = ({ activities }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'request': return 'FileText';
      case 'assigned': return 'UserCheck';
      case 'enroute': return 'Navigation';
      case 'completed': return 'CheckCircle';
      case 'cancelled': return 'XCircle';
      default: return 'Activity';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'request': return 'text-warning';
      case 'assigned': return 'text-primary';
      case 'enroute': return 'text-success';
      case 'completed': return 'text-success';
      case 'cancelled': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="bg-card rounded-xl p-4 md:p-6 border border-border shadow-elevation-md">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h3 className="text-lg md:text-xl font-semibold flex items-center gap-2">
          <Icon name="History" size={24} className="text-primary" />
          Recent Activity
        </h3>
        <span className="text-xs md:text-sm text-muted-foreground caption">Last 24 hours</span>
      </div>
      <div className="space-y-3 md:space-y-4 max-h-96 overflow-y-auto">
        {activities?.map((activity) => (
          <div key={activity?.id} className="flex items-start gap-3 md:gap-4 p-3 md:p-4 rounded-lg hover:bg-muted/50 transition-colors duration-250">
            <div className={`flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-muted flex items-center justify-center ${getActivityColor(activity?.type)}`}>
              <Icon name={getActivityIcon(activity?.type)} size={20} />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm md:text-base font-medium mb-1">{activity?.title}</p>
              <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">{activity?.description}</p>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-xs text-muted-foreground caption">{activity?.time}</span>
                {activity?.vehicleNumber && (
                  <span className="text-xs font-medium data-text">{activity?.vehicleNumber}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivityPanel;