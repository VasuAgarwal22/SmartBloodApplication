import React from 'react';
import Icon from '../../../components/AppIcon';

const MapIntegration = ({ latitude, longitude, locationName }) => {
  return (
    <div className="bg-card rounded-xl overflow-hidden border border-border shadow-elevation-md">
      <div className="p-4 md:p-5 bg-muted/50 border-b border-border">
        <div className="flex items-center gap-2">
          <Icon name="MapPin" size={20} className="text-primary" />
          <h3 className="text-base md:text-lg font-semibold">Live Location Tracking</h3>
        </div>
        <p className="text-xs md:text-sm text-muted-foreground mt-1">{locationName}</p>
      </div>
      
      <div className="relative w-full h-64 md:h-80 lg:h-96 bg-muted">
        <iframe
          width="100%"
          height="100%"
          loading="lazy"
          title={locationName}
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://www.google.com/maps?q=${latitude},${longitude}&z=14&output=embed`}
          className="border-0"
        />
        
        <div className="absolute bottom-4 left-4 right-4 bg-card/95 backdrop-blur-sm rounded-lg p-3 shadow-elevation-lg">
          <div className="flex items-center gap-2 text-xs md:text-sm">
            <Icon name="Navigation" size={16} className="text-primary" />
            <span className="font-medium">Ambulance is moving towards your location</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapIntegration;