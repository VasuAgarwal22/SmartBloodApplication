import React from 'react';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';

const FilterControls = ({ filters, onFilterChange }) => {
  const urgencyOptions = [
    { value: 'all', label: 'All Urgency Levels' },
    { value: 'Critical', label: 'Critical' },
    { value: 'High', label: 'High' },
    { value: 'Normal', label: 'Normal' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Processing', label: 'Processing' },
    { value: 'Fulfilled', label: 'Fulfilled' },
    { value: 'Cancelled', label: 'Cancelled' }
  ];

  const bloodGroupOptions = [
    { value: 'all', label: 'All Blood Groups' },
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
    <div className="bg-card border border-border rounded-xl p-4 md:p-6 shadow-elevation-sm">
      <div className="flex items-center gap-2 mb-4">
        <Icon name="Filter" size={20} className="text-primary" />
        <h3 className="text-base md:text-lg font-semibold">Filter Queue</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Select
          label="Urgency Level"
          options={urgencyOptions}
          value={filters?.urgency}
          onChange={(value) => onFilterChange('urgency', value)}
        />

        <Select
          label="Status"
          options={statusOptions}
          value={filters?.status}
          onChange={(value) => onFilterChange('status', value)}
        />

        <Select
          label="Blood Group"
          options={bloodGroupOptions}
          value={filters?.bloodGroup}
          onChange={(value) => onFilterChange('bloodGroup', value)}
        />

        <Input
          label="Search"
          type="search"
          placeholder="Patient name or ID..."
          value={filters?.search}
          onChange={(e) => onFilterChange('search', e?.target?.value)}
        />
      </div>
      {(filters?.urgency !== 'all' || filters?.status !== 'all' || filters?.bloodGroup !== 'all' || filters?.search) && (
        <div className="mt-4 flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            Active filters applied
          </p>
          <button
            onClick={() => onFilterChange('reset')}
            className="text-sm text-primary hover:underline font-medium"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};

export default FilterControls;