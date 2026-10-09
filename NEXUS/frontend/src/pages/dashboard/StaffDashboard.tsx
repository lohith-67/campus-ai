import { motion } from 'framer-motion';
import { ListTodo, CheckCircle2, Clock, Play, FileText, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export function StaffDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState<any[]>([]);

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const data = await api.get('/api/incidents/');
        setIncidents(data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchIncidents();
  }, []);

  const handleStartWork = async (id: string) => {
    try {
      await api.patch(`/api/incidents/${id}/status`, { status: 'in_progress' });
      setIncidents(prev => prev.map(inc => inc.id === id ? { ...inc, status: 'in_progress' } : inc));
      toast.success('Task started!');
    } catch (e) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-2xl lg:text-3xl font-bold text-nexus-text">My Work Queue</h1>
        <p className="text-sm text-nexus-text-secondary mt-1">Manage assigned operational tasks and updates.</p>
      </motion.div>

      {/* Staff task summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Assigned Tasks', value: incidents.length.toString(), icon: ListTodo, color: 'text-nexus-blue' },
          { label: 'In Progress', value: incidents.filter(i => i.status === 'in_progress').length.toString(), icon: Play, color: 'text-nexus-cyan' },
          { label: 'High Priority', value: incidents.filter(i => i.severity === 'high' || i.severity === 'critical').length.toString(), icon: AlertTriangle, color: 'text-nexus-red' },
          { label: 'Resolved Today', value: incidents.filter(i => i.status === 'resolved').length.toString(), icon: CheckCircle2, color: 'text-nexus-green' },
        ].map((stat, i) => (
          <motion.div key={stat.label} className="glass rounded-2xl p-5 hover:border-nexus-cyan/20 transition-all duration-300" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
              <p className="text-xs text-nexus-text-secondary">{stat.label}</p>
            </div>
            <p className="text-2xl font-bold text-nexus-text">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <motion.div className="glass rounded-2xl overflow-hidden" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <div className="px-5 py-4 border-b border-nexus-border flex justify-between items-center">
          <h2 className="text-sm font-semibold text-nexus-text">Task Queue</h2>
          <span className="text-xs px-2 py-1 bg-nexus-surface-3 rounded text-nexus-text-secondary">Sorted by Priority</span>
        </div>
        <div className="divide-y divide-nexus-border">
          {incidents.length === 0 ? (
             <div className="p-8 text-center text-nexus-text-muted">No tasks in queue.</div>
          ) : (
            incidents.map((inc) => (
              <div key={inc.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-nexus-surface-2/20">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-nexus-text-muted">{inc.id}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${inc.severity === 'high' || inc.severity === 'critical' ? 'bg-nexus-red/20 text-red-400' : 'bg-nexus-amber/20 text-amber-400'}`}>
                      {inc.severity?.toUpperCase() || 'MEDIUM'}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-nexus-cyan/20 text-cyan-400">
                      {inc.status?.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-sm font-medium text-nexus-text">{inc.title}</h3>
                  <p className="text-xs text-nexus-text-secondary mt-1">{inc.location} • {new Date(inc.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                  {inc.status !== 'in_progress' && inc.status !== 'resolved' && (
                    <button onClick={() => handleStartWork(inc.id)} className="px-4 py-2 text-xs font-medium rounded-xl bg-nexus-cyan/10 text-nexus-cyan border border-nexus-cyan/20 hover:bg-nexus-cyan/20 transition-colors flex items-center gap-1.5">
                      <Play className="w-3.5 h-3.5" /> Start Work
                    </button>
                  )}
                  <button onClick={() => navigate(`/dashboard/incidents/${inc.id}`)} className="px-4 py-2 text-xs font-medium rounded-xl bg-nexus-surface-3 text-nexus-text hover:bg-nexus-surface border border-nexus-border transition-colors flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" /> Details
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}
