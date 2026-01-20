import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EmergencyEscalation = ({ onEscalate, onAlternative }) => {
  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-xl p-4 md:p-6 border-2 border-amber-200 dark:border-amber-800">
      <div className="flex items-start gap-3 md:gap-4 mb-4">
        <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-warning/20 flex items-center justify-center">
          <Icon name="AlertTriangle" size={24} className="text-warning" />
        </div>
        <div className="flex-1">
          <h3 className="text-base md:text-lg font-semibold text-amber-900 dark:text-amber-100 mb-1">
            Need Immediate Assistance?
          </h3>
          <p className="text-xs md:text-sm text-amber-700 dark:text-amber-300">
            If the situation is critical or ambulance is delayed, you can escalate or request alternative services.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Button
          variant="warning"
          size="default"
          fullWidth
          iconName="AlertCircle"
          iconPosition="left"
          onClick={onEscalate}
        >
          Escalate Priority
        </Button>
        <Button
          variant="outline"
          size="default"
          fullWidth
          iconName="RefreshCw"
          iconPosition="left"
          onClick={onAlternative}
        >
          Request Alternative
        </Button>
      </div>
    </div>
  );
};

export default EmergencyEscalation;