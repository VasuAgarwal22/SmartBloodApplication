import React from 'react';
import Icon from '../../../components/AppIcon';

const MapVisualization = ({ searchLocation, results }) => {
  const mapUrl = searchLocation 
    ? `https://www.google.com/maps?q=${encodeURIComponent(searchLocation)}&z=12&output=embed`
    : null;

  if (!searchLocation || results?.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-elevation-md">
        <div className="flex flex-col items-center justify-center text-center py-8 md:py-12">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-muted/50 flex items-center justify-center mb-4">
            <Icon name="Map" size={32} color="var(--color-muted-foreground)" />
          </div>
          <h3 className="text-base md:text-lg font-semibold mb-2">No Map Data Available</h3>
          <p className="text-xs md:text-sm text-muted-foreground max-w-md">
            Perform a search to view geographical distribution and route optimization visualization
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-elevation-md">
      <div className="p-4 md:p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
            <Icon name="Map" size={20} color="var(--color-secondary)" />
          </div>
          <div>
            <h3 className="text-base md:text-lg font-semibold">Route Visualization</h3>
            <p className="text-xs md:text-sm text-muted-foreground">Graph-based location mapping</p>
          </div>
        </div>
      </div>
      <div className="relative w-full h-64 md:h-80 lg:h-96 bg-muted/20">
        <iframe
          width="100%"
          height="100%"
          loading="lazy"
          title={`Map showing ${searchLocation}`}
          referrerPolicy="no-referrer-when-downgrade"
          src={mapUrl}
          className="border-0"
        />
      </div>
      <div className="p-4 md:p-6 bg-muted/30">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">Total Nodes</p>
            <p className="text-lg md:text-xl font-bold text-primary data-text">{results?.length}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">Avg Distance</p>
            <p className="text-lg md:text-xl font-bold text-secondary data-text">
              {(results?.reduce((sum, r) => sum + parseFloat(r?.distance), 0) / results?.length)?.toFixed(1)} km
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">Available</p>
            <p className="text-lg md:text-xl font-bold text-success data-text">
              {results?.filter(r => r?.status === 'Available')?.length}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">Verified</p>
            <p className="text-lg md:text-xl font-bold text-accent data-text">
              {results?.filter(r => r?.verified)?.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapVisualization;