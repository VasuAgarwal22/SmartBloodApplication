import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/navigation/Header';
import EmergencyStatusBanner from '../../components/navigation/EmergencyStatusBanner';
import EmergencyFAB from '../../components/navigation/EmergencyFAB';
import NotificationToast from '../../components/navigation/NotificationToast';
import QuickActionCard from './components/QuickActionCard';
import MetricCard from './components/MetricCard';
import RecentActivityCard from './components/RecentActivityCard';
import TrustBadges from './components/TrustBadges';
import InventoryStatus from './components/InventoryStatus';

const HomeDashboard = () => {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      severity: 'critical',
      title: 'Critical Blood Shortage',
      message: 'O- blood type critically low. Only 12 units remaining across all facilities.',
      actionLabel: 'View Details',
      onAction: () => console.log('Navigate to inventory'),
      dismissed: false
    },
    {
      id: 2,
      severity: 'warning',
      title: 'High Priority Request',
      message: '3 emergency requests pending allocation in the priority queue.',
      actionLabel: 'Review Queue',
      onAction: () => console.log('Navigate to priority queue'),
      dismissed: false
    }
  ]);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'success',
      title: 'Allocation Successful',
      message: 'Emergency request #ER-2026-0145 successfully allocated to City General Hospital.',
      timestamp: new Date(Date.now() - 300000),
      autoDismiss: true,
      duration: 5000
    }
  ]);

  const quickActions = [
    {
      title: 'Request Blood',
      description: 'Submit emergency blood request with priority allocation',
      icon: 'Droplet',
      route: '/request-blood',
      variant: 'emergency',
      iconColor: 'var(--color-error)'
    },
    {
      title: 'Donate Blood',
      description: 'Register as a blood donor and save lives',
      icon: 'Heart',
      route: '/nearest-donor-finder',
      variant: 'success',
      iconColor: 'var(--color-success)'
    },
    {
      title: 'Check Availability',
      description: 'View real-time blood inventory and expiry status',
      icon: 'Search',
      route: '/nearest-donor-finder',
      variant: 'default',
      iconColor: 'var(--color-primary)'
    },
    {
      title: 'Call Ambulance',
      description: 'Request emergency ambulance with real-time tracking',
      icon: 'Ambulance',
      route: '/ambulance-tracking',
      variant: 'warning',
      iconColor: 'var(--color-warning)'
    }
  ];

  const metrics = [
    {
      title: 'Active Emergency Requests',
      value: '24',
      icon: 'AlertTriangle',
      trend: 'up',
      trendValue: '+8.2%',
      variant: 'error'
    },
    {
      title: 'Current Blood Inventory',
      value: '1,847',
      icon: 'Droplet',
      trend: 'down',
      trendValue: '-3.5%',
      variant: 'warning'
    },
    {
      title: 'Successful Allocations',
      value: '156',
      icon: 'CheckCircle',
      trend: 'up',
      trendValue: '+12.4%',
      variant: 'success'
    },
    {
      title: 'Wastage Prevented',
      value: '89%',
      icon: 'TrendingUp',
      trend: 'up',
      trendValue: '+5.1%',
      variant: 'success'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'request',
      title: 'Emergency Request Submitted',
      description: 'Critical O- blood request from Metro Hospital for trauma patient',
      timestamp: new Date(Date.now() - 180000)
    },
    {
      id: 2,
      type: 'allocation',
      title: 'Blood Allocated Successfully',
      description: 'A+ blood (4 units) allocated to City General Hospital via priority queue',
      timestamp: new Date(Date.now() - 420000)
    },
    {
      id: 3,
      type: 'donation',
      title: 'New Donor Registered',
      description: 'John Smith registered as AB+ donor in Downtown area',
      timestamp: new Date(Date.now() - 900000)
    },
    {
      id: 4,
      type: 'ambulance',
      title: 'Ambulance Dispatched',
      description: 'Emergency ambulance en route to pickup location with ETA 8 minutes',
      timestamp: new Date(Date.now() - 1200000)
    }
  ];

  const inventoryData = [
    { bloodGroup: 'A+', units: 342, status: 'good' },
    { bloodGroup: 'A-', units: 87, status: 'adequate' },
    { bloodGroup: 'B+', units: 256, status: 'good' },
    { bloodGroup: 'B-', units: 45, status: 'low' },
    { bloodGroup: 'AB+', units: 123, status: 'adequate' },
    { bloodGroup: 'AB-', units: 28, status: 'low' },
    { bloodGroup: 'O+', units: 478, status: 'good' },
    { bloodGroup: 'O-', units: 12, status: 'critical' }
  ];

  const handleDismissNotification = (id) => {
    setNotifications(prev => prev?.filter(n => n?.id !== id));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setNotifications(prev => [
        ...prev,
        {
          id: Date.now(),
          type: 'warning',
          title: 'Expiry Alert',
          message: '15 units of B+ blood expiring in next 48 hours. Consider priority allocation.',
          timestamp: new Date(),
          autoDismiss: true,
          duration: 6000
        }
      ]);
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Helmet>
        <title>Home Dashboard - SmartBloodAllocation</title>
        <meta name="description" content="Central command center for emergency blood allocation with real-time priority management and optimization" />
      </Helmet>
      <Header />
      <EmergencyStatusBanner alerts={alerts} />
      <NotificationToast notifications={notifications} onDismiss={handleDismissNotification} />
      <EmergencyFAB />
      <main className="content-main bg-background">
        <div className="max-w-screen-2xl mx-auto">
          {/* Hero Section */}
          <div className="mb-8 md:mb-12">
            <div className="text-center mb-6 md:mb-8">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4">
                Smart Blood Allocation System
              </h1>
              <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
                Algorithm-driven emergency blood allocation with real-time priority management, 
                intelligent routing, and wastage prevention for life-saving healthcare delivery
              </p>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {quickActions?.map((action, index) => (
                <QuickActionCard
                  key={index}
                  title={action?.title}
                  description={action?.description}
                  icon={action?.icon}
                  route={action?.route}
                  variant={action?.variant}
                  iconColor={action?.iconColor}
                />
              ))}
            </div>
          </div>

          {/* Metrics Dashboard */}
          <div className="mb-8 md:mb-12">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">Real-Time Metrics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {metrics?.map((metric, index) => (
                <MetricCard
                  key={index}
                  title={metric?.title}
                  value={metric?.value}
                  icon={metric?.icon}
                  trend={metric?.trend}
                  trendValue={metric?.trendValue}
                  variant={metric?.variant}
                />
              ))}
            </div>
          </div>

          {/* Inventory Status */}
          <div className="mb-8 md:mb-12">
            <InventoryStatus inventory={inventoryData} />
          </div>

          {/* Recent Activity */}
          <div className="mb-8 md:mb-12">
            <RecentActivityCard activities={recentActivities} />
          </div>

          {/* Trust Badges */}
          <div className="mb-8">
            <TrustBadges />
          </div>

          {/* Footer Info */}
          <div className="bg-card rounded-xl border-2 border-border p-6 md:p-8 text-center">
            <p className="text-sm md:text-base text-muted-foreground mb-4">
              SmartBloodAllocation uses advanced algorithms including Priority Queues, Min-Heap structures, 
              and Dijkstra's algorithm for optimal blood allocation and delivery route optimization.
            </p>
            <p className="text-xs md:text-sm text-muted-foreground caption">
              &copy; {new Date()?.getFullYear()} SmartBloodAllocation. All rights reserved. 
              HIPAA Compliant | ISO 27001 Certified | FDA Registered
            </p>
          </div>
        </div>
      </main>
    </>
  );
};

export default HomeDashboard;