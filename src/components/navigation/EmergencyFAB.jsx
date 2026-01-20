import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const EmergencyFAB = ({ onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate('/request-blood');
    }
  };

  return (
    <button
      className="emergency-fab"
      onClick={handleClick}
      aria-label="Emergency blood request"
    >
      <Icon name="Droplet" size={24} />
    </button>
  );
};

export default EmergencyFAB;