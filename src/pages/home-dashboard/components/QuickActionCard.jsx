import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const QuickActionCard = ({ title, description, icon, route, variant = 'default', iconColor }) => {
  const navigate = useNavigate();

  const variantStyles = {
    default: 'bg-card hover:bg-primary/5 border-border',
    emergency: 'bg-error/10 hover:bg-error/20 border-error/30',
    success: 'bg-success/10 hover:bg-success/20 border-success/30',
    warning: 'bg-warning/10 hover:bg-warning/20 border-warning/30'
  };

  const iconBgStyles = {
    default: 'bg-primary/10',
    emergency: 'bg-error/20',
    success: 'bg-success/20',
    warning: 'bg-warning/20'
  };

  return (
    <button
      onClick={() => navigate(route)}
      className={`w-full p-6 md:p-8 rounded-xl border-2 transition-all duration-250 hover:shadow-elevation-md hover:scale-[1.02] active:scale-[0.98] text-left ${variantStyles?.[variant]}`}
    >
      <div className="flex flex-col items-center text-center gap-4">
        <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center ${iconBgStyles?.[variant]}`}>
          <Icon name={icon} size={32} color={iconColor || 'var(--color-primary)'} />
        </div>
        <div>
          <h3 className="text-lg md:text-xl font-semibold mb-2">{title}</h3>
          <p className="text-sm md:text-base text-muted-foreground">{description}</p>
        </div>
      </div>
    </button>
  );
};

export default QuickActionCard;