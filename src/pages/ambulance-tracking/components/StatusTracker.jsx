import React from 'react';
import Icon from '../../../components/AppIcon';

const StatusTracker = ({ currentStatus }) => {
  const statuses = [
    { id: 'searching', label: 'Searching', icon: 'Search', description: 'Finding nearest ambulance' },
    { id: 'assigned', label: 'Assigned', icon: 'CheckCircle', description: 'Ambulance assigned to request' },
    { id: 'enroute', label: 'En Route', icon: 'Navigation', description: 'Ambulance on the way' },
    { id: 'arrived', label: 'Arrived', icon: 'MapPin', description: 'Ambulance at location' }
  ];

  const getCurrentIndex = () => {
    return statuses?.findIndex(s => s?.id === currentStatus);
  };

  const currentIndex = getCurrentIndex();

  return (
    <div className="bg-card rounded-xl p-4 md:p-6 lg:p-8 border border-border shadow-elevation-md">
      <h3 className="text-lg md:text-xl lg:text-2xl font-semibold mb-6 md:mb-8 flex items-center gap-2">
        <Icon name="Activity" size={24} className="text-primary" />
        Ambulance Status
      </h3>
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute left-6 md:left-8 top-0 bottom-0 w-0.5 bg-border hidden lg:block" />
        <div 
          className="absolute left-6 md:left-8 top-0 w-0.5 bg-primary transition-all duration-500 hidden lg:block"
          style={{ height: `${(currentIndex / (statuses?.length - 1)) * 100}%` }}
        />

        {/* Status Steps */}
        <div className="space-y-4 md:space-y-6">
          {statuses?.map((status, index) => {
            const isActive = index === currentIndex;
            const isCompleted = index < currentIndex;
            const isPending = index > currentIndex;

            return (
              <div key={status?.id} className="relative flex items-start gap-4 md:gap-6">
                {/* Icon Circle */}
                <div className={`flex-shrink-0 w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full flex items-center justify-center border-2 transition-all duration-250 ${
                  isActive 
                    ? 'bg-primary border-primary shadow-elevation-md scale-110' 
                    : isCompleted 
                    ? 'bg-success border-success' :'bg-muted border-border'
                }`}>
                  <Icon 
                    name={status?.icon} 
                    size={24} 
                    color={isActive || isCompleted ? '#FFFFFF' : 'currentColor'}
                    className="md:w-7 md:h-7 lg:w-8 lg:h-8"
                  />
                </div>
                {/* Content */}
                <div className="flex-1 pt-2">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className={`text-base md:text-lg lg:text-xl font-semibold ${
                      isActive ? 'text-primary' : isCompleted ? 'text-success' : 'text-muted-foreground'
                    }`}>
                      {status?.label}
                    </h4>
                    {isActive && (
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full animate-pulse">
                        Active
                      </span>
                    )}
                    {isCompleted && (
                      <Icon name="Check" size={16} className="text-success" />
                    )}
                  </div>
                  <p className={`text-sm md:text-base ${
                    isPending ? 'text-muted-foreground' : 'text-foreground'
                  }`}>
                    {status?.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StatusTracker;