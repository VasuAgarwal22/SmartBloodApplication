import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/navigation/Header';
import EmergencyStatusBanner from '../../components/navigation/EmergencyStatusBanner';
import NotificationToast from '../../components/navigation/NotificationToast';
import LoadingOverlay from '../../components/navigation/LoadingOverlay';

import Button from '../../components/ui/Button';
import MetricCard from './components/MetricCard';
import InventoryHealthChart from './components/InventoryHealthChart';
import AllocationEfficiencyChart from './components/AllocationEfficiencyChart';
import SuspiciousRequestPanel from './components/SuspiciousRequestPanel';
import OperationalMetricsPanel from './components/OperationalMetricsPanel';
import SystemAlertsPanel from './components/SystemAlertsPanel';
import ScalabilityMonitor from './components/ScalabilityMonitor';
import ExportReportModal from './components/ExportReportModal';

import { dbHelpers } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [bannerAlerts, setBannerAlerts] = useState([]);

  useEffect(() => {
    const loadDashboard = async () => {
      setIsLoading(true);
      setLoadingProgress(20);

      try {
        // Load blood requests data
        const { data: requestsData, error: requestsError } = await dbHelpers.getBloodRequests();
        setLoadingProgress(40);

        // Load inventory data
        const { data: inventoryData, error: inventoryError } = await dbHelpers.getInventory();
        setLoadingProgress(60);

        // Load ambulances data
        const { data: ambulancesData, error: ambulancesError } = await dbHelpers.getAmbulances();
        setLoadingProgress(80);

        // Load admin metrics
        const today = new Date().toISOString().split('T')[0];
        const { data: metricsData, error: metricsError } = await dbHelpers.getAdminMetrics(today);
        setLoadingProgress(100);

        // Process alerts based on real data
        const alerts = [];

        // Check for critical blood shortages
        if (inventoryData) {
          const criticalBloodGroups = inventoryData.filter(item =>
            item.status === 'critical' || item.quantity < 10
          );
          if (criticalBloodGroups.length > 0) {
            alerts.push({
              id: 1,
              type: 'critical',
              title: 'Critical Blood Shortage',
              message: `${criticalBloodGroups.length} blood groups below minimum threshold`,
              timestamp: '5 minutes ago',
              location: 'Multiple Blood Banks'
            });
          }
        }

        // Check for expiring inventory
        if (inventoryData) {
          const expiringSoon = inventoryData.filter(item => {
            const expiryDate = new Date(item.expiry_date);
            const now = new Date();
            const hoursUntilExpiry = (expiryDate - now) / (1000 * 60 * 60);
            return hoursUntilExpiry <= 48 && hoursUntilExpiry > 0;
          });
          if (expiringSoon.length > 0) {
            alerts.push({
              id: 2,
              type: 'warning',
              title: 'Expiring Inventory Alert',
              message: `${expiringSoon.length} units expiring within 48 hours`,
              timestamp: '15 minutes ago',
              location: 'Various Blood Banks'
            });
          }
        }

        // System maintenance alert (static for now)
        alerts.push({
          id: 3,
          type: 'info',
          title: 'System Maintenance Scheduled',
          message: 'Routine maintenance scheduled for tonight at 2:00 AM EST',
          timestamp: '1 hour ago'
        });

        setAlerts(alerts);

        // Set banner alerts based on system status
        const bannerAlerts = [];
        if (metricsData && metricsData.system_load > 80) {
          bannerAlerts.push({
            id: 1,
            severity: 'warning',
            title: 'High System Load',
            message: `Current load at ${metricsData.system_load}% capacity. Consider scaling resources.`,
            actionLabel: 'View Details',
            onAction: () => console.log('View system load details')
          });
        }
        setBannerAlerts(bannerAlerts);

      } catch (error) {
        console.error('Error loading dashboard data:', error);
        // Fallback to mock alerts if data loading fails
        setAlerts([
          {
            id: 1,
            type: 'info',
            title: 'Loading Data',
            message: 'Dashboard data is being loaded...',
            timestamp: 'Just now'
          }
        ]);
      }

      setIsLoading(false);
    };

    loadDashboard();
  }, []);

  const keyMetrics = [
    {
      title: "Total Requests",
      value: "12,847",
      change: "+18.2%",
      changeType: "positive",
      trend: "up",
      icon: "FileText",
      iconColor: "#1E40AF"
    },
    {
      title: "Emergency Requests",
      value: "3,421",
      change: "+12.5%",
      changeType: "positive",
      trend: "up",
      icon: "AlertTriangle",
      iconColor: "#DC2626"
    },
    {
      title: "Wastage Prevented",
      value: "892 units",
      change: "-24.3%",
      changeType: "positive",
      trend: "down",
      icon: "TrendingDown",
      iconColor: "#059669"
    },
    {
      title: "Suspicious Requests",
      value: "47",
      change: "+8.1%",
      changeType: "negative",
      trend: "up",
      icon: "Shield",
      iconColor: "#D97706"
    }
  ];

  const inventoryHealthData = [
    { bloodGroup: "A+", healthy: 450, warning: 120, critical: 30 },
    { bloodGroup: "A-", healthy: 180, warning: 45, critical: 15 },
    { bloodGroup: "B+", healthy: 320, warning: 85, critical: 20 },
    { bloodGroup: "B-", healthy: 140, warning: 35, critical: 10 },
    { bloodGroup: "AB+", healthy: 210, warning: 55, critical: 12 },
    { bloodGroup: "AB-", healthy: 95, warning: 25, critical: 8 },
    { bloodGroup: "O+", healthy: 520, warning: 140, critical: 35 },
    { bloodGroup: "O-", healthy: 160, warning: 40, critical: 18 }
  ];

  const allocationEfficiencyData = [
    { day: "Mon", responseTime: 12, successRate: 94 },
    { day: "Tue", responseTime: 10, successRate: 96 },
    { day: "Wed", responseTime: 15, successRate: 91 },
    { day: "Thu", responseTime: 11, successRate: 95 },
    { day: "Fri", responseTime: 13, successRate: 93 },
    { day: "Sat", responseTime: 9, successRate: 97 },
    { day: "Sun", responseTime: 8, successRate: 98 }
  ];

  const suspiciousRequests = [
    {
      id: 1,
      requesterName: "Dr. Michael Johnson",
      reason: "Multiple high-volume requests within 24 hours from same location",
      bloodGroup: "O-",
      quantity: 25,
      timestamp: "2 hours ago",
      severity: "high"
    },
    {
      id: 2,
      requesterName: "City General Hospital",
      reason: "Request pattern matches known abuse signature",
      bloodGroup: "AB+",
      quantity: 15,
      timestamp: "4 hours ago",
      severity: "medium"
    },
    {
      id: 3,
      requesterName: "Emergency Clinic 247",
      reason: "Unverified hospital credentials, first-time requester",
      bloodGroup: "A+",
      quantity: 20,
      timestamp: "6 hours ago",
      severity: "medium"
    }
  ];

  const operationalMetrics = [
    {
      label: "Donor Registrations",
      value: "2,847",
      icon: "Users",
      iconColor: "#1E40AF",
      subMetrics: [
        { label: "New Donors", value: "342" },
        { label: "Repeat Donors", value: "2,505" }
      ]
    },
    {
      label: "Blood Bank Coordination",
      value: "98.5%",
      icon: "Building2",
      iconColor: "#059669",
      subMetrics: [
        { label: "Active Banks", value: "47" },
        { label: "Avg Response", value: "8 min" }
      ]
    },
    {
      label: "Ambulance Response",
      value: "11.2 min",
      icon: "Ambulance",
      iconColor: "#DC2626",
      subMetrics: [
        { label: "Active Units", value: "23" },
        { label: "Completed", value: "1,284" }
      ]
    },
    {
      label: "Algorithm Performance",
      value: "99.2%",
      icon: "Cpu",
      iconColor: "#0F766E",
      subMetrics: [
        { label: "Avg Process", value: "0.8s" },
        { label: "Success Rate", value: "99.2%" }
      ]
    }
  ];

  const scalabilityData = [
    { time: "00:00", load: 450 },
    { time: "04:00", load: 320 },
    { time: "08:00", load: 680 },
    { time: "12:00", load: 920 },
    { time: "16:00", load: 1150 },
    { time: "20:00", load: 890 },
    { time: "23:59", load: 650 }
  ];

  const handleInvestigate = (requestId) => {
    setNotifications(prev => [...prev, {
      id: Date.now(),
      type: 'info',
      title: 'Investigation Started',
      message: `Investigation initiated for request #${requestId}`,
      timestamp: new Date()
    }]);
  };

  const handleResolve = (requestId, action) => {
    setNotifications(prev => [...prev, {
      id: Date.now(),
      type: action === 'approved' ? 'success' : 'warning',
      title: `Request ${action === 'approved' ? 'Approved' : 'Rejected'}`,
      message: `Request #${requestId} has been ${action}`,
      timestamp: new Date()
    }]);
  };

  const handleDismissAlert = (alertId) => {
    setAlerts(prev => prev?.filter(alert => alert?.id !== alertId));
  };

  const handleEscalateAlert = (alertId) => {
    setNotifications(prev => [...prev, {
      id: Date.now(),
      type: 'critical',
      title: 'Alert Escalated',
      message: `Alert #${alertId} has been escalated to senior management`,
      timestamp: new Date()
    }]);
  };

  const handleExport = (exportConfig) => {
    setIsLoading(true);
    setLoadingProgress(0);
    
    const simulateExport = async () => {
      for (let i = 0; i <= 100; i += 10) {
        setLoadingProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      setIsLoading(false);
      setNotifications(prev => [...prev, {
        id: Date.now(),
        type: 'success',
        title: 'Report Generated',
        message: `Your ${exportConfig?.format?.toUpperCase()} report has been generated successfully`,
        timestamp: new Date(),
        action: {
          label: 'Download',
          onClick: () => console.log('Download report')
        }
      }]);
    };

    simulateExport();
  };

  const handleDismissNotification = (notificationId) => {
    setNotifications(prev => prev?.filter(n => n?.id !== notificationId));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <EmergencyStatusBanner alerts={bannerAlerts} />
      <NotificationToast 
        notifications={notifications} 
        onDismiss={handleDismissNotification}
      />
      <LoadingOverlay 
        isVisible={isLoading} 
        message="Loading Dashboard Data..." 
        progress={loadingProgress}
      />
      <main className="content-main">
        <div className="max-w-screen-2xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6 md:mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-semibold mb-2">Admin Dashboard</h1>
              <p className="text-base md:text-lg text-muted-foreground">
                Comprehensive system oversight and performance monitoring
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                iconName="RefreshCw"
                iconPosition="left"
                onClick={() => window.location?.reload()}
              >
                Refresh
              </Button>
              <Button
                variant="default"
                iconName="Download"
                iconPosition="left"
                onClick={() => setIsExportModalOpen(true)}
              >
                Export Report
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
            {keyMetrics?.map((metric, index) => (
              <MetricCard key={index} {...metric} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
            <InventoryHealthChart data={inventoryHealthData} />
            <AllocationEfficiencyChart data={allocationEfficiencyData} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
            <SuspiciousRequestPanel 
              requests={suspiciousRequests}
              onInvestigate={handleInvestigate}
              onResolve={handleResolve}
            />
            <SystemAlertsPanel 
              alerts={alerts}
              onDismiss={handleDismissAlert}
              onEscalate={handleEscalateAlert}
            />
          </div>

          <div className="mb-6 md:mb-8">
            <OperationalMetricsPanel metrics={operationalMetrics} />
          </div>

          <div className="mb-6 md:mb-8">
            <ScalabilityMonitor 
              data={scalabilityData}
              currentLoad={1150}
              maxCapacity={1500}
            />
          </div>

          <div className="bg-card border border-border rounded-xl p-4 md:p-6 shadow-elevation-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-lg md:text-xl font-semibold mb-2">Quick Actions</h3>
                <p className="text-sm text-muted-foreground">Navigate to key system areas</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  iconName="LayoutDashboard"
                  iconPosition="left"
                  onClick={() => navigate('/home-dashboard')}
                >
                  Main Dashboard
                </Button>
                {/* <Button
                  variant="outline"
                  iconName="ListOrdered"
                  iconPosition="left"
                  onClick={() => navigate('/emergency-priority-queue')}
                >
                  Priority Queue
                </Button> */}
                <Button
                  variant="outline"
                  iconName="Ambulance"
                  iconPosition="left"
                  onClick={() => navigate('/ambulance-tracking')}
                >
                  Ambulance Tracking
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <ExportReportModal 
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExport}
      />
    </div>
  );
};

export default AdminDashboard;