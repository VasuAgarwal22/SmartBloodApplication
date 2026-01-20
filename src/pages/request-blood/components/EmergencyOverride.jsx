import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const EmergencyOverride = ({ onOverride, isVisible }) => {
  const [overrideCode, setOverrideCode] = useState('');
  const [error, setError] = useState('');

  if (!isVisible) return null;

  const handleOverride = () => {
    if (overrideCode === 'EMERG-2026-OVERRIDE') {
      onOverride(true);
      setError('');
    } else {
      setError('Invalid emergency override code');
    }
  };

  return (
    <div className="bg-error/10 border-2 border-error rounded-xl p-4 md:p-6">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-error flex items-center justify-center flex-shrink-0">
          <Icon name="ShieldAlert" size={20} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-error text-lg mb-1">Emergency Override</h3>
          <p className="text-sm text-muted-foreground">
            For verified hospitals only. This will bypass standard validation and prioritize your request.
          </p>
        </div>
      </div>
      <div className="space-y-4">
        <Input
          label="Emergency Override Code"
          type="password"
          placeholder="Enter override code"
          value={overrideCode}
          onChange={(e) => setOverrideCode(e?.target?.value)}
          error={error}
          className="w-full"
        />

        <Button
          variant="destructive"
          onClick={handleOverride}
          iconName="ShieldCheck"
          iconPosition="left"
          fullWidth
        >
          Activate Emergency Override
        </Button>

        <div className="bg-muted rounded-lg p-3">
          <p className="text-xs text-muted-foreground">
            <strong>Mock Override Code:</strong> EMERG-2026-OVERRIDE
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmergencyOverride;