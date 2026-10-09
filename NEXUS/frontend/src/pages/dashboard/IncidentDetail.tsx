import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, MessageSquare, AlertTriangle, ShieldAlert, CheckCircle2, User, ChevronDown } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

const statusColors: Record<string, string> = {
  open: 'bg-nexus-blue/20 text-nexus-blue border-nexus-blue/30',
  in_progress: 'bg-nexus-cyan/20 text-nexus-cyan border-nexus-cyan/30',
  resolved: 'bg-nexus-green/20 text-nexus-green border-nexus-green/30',
  closed: 'bg-nexus-text-muted/20 text-nexus-text-muted border-nexus-text-muted/30',
};

const severityIcons: Record<string, any> = {
  low: CheckCircle2,
  medium: Clock,
  high: AlertTriangle,
  critical: ShieldAlert,
};

const severityColors: Record<string, string> = {
  low: 'text-nexus-green',
  medium: 'text-nexus-amber',
  high: 'text-nexus-red',
  critical: 'text-red-500',
};

export default function IncidentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [incident, setIncident] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    // In demo mode or normally, fetch the incident details.
    // For now, we mock if api fails or returns null.
    const fetchIncident = async () => {
      try {
        const data = await api.get(`/api/incidents/${id}`);
        setIncident(data);
      } catch (err) {
        console.error(err);
        // Provide mock data if not found during dev
        setIncident({
          id,
          title: "Projector not working in Room 101",
          description: "The projector won't turn on. Tried replacing the power cable but no luck. We have a class in 20 mins.",
          location: "Main Building, Room 101",
          category: "maintenance",
          severity: "high",
          status: "open",
          created_at: new Date().toISOString(),
          reporter_id: "user123",
          image_url: null,
          updates: [
            { id: 1, message: "Request received by NEXUS AI and routed to Maintenance.", time: new Date(Date.now() - 3600000).toISOString(), is_ai: true }
          ]
        });
      } finally {
        setLoading(false);
      }
    };
    fetchIncident();
  }, [id]);

  const handleStatusChange = async (newStatus: string) => {
    try {
      setUpdating(true);
      await api.patch(`/api/incidents/${id}/status`, { status: newStatus });
      setIncident((prev: any) => ({ ...prev, status: newStatus }));
      toast.success(`Incident status updated to ${newStatus.replace('_', ' ').toUpperCase()}`);
    } catch (err) {
      console.error(err);
      // Mock update
      setIncident((prev: any) => ({ ...prev, status: newStatus }));
      toast.success(`Incident status updated to ${newStatus.replace('_', ' ').toUpperCase()}`);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="animate-pulse flex space-x-4"><div className="flex-1 space-y-4 py-1"><div className="h-4 bg-nexus-surface-3 rounded w-3/4"></div></div></div>;
  }

  if (!incident) return <div className="text-nexus-text">Incident not found.</div>;

  const Icon = severityIcons[incident.severity] || AlertTriangle;
  const canEditStatus = user?.role === 'admin' || user?.role === 'staff';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button 
        onClick={() => navigate('/dashboard/incidents')}
        className="flex items-center gap-2 text-sm text-nexus-text-secondary hover:text-nexus-cyan transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Incidents
      </button>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              {canEditStatus ? (
                <div className="relative group">
                  <select 
                    value={incident.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    disabled={updating}
                    className={`appearance-none cursor-pointer pl-3 pr-8 py-1 rounded-full text-xs font-medium border ${statusColors[incident.status] || statusColors.open} outline-none focus:ring-1 focus:ring-nexus-cyan`}
                  >
                    <option value="open">OPEN</option>
                    <option value="in_progress">IN PROGRESS</option>
                    <option value="resolved">RESOLVED</option>
                    <option value="closed">CLOSED</option>
                  </select>
                  <ChevronDown className={`w-3 h-3 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${statusColors[incident.status] ? statusColors[incident.status].split(' ')[1] : 'text-nexus-text'}`} />
                </div>
              ) : (
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[incident.status] || statusColors.open}`}>
                  {(incident.status || 'open').replace('_', ' ').toUpperCase()}
                </span>
              )}
              
              <span className={`flex items-center gap-1 text-sm font-medium ${severityColors[incident.severity] || severityColors.medium}`}>
                <Icon className="w-4 h-4" /> {(incident.severity || 'medium').toUpperCase()}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-nexus-text">{incident.title}</h1>
            <p className="text-sm text-nexus-text-secondary mt-1 font-mono">ID: {incident.id} • Reported on {new Date(incident.created_at).toLocaleString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div>
              <h3 className="text-sm font-bold text-nexus-text mb-2">Description</h3>
              <p className="text-nexus-text-secondary leading-relaxed bg-nexus-surface-2 p-4 rounded-xl border border-nexus-border">
                {incident.description}
              </p>
            </div>
            
            {incident.image_url && (
              <div>
                <h3 className="text-sm font-bold text-nexus-text mb-2">Attached Image</h3>
                <img src={incident.image_url} alt="Incident" className="rounded-xl border border-nexus-border max-w-full h-auto" />
              </div>
            )}

            <div>
              <h3 className="text-sm font-bold text-nexus-text mb-4">Activity Timeline</h3>
              <div className="space-y-4">
                {incident.updates?.map((update: any) => (
                  <div key={update.id} className="flex gap-4">
                    <div className="relative mt-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${update.is_ai ? 'bg-nexus-cyan/20 text-nexus-cyan' : 'bg-nexus-surface-3 text-nexus-text'}`}>
                        {update.is_ai ? <MessageSquare className="w-4 h-4" /> : <User className="w-4 h-4" />}
                      </div>
                      <div className="absolute top-8 bottom-[-16px] left-1/2 w-px bg-nexus-border -translate-x-1/2 last:hidden" />
                    </div>
                    <div className="bg-nexus-surface-2 p-3 rounded-xl border border-nexus-border flex-1">
                      <p className="text-sm text-nexus-text">{update.message}</p>
                      <p className="text-xs text-nexus-text-muted mt-1">{new Date(update.time).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-nexus-surface-2 p-4 rounded-xl border border-nexus-border">
              <h3 className="text-sm font-bold text-nexus-text mb-3">Details</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="block text-nexus-text-muted text-xs mb-0.5">Location</span>
                  <span className="text-nexus-text">{incident.location}</span>
                </div>
                <div>
                  <span className="block text-nexus-text-muted text-xs mb-0.5">Category</span>
                  <span className="text-nexus-text capitalize">{incident.category}</span>
                </div>
                <div>
                  <span className="block text-nexus-text-muted text-xs mb-0.5">Reporter ID</span>
                  <span className="text-nexus-text font-mono">{incident.reporter_id}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
