import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import Login from './pages/login';
import HomeDashboard from './pages/home-dashboard';
import HospitalDashboard from './pages/hospital-dashboard';
import AdminDashboard from './pages/admin-dashboard';
import RequestBlood from './pages/request-blood';
import AmbulanceTracking from './pages/ambulance-tracking';
import EmergencyPriorityQueue from './pages/emergency-priority-queue';
import NearestDonorFinder from './pages/nearest-donor-finder';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

const AppRoutes = () => {
  return (
    <RouterRoutes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={
        <ProtectedRoute requiredRoles={['user']}>
          <HomeDashboard />
        </ProtectedRoute>
      } />
      <Route path="/home-dashboard" element={
        <ProtectedRoute requiredRoles={['user']}>
          <HomeDashboard />
        </ProtectedRoute>
      } />
      <Route path="/hospital-dashboard" element={
        <ProtectedRoute requiredRoles={['hospital']}>
          <HospitalDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin-dashboard" element={
        <ProtectedRoute requiredRoles={['admin']}>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/request-blood" element={<RequestBlood />} />
      <Route path="/ambulance-tracking" element={<AmbulanceTracking />} />
      <Route path="/emergency-priority-queue" element={<EmergencyPriorityQueue />} />
      <Route path="/nearest-donor-finder" element={<NearestDonorFinder />} />
      <Route path="*" element={<NotFound />} />
    </RouterRoutes>
  );
};

const Routes = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ErrorBoundary>
          <ScrollToTop />
          <AppRoutes />
        </ErrorBoundary>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default Routes;