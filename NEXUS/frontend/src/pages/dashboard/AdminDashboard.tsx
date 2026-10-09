import { motion } from 'framer-motion';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldAlert,
} from 'lucide-react';
import { NexusAIBar } from '@/components/NexusAIBar';

export function AdminDashboard() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-2xl lg:text-3xl font-bold text-nexus-text">Campus Command Center</h1>
        <p className="text-sm text-nexus-text-secondary mt-1">Campus-wide operations and intelligence overview.</p>
      </motion.div>

      {/* Stats Grid for Admin */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Incidents', value: '12', icon: AlertTriangle, color: 'text-nexus-amber', bg: 'bg-nexus-amber/10' },
          { label: 'Resolved Today', value: '8', icon: CheckCircle2, color: 'text-nexus-green', bg: 'bg-nexus-green/10' },
          { label: 'Critical Issues', value: '2', icon: ShieldAlert, color: 'text-nexus-red', bg: 'bg-nexus-red/10' },
          { label: 'Avg Response', value: '14m', icon: Clock, color: 'text-nexus-violet', bg: 'bg-nexus-violet/10' },
        ].map((stat, i) => (
          <motion.div key={stat.label} className="glass rounded-2xl p-5 hover:border-nexus-cyan/20 transition-all duration-300" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </div>
            <p className="text-2xl font-bold text-nexus-text">{stat.value}</p>
            <p className="text-xs text-nexus-text-secondary mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Admin AI Bar */}
      <NexusAIBar 
        title="Admin Intelligence Assistant" 
        placeholder="Query campus operations data..." 
        suggestedPrompts={[
          { text: 'Show unresolved critical incidents' }, 
          { text: 'Generate daily ops summary' }, 
          { text: 'Identify recurring issues in B Block' }
        ]} 
      />

    </div>
  );
}
