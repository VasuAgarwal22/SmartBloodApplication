import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EmergencyRequestButton = ({ onRequestAmbulance, isRequesting }) => {
  return (
    <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-900/20 rounded-2xl p-6 md:p-8 lg:p-10 border-2 border-red-200 dark:border-red-800 shadow-elevation-lg">
      <div className="text-center max-w-2xl mx-auto">
        <div className="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 mx-auto mb-4 md:mb-6 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center shadow-elevation-xl animate-pulse">
          <Icon name="Ambulance" size={48} color="#FFFFFF" className="md:w-14 md:h-14 lg:w-16 lg:h-16" />
        </div>
        
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-red-900 dark:text-red-100 mb-3 md:mb-4">
          Emergency Ambulance Service
        </h2>
        
        <p className="text-sm md:text-base lg:text-lg text-red-700 dark:text-red-300 mb-6 md:mb-8 leading-relaxed">
          Request immediate ambulance dispatch for critical medical emergencies.\nOur rapid response team will be notified instantly.
        </p>
        
        <Button
          variant="destructive"
          size="xl"
          fullWidth
          loading={isRequesting}
          iconName="Siren"
          iconPosition="left"
          iconSize={24}
          onClick={onRequestAmbulance}
          className="text-base md:text-lg lg:text-xl py-4 md:py-5 lg:py-6 shadow-elevation-lg hover:shadow-elevation-xl transition-all duration-250"
        >
          {isRequesting ? 'Dispatching Ambulance...' : 'Request Emergency Ambulance'}
        </Button>
        
        <div className="mt-6 md:mt-8 flex items-center justify-center gap-2 text-xs md:text-sm text-red-600 dark:text-red-400">
          <Icon name="Clock" size={16} />
          <span>Average response time: 8-12 minutes</span>
        </div>
      </div>
    </div>
  );
};

export default EmergencyRequestButton;