import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SuspiciousRequestPanel = ({ requests, onInvestigate, onResolve }) => {
  const [selectedRequest, setSelectedRequest] = useState(null);

  const getSeverityColor = (severity) => {
    if (severity === 'high') return 'text-error';
    if (severity === 'medium') return 'text-warning';
    return 'text-muted-foreground';
  };

  const getSeverityBg = (severity) => {
    if (severity === 'high') return 'bg-error/10';
    if (severity === 'medium') return 'bg-warning/10';
    return 'bg-muted';
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 md:p-6 shadow-elevation-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg md:text-xl font-semibold mb-2">Suspicious Request Monitoring</h3>
          <p className="text-sm text-muted-foreground">Flagged activities requiring review</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-error/10 rounded-lg">
          <Icon name="AlertTriangle" size={18} color="#DC2626" />
          <span className="text-sm font-semibold text-error">{requests?.length} Pending</span>
        </div>
      </div>
      <div className="space-y-3">
        {requests?.map((request) => (
          <div 
            key={request?.id}
            className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-smooth"
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold truncate">{request?.requesterName}</h4>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${getSeverityBg(request?.severity)} ${getSeverityColor(request?.severity)}`}>
                    {request?.severity?.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{request?.reason}</p>
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Icon name="Droplet" size={14} />
                    {request?.bloodGroup}
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon name="Package" size={14} />
                    {request?.quantity} units
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon name="Clock" size={14} />
                    {request?.timestamp}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                iconName="Search"
                iconPosition="left"
                onClick={() => onInvestigate(request?.id)}
              >
                Investigate
              </Button>
              <Button
                variant="success"
                size="sm"
                iconName="CheckCircle"
                iconPosition="left"
                onClick={() => onResolve(request?.id, 'approved')}
              >
                Approve
              </Button>
              <Button
                variant="danger"
                size="sm"
                iconName="XCircle"
                iconPosition="left"
                onClick={() => onResolve(request?.id, 'rejected')}
              >
                Reject
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuspiciousRequestPanel;