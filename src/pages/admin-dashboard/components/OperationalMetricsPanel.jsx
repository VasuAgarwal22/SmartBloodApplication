import React from 'react';
import Icon from '../../../components/AppIcon';

const OperationalMetricsPanel = ({ metrics }) => {
  return (
    <div className="bg-card border border-border rounded-xl p-4 md:p-6 shadow-elevation-sm">
      <div className="mb-6">
        <h3 className="text-lg md:text-xl font-semibold mb-2">Operational Metrics</h3>
        <p className="text-sm text-muted-foreground">Real-time system performance indicators</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {metrics?.map((metric, index) => (
          <div key={index} className="border border-border rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-muted-foreground mb-1 caption">{metric?.label}</p>
                <h4 className="text-xl md:text-2xl font-semibold data-text">{metric?.value}</h4>
              </div>
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${metric?.iconColor}20` }}
              >
                <Icon name={metric?.icon} size={20} color={metric?.iconColor} />
              </div>
            </div>

            {metric?.subMetrics && (
              <div className="space-y-2 pt-3 border-t border-border">
                {metric?.subMetrics?.map((sub, subIndex) => (
                  <div key={subIndex} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{sub?.label}</span>
                    <span className="font-medium data-text">{sub?.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OperationalMetricsPanel;