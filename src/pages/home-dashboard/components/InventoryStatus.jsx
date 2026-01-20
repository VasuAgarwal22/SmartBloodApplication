import React from 'react';
import Icon from '../../../components/AppIcon';

const InventoryStatus = ({ inventory }) => {
  const getStatusColor = (status) => {
    const colors = {
      critical: 'text-error',
      low: 'text-warning',
      adequate: 'text-success',
      good: 'text-success'
    };
    return colors?.[status] || 'text-muted-foreground';
  };

  const getStatusBg = (status) => {
    const backgrounds = {
      critical: 'bg-error/10',
      low: 'bg-warning/10',
      adequate: 'bg-success/10',
      good: 'bg-success/10'
    };
    return backgrounds?.[status] || 'bg-muted';
  };

  const getStatusIcon = (status) => {
    const icons = {
      critical: 'AlertTriangle',
      low: 'AlertCircle',
      adequate: 'CheckCircle',
      good: 'CheckCircle'
    };
    return icons?.[status] || 'Circle';
  };

  return (
    <div className="bg-card rounded-xl border-2 border-border p-4 md:p-6">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h3 className="text-lg md:text-xl font-semibold">Blood Inventory Status</h3>
        <Icon name="Droplet" size={20} color="var(--color-primary)" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {inventory?.map((item) => (
          <div key={item?.bloodGroup} className={`p-3 md:p-4 rounded-xl border-2 ${getStatusBg(item?.status)} border-border`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg md:text-xl font-bold data-text">{item?.bloodGroup}</span>
              <Icon 
                name={getStatusIcon(item?.status)} 
                size={16} 
                className={getStatusColor(item?.status)}
              />
            </div>
            <p className="text-xl md:text-2xl font-semibold data-text mb-1">{item?.units}</p>
            <p className="text-xs md:text-sm text-muted-foreground caption">units</p>
            <div className="mt-2 pt-2 border-t border-border">
              <p className={`text-xs font-medium capitalize ${getStatusColor(item?.status)}`}>
                {item?.status}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InventoryStatus;