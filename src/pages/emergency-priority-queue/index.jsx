import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/navigation/Header';
import EmergencyStatusBanner from '../../components/navigation/EmergencyStatusBanner';
import EmergencyFAB from '../../components/navigation/EmergencyFAB';
import NotificationToast from '../../components/navigation/NotificationToast';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import PriorityQueueCard from './components/PriorityQueueCard';
import QueueStatistics from './components/QueueStatistics';
import EmergencyOverridePanel from './components/EmergencyOverridePanel';
import RequestDetailsModal from './components/RequestDetailsModal';
import FilterControls from './components/FilterControls';

const EmergencyPriorityQueue = () => {
  const [requests, setRequests] = useState([
    {
      id: "REQ-2026-001",
      patientName: "Sarah Johnson",
      bloodGroup: "O-",
      quantity: 4,
      urgencyLevel: "Critical",
      requesterType: "Hospital",
      hospitalName: "City General Hospital",
      verificationId: "HVR-2026-789",
      verified: true,
      status: "Pending",
      location: "123 Emergency Drive, Downtown Medical District",
      contactNumber: "+1 (555) 123-4567",
      estimatedTime: "15 mins",
      distance: "2.3 km",
      routeInfo: "Via Highway 101 North",
      timestamp: new Date(Date.now() - 300000)?.toISOString(),
      priorityScore: 98,
      queuePosition: 1,
      waitTime: "5 mins",
      timeline: [
        { status: "Request Submitted", timestamp: new Date(Date.now() - 300000)?.toLocaleString(), completed: true, note: "Emergency request received" },
        { status: "Verification Complete", timestamp: new Date(Date.now() - 240000)?.toLocaleString(), completed: true, note: "Hospital credentials verified" },
        { status: "Blood Allocation", timestamp: "In Progress", completed: false },
        { status: "Dispatch", timestamp: "Pending", completed: false },
        { status: "Delivery", timestamp: "Pending", completed: false }
      ]
    },
    {
      id: "REQ-2026-002",
      patientName: "Michael Chen",
      bloodGroup: "AB+",
      quantity: 2,
      urgencyLevel: "Critical",
      requesterType: "Hospital",
      hospitalName: "Memorial Medical Center",
      verificationId: "HVR-2026-456",
      verified: true,
      status: "Processing",
      location: "456 Healthcare Boulevard, Westside Medical Complex",
      contactNumber: "+1 (555) 234-5678",
      estimatedTime: "20 mins",
      distance: "3.7 km",
      routeInfo: "Via Central Avenue",
      timestamp: new Date(Date.now() - 600000)?.toISOString(),
      priorityScore: 95,
      queuePosition: 2,
      waitTime: "10 mins",
      timeline: [
        { status: "Request Submitted", timestamp: new Date(Date.now() - 600000)?.toLocaleString(), completed: true, note: "Emergency request received" },
        { status: "Verification Complete", timestamp: new Date(Date.now() - 540000)?.toLocaleString(), completed: true, note: "Hospital credentials verified" },
        { status: "Blood Allocation", timestamp: new Date(Date.now() - 180000)?.toLocaleString(), completed: true, note: "2 units allocated from Central Bank" },
        { status: "Dispatch", timestamp: "In Progress", completed: false },
        { status: "Delivery", timestamp: "Pending", completed: false }
      ]
    },
    {
      id: "REQ-2026-003",
      patientName: "Emily Rodriguez",
      bloodGroup: "B+",
      quantity: 3,
      urgencyLevel: "High",
      requesterType: "Hospital",
      hospitalName: "St. Mary\'s Hospital",
      verificationId: "HVR-2026-123",
      verified: true,
      status: "Pending",
      location: "789 Medical Plaza, Northside Healthcare District",
      contactNumber: "+1 (555) 345-6789",
      estimatedTime: "25 mins",
      distance: "4.2 km",
      routeInfo: "Via Park Street",
      timestamp: new Date(Date.now() - 900000)?.toISOString(),
      priorityScore: 87,
      queuePosition: 3,
      waitTime: "15 mins",
      timeline: [
        { status: "Request Submitted", timestamp: new Date(Date.now() - 900000)?.toLocaleString(), completed: true, note: "High priority request received" },
        { status: "Verification Complete", timestamp: new Date(Date.now() - 840000)?.toLocaleString(), completed: true, note: "Hospital credentials verified" },
        { status: "Blood Allocation", timestamp: "Pending", completed: false },
        { status: "Dispatch", timestamp: "Pending", completed: false },
        { status: "Delivery", timestamp: "Pending", completed: false }
      ]
    },
    {
      id: "REQ-2026-004",
      patientName: "David Thompson",
      bloodGroup: "A+",
      quantity: 2,
      urgencyLevel: "High",
      requesterType: "Doctor",
      hospitalName: "Community Health Clinic",
      verificationId: "DVR-2026-567",
      verified: true,
      status: "Pending",
      location: "321 Wellness Avenue, Eastside Medical Center",
      contactNumber: "+1 (555) 456-7890",
      estimatedTime: "30 mins",
      distance: "5.1 km",
      routeInfo: "Via Main Street",
      timestamp: new Date(Date.now() - 1200000)?.toISOString(),
      priorityScore: 82,
      queuePosition: 4,
      waitTime: "20 mins",
      timeline: [
        { status: "Request Submitted", timestamp: new Date(Date.now() - 1200000)?.toLocaleString(), completed: true, note: "High priority request received" },
        { status: "Verification Complete", timestamp: new Date(Date.now() - 1140000)?.toLocaleString(), completed: true, note: "Doctor credentials verified" },
        { status: "Blood Allocation", timestamp: "Pending", completed: false },
        { status: "Dispatch", timestamp: "Pending", completed: false },
        { status: "Delivery", timestamp: "Pending", completed: false }
      ]
    },
    {
      id: "REQ-2026-005",
      patientName: "Lisa Anderson",
      bloodGroup: "O+",
      quantity: 1,
      urgencyLevel: "Normal",
      requesterType: "Hospital",
      hospitalName: "Regional Medical Center",
      verificationId: "HVR-2026-890",
      verified: true,
      status: "Pending",
      location: "654 Hospital Road, Southside Medical District",
      contactNumber: "+1 (555) 567-8901",
      estimatedTime: "35 mins",
      distance: "6.8 km",
      routeInfo: "Via River Road",
      timestamp: new Date(Date.now() - 1800000)?.toISOString(),
      priorityScore: 65,
      queuePosition: 5,
      waitTime: "30 mins",
      timeline: [
        { status: "Request Submitted", timestamp: new Date(Date.now() - 1800000)?.toLocaleString(), completed: true, note: "Standard request received" },
        { status: "Verification Complete", timestamp: new Date(Date.now() - 1740000)?.toLocaleString(), completed: true, note: "Hospital credentials verified" },
        { status: "Blood Allocation", timestamp: "Pending", completed: false },
        { status: "Dispatch", timestamp: "Pending", completed: false },
        { status: "Delivery", timestamp: "Pending", completed: false }
      ]
    },
    {
      id: "REQ-2026-006",
      patientName: "James Wilson",
      bloodGroup: "A-",
      quantity: 2,
      urgencyLevel: "Normal",
      requesterType: "Doctor",
      hospitalName: "Family Health Center",
      verificationId: "DVR-2026-234",
      verified: false,
      status: "Pending",
      location: "987 Care Street, Central Medical Plaza",
      contactNumber: "+1 (555) 678-9012",
      estimatedTime: "40 mins",
      distance: "7.5 km",
      routeInfo: "Via Oak Avenue",
      timestamp: new Date(Date.now() - 2400000)?.toISOString(),
      priorityScore: 58,
      queuePosition: 6,
      waitTime: "40 mins",
      timeline: [
        { status: "Request Submitted", timestamp: new Date(Date.now() - 2400000)?.toLocaleString(), completed: true, note: "Standard request received" },
        { status: "Verification Complete", timestamp: "Pending", completed: false, note: "Awaiting credential verification" },
        { status: "Blood Allocation", timestamp: "Pending", completed: false },
        { status: "Dispatch", timestamp: "Pending", completed: false },
        { status: "Delivery", timestamp: "Pending", completed: false }
      ]
    }
  ]);

  const [filters, setFilters] = useState({
    urgency: 'all',
    status: 'all',
    bloodGroup: 'all',
    search: ''
  });

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showOverridePanel, setShowOverridePanel] = useState(false);
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      severity: 'critical',
      title: 'Critical Blood Request',
      message: '2 O- emergency requests in queue - immediate attention required',
      actionLabel: 'View Queue',
      onAction: () => {},
      dismissed: false
    }
  ]);
  const [notifications, setNotifications] = useState([]);

  const stats = {
    totalRequests: requests?.length,
    emergencyCases: requests?.filter(r => r?.urgencyLevel === 'Critical')?.length,
    avgProcessingTime: '18 mins',
    algorithmEfficiency: 94,
    requestTrend: 12,
    emergencyTrend: 8,
    timeTrend: -5,
    efficiencyTrend: 3
  };

  const filteredRequests = requests?.filter(request => {
    if (filters?.urgency !== 'all' && request?.urgencyLevel !== filters?.urgency) return false;
    if (filters?.status !== 'all' && request?.status !== filters?.status) return false;
    if (filters?.bloodGroup !== 'all' && request?.bloodGroup !== filters?.bloodGroup) return false;
    if (filters?.search && !request?.patientName?.toLowerCase()?.includes(filters?.search?.toLowerCase()) && !request?.id?.toLowerCase()?.includes(filters?.search?.toLowerCase())) return false;
    return true;
  });

  const handleFilterChange = (key, value) => {
    if (key === 'reset') {
      setFilters({
        urgency: 'all',
        status: 'all',
        bloodGroup: 'all',
        search: ''
      });
    } else {
      setFilters(prev => ({ ...prev, [key]: value }));
    }
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  const handleUpdateStatus = (requestId, newStatus) => {
    setRequests(prev => prev?.map(req => 
      req?.id === requestId ? { ...req, status: newStatus } : req
    ));

    const request = requests?.find(r => r?.id === requestId);
    setNotifications(prev => [...prev, {
      id: Date.now(),
      type: 'success',
      title: 'Status Updated',
      message: `Request ${requestId} status changed to ${newStatus}`,
      timestamp: new Date()?.toISOString()
    }]);
  };

  const handleEmergencyOverride = (overrideData) => {
    setNotifications(prev => [...prev, {
      id: Date.now(),
      type: 'warning',
      title: 'Emergency Override Activated',
      message: `Override authorized by ${overrideData?.verificationId}`,
      timestamp: new Date()?.toISOString()
    }]);
    setShowOverridePanel(false);
  };

  const handleDismissNotification = (id) => {
    setNotifications(prev => prev?.filter(n => n?.id !== id));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setRequests(prev => prev?.map(req => ({
        ...req,
        waitTime: calculateWaitTime(req?.timestamp)
      })));
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const calculateWaitTime = (timestamp) => {
    const diff = Date.now() - new Date(timestamp)?.getTime();
    const minutes = Math.floor(diff / 60000);
    return `${minutes} mins`;
  };

  return (
    <>
      <Helmet>
        <title>Live Emergency Requests - SmartBloodApplication</title>
        <meta name="description" content="Real-time blood request emergency queue with max-heap algorithm ordering for critical emergency allocation" />
      </Helmet>
      <Header />
      <EmergencyStatusBanner alerts={alerts} />
      <EmergencyFAB />
      <NotificationToast notifications={notifications} onDismiss={handleDismissNotification} />
      <main className="content-main bg-background">
        <div className="max-w-screen-2xl mx-auto">
          {/* Page Header */}
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">Live Emergency Requests</h1>
                <p className="text-sm md:text-base text-muted-foreground">
                 “Real-time blood request prioritization based on urgency and availability.”
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  iconName="RefreshCw"
                  iconPosition="left"
                  onClick={() => {
                    setNotifications(prev => [...prev, {
                      id: Date.now(),
                      type: 'success',
                      title: 'Queue Refreshed',
                      message: 'Emergency queue updated with latest requests',
                      timestamp: new Date()?.toISOString()
                    }]);
                  }}
                >
                  Refresh Queue
                </Button>
                <Button
                  variant="destructive"
                  iconName="ShieldAlert"
                  iconPosition="left"
                  onClick={() => setShowOverridePanel(true)}
                >
                  Emergency Override
                </Button>
              </div>
            </div>

            {/* Algorithm Info Banner */}
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl">
              <div className="flex items-start gap-3">
                <Icon name="Cpu" size={24} className="text-primary flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-sm md:text-base font-semibold text-primary mb-1">Urgent Request Processing Active</h3>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    {/* Requests are automatically ordered by priority score calculated from urgency level (Critical &gt; High &gt; Normal), wait time, verification status, and quantity. Queue positions update in real-time as new requests arrive or statuses change. */}
                    “Requests are automatically prioritized based on urgency, waiting time, verification status, and required quantity. The order updates in real time as new requests are received or statuses change.”
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="mb-6 md:mb-8">
            <QueueStatistics stats={stats} />
          </div>

          {/* Filters */}
          <div className="mb-6 md:mb-8">
            <FilterControls filters={filters} onFilterChange={handleFilterChange} />
          </div>

          {/* Queue List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl md:text-2xl font-semibold">
              Emergency Request List ({filteredRequests?.length} {filteredRequests?.length === 1 ? 'Request' : 'Requests'})
              </h2>
              {filteredRequests?.length > 0 && (
                <p className="text-sm text-muted-foreground caption">
                  Last updated: {new Date()?.toLocaleTimeString()}
                </p>
              )}
            </div>

            {filteredRequests?.length === 0 ? (
              <div className="bg-card border border-border rounded-xl p-8 md:p-12 text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Icon name="ListOrdered" size={32} className="text-muted-foreground" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-2">No Requests Found</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  {filters?.urgency !== 'all' || filters?.status !== 'all' || filters?.bloodGroup !== 'all' || filters?.search ?'No requests match your current filters. Try adjusting your search criteria.' :'The priority queue is currently empty. New emergency requests will appear here automatically.'}
                </p>
                {(filters?.urgency !== 'all' || filters?.status !== 'all' || filters?.bloodGroup !== 'all' || filters?.search) && (
                  <Button
                    variant="outline"
                    onClick={() => handleFilterChange('reset')}
                  >
                    Clear All Filters
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredRequests?.map((request, index) => (
                  <PriorityQueueCard
                    key={request?.id}
                    request={request}
                    rank={index + 1}
                    onViewDetails={handleViewDetails}
                    onUpdateStatus={handleUpdateStatus}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <RequestDetailsModal
        request={selectedRequest}
        isVisible={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
      />
      <EmergencyOverridePanel
        isVisible={showOverridePanel}
        onClose={() => setShowOverridePanel(false)}
        onOverride={handleEmergencyOverride}
      />
    </>
  );
};

export default EmergencyPriorityQueue;