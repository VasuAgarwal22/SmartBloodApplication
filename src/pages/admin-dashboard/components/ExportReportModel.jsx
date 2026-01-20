import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const ExportReportModal = ({ isOpen, onClose, onExport }) => {
  const [selectedSections, setSelectedSections] = useState({
    metrics: true,
    inventory: true,
    suspicious: true,
    operational: true,
    alerts: true,
    scalability: true
  });

  const [exportFormat, setExportFormat] = useState('pdf');
  const [dateRange, setDateRange] = useState('last30days');

  if (!isOpen) return null;

  const handleSectionToggle = (section) => {
    setSelectedSections(prev => ({
      ...prev,
      [section]: !prev?.[section]
    }));
  };

  const handleExport = () => {
    onExport({
      sections: selectedSections,
      format: exportFormat,
      dateRange: dateRange
    });
    onClose();
  };

  const sections = [
    { id: 'metrics', label: 'Key Performance Metrics', icon: 'BarChart3' },
    { id: 'inventory', label: 'Inventory Health Report', icon: 'Package' },
    { id: 'suspicious', label: 'Suspicious Activity Log', icon: 'AlertTriangle' },
    { id: 'operational', label: 'Operational Metrics', icon: 'Activity' },
    { id: 'alerts', label: 'System Alerts History', icon: 'Bell' },
    { id: 'scalability', label: 'Scalability Analysis', icon: 'TrendingUp' }
  ];

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[1200] flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-xl shadow-elevation-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border p-4 md:p-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl md:text-2xl font-semibold mb-1">Export Report</h2>
            <p className="text-sm text-muted-foreground">Generate comprehensive system report</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-smooth"
            aria-label="Close modal"
          >
            <Icon name="X" size={24} />
          </button>
        </div>

        <div className="p-4 md:p-6 space-y-6">
          <div>
            <h3 className="font-semibold mb-4">Select Report Sections</h3>
            <div className="space-y-3">
              {sections?.map((section) => (
                <div key={section?.id} className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-muted/50 transition-smooth">
                  <Checkbox
                    checked={selectedSections?.[section?.id]}
                    onChange={() => handleSectionToggle(section?.id)}
                  />
                  <Icon name={section?.icon} size={20} className="text-primary" />
                  <span className="text-sm font-medium">{section?.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Export Format</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {['pdf', 'excel', 'csv']?.map((format) => (
                <button
                  key={format}
                  onClick={() => setExportFormat(format)}
                  className={`p-4 border rounded-lg text-center transition-smooth ${
                    exportFormat === format
                      ? 'border-primary bg-primary/10' :'border-border hover:bg-muted'
                  }`}
                >
                  <Icon 
                    name={format === 'pdf' ? 'FileText' : format === 'excel' ? 'Sheet' : 'File'} 
                    size={24} 
                    className="mx-auto mb-2"
                    color={exportFormat === format ? 'var(--color-primary)' : 'currentColor'}
                  />
                  <span className="text-sm font-medium uppercase">{format}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Date Range</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { value: 'last7days', label: 'Last 7 Days' },
                { value: 'last30days', label: 'Last 30 Days' },
                { value: 'last90days', label: 'Last 90 Days' },
                { value: 'custom', label: 'Custom Range' }
              ]?.map((range) => (
                <button
                  key={range?.value}
                  onClick={() => setDateRange(range?.value)}
                  className={`p-3 border rounded-lg text-sm font-medium transition-smooth ${
                    dateRange === range?.value
                      ? 'border-primary bg-primary/10 text-primary' :'border-border hover:bg-muted'
                  }`}
                >
                  {range?.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-card border-t border-border p-4 md:p-6 flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            fullWidth
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            fullWidth
            iconName="Download"
            iconPosition="left"
            onClick={handleExport}
          >
            Export Report
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExportReportModal;