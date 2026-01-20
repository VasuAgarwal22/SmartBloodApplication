import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RequestDetailsModal = ({ request, isVisible, onClose }) => {
  if (!isVisible || !request) return null;

  const getUrgencyColor = (level) => {
    switch (level) {
      case 'Critical':
        return 'text-error';
      case 'High':
        return 'text-warning';
      case 'Normal':
        return 'text-primary';
      default:
        return 'text-foreground';
    }
  };

  const detailSections = [
    {
      title: 'Patient Information',
      icon: 'User',
      items: [
        { label: 'Patient Name', value: request?.patientName },
        { label: 'Blood Group', value: request?.bloodGroup },
        { label: 'Quantity Required', value: `${request?.quantity} units` },
        { label: 'Contact Number', value: request?.contactNumber }
      ]
    },
    {
      title: 'Request Details',
      icon: 'FileText',
      items: [
        { label: 'Request ID', value: request?.id },
        { label: 'Urgency Level', value: request?.urgencyLevel, highlight: true },
        { label: 'Status', value: request?.status },
        { label: 'Submitted', value: new Date(request.timestamp)?.toLocaleString() }
      ]
    },
    {
      title: 'Requester Information',
      icon: 'Building2',
      items: [
        { label: 'Requester Type', value: request?.requesterType },
        { label: 'Hospital/Facility', value: request?.hospitalName },
        { label: 'Verification ID', value: request?.verificationId },
        { label: 'Verified Status', value: request?.verified ? 'Verified' : 'Pending Verification' }
      ]
    },
    {
      title: 'Location & Logistics',
      icon: 'MapPin',
      items: [
        { label: 'Location', value: request?.location },
        { label: 'Estimated Delivery Time', value: request?.estimatedTime },
        { label: 'Distance from Bank', value: request?.distance },
        { label: 'Optimal Route', value: request?.routeInfo }
      ]
    }
  ];

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[1150] flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-xl shadow-elevation-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border p-4 md:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Icon name="FileText" size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-semibold">Request Details</h2>
              <p className="text-xs text-muted-foreground">Complete information and timeline</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors duration-250"
            aria-label="Close details modal"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        <div className="p-4 md:p-6 space-y-6">
          {/* Priority Algorithm Info */}
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex items-start gap-3">
              <Icon name="Cpu" size={20} className="text-primary flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-primary mb-2">Max-Heap Priority Calculation</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Priority Score</p>
                    <p className="text-lg font-bold data-text text-primary">{request?.priorityScore}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Queue Position</p>
                    <p className="text-lg font-bold data-text">#{request?.queuePosition}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Wait Time</p>
                    <p className="text-lg font-bold data-text">{request?.waitTime}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detail Sections */}
          {detailSections?.map((section, sectionIndex) => (
            <div key={sectionIndex} className="space-y-3">
              <div className="flex items-center gap-2">
                <Icon name={section?.icon} size={18} className="text-primary" />
                <h3 className="text-base font-semibold">{section?.title}</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {section?.items?.map((item, itemIndex) => (
                  <div key={itemIndex} className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">{item?.label}</p>
                    <p className={`text-sm font-semibold ${item?.highlight ? getUrgencyColor(item?.value) : ''}`}>
                      {item?.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Timeline */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Icon name="Clock" size={18} className="text-primary" />
              <h3 className="text-base font-semibold">Request Timeline</h3>
            </div>
            <div className="space-y-3">
              {request?.timeline?.map((event, index) => (
                <div key={index} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      event?.completed ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'
                    }`}>
                      <Icon name={event?.completed ? 'Check' : 'Clock'} size={16} />
                    </div>
                    {index < request?.timeline?.length - 1 && (
                      <div className={`w-0.5 h-12 ${event?.completed ? 'bg-success' : 'bg-border'}`} />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="text-sm font-semibold mb-1">{event?.status}</p>
                    <p className="text-xs text-muted-foreground">{event?.timestamp}</p>
                    {event?.note && (
                      <p className="text-xs text-muted-foreground mt-1">{event?.note}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Close
            </Button>
            <Button
              variant="default"
              iconName="Printer"
              iconPosition="left"
              className="flex-1"
            >
              Print Details
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestDetailsModal;