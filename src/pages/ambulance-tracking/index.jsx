import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/navigation/Header';
import EmergencyStatusBanner from '../../components/navigation/EmergencyStatusBanner';
import EmergencyFAB from '../../components/navigation/EmergencyFAB';
import NotificationToast from '../../components/navigation/NotificationToast';
import LoadingOverlay from '../../components/navigation/LoadingOverlay';
import EmergencyRequestButton from './components/EmergencyRequestButton';
import StatusTracker from './components/StatusTracker';
import ActiveAmbulanceCard from './components/ActiveAmbulanceCard';
import MapIntegration from './components/MapIntegration';
import RecentActivityPanel from './components/RecentActivityPanel';
import ServiceMetrics from './components/ServiceMetrics';
import EmergencyEscalation from './components/EmergencyEscalation';

const AmbulanceTracking = () => {
  const [isRequesting, setIsRequesting] = useState(false);
  const [currentStatus, setCurrentStatus] = useState('searching');
  const [activeAmbulance, setActiveAmbulance] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const mockMetrics = {
    avgResponseTime: "9.5 min",
    responseTimeTrend: -12,
    activeAmbulances: "24",
    completedToday: "156",
    completedTrend: 8,
    availability: "92%"
  };

  const mockActivities = [
    {
      id: 1,
      type: 'completed',
      title: 'Emergency Request Completed',
      description: 'Patient successfully transported to City General Hospital',
      time: '15 minutes ago',
      vehicleNumber: 'AMB-2847'
    },
    {
      id: 2,
      type: 'enroute',
      title: 'Ambulance En Route',
      description: 'Responding to critical blood delivery request at Memorial Hospital',
      time: '28 minutes ago',
      vehicleNumber: 'AMB-1923'
    },
    {
      id: 3,
      type: 'assigned',
      title: 'Ambulance Assigned',
      description: 'Driver Michael Rodriguez assigned to emergency request',
      time: '45 minutes ago',
      vehicleNumber: 'AMB-3156'
    },
    {
      id: 4,
      type: 'completed',
      title: 'Blood Transport Completed',
      description: 'O-negative blood units delivered to St. Mary Medical Center',
      time: '1 hour ago',
      vehicleNumber: 'AMB-2847'
    },
    {
      id: 5,
      type: 'request',
      title: 'New Emergency Request',
      description: 'Critical patient transport requested from Downtown Clinic',
      time: '2 hours ago',
      vehicleNumber: null
    }
  ];

  const mockAmbulance = {
    vehicleNumber: 'AMB-2847',
    status: 'enroute',
    statusLabel: 'En Route to Location',
    driverName: 'Michael Rodriguez',
    driverContact: '+1 (555) 234-5678',
    currentLocation: '1247 Oak Street, Downtown District, approaching Main Avenue intersection',
    eta: '6 minutes',
    distanceRemaining: '2.3 km',
    progressPercentage: 65,
    latitude: 40.7128,
    longitude: -74.0060
  };

  useEffect(() => {
    if (activeAmbulance) {
      const statusSequence = ['searching', 'assigned', 'enroute', 'arrived'];
      const currentIndex = statusSequence?.indexOf(currentStatus);
      
      if (currentIndex < statusSequence?.length - 1) {
        const timer = setTimeout(() => {
          const nextStatus = statusSequence?.[currentIndex + 1];
          setCurrentStatus(nextStatus);
          
          addNotification({
            id: Date.now(),
            type: nextStatus === 'arrived' ? 'success' : 'info',
            title: `Status Updated: ${nextStatus?.charAt(0)?.toUpperCase() + nextStatus?.slice(1)}`,
            message: `Ambulance ${mockAmbulance?.vehicleNumber} is now ${nextStatus}`,
            timestamp: new Date()
          });
        }, 8000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [currentStatus, activeAmbulance]);

  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev]?.slice(0, 3));
  };

  const handleRequestAmbulance = () => {
    setIsRequesting(true);
    setIsLoading(true);
    
    setTimeout(() => {
      setIsRequesting(false);
      setIsLoading(false);
      setActiveAmbulance(mockAmbulance);
      setCurrentStatus('searching');
      
      setAlerts([{
        id: 1,
        severity: 'critical',
        title: 'Emergency Request Received',
        message: 'Searching for nearest available ambulance. ETA: 8-12 minutes',
        actionLabel: 'View Status',
        onAction: () => {
          document.getElementById('status-tracker')?.scrollIntoView({ behavior: 'smooth' });
        }
      }]);
      
      addNotification({
        id: Date.now(),
        type: 'success',
        title: 'Emergency Request Submitted',
        message: 'Your ambulance request has been received. Dispatching nearest unit.',
        timestamp: new Date()
      });
    }, 2000);
  };

  const handleContactDriver = (ambulance) => {
    addNotification({
      id: Date.now(),
      type: 'info',
      title: 'Connecting to Driver',
      message: `Initiating call to ${ambulance?.driverName} at ${ambulance?.driverContact}`,
      timestamp: new Date(),
      action: {
        label: 'Call Now',
        onClick: () => window.open(`tel:${ambulance?.driverContact}`)
      }
    });
  };

  const handleViewMap = (ambulance) => {
    document.getElementById('map-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleEscalate = () => {
    addNotification({
      id: Date.now(),
      type: 'warning',
      title: 'Priority Escalated',
      message: 'Your request has been marked as critical priority. Dispatch team notified.',
      timestamp: new Date()
    });
  };

  const handleAlternative = () => {
    addNotification({
      id: Date.now(),
      type: 'info',
      title: 'Alternative Services',
      message: 'Searching for alternative ambulance providers in your area.',
      timestamp: new Date()
    });
  };

  const dismissNotification = (id) => {
    setNotifications(prev => prev?.filter(n => n?.id !== id));
  };

  return (
    <>
      <Helmet>
        <title>Ambulance Tracking - SmartBloodApplication</title>
        <meta name="description" content="Real-time ambulance tracking and emergency response coordination for critical medical situations" />
      </Helmet>
      <Header />
      <EmergencyStatusBanner alerts={alerts} />
      <EmergencyFAB />
      <NotificationToast notifications={notifications} onDismiss={dismissNotification} />
      <LoadingOverlay isVisible={isLoading} message="Dispatching ambulance..." />
      <main className="content-main bg-background min-h-screen">
        <div className="max-w-screen-2xl mx-auto">
          {/* Page Header */}
          <div className="mb-6 md:mb-8 lg:mb-10">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-3">
              Ambulance Tracking
            </h1>
            <p className="text-sm md:text-base lg:text-lg text-muted-foreground">
              Real-time emergency response coordination and ambulance status monitoring
            </p>
          </div>

          {/* Service Metrics */}
          <div className="mb-6 md:mb-8">
            <ServiceMetrics metrics={mockMetrics} />
          </div>

          {/* Emergency Request Section */}
          {!activeAmbulance && (
            <div className="mb-6 md:mb-8">
              <EmergencyRequestButton 
                onRequestAmbulance={handleRequestAmbulance}
                isRequesting={isRequesting}
              />
            </div>
          )}

          {/* Active Tracking Section */}
          {activeAmbulance && (
            <div className="space-y-6 md:space-y-8">
              {/* Status Tracker */}
              <div id="status-tracker">
                <StatusTracker currentStatus={currentStatus} />
              </div>

              {/* Active Ambulance Card */}
              <ActiveAmbulanceCard 
                ambulance={activeAmbulance}
                onContactDriver={handleContactDriver}
                onViewMap={handleViewMap}
              />

              {/* Map Integration */}
              <div id="map-section">
                <MapIntegration 
                  latitude={mockAmbulance?.latitude}
                  longitude={mockAmbulance?.longitude}
                  locationName={mockAmbulance?.currentLocation}
                />
              </div>

              {/* Emergency Escalation */}
              {currentStatus !== 'arrived' && (
                <EmergencyEscalation 
                  onEscalate={handleEscalate}
                  onAlternative={handleAlternative}
                />
              )}
            </div>
          )}

          {/* Recent Activity Panel */}
          <div className="mt-6 md:mt-8 lg:mt-10">
            <RecentActivityPanel activities={mockActivities} />
          </div>
        </div>
      </main>
    </>
  );
};

export default AmbulanceTracking;