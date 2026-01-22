import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/navigation/Header';
import DonorRegistrationForm from './components/DonorRegistrationForm';
import InventoryStatus from './components/InventoryStatus';
import MetricCard from './components/MetricCard';
import QuickActionCard from './components/QuickActionCard';
import RecentActivityCard from './components/RecentActivityCard';
import TrustBadges from './components/TrustBadges';
import AppImpactStatistics from './components/AppImpactStatistics';

const HomeDashboard = () => {
  const { user, signOut } = useAuth();
  const [impactStats, setImpactStats] = useState(null);

  useEffect(() => {
    // Mock impact stats - replace with actual API call
    setImpactStats({
      livesSaved: 1250,
      bloodUnitsDistributed: 8500,
      activeDonors: 3200,
      hospitalsServed: 45
    });
  }, []);

  return (
    <>
      <Helmet>
        <title>Home Dashboard - SmartBloodAllocation</title>
        <meta name="description" content="Smart Blood Allocation System Dashboard" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <main className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Welcome Section */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Welcome to Smart Blood Allocation
              </h1>
              <p className="text-muted-foreground">
                Connecting donors with those in need through intelligent allocation
              </p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <QuickActionCard
                title="Request Blood"
                description="Submit a blood request for emergency or planned needs"
                icon="Droplet"
                route="/request-blood"
                variant="primary"
              />
              <QuickActionCard
                title="Find Nearest Donor"
                description="Locate compatible donors in your area"
                icon="MapPin"
                route="/nearest-donor-finder"
                variant="secondary"
              />
              <QuickActionCard
                title="Track Ambulance"
                description="Monitor emergency blood transport"
                icon="Truck"
                route="/ambulance-tracking"
                variant="outline"
              />
            </div>

            {/* Metrics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <MetricCard
                title="Lives Saved"
                value="1,250"
                change="+12%"
                trend="up"
                icon="Heart"
              />
              <MetricCard
                title="Blood Units"
                value="8,500"
                change="+8%"
                trend="up"
                icon="Droplet"
              />
              <MetricCard
                title="Active Donors"
                value="3,200"
                change="+15%"
                trend="up"
                icon="Users"
              />
              <MetricCard
                title="Hospitals Served"
                value="45"
                change="+5%"
                trend="up"
                icon="Building"
              />
            </div>

            {/* Donor Registration */}
            <div className="mb-8">
              <DonorRegistrationForm />
            </div>

            {/* Inventory Status */}
            <div className="mb-8">
              <InventoryStatus />
            </div>

            {/* Recent Activity */}
            <div className="mb-8">
              <RecentActivityCard />
            </div>

            {/* Trust Badges */}
            <div className="mb-8">
              <TrustBadges />
            </div>

            {/* App Impact Statistics */}
            {impactStats && (
              <AppImpactStatistics stats={impactStats} />
            )}
          </motion.div>
        </main>
      </div>
    </>
  );
};

export default HomeDashboard;
