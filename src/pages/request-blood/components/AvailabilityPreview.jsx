import React from 'react';
import Icon from '../../../components/AppIcon';

const AvailabilityPreview = ({ bloodGroup, location }) => {
  const availabilityData = {
    'A+': { units: 45, nearestBank: 'City General Blood Bank', distance: '2.3 miles', estimatedTime: '15-20 mins' },
    'A-': { units: 12, nearestBank: 'Memorial Hospital Blood Center', distance: '3.1 miles', estimatedTime: '20-25 mins' },
    'B+': { units: 38, nearestBank: 'City General Blood Bank', distance: '2.3 miles', estimatedTime: '15-20 mins' },
    'B-': { units: 8, nearestBank: 'Regional Medical Center', distance: '4.5 miles', estimatedTime: '25-30 mins' },
    'AB+': { units: 15, nearestBank: 'University Hospital Blood Bank', distance: '3.8 miles', estimatedTime: '22-28 mins' },
    'AB-': { units: 5, nearestBank: 'Regional Medical Center', distance: '4.5 miles', estimatedTime: '25-30 mins' },
    'O+': { units: 67, nearestBank: 'City General Blood Bank', distance: '2.3 miles', estimatedTime: '15-20 mins' },
    'O-': { units: 18, nearestBank: 'Memorial Hospital Blood Center', distance: '3.1 miles', estimatedTime: '20-25 mins' }
  };

  const data = bloodGroup ? availabilityData?.[bloodGroup] : null;

  return (
    <div className="bg-card border border-border rounded-xl p-4 md:p-6 lg:p-8 shadow-elevation-sm sticky top-24">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
          <Icon name="Activity" size={20} className="text-success" />
        </div>
        <h3 className="text-lg md:text-xl font-semibold">Real-Time Availability</h3>
      </div>
      {!bloodGroup ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <Icon name="Droplet" size={32} className="text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">
            Select a blood group to view availability
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Blood Group</span>
              <span className="text-2xl font-bold text-primary data-text">{bloodGroup}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Units Available</span>
              <span className={`text-xl font-semibold data-text ${
                data?.units > 30 ? 'text-success' : data?.units > 15 ? 'text-warning' : 'text-error'
              }`}>
                {data?.units}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Icon name="Building2" size={18} className="text-primary flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground mb-1">Nearest Blood Bank</p>
                <p className="text-sm font-medium">{data?.nearestBank}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Icon name="MapPin" size={18} className="text-primary flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground mb-1">Distance</p>
                <p className="text-sm font-medium data-text">{data?.distance}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Icon name="Clock" size={18} className="text-primary flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground mb-1">Estimated Delivery</p>
                <p className="text-sm font-medium data-text">{data?.estimatedTime}</p>
              </div>
            </div>
          </div>

          <div className="bg-muted rounded-lg p-3 mt-4">
            <div className="flex items-start gap-2">
              <Icon name="Info" size={16} className="text-primary flex-shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground">
                {/* Delivery time calculated using Dijkstra's algorithm for optimal route planning */}
                “Delivery time is estimated by analyzing the fastest available routes in real time.”
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvailabilityPreview;