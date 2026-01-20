import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const RequesterDetailsSection = ({ formData, errors, onChange }) => {
  const requesterTypeOptions = [
    { value: 'hospital', label: 'Hospital' },
    { value: 'doctor', label: 'Doctor' },
    { value: 'individual', label: 'Individual/Family' }
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-4 md:p-6 lg:p-8 shadow-elevation-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <span className="text-primary font-semibold text-lg">3</span>
        </div>
        <h2 className="text-xl md:text-2xl font-semibold">Requester Details</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <Select
          label="Requester Type"
          placeholder="Select requester type"
          required
          options={requesterTypeOptions}
          value={formData?.requesterType}
          onChange={(value) => onChange('requesterType', value)}
          error={errors?.requesterType}
        />

        <Input
          label="Requester Name"
          type="text"
          placeholder="Enter your full name"
          required
          value={formData?.requesterName}
          onChange={(e) => onChange('requesterName', e?.target?.value)}
          error={errors?.requesterName}
          className="w-full"
        />

        {formData?.requesterType === 'hospital' && (
          <Input
            label="Hospital Verification ID"
            type="text"
            placeholder="Enter hospital ID (e.g., HOSP-2026-001)"
            required
            value={formData?.verificationId}
            onChange={(e) => onChange('verificationId', e?.target?.value)}
            error={errors?.verificationId}
            description="Format: HOSP-YYYY-XXX"
            className="w-full"
          />
        )}

        {formData?.requesterType === 'doctor' && (
          <Input
            label="Medical License Number"
            type="text"
            placeholder="Enter license number"
            required
            value={formData?.verificationId}
            onChange={(e) => onChange('verificationId', e?.target?.value)}
            error={errors?.verificationId}
            className="w-full"
          />
        )}

        <Input
          label="Contact Number"
          type="tel"
          placeholder="+1 (555) 000-0000"
          required
          value={formData?.requesterContact}
          onChange={(e) => onChange('requesterContact', e?.target?.value)}
          error={errors?.requesterContact}
          className="w-full"
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="requester@example.com"
          required
          value={formData?.requesterEmail}
          onChange={(e) => onChange('requesterEmail', e?.target?.value)}
          error={errors?.requesterEmail}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default RequesterDetailsSection;