import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DonorResultCard = ({ donor, rank }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Available':
        return 'text-success bg-success/10 border-success/20';
      case 'Limited':
        return 'text-warning bg-warning/10 border-warning/20';
      case 'Unavailable':
        return 'text-error bg-error/10 border-error/20';
      default:
        return 'text-muted-foreground bg-muted/10 border-border';
    }
  };

  const handleContact = () => {
    window.location.href = `tel:${donor?.phone}`;
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 md:p-6 shadow-elevation-sm hover:shadow-elevation-md transition-smooth">
      <div className="flex items-start gap-3 md:gap-4 mb-4">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <span className="text-base md:text-lg font-bold text-primary">#{rank}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="text-base md:text-lg font-semibold truncate">{donor?.name}</h3>
              <p className="text-xs md:text-sm text-muted-foreground">{donor?.type}</p>
            </div>
            {donor?.verified && (
              <div className="flex-shrink-0 w-6 h-6 md:w-7 md:h-7 rounded-full bg-success/10 flex items-center justify-center">
                <Icon name="CheckCircle" size={16} color="var(--color-success)" />
              </div>
            )}
          </div>
          <div className={`inline-flex items-center gap-1.5 px-2 md:px-3 py-1 rounded-full border text-xs md:text-sm font-medium ${getStatusColor(donor?.status)}`}>
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-current"></div>
            {donor?.status}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-4">
        <div className="flex items-center gap-2 p-2 md:p-3 bg-muted/50 rounded-lg">
          <Icon name="Droplet" size={16} color="var(--color-primary)" />
          <div>
            <p className="text-xs text-muted-foreground">Blood Group</p>
            <p className="text-sm md:text-base font-semibold data-text">{donor?.bloodGroup}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2 md:p-3 bg-muted/50 rounded-lg">
          <Icon name="Navigation" size={16} color="var(--color-secondary)" />
          <div>
            <p className="text-xs text-muted-foreground">Distance</p>
            <p className="text-sm md:text-base font-semibold data-text">{donor?.distance} km</p>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2 md:p-3 bg-muted/50 rounded-lg">
          <Icon name="Clock" size={16} color="var(--color-accent)" />
          <div>
            <p className="text-xs text-muted-foreground">Est. Time</p>
            <p className="text-sm md:text-base font-semibold data-text">{donor?.estimatedTime}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2 md:p-3 bg-muted/50 rounded-lg">
          <Icon name="MapPin" size={16} color="var(--color-primary)" />
          <div>
            <p className="text-xs text-muted-foreground">Location</p>
            <p className="text-sm md:text-base font-semibold truncate">{donor?.location}</p>
          </div>
        </div>
      </div>
      <div className="mb-4 p-3 md:p-4 bg-primary/5 border border-primary/10 rounded-lg">
        <div className="flex items-start gap-2 mb-2">
          <Icon name="Route" size={16} color="var(--color-primary)" className="flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-xs md:text-sm font-semibold mb-1">Optimal Route</p>
            <p className="text-xs text-muted-foreground">{donor?.route}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Icon name="TrendingDown" size={14} />
          <span>Path Weight: {donor?.pathWeight}</span>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
        <Button
          variant="default"
          fullWidth
          iconName="Phone"
          iconPosition="left"
          onClick={handleContact}
        >
          Contact Now
        </Button>
        <Button
          variant="outline"
          fullWidth
          iconName="MapPin"
          iconPosition="left"
        >
          View on Map
        </Button>
      </div>
    </div>
  );
};

export default DonorResultCard;