import React from 'react';
import Icon from '../../../components/AppIcon';

const UrgencyLevelSelector = ({ selectedLevel, onChange, error }) => {
  const urgencyLevels = [
    {
      value: 'critical',
      label: 'Critical',
      description: 'Life-threatening emergency',
      icon: 'AlertTriangle',
      color: 'bg-error text-error-foreground',
      borderColor: 'border-error',
      hoverColor: 'hover:bg-error/90'
    },
    {
      value: 'high',
      label: 'High',
      description: 'Urgent medical need',
      icon: 'AlertCircle',
      color: 'bg-warning text-warning-foreground',
      borderColor: 'border-warning',
      hoverColor: 'hover:bg-warning/90'
    },
    {
      value: 'normal',
      label: 'Normal',
      description: 'Scheduled procedure',
      icon: 'Info',
      color: 'bg-primary text-primary-foreground',
      borderColor: 'border-primary',
      hoverColor: 'hover:bg-primary/90'
    }
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-4 md:p-6 lg:p-8 shadow-elevation-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <span className="text-primary font-semibold text-lg">2</span>
        </div>
        <h2 className="text-xl md:text-2xl font-semibold">Urgency Level</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {urgencyLevels?.map((level) => (
          <button
            key={level?.value}
            type="button"
            onClick={() => onChange(level?.value)}
            className={`relative p-4 md:p-6 rounded-xl border-2 transition-all duration-250 ${
              selectedLevel === level?.value
                ? `${level?.color} ${level?.borderColor} shadow-elevation-md`
                : 'bg-muted border-border hover:border-primary/50'
            }`}
          >
            <div className="flex flex-col items-center gap-3 text-center">
              <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center ${
                selectedLevel === level?.value ? 'bg-white/20' : 'bg-primary/10'
              }`}>
                <Icon 
                  name={level?.icon} 
                  size={24} 
                  color={selectedLevel === level?.value ? 'currentColor' : 'var(--color-primary)'}
                />
              </div>
              <div>
                <h3 className={`font-semibold text-base md:text-lg mb-1 ${
                  selectedLevel === level?.value ? '' : 'text-foreground'
                }`}>
                  {level?.label}
                </h3>
                <p className={`text-xs md:text-sm ${
                  selectedLevel === level?.value ? 'opacity-90' : 'text-muted-foreground'
                }`}>
                  {level?.description}
                </p>
              </div>
            </div>
            {selectedLevel === level?.value && (
              <div className="absolute top-2 right-2">
                <Icon name="CheckCircle" size={20} />
              </div>
            )}
          </button>
        ))}
      </div>
      {error && (
        <p className="text-error text-sm mt-3 flex items-center gap-2">
          <Icon name="AlertCircle" size={16} />
          {error}
        </p>
      )}
    </div>
  );
};

export default UrgencyLevelSelector;