import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Users
} from 'lucide-react';

const incidentData = [
  { name: 'Mon', tickets: 12 },
  { name: 'Tue', tickets: 19 },
  { name: 'Wed', tickets: 15 },
  { name: 'Thu', tickets: 8 },
  { name: 'Fri', tickets: 22 },
  { name: 'Sat', tickets: 5 },
  { name: 'Sun', tickets: 3 },
];

const resourceUtilization = [
  { name: 'Main Building', usage: 85 },
  { name: 'B Block', usage: 60 },
  { name: 'C Block', usage: 92 },
  { name: 'Library', usage: 45 },
  { name: 'Workshop', usage: 30 },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-nexus-text">Analytics & Insights</h1>
        <p className="text-sm text-nexus-text-secondary">
          Data-driven overview of campus operations
        </p>
      </motion.div>

      {/* AI Insight Bar */}
      <motion.div
        className="glass rounded-2xl p-5 border border-nexus-cyan/30 bg-nexus-cyan/5 flex gap-4 items-start"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="w-10 h-10 rounded-xl bg-nexus-cyan/20 flex items-center justify-center shrink-0">
          <TrendingUp className="w-5 h-5 text-nexus-cyan" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-nexus-text mb-1">NEXUS AI Insight</h3>
          <p className="text-sm text-nexus-text-secondary leading-relaxed">
            Based on this week's data, <span className="text-nexus-cyan font-medium">C Block</span> is experiencing the highest utilization rate (92%) and the most IT-related incidents. Consider reallocating Lab 2 resources to off-peak hours to balance the load.
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Incident Trends */}
        <motion.div
          className="glass rounded-2xl p-5"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-bold text-nexus-text">Incident Trends</h2>
            <div className="flex gap-2">
              <span className="px-2 py-1 rounded bg-nexus-surface-3 text-[10px] text-nexus-text-secondary">This Week</span>
            </div>
          </div>
          
          {/* Custom minimal bar chart */}
          <div className="h-48 flex items-end justify-between gap-2 px-2">
            {incidentData.map((data, i) => (
              <div key={data.name} className="flex flex-col items-center gap-2 flex-1 group">
                <div 
                  className="w-full bg-nexus-surface-3 rounded-t-sm group-hover:bg-nexus-blue/50 transition-colors relative"
                  style={{ height: `${(data.tickets / 25) * 100}%` }}
                >
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-nexus-surface border border-nexus-border px-2 py-1 rounded text-xs text-nexus-text transition-opacity z-10 pointer-events-none">
                    {data.tickets}
                  </div>
                </div>
                <span className="text-xs text-nexus-text-muted">{data.name}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Resource Utilization */}
        <motion.div
          className="glass rounded-2xl p-5"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-bold text-nexus-text">Space Utilization</h2>
            <div className="flex gap-2">
              <span className="px-2 py-1 rounded bg-nexus-surface-3 text-[10px] text-nexus-text-secondary">Today</span>
            </div>
          </div>

          <div className="space-y-4">
            {resourceUtilization.map((resource) => (
              <div key={resource.name}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-nexus-text">{resource.name}</span>
                  <span className="text-nexus-text-secondary font-mono">{resource.usage}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-nexus-surface-3 overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      resource.usage > 80 ? 'bg-nexus-red' : 
                      resource.usage > 50 ? 'bg-nexus-amber' : 'bg-nexus-cyan'
                    }`}
                    style={{ width: `${resource.usage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Avg Resolution Time", value: "4.2 hrs", icon: Clock, color: "text-nexus-cyan" },
          { label: "Resolution Rate", value: "94%", icon: CheckCircle2, color: "text-nexus-green" },
          { label: "Critical Issues", value: "2", icon: AlertTriangle, color: "text-nexus-red" },
          { label: "Active Users", value: "1,204", icon: Users, color: "text-nexus-blue" },
        ].map((kpi, i) => (
          <motion.div
            key={kpi.label}
            className="glass rounded-xl p-4 flex flex-col gap-2"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + (i * 0.1) }}
          >
            <div className="flex items-center gap-2">
              <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
              <span className="text-xs text-nexus-text-secondary">{kpi.label}</span>
            </div>
            <span className="text-xl font-bold text-nexus-text">{kpi.value}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
