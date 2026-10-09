/**
 * Rooms & Resources Page — view availability and request bookings.
 */

import { motion, AnimatePresence } from 'framer-motion';
import {
  DoorOpen,
  Users,
  Monitor,
  Wifi,
  Wind,
  Search,
  Loader2,
  X,
  Calendar,
  Clock,
  Briefcase
} from 'lucide-react';
import { useState, useEffect, type FormEvent } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface Room {
  id: string;
  name: string;
  building: string;
  block?: string;
  floor?: string;
  room_type?: string;
  capacity: int;
  status: string;
  resources: string[];
  current_event?: string;
}

const statusConfig: Record<string, { label: string; color: string; dot: string }> = {
  available: { label: 'Available', color: 'text-green-400', dot: 'bg-nexus-green' },
  occupied: { label: 'Occupied', color: 'text-nexus-amber', dot: 'bg-nexus-amber' },
  maintenance: { label: 'Maintenance', color: 'text-nexus-red', dot: 'bg-nexus-red' },
  reserved: { label: 'Reserved', color: 'text-nexus-violet', dot: 'bg-nexus-violet' },
};

const amenityIcons: Record<string, typeof Monitor> = {
  projector: Monitor,
  computers: Monitor,
  ac: Wind,
  wifi: Wifi,
  mic: Users,
  whiteboard: Briefcase,
};

