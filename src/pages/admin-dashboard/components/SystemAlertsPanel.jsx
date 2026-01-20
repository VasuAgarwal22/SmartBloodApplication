import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SystemAlertsPanel = ({ alerts, onDismiss, onEscalate }) => {
  const getAlertIcon = (type) => {
    if (type === 'critical') return 'AlertTriangle';
    if (type === 'warning') return 'AlertCircle';
    if (type === 'info') return 'Info';
    return 'Bell';
  };

  const getAlertColor = (type) => {
    if (type === 'critical') return '#DC2626';
    if (type === 'warning') return '#D97706';
    if (type === 'info') return '#1E40AF';
    return '#6B7280';
  };

  const getAlertBg = (type) => {
    if (type === 'critical') return 'bg-error/10';
    if (type === 'warning') return 'bg-warning/10';
    if (type === 'info') return 'bg-primary/10';
    return 'bg-muted';
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 md:p-6 shadow-elevation-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg md:text-xl font-semibold mb-2">System Alerts</h3>
          <p className="text-sm text-muted-foreground">Critical events and notifications</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-lg">
          <Icon name="Bell" size={18} color="#1E40AF" />
          <span className="text-sm font-semibold text-primary">{alerts?.length} Active</span>
        </div>
      </div>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {alerts?.map((alert) => (
          <div 
            key={alert?.id}
            className={`border border-border rounded-lg p-4 ${getAlertBg(alert?.type)}`}
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="flex-shrink-0 mt-0.5">
                <Icon name={getAlertIcon(alert?.type)} size={20} color={getAlertColor(alert?.type)} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold mb-1">{alert?.title}</h4>
                <p className="text-sm text-muted-foreground mb-2">{alert?.message}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Icon name="Clock" size={12} />
                    {alert?.timestamp}
                  </span>
                  {alert?.location && (
                    <span className="flex items-center gap-1">
                      <Icon name="MapPin" size={12} />
                      {alert?.location}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {alert?.type === 'critical' && (
                <Button
                  variant="danger"
                  size="sm"
                  iconName="AlertTriangle"
                  iconPosition="left"
                  onClick={() => onEscalate(alert?.id)}
                >
                  Escalate
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDismiss(alert?.id)}
              >
                Dismiss
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SystemAlertsPanel;