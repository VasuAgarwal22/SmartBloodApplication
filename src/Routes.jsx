import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import HomeDashboard from './pages/home-dashboard';
import AdminDashboard from './pages/admin-dashboard';
import RequestBlood from './pages/request-blood';
import AmbulanceTracking from './pages/ambulance-tracking';
import EmergencyPriorityQueue from './pages/emergency-priority-queue';
import NearestDonorFinder from './pages/nearest-donor-finder';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<HomeDashboard />} />
        <Route path="/home-dashboard" element={<HomeDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/request-blood" element={<RequestBlood />} />
        <Route path="/ambulance-tracking" element={<AmbulanceTracking />} />
        <Route path="/emergency-priority-queue" element={<EmergencyPriorityQueue />} />
        <Route path="/nearest-donor-finder" element={<NearestDonorFinder />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;