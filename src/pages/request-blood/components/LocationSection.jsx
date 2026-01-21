import React from 'react';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const LocationSection = ({ formData, errors, onChange }) => {
  return (
    <div className="bg-card border border-border rounded-xl p-4 md:p-6 lg:p-8 shadow-elevation-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <span className="text-primary font-semibold text-lg">4</span>
        </div>
        <h2 className="text-xl md:text-2xl font-semibold">Delivery Location</h2>
      </div>
      <div className="grid grid-cols-1 gap-4 md:gap-6">
        <Input
          label="Hospital/Facility Name"
          type="text"
          placeholder="Enter facility name"
          required
          value={formData?.facilityName}
          onChange={(e) => onChange('facilityName', e?.target?.value)}
          error={errors?.facilityName}
          className="w-full"
        />

        <Input
          label="Street Address"
          type="text"
          placeholder="Enter street address"
          required
          value={formData?.address}
          onChange={(e) => onChange('address', e?.target?.value)}
          error={errors?.address}
          className="w-full"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="City"
            type="text"
            placeholder="City"
            required
            value={formData?.city}
            onChange={(e) => onChange('city', e?.target?.value)}
            error={errors?.city}
            className="w-full"
          />

          <Input
            label="State"
            type="text"
            placeholder="State"
            required
            value={formData?.state}
            onChange={(e) => onChange('state', e?.target?.value)}
            error={errors?.state}
            className="w-full"
          />

          <Input
            label="ZIP Code"
            type="text"
            placeholder="00000"
            required
            value={formData?.zipCode}
            onChange={(e) => onChange('zipCode', e?.target?.value)}
            error={errors?.zipCode}
            className="w-full"
          />
        </div>

        <div className="bg-muted rounded-lg p-4 flex items-start gap-3">
          <Icon name="MapPin" size={20} className="text-primary flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium mb-1">Location Optimization</p>
            <p className="text-xs text-muted-foreground">
             “Accurate location data enables us to calculate the fastest delivery routes and provide reliable estimated arrival times.”
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationSection;