import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const HospitalDashboard = () => {
  const { userProfile } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Hospital Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back, {userProfile?.full_name || userProfile?.email}!
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Organization: {userProfile?.organization || 'Not specified'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="bg-card rounded-lg p-6 shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
                View Blood Requests
              </button>
              <button className="w-full bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-secondary/90 transition-colors">
                Manage Inventory
              </button>
              <button className="w-full bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-secondary/90 transition-colors">
                Ambulance Tracking
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-card rounded-lg p-6 shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="text-sm text-muted-foreground">
                No recent activity
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-card rounded-lg p-6 shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Active Requests</span>
                <span className="text-sm font-medium">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Available Units</span>
                <span className="text-sm font-medium">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Active Ambulances</span>
                <span className="text-sm font-medium">0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalDashboard;
