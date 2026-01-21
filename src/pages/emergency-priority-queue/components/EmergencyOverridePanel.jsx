import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const EmergencyOverridePanel = ({ onOverride, isVisible, onClose }) => {
  const [verificationId, setVerificationId] = useState('');
  const [reason, setReason] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e?.preventDefault();
    const newErrors = {};

    if (!verificationId?.trim()) {
      newErrors.verificationId = 'Hospital verification ID is required';
    }

    if (!reason?.trim()) {
      newErrors.reason = 'Override reason is required';
    }

    if (Object.keys(newErrors)?.length > 0) {
      setErrors(newErrors);
      return;
    }

    onOverride({ verificationId, reason, timestamp: new Date()?.toISOString() });
    setVerificationId('');
    setReason('');
    setErrors({});
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[1150] flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-xl shadow-elevation-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border p-4 md:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-error/10 flex items-center justify-center">
              <Icon name="ShieldAlert" size={20} className="text-error" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-semibold">Emergency Override</h2>
              <p className="text-xs text-muted-foreground">Authorized personnel only</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors duration-250"
            aria-label="Close override panel"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4">
          <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
            <div className="flex items-start gap-3">
              <Icon name="AlertTriangle" size={20} className="text-warning flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-warning mb-1">Critical Action Warning</p>
                <p className="text-xs text-muted-foreground">
                  Emergency overrides bypass normal emergency queue ordering. This action will be logged and audited. Use only for life-threatening situations.
                </p>
              </div>
            </div>
          </div>

          <Input
            label="Hospital Verification ID"
            type="text"
            placeholder="Enter verification ID"
            value={verificationId}
            onChange={(e) => setVerificationId(e?.target?.value)}
            error={errors?.verificationId}
            required
            description="Your authorized hospital identification number"
          />

          <div>
            <label className="block text-sm font-medium mb-2">Override Reason</label>
            <textarea
              className="w-full px-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm resize-none"
              rows="4"
              placeholder="Provide detailed justification for emergency override..."
              value={reason}
              onChange={(e) => setReason(e?.target?.value)}
              required
            />
            {errors?.reason && (
              <p className="text-xs text-error mt-1">{errors?.reason}</p>
            )}
          </div>

          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Info" size={16} className="text-muted-foreground" />
              <p className="text-xs font-semibold">Audit Trail Information</p>
            </div>
            <ul className="text-xs text-muted-foreground space-y-1 ml-6">
              <li>• Timestamp: {new Date()?.toLocaleString()}</li>
              <li>• Action will be logged for compliance review</li>
              <li>• Supervisor notification will be triggered</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="destructive"
              iconName="ShieldCheck"
              iconPosition="left"
              className="flex-1"
            >
              Confirm Override
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmergencyOverridePanel;