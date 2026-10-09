/**
 * Incidents Page — list & filter incidents, and report new ones.
 */

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Filter, Plus, Search, Loader2, X } from 'lucide-react';
import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { campusConfig } from '@/config/campus';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { GuidedRequestModal } from '@/components/GuidedRequestModal';

// Define the incident type
interface Incident {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  severity: string;
  status: string;
  reporter_id: string;
  assignee_id?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

const severityColors: Record<string, string> = {
  low: 'bg-nexus-green/20 text-green-400',
  medium: 'bg-nexus-amber/20 text-amber-400',
  high: 'bg-nexus-red/20 text-red-400',
  critical: 'bg-red-600/20 text-red-300',
};

const statusColors: Record<string, string> = {
  open: 'bg-nexus-blue/20 text-blue-400',
  in_progress: 'bg-nexus-cyan/20 text-cyan-400',
  resolved: 'bg-nexus-green/20 text-green-400',
  closed: 'bg-nexus-text-muted/20 text-nexus-text-muted',
};

export default function IncidentsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // State for incidents list
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // State for filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');
  
  // State for report modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: campusConfig.categories[0].id,
    severity: 'medium',
    location: '',
  });

  // Fetch incidents
  const fetchIncidents = async () => {
    try {
      setLoading(true);
      setError('');
      
      const queryParams = new URLSearchParams();
      if (filterCategory !== 'all') queryParams.append('category', filterCategory);
      if (filterSeverity !== 'all') queryParams.append('priority', filterSeverity);
      
      const data = await api.get<Incident[]>(`/api/incidents/?${queryParams.toString()}`);
      setIncidents(data);
    } catch (err: any) {
      console.error('Failed to fetch incidents:', err);
      setError(err.message || 'Failed to load incidents. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, [filterCategory, filterSeverity]);

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim() || !formData.location.trim()) {
      setSubmitError('Please fill in all required fields.');
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError('');
      
      await api.post('/api/incidents/', {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        category: formData.category,
        priority: formData.severity, // Backend uses 'priority', frontend used 'severity'
      });
      
      setIsModalOpen(false);
      setFormData({
        title: '',
        description: '',
        category: campusConfig.categories[0].id,
        severity: 'medium',
        location: '',
      });
      
      fetchIncidents(); // Refresh list
    } catch (err: any) {
      console.error('Failed to submit incident:', err);
      setSubmitError(err.message || 'Failed to submit incident. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter by search query (client-side)
  const filtered = incidents.filter((inc) => {
    if (searchQuery && !inc.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      <motion.div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-2xl font-bold text-nexus-text">Incidents</h1>
          <p className="text-sm text-nexus-text-secondary">
            Track and manage campus issues
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-white bg-gradient-to-r from-nexus-cyan to-nexus-blue hover:shadow-lg hover:shadow-nexus-cyan/20 transition-all text-sm"
        >
          <Plus className="w-4 h-4" />
          Report Issue
        </button>
      </motion.div>

      {/* Filters */}
      <motion.div
        className="glass rounded-2xl p-4 flex flex-col sm:flex-row gap-3"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex-1 flex items-center gap-2 bg-nexus-surface-2 rounded-xl border border-nexus-border px-3">
          <Search className="w-4 h-4 text-nexus-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search incidents..."
            className="flex-1 py-2 bg-transparent text-sm text-nexus-text placeholder:text-nexus-text-muted focus:outline-none"
          />
        </div>

        <div className="flex gap-2">
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-nexus-text-muted" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-nexus-surface-2 border border-nexus-border rounded-lg px-3 py-2 text-xs text-nexus-text focus:outline-none focus:border-nexus-cyan/50"
              aria-label="Filter by category"
            >
              <option value="all">All Categories</option>
              {campusConfig.categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="bg-nexus-surface-2 border border-nexus-border rounded-lg px-3 py-2 text-xs text-nexus-text focus:outline-none focus:border-nexus-cyan/50"
            aria-label="Filter by severity"
          >
            <option value="all">All Severity</option>
            {campusConfig.severityLevels.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Error state */}
      {error && (
        <div className="px-4 py-3 rounded-xl bg-nexus-red/10 border border-nexus-red/30 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Incidents Table */}
      <motion.div
        className="glass rounded-2xl overflow-hidden min-h-[300px] relative"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-nexus-bg/50 backdrop-blur-sm z-10">
            <Loader2 className="w-8 h-8 text-nexus-cyan animate-spin" />
          </div>
        ) : null}

        <div className="overflow-x-auto">
          <table className="w-full text-sm" aria-label="Incidents table">
            <thead>
              <tr className="border-b border-nexus-border text-nexus-text-muted text-xs uppercase tracking-wider">
                <th className="text-left px-5 py-3 font-medium">Issue</th>
                <th className="text-left px-5 py-3 font-medium hidden md:table-cell">Location</th>
                <th className="text-left px-5 py-3 font-medium">Severity</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
                <th className="text-left px-5 py-3 font-medium hidden lg:table-cell">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-nexus-border">
              {!loading && filtered.map((inc) => (
                <tr
                  key={inc.id}
                  onClick={() => navigate(`/dashboard/incidents/${inc.id}`)}
                  className="hover:bg-nexus-surface-2/50 transition-colors cursor-pointer"
                  tabIndex={0}
                  role="button"
                  aria-label={`View ${inc.title}`}
                >
                  <td className="px-5 py-3 text-nexus-text">
                    <div className="font-medium">{inc.title}</div>
                    <div className="text-xs text-nexus-text-muted mt-1 font-mono">{inc.id}</div>
                  </td>
                  <td className="px-5 py-3 text-nexus-text-secondary hidden md:table-cell">
                    {inc.location}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${severityColors[inc.severity] || severityColors.medium}`}>
                      {(inc.severity || 'medium').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-medium ${statusColors[inc.status] || statusColors.open}`}>
                      {(inc.status || 'open').replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-nexus-text-secondary hidden lg:table-cell text-xs">
                    {new Date(inc.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {!loading && filtered.length === 0 && !error && (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-nexus-text-muted">
                    <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    No incidents match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Report Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <GuidedRequestModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            onSuccess={() => {
              setIsModalOpen(false);
              fetchIncidents();
            }} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
