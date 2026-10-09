/**
 * Dashboard Layout — command-center shell with sidebar navigation.
 */

import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cpu,
  LayoutDashboard,
  AlertTriangle,
  DoorOpen,
  BarChart3,
  Bell,
  LogOut,
  Menu,
  X,
  ChevronDown,
  User,
} from 'lucide-react';

const getNavItems = (role?: string) => {
  const items = [{ to: '/dashboard', icon: LayoutDashboard, label: 'Overview', end: true }];
  if (role === 'admin') {
    items.push({ to: '/dashboard/incidents', icon: AlertTriangle, label: 'Incidents' });
    items.push({ to: '/dashboard/rooms', icon: DoorOpen, label: 'Rooms & Resources' });
    items.push({ to: '/dashboard/analytics', icon: BarChart3, label: 'Analytics' });
  } else if (role === 'staff') {
    items.push({ to: '/dashboard/incidents', icon: AlertTriangle, label: 'My Tasks' });
  } else if (role === 'faculty') {
    items.push({ to: '/dashboard/incidents', icon: AlertTriangle, label: 'Requests' });
    items.push({ to: '/dashboard/rooms', icon: DoorOpen, label: 'Rooms & Resources' });
  } else {
    // Student
    items.push({ to: '/dashboard/incidents', icon: AlertTriangle, label: 'My Requests' });
    items.push({ to: '/dashboard/rooms', icon: DoorOpen, label: 'Rooms & Resources' });
  }
  return items;
};

export default function DashboardLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  async function handleSignOut() {
    await signOut();
    navigate('/', { replace: true });
  }

  const roleBadgeColor: Record<string, string> = {
    admin: 'bg-nexus-red/20 text-red-400',
    faculty: 'bg-nexus-violet/20 text-violet-400',
    staff: 'bg-nexus-amber/20 text-amber-400',
    student: 'bg-nexus-cyan/20 text-cyan-400',
  };

  return (
    <div className="flex h-screen bg-nexus-bg overflow-hidden">
      {/* ── Sidebar ── */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-nexus-surface border-r border-nexus-border
          transform transition-transform duration-300 lg:translate-x-0 lg:static lg:flex flex-col
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-nexus-border">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-nexus-cyan to-nexus-blue flex items-center justify-center">
            <Cpu className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-nexus-text">
            NEXUS
          </span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto lg:hidden text-nexus-text-muted hover:text-nexus-text"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1" aria-label="Main navigation">
          {getNavItems(user?.role).map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                ${
                  isActive
                    ? 'bg-nexus-cyan/10 text-nexus-cyan border border-nexus-cyan/20'
                    : 'text-nexus-text-secondary hover:bg-nexus-surface-2 hover:text-nexus-text border border-transparent'
                }`
              }
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User info */}
        <div className="px-4 py-4 border-t border-nexus-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-nexus-surface-3 flex items-center justify-center text-nexus-text-secondary">
              <User className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-nexus-text truncate">
                {user?.displayName || 'User'}
              </p>
              <span
                className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-medium uppercase tracking-wider ${
                  roleBadgeColor[user?.role ?? 'student'] ?? roleBadgeColor.student
                }`}
              >
                {user?.role ?? 'student'}
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Sidebar overlay on mobile ── */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="flex items-center justify-between px-4 lg:px-6 py-3 border-b border-nexus-border bg-nexus-surface/80 backdrop-blur-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-nexus-text-muted hover:text-nexus-text"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden lg:block" />

          <div className="flex items-center gap-3">
            {/* Notifications */}
            <button
              className="relative w-9 h-9 rounded-xl bg-nexus-surface-2 flex items-center justify-center text-nexus-text-secondary hover:text-nexus-text hover:bg-nexus-surface-3 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-nexus-cyan pulse-dot" />
            </button>

            {/* Profile dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-nexus-surface-2 border border-nexus-border hover:border-nexus-cyan/30 transition-colors"
                aria-expanded={profileOpen}
                aria-haspopup="true"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-nexus-cyan to-nexus-blue flex items-center justify-center">
                  <span className="text-xs font-bold text-white">
                    {(user?.displayName?.[0] ?? 'U').toUpperCase()}
                  </span>
                </div>
                <span className="hidden sm:block text-sm text-nexus-text">
                  {user?.displayName?.split(' ')[0] ?? 'User'}
                </span>
                <ChevronDown className="w-3 h-3 text-nexus-text-muted" />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    className="absolute right-0 mt-2 w-48 rounded-xl bg-nexus-surface border border-nexus-border shadow-xl overflow-hidden z-50"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                  >
                    <div className="px-4 py-3 border-b border-nexus-border">
                      <p className="text-sm font-medium text-nexus-text">
                        {user?.displayName}
                      </p>
                      <p className="text-xs text-nexus-text-muted truncate">
                        {user?.email}
                      </p>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-nexus-surface-2 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