export default function RoomsPage() {
  const { user } = useAuth();

  // Data state
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters state
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Booking modal state
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  // Booking form state
  const [bookingForm, setBookingForm] = useState({
    date: new Date().toISOString().split('T')[0],
    start_time: '09:00',
    end_time: '10:00',
    purpose: '',
    expected_attendees: 10,
  });

  const fetchRooms = async () => {
    try {
      setLoading(true);
      setError('');
      
      const queryParams = new URLSearchParams();
      if (statusFilter !== 'all') queryParams.append('status', statusFilter);
      // NOTE: We don't filter by type in the backend yet, filtering on client.
      
      const data = await api.get<Room[]>(`/api/rooms/?${queryParams.toString()}`);
      setRooms(data);
    } catch (err: any) {
      console.error('Failed to fetch rooms:', err);
      setError(err.message || 'Failed to load rooms. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [statusFilter]);

  const handleBookingSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedRoom) return;

    if (!bookingForm.purpose.trim()) {
      setSubmitError('Please enter a purpose for the booking.');
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError('');
      
      await api.post('/api/rooms/bookings', {
        room_id: selectedRoom.id,
        date: bookingForm.date,
        start_time: bookingForm.start_time,
        end_time: bookingForm.end_time,
        purpose: bookingForm.purpose,
        expected_attendees: parseInt(bookingForm.expected_attendees.toString()),
      });
      
      setSelectedRoom(null);
      setBookingForm({
        date: new Date().toISOString().split('T')[0],
        start_time: '09:00',
        end_time: '10:00',
        purpose: '',
        expected_attendees: 10,
      });
      
      // We could optionally refetch or show a toast message here
      alert("Booking request submitted successfully.");
    } catch (err: any) {
      console.error('Failed to submit booking:', err);
      setSubmitError(err.message || 'Failed to submit booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = rooms.filter((room) => {
    if (typeFilter !== 'all' && room.room_type !== typeFilter) return false;
    if (search && !room.name.toLowerCase().includes(search.toLowerCase()) && !room.building.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-nexus-text">Rooms & Resources</h1>
        <p className="text-sm text-nexus-text-secondary">
          View availability and manage campus spaces
        </p>
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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search rooms..."
            className="flex-1 py-2 bg-transparent text-sm text-nexus-text placeholder:text-nexus-text-muted focus:outline-none"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="bg-nexus-surface-2 border border-nexus-border rounded-lg px-3 py-2 text-xs text-nexus-text focus:outline-none focus:border-nexus-cyan/50"
          aria-label="Filter by type"
        >
          <option value="all">All Types</option>
          <option value="classroom">Classrooms</option>
          <option value="lab">Labs</option>
          <option value="seminar_hall">Seminar Halls</option>
          <option value="meeting_room">Meeting Rooms</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-nexus-surface-2 border border-nexus-border rounded-lg px-3 py-2 text-xs text-nexus-text focus:outline-none focus:border-nexus-cyan/50"
          aria-label="Filter by status"
        >
          <option value="all">All Status</option>
          <option value="available">Available</option>
          <option value="occupied">Occupied</option>
          <option value="maintenance">Maintenance</option>
          <option value="reserved">Reserved</option>
        </select>
      </motion.div>

      {/* Error state */}
      {error && (
        <div className="px-4 py-3 rounded-xl bg-nexus-red/10 border border-nexus-red/30 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Room Cards Grid */}
      <div className="relative min-h-[300px]">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-nexus-bg/50 backdrop-blur-sm z-10 rounded-2xl">
            <Loader2 className="w-8 h-8 text-nexus-cyan animate-spin" />
          </div>
        ) : null}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {!loading && filtered.map((room, i) => {
            const st = statusConfig[room.status || 'available'] || statusConfig.available;
            return (
              <motion.div
                key={room.id}
                onClick={() => setSelectedRoom(room)}
                className="glass rounded-2xl p-5 hover:border-nexus-cyan/40 transition-all duration-300 cursor-pointer group hover:bg-nexus-surface-2"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.03 }}
                tabIndex={0}
                role="button"
                aria-label={`Book ${room.name} - ${st.label}`}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-nexus-surface-3 flex items-center justify-center group-hover:bg-nexus-cyan/10 transition-colors">
                    <DoorOpen className="w-4 h-4 text-nexus-text-secondary group-hover:text-nexus-cyan transition-colors" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${st.dot}`} />
                    <span className={`text-xs font-medium ${st.color}`}>{st.label}</span>
                  </div>
                </div>

                {/* Info */}
                <h3 className="font-semibold text-nexus-text mb-0.5">{room.name}</h3>
                <p className="text-xs text-nexus-text-secondary mb-3">
                  {room.building}{room.floor ? `, Floor ${room.floor}` : ''}
                </p>

                {/* Capacity */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1 text-xs text-nexus-text-muted">
                    <Users className="w-3 h-3" />
                    <span>Capacity: {room.capacity}</span>
                  </div>
                </div>

                {/* Amenities */}
                <div className="flex gap-1.5 mt-3">
                  {(room.resources || []).slice(0, 4).map((a) => {
                    const Icon = amenityIcons[a.toLowerCase()] ?? Briefcase;
                    return (
                      <div
                        key={a}
                        className="w-6 h-6 rounded-md bg-nexus-surface-3 flex items-center justify-center"
                        title={a}
                      >
                        <Icon className="w-3 h-3 text-nexus-text-muted" />
                      </div>
                    );
                  })}
                  {(room.resources || []).length > 4 && (
                    <div className="w-6 h-6 rounded-md bg-nexus-surface-3 flex items-center justify-center text-[10px] text-nexus-text-muted">
                      +{(room.resources || []).length - 4}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {!loading && filtered.length === 0 && !error && (
          <div className="col-span-full text-center py-12 text-nexus-text-muted glass rounded-2xl">
            <DoorOpen className="w-8 h-8 mx-auto mb-2 opacity-40" />
            No rooms match your filters.
          </div>
        )}
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {selectedRoom && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => !isSubmitting && setSelectedRoom(null)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md glass rounded-2xl p-6 shadow-2xl border border-nexus-border overflow-hidden"
            >
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-xl font-bold text-nexus-text">Book {selectedRoom.name}</h2>
                  <p className="text-xs text-nexus-text-secondary mt-1">{selectedRoom.building} (Capacity: {selectedRoom.capacity})</p>
                </div>
                <button 
                  onClick={() => setSelectedRoom(null)}
                  disabled={isSubmitting}
                  className="text-nexus-text-muted hover:text-nexus-text transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {submitError && (
                <div className="mb-4 px-4 py-2.5 rounded-xl bg-nexus-red/10 border border-nexus-red/30 text-sm text-red-400">
                  {submitError}
                </div>
              )}

              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div>
                  <label htmlFor="purpose" className="block text-sm font-medium text-nexus-text-secondary mb-1.5">
                    Purpose of Booking <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="purpose"
                    type="text"
                    required
                    maxLength={100}
                    value={bookingForm.purpose}
                    onChange={(e) => setBookingForm({...bookingForm, purpose: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl bg-nexus-surface-2 border border-nexus-border text-nexus-text placeholder:text-nexus-text-muted focus:border-nexus-cyan/50 focus:outline-none transition-colors"
                    placeholder="e.g. Study group, Guest lecture"
                  />
                </div>

                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-nexus-text-secondary mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" /> Date <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="date"
                    type="date"
                    required
                    value={bookingForm.date}
                    onChange={(e) => setBookingForm({...bookingForm, date: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2.5 rounded-xl bg-nexus-surface-2 border border-nexus-border text-nexus-text focus:border-nexus-cyan/50 focus:outline-none transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="start_time" className="block text-sm font-medium text-nexus-text-secondary mb-1.5 flex items-center gap-1.5">
                      <Clock className="w-4 h-4" /> Start Time
                    </label>
                    <input
                      id="start_time"
                      type="time"
                      required
                      value={bookingForm.start_time}
                      onChange={(e) => setBookingForm({...bookingForm, start_time: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl bg-nexus-surface-2 border border-nexus-border text-nexus-text focus:border-nexus-cyan/50 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="end_time" className="block text-sm font-medium text-nexus-text-secondary mb-1.5 flex items-center gap-1.5">
                      <Clock className="w-4 h-4" /> End Time
                    </label>
                    <input
                      id="end_time"
                      type="time"
                      required
                      value={bookingForm.end_time}
                      onChange={(e) => setBookingForm({...bookingForm, end_time: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl bg-nexus-surface-2 border border-nexus-border text-nexus-text focus:border-nexus-cyan/50 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="expected_attendees" className="block text-sm font-medium text-nexus-text-secondary mb-1.5">
                    Expected Attendees <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="expected_attendees"
                    type="number"
                    min="1"
                    max={selectedRoom.capacity}
                    required
                    value={bookingForm.expected_attendees}
                    onChange={(e) => setBookingForm({...bookingForm, expected_attendees: parseInt(e.target.value) || 1})}
                    className="w-full px-4 py-2.5 rounded-xl bg-nexus-surface-2 border border-nexus-border text-nexus-text focus:border-nexus-cyan/50 focus:outline-none transition-colors"
                  />
                  <p className="text-[10px] text-nexus-text-muted mt-1">
                    Maximum capacity: {selectedRoom.capacity}
                  </p>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedRoom(null)}
                    disabled={isSubmitting}
                    className="px-5 py-2.5 rounded-xl font-medium text-nexus-text bg-nexus-surface-2 border border-nexus-border hover:bg-nexus-surface-3 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 rounded-xl font-medium text-white bg-gradient-to-r from-nexus-violet to-nexus-blue hover:shadow-lg hover:shadow-nexus-violet/20 transition-all disabled:opacity-50 flex items-center justify-center min-w-[140px]"
                  >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Request Booking'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
