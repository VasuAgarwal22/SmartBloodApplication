import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '../../contexts/AuthContext';
import InventoryManagement from './components/InventoryManagement';
import RequestHandling from './components/RequestHandling';
import DonationEntry from './components/DonationEntry';
import HospitalProfile from './components/HospitalProfile';

const HospitalDashboard = () => {
  const { userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('inventory');

  const tabs = [
    { id: 'inventory', label: 'Inventory Management', icon: '📦' },
    { id: 'requests', label: 'Request Handling', icon: '📋' },
    { id: 'donations', label: 'Donation Entry', icon: '🩸' },
    { id: 'profile', label: 'Hospital Profile', icon: '🏥' }
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'inventory':
        return <InventoryManagement />;
      case 'requests':
        return <RequestHandling />;
      case 'donations':
        return <DonationEntry />;
      case 'profile':
        return <HospitalProfile />;
      default:
        return <InventoryManagement />;
    }
  };

  return (
    <>
      <Helmet>
        <title>Hospital Dashboard - SmartBloodApplication</title>
        <meta name="description" content="Comprehensive hospital dashboard for blood inventory management, request handling, and donation recording" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="max-w-screen-2xl mx-auto">
          {/* Header */}
          <div className="bg-card border-b border-border px-6 py-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  Hospital Dashboard
                </h1>
                <p className="text-muted-foreground mt-1">
                  Welcome back, {userProfile?.full_name || userProfile?.email}!
                </p>
                <p className="text-sm text-muted-foreground">
                  {userProfile?.organization || 'Hospital Management System'}
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Current Session</div>
                <div className="font-medium">{new Date().toLocaleDateString()}</div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-card border-b border-border px-6">
            <div className="flex flex-wrap gap-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <main className="p-6">
            {renderActiveTab()}
          </main>

          {/* Footer */}
          <footer className="bg-card border-t border-border px-6 py-4 mt-8">
            <div className="text-center text-sm text-muted-foreground">
              <p>&copy; {new Date().getFullYear()} SmartBloodApplication. Hospital Management System.</p>
              <p className="mt-1">Ensuring safe and efficient blood supply management.</p>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
};

export default HospitalDashboard;
