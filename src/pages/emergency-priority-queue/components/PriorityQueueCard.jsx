import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PriorityQueueCard = ({ request, onViewDetails, onUpdateStatus, rank }) => {
  const getUrgencyColor = (level) => {
    switch (level) {
      case 'Critical':
        return 'bg-error/10 border-error text-error';
      case 'High':
        return 'bg-warning/10 border-warning text-warning';
      case 'Normal':
        return 'bg-primary/10 border-primary text-primary';
      default:
        return 'bg-muted border-border text-foreground';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-warning/10 text-warning';
      case 'Processing':
        return 'bg-primary/10 text-primary';
      case 'Fulfilled':
        return 'bg-success/10 text-success';
      case 'Cancelled':
        return 'bg-error/10 text-error';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getVerificationIcon = (verified) => {
    return verified ? 'ShieldCheck' : 'ShieldAlert';
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 md:p-6 shadow-elevation-md hover:shadow-elevation-lg transition-all duration-250">
      <div className="flex flex-col lg:flex-row lg:items-start gap-4">
        {/* Rank Badge */}
        <div className="flex-shrink-0">
          <div className={`w-12 h-12 md:w-16 md:h-16 rounded-xl flex items-center justify-center font-bold text-lg md:text-xl ${getUrgencyColor(request?.urgencyLevel)}`}>
            #{rank}
          </div>
        </div>

        {/* Request Details */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg md:text-xl font-semibold truncate">{request?.patientName}</h3>
                <Icon 
                  name={getVerificationIcon(request?.verified)} 
                  size={20} 
                  className={request?.verified ? 'text-success' : 'text-warning'}
                />
              </div>
              <p className="text-sm text-muted-foreground mb-1">Request ID: <span className="data-text">{request?.id}</span></p>
              <p className="text-sm text-muted-foreground">Submitted: {new Date(request.timestamp)?.toLocaleString()}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getUrgencyColor(request?.urgencyLevel)}`}>
                {request?.urgencyLevel}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(request?.status)}`}>
                {request?.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-error/10 flex items-center justify-center">
                <Icon name="Droplet" size={20} className="text-error" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Blood Group</p>
                <p className="font-semibold data-text">{request?.bloodGroup}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon name="Package" size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Quantity</p>
                <p className="font-semibold data-text">{request?.quantity} units</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                <Icon name="Building2" size={20} className="text-secondary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Requester</p>
                <p className="font-semibold text-sm truncate">{request?.requesterType}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <Icon name="Clock" size={20} className="text-warning" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Est. Time</p>
                <p className="font-semibold data-text">{request?.estimatedTime}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4 p-3 bg-muted/50 rounded-lg">
            <Icon name="MapPin" size={16} className="text-muted-foreground flex-shrink-0" />
            <p className="text-sm text-muted-foreground truncate">{request?.location}</p>
          </div>

          {/* Algorithm Info */}
          <div className="flex items-start gap-2 p-3 bg-primary/5 border border-primary/20 rounded-lg mb-4">
            <Icon name="Cpu" size={16} className="text-primary flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-primary mb-1">Max-Heap Priority Algorithm</p>
              <p className="text-xs text-muted-foreground">Priority Score: <span className="data-text font-semibold">{request?.priorityScore}</span> | Calculated based on urgency level, wait time, and verification status</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              size="sm"
              iconName="Eye"
              iconPosition="left"
              onClick={() => onViewDetails(request)}
              className="flex-1"
            >
              View Details
            </Button>
            {request?.status === 'Pending' && (
              <Button
                variant="default"
                size="sm"
                iconName="CheckCircle"
                iconPosition="left"
                onClick={() => onUpdateStatus(request?.id, 'Processing')}
                className="flex-1"
              >
                Start Processing
              </Button>
            )}
            {request?.status === 'Processing' && (
              <Button
                variant="success"
                size="sm"
                iconName="Check"
                iconPosition="left"
                onClick={() => onUpdateStatus(request?.id, 'Fulfilled')}
                className="flex-1"
              >
                Mark Fulfilled
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriorityQueueCard;