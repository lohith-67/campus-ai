import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { StudentDashboard } from './StudentDashboard';
import { AdminDashboard } from './AdminDashboard';
import { StaffDashboard } from './StaffDashboard';
import { FacultyDashboard } from './FacultyDashboard';

export default function DashboardHome() {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  switch (user.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'staff':
      return <StaffDashboard />;
    case 'faculty':
      return <FacultyDashboard />;
    case 'student':
    default:
      return <StudentDashboard />;
  }
}
