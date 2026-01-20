import React, { useEffect, useState } from 'react';
import Icon from '../AppIcon';

const NotificationToast = ({ notifications = [], onDismiss }) => {
  const [visibleNotifications, setVisibleNotifications] = useState([]);

  useEffect(() => {
    setVisibleNotifications(notifications?.slice(0, 3));
  }, [notifications]);

  useEffect(() => {
    const timers = visibleNotifications?.map((notification) => {
      if (notification?.autoDismiss !== false) {
        return setTimeout(() => {
          handleDismiss(notification?.id);
        }, notification?.duration || 5000);
      }
      return null;
    });

    return () => {
      timers?.forEach(timer => timer && clearTimeout(timer));
    };
  }, [visibleNotifications]);

  const handleDismiss = (id) => {
    setVisibleNotifications(prev => prev?.filter(n => n?.id !== id));
    if (onDismiss) {
      onDismiss(id);
    }
  };

  if (visibleNotifications?.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-[1100] flex flex-col gap-3 max-w-full sm:max-w-md">
      {visibleNotifications?.map((notification, index) => {
        const typeClass = notification?.type === 'critical' ? 'critical' :
                         notification?.type === 'warning' ? 'warning' :
                         notification?.type === 'success' ? 'success' : '';

        const typeIcon = notification?.type === 'critical' ? 'AlertTriangle' :
                        notification?.type === 'warning' ? 'AlertCircle' :
                        notification?.type === 'success' ? 'CheckCircle' : 'Info';

        return (
          <div
            key={notification?.id}
            className={`notification-toast ${typeClass}`}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <Icon name={typeIcon} size={20} />
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm mb-1">{notification?.title}</h4>
                <p className="text-sm text-muted-foreground">{notification?.message}</p>
                {notification?.timestamp && (
                  <p className="text-xs text-muted-foreground mt-2 caption">
                    {new Date(notification.timestamp)?.toLocaleTimeString()}
                  </p>
                )}
              </div>

              <button
                onClick={() => handleDismiss(notification?.id)}
                className="flex-shrink-0 p-1 hover:bg-muted rounded transition-colors duration-250"
                aria-label="Dismiss notification"
              >
                <Icon name="X" size={16} />
              </button>
            </div>
            {notification?.action && (
              <button
                onClick={notification?.action?.onClick}
                className="mt-3 w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity duration-250"
              >
                {notification?.action?.label}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default NotificationToast;