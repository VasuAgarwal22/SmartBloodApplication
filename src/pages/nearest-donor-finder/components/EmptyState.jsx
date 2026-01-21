import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EmptyState = ({ onSearch }) => {
  return (
    <div className="bg-card border border-border rounded-xl p-6 md:p-8 lg:p-12 shadow-elevation-md">
      <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto">
        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4 md:mb-6">
          <Icon name="Search" size={40} color="var(--color-primary)" />
        </div>
        
        <h3 className="text-xl md:text-2xl font-semibold mb-2 md:mb-3">Start Your Search</h3>
        <p className="text-sm md:text-base text-muted-foreground mb-6 md:mb-8 leading-relaxed">
          {/* Enter your blood group requirement and location to find the nearest donors and blood banks using our advanced graph-based algorithm. */}
          Enter your blood group requirement and location to quickly find the nearest donors and blood banks through our intelligent matching system.
        </p>

        <div className="w-full space-y-3 md:space-y-4 mb-6 md:mb-8">
          <div className="flex items-start gap-3 p-3 md:p-4 bg-muted/50 rounded-lg text-left">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Icon name="Zap" size={16} color="var(--color-primary)" />
            </div>
            <div>
              <p className="text-sm md:text-base font-semibold mb-1"> Fast Matching</p>
              <p className="text-xs md:text-sm text-muted-foreground">
                The system instantly analyzes available blood sources and identifies the most suitable options to minimize response time.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 md:p-4 bg-muted/50 rounded-lg text-left">
            <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
              <Icon name="MapPin" size={16} color="var(--color-secondary)" />
            </div>
            <div>
              <p className="text-sm md:text-base font-semibold mb-1">Accurate Location</p>
              <p className="text-xs md:text-sm text-muted-foreground">
                Real-time location and distance evaluation ensure precise results and efficient planning during emergencies.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 md:p-4 bg-muted/50 rounded-lg text-left">
            <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
              <Icon name="CheckCircle" size={16} color="var(--color-success)" />
            </div>
            <div>
              <p className="text-sm md:text-base font-semibold mb-1">Verified Sources</p>
              <p className="text-xs md:text-sm text-muted-foreground">
                All donors and blood banks are carefully verified to ensure safety, reliability, and trustworthiness.
              </p>
            </div>
          </div>
        </div>

        <Button
          variant="default"
          size="lg"
          iconName="ArrowUp"
          iconPosition="left"
          onClick={onSearch}
        >
          Scroll to Search
        </Button>
      </div>
    </div>
  );
};

export default EmptyState;