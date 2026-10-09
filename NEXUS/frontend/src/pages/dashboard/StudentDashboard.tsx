import { motion } from 'framer-motion';
import {
  AlertTriangle,
  Clock,
  DoorOpen,
  Info,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { NexusAIBar } from '@/components/NexusAIBar';

const suggestedPrompts = [
  { icon: DoorOpen, text: 'Find an available lab' },
  { icon: AlertTriangle, text: 'Report a campus issue' },
  { icon: Clock, text: 'Check my requests' },
];

export function StudentDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-2xl lg:text-3xl font-bold text-nexus-text">
          Welcome back, {user?.displayName?.split(' ')[0] || 'Student'}
        </h1>
        <p className="text-sm text-nexus-text-secondary mt-1">
          Your personal campus intelligence hub.
        </p>
      </motion.div>

      <NexusAIBar suggestedPrompts={suggestedPrompts} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <motion.div className="glass rounded-2xl p-5 space-y-4" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="text-sm font-bold text-nexus-text">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Report Issue', icon: AlertTriangle, color: 'text-nexus-amber' },
              { label: 'Find Room', icon: DoorOpen, color: 'text-nexus-cyan' },
              { label: 'Check Requests', icon: Clock, color: 'text-nexus-violet' },
              { label: 'Campus Info', icon: Info, color: 'text-nexus-blue' },
            ].map((action) => (
              <button key={action.label} className="p-4 rounded-xl bg-nexus-surface-2 hover:bg-nexus-surface-3 border border-nexus-border transition-colors flex flex-col items-center gap-2 text-center">
                <action.icon className={`w-5 h-5 ${action.color}`} />
                <span className="text-xs font-medium text-nexus-text">{action.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* My Requests */}
        <motion.div className="glass rounded-2xl p-5" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-nexus-text">My Recent Requests</h2>
            <button className="text-xs text-nexus-cyan hover:underline">View All</button>
          </div>
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-nexus-surface-2 border border-nexus-border flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-nexus-text">AC Not Working</p>
                <p className="text-xs text-nexus-text-muted">Room 304 • 2 days ago</p>
              </div>
              <span className="px-2 py-1 rounded text-[10px] font-medium bg-nexus-cyan/20 text-cyan-400">In Progress</span>
            </div>
            <div className="p-3 rounded-lg bg-nexus-surface-2 border border-nexus-border flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-nexus-text">Lab Software Request</p>
                <p className="text-xs text-nexus-text-muted">CS Lab 1 • 5 days ago</p>
              </div>
              <span className="px-2 py-1 rounded text-[10px] font-medium bg-nexus-green/20 text-green-400">Resolved</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
