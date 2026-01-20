import React from 'react';
import Icon from '../../../components/AppIcon';

const ValidationWarning = ({ warnings }) => {
  if (!warnings || warnings?.length === 0) return null;

  return (
    <div className="bg-warning/10 border border-warning rounded-xl p-4 md:p-6">
      <div className="flex items-start gap-3">
        <Icon name="AlertTriangle" size={20} className="text-warning flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-warning mb-2">Validation Warnings</h4>
          <ul className="space-y-2">
            {warnings?.map((warning, index) => (
              <li key={index} className="text-sm text-foreground flex items-start gap-2">
                <span className="text-warning mt-0.5">•</span>
                <span>{warning}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ValidationWarning;