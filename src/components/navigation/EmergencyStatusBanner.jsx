import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from '../ui/Button';

const EmergencyStatusBanner = ({ alerts = [] }) => {
  const [visibleAlerts, setVisibleAlerts] = useState([]);
  const [currentAlertIndex, setCurrentAlertIndex] = useState(0);

  useEffect(() => {
    setVisibleAlerts(alerts?.filter(alert => !alert?.dismissed));
  }, [alerts]);

  useEffect(() => {
    if (visibleAlerts?.length > 1) {
      const timer = setInterval(() => {
        setCurrentAlertIndex((prev) => (prev + 1) % visibleAlerts?.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [visibleAlerts?.length]);

  const dismissAlert = (alertId) => {
    setVisibleAlerts(prev => prev?.filter(alert => alert?.id !== alertId));
  };

  if (visibleAlerts?.length === 0) return null;

  const currentAlert = visibleAlerts?.[currentAlertIndex];
  const severityClass = currentAlert?.severity === 'critical' ? 'critical' : 
                        currentAlert?.severity === 'warning' ? 'warning' : 'info';

  const severityIcon = currentAlert?.severity === 'critical' ? 'AlertTriangle' :
                       currentAlert?.severity === 'warning' ? 'AlertCircle' : 'Info';

  return (
    <div className={`emergency-status-banner ${severityClass}`}>
      <div className="max-w-screen-2xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Icon name={severityIcon} size={20} className="flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">{currentAlert?.title}</p>
            <p className="text-xs opacity-90 truncate">{currentAlert?.message}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {visibleAlerts?.length > 1 && (
            <span className="text-xs opacity-75 hidden sm:inline">
              {currentAlertIndex + 1} / {visibleAlerts?.length}
            </span>
          )}
          
          {currentAlert?.actionLabel && (
            <Button
              variant="ghost"
              size="sm"
              className="text-current hover:bg-white/20"
              onClick={currentAlert?.onAction}
            >
              {currentAlert?.actionLabel}
            </Button>
          )}

          <button
            onClick={() => dismissAlert(currentAlert?.id)}
            className="p-1 hover:bg-white/20 rounded transition-colors duration-250"
            aria-label="Dismiss alert"
          >
            <Icon name="X" size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmergencyStatusBanner;