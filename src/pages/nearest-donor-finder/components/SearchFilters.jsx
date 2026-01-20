import React from 'react';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const SearchFilters = ({ 
  bloodGroup, 
  setBloodGroup, 
  location, 
  setLocation, 
  onSearch, 
  onDetectLocation,
  isDetecting 
}) => {
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
    <div className="bg-card border border-border rounded-xl p-4 md:p-6 shadow-elevation-md">
      <div className="flex items-center gap-3 mb-4 md:mb-6">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon name="Search" size={20} color="var(--color-primary)" />
        </div>
        <div>
          <h2 className="text-lg md:text-xl font-semibold">Find Nearest Donors</h2>
          <p className="text-xs md:text-sm text-muted-foreground">Search using graph + Dijkstra algorithm</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Select
          label="Blood Group Required"
          placeholder="Select blood group"
          options={bloodGroupOptions}
          value={bloodGroup}
          onChange={setBloodGroup}
          required
        />

        <div className="space-y-2">
          <Input
            label="Location"
            type="text"
            placeholder="Enter city or address"
            value={location}
            onChange={(e) => setLocation(e?.target?.value)}
            required
          />
          <Button
            variant="outline"
            size="sm"
            fullWidth
            iconName="MapPin"
            iconPosition="left"
            onClick={onDetectLocation}
            loading={isDetecting}
            disabled={isDetecting}
          >
            {isDetecting ? 'Detecting...' : 'Detect My Location'}
          </Button>
        </div>
      </div>
      <div className="mt-4 md:mt-6">
        <Button
          variant="default"
          fullWidth
          iconName="Search"
          iconPosition="left"
          onClick={onSearch}
          disabled={!bloodGroup || !location}
        >
          Search Optimal Routes
        </Button>
      </div>
    </div>
  );
};

export default SearchFilters;