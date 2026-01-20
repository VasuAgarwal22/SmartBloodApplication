import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ActiveAmbulanceCard = ({ ambulance, onContactDriver, onViewMap }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'searching': return 'text-warning bg-warning/10';
      case 'assigned': return 'text-primary bg-primary/10';
      case 'enroute': return 'text-success bg-success/10';
      case 'arrived': return 'text-success bg-success/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  return (
    <div className="bg-card rounded-xl p-4 md:p-6 border border-border shadow-elevation-md hover:shadow-elevation-lg transition-all duration-250">
      <div className="flex flex-col lg:flex-row lg:items-start gap-4 md:gap-6">
        {/* Ambulance Info */}
        <div className="flex-1 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Icon name="Ambulance" size={24} className="text-primary" />
                <h3 className="text-lg md:text-xl font-semibold">{ambulance?.vehicleNumber}</h3>
              </div>
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs md:text-sm font-medium ${getStatusColor(ambulance?.status)}`}>
                <Icon name="Activity" size={14} />
                {ambulance?.statusLabel}
              </span>
            </div>
          </div>

          {/* Driver Details */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm md:text-base">
              <Icon name="User" size={18} className="text-muted-foreground" />
              <span className="font-medium">Driver:</span>
              <span>{ambulance?.driverName}</span>
            </div>
            <div className="flex items-center gap-2 text-sm md:text-base">
              <Icon name="Phone" size={18} className="text-muted-foreground" />
              <span className="font-medium">Contact:</span>
              <span className="data-text">{ambulance?.driverContact}</span>
            </div>
          </div>

          {/* Location & ETA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 pt-3 border-t border-border">
            <div className="flex items-start gap-2">
              <Icon name="MapPin" size={18} className="text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs md:text-sm text-muted-foreground mb-1">Current Location</p>
                <p className="text-sm md:text-base font-medium line-clamp-2">{ambulance?.currentLocation}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Icon name="Clock" size={18} className="text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs md:text-sm text-muted-foreground mb-1">Estimated Arrival</p>
                <p className="text-sm md:text-base font-semibold text-primary">{ambulance?.eta}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex lg:flex-col gap-2 md:gap-3">
          <Button
            variant="outline"
            size="default"
            fullWidth
            iconName="Phone"
            iconPosition="left"
            onClick={() => onContactDriver(ambulance)}
            className="flex-1 lg:flex-none"
          >
            Call Driver
          </Button>
          <Button
            variant="secondary"
            size="default"
            fullWidth
            iconName="Map"
            iconPosition="left"
            onClick={() => onViewMap(ambulance)}
            className="flex-1 lg:flex-none"
          >
            View Map
          </Button>
        </div>
      </div>
      {/* Distance Progress */}
      {ambulance?.status === 'enroute' && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs md:text-sm text-muted-foreground">Distance Remaining</span>
            <span className="text-xs md:text-sm font-semibold data-text">{ambulance?.distanceRemaining}</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-success transition-all duration-500"
              style={{ width: `${ambulance?.progressPercentage}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveAmbulanceCard;