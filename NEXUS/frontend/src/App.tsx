import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LandingPage from '@/pages/Landing';
import LoginPage from '@/pages/Login';
import DashboardLayout from '@/layouts/DashboardLayout';
import DashboardHome from '@/pages/dashboard/Home';
import IncidentsPage from '@/pages/dashboard/Incidents';
import IncidentDetail from '@/pages/dashboard/IncidentDetail';
import RoomsPage from '@/pages/dashboard/Rooms';
import AnalyticsPage from '@/pages/dashboard/Analytics';
import { Loader2 } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-nexus-bg">
        <Loader2 className="w-8 h-8 text-nexus-cyan animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <>
      <Toaster 
        position="top-right" 
        toastOptions={{
          className: '!bg-nexus-surface-2 !text-nexus-text !border !border-nexus-border',
          style: {
            background: 'var(--color-nexus-surface-2)',
            color: 'var(--color-nexus-text)',
            border: '1px solid var(--color-nexus-border)',
            borderRadius: '12px'
          }
        }} 
      />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="incidents" element={<IncidentsPage />} />
          <Route path="incidents/:id" element={<IncidentDetail />} />
          <Route path="rooms" element={<RoomsPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
