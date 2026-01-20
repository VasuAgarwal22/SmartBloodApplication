import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const PatientInfoSection = ({ formData, errors, onChange }) => {
  const bloodGroupOptions = [
    { value: 'A+', label: 'A+' },
    { value: 'A-', label: 'A-' },
    { value: 'B+', label: 'B+' },
    { value: 'B-', label: 'B-' },
    { value: 'AB+', label: 'AB+' },
    { value: 'AB-', label: 'AB-' },
    { value: 'O+', label: 'O+' },
    { value: 'O-', label: 'O-' }
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-4 md:p-6 lg:p-8 shadow-elevation-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <span className="text-primary font-semibold text-lg">1</span>
        </div>
        <h2 className="text-xl md:text-2xl font-semibold">Patient Information</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <Input
          label="Patient Full Name"
          type="text"
          placeholder="Enter patient's full name"
          required
          value={formData?.patientName}
          onChange={(e) => onChange('patientName', e?.target?.value)}
          error={errors?.patientName}
          className="w-full"
        />

        <Select
          label="Blood Group Required"
          placeholder="Select blood group"
          required
          options={bloodGroupOptions}
          value={formData?.bloodGroup}
          onChange={(value) => onChange('bloodGroup', value)}
          error={errors?.bloodGroup}
        />

        <Input
          label="Quantity (Units)"
          type="number"
          placeholder="Enter units needed"
          required
          min="1"
          max="10"
          value={formData?.quantity}
          onChange={(e) => onChange('quantity', e?.target?.value)}
          error={errors?.quantity}
          description="Maximum 10 units per request"
          className="w-full"
        />

        <Input
          label="Patient Contact Number"
          type="tel"
          placeholder="+1 (555) 000-0000"
          required
          value={formData?.patientContact}
          onChange={(e) => onChange('patientContact', e?.target?.value)}
          error={errors?.patientContact}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default PatientInfoSection;