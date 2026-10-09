import { motion } from 'framer-motion';
import { CalendarDays } from 'lucide-react';
import { NexusAIBar } from '@/components/NexusAIBar';

export function FacultyDashboard() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-2xl lg:text-3xl font-bold text-nexus-text">Academic Operations</h1>
        <p className="text-sm text-nexus-text-secondary mt-1">Manage classes, room bookings, and requests.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div className="glass rounded-2xl p-5" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h2 className="text-sm font-bold text-nexus-text mb-4 flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-nexus-cyan" />
            Today's Schedule
          </h2>
          <div className="space-y-3">
            <div className="p-3 bg-nexus-surface-2 rounded-xl border border-nexus-border flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-nexus-text">CS-401 Algorithms</p>
                <p className="text-xs text-nexus-text-muted mt-0.5">10:00 AM - 11:30 AM</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono bg-nexus-surface-3 px-2 py-1 rounded text-nexus-text-secondary">Room 102</span>
              </div>
            </div>
            <div className="p-3 bg-nexus-surface-2 rounded-xl border border-nexus-border flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-nexus-text">Office Hours</p>
                <p className="text-xs text-nexus-text-muted mt-0.5">2:00 PM - 4:00 PM</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono bg-nexus-surface-3 px-2 py-1 rounded text-nexus-text-secondary">Faculty Block C</span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="space-y-6">
          <NexusAIBar 
            title="NEXUS Assistant"
            placeholder="Book a room, report issue..."
            suggestedPrompts={[
              { text: 'Find projector for tomorrow' },
              { text: 'Request seminar hall' }
            ]}
          />
        </div>
      </div>
    </div>
  );
}
