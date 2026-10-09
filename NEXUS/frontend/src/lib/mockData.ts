/**
 * Mock data for demo mode when Supabase is not configured.
 */

// Mutable state to simulate database across navigation in demo mode
let incidents = [
  { id: 'INC-1042', title: 'AC Failure in Room 304', category: 'maintenance', severity: 'high', status: 'assigned', location: 'B Block, Room 304', reporter_id: 'user1', created_at: '2025-10-07T10:30:00Z', updated_at: '2025-10-07T10:30:00Z' },
  { id: 'INC-1041', title: 'Projector not working', category: 'classroom', severity: 'medium', status: 'in_progress', location: 'Main Building, Room 204', reporter_id: 'user2', created_at: '2025-10-07T09:45:00Z', updated_at: '2025-10-07T09:45:00Z' },
  { id: 'INC-1040', title: 'Water leakage near B Block', category: 'maintenance', severity: 'high', status: 'open', location: 'B Block, 2nd Floor', reporter_id: 'user3', created_at: '2025-10-07T09:00:00Z', updated_at: '2025-10-07T09:00:00Z' },
  { id: 'INC-1039', title: 'Accessible entrance blocked', category: 'safety', severity: 'critical', status: 'assigned', location: 'Near Library', reporter_id: 'user4', created_at: '2025-10-07T08:30:00Z', updated_at: '2025-10-07T08:30:00Z' },
  { id: 'INC-1038', title: 'Lab PC not booting', category: 'it', severity: 'low', status: 'resolved', location: 'C Block, Lab 3', reporter_id: 'user5', created_at: '2025-10-07T07:15:00Z', updated_at: '2025-10-07T07:15:00Z' },
];

let rooms = [
  { id: 'r1', name: 'Room 101', building: 'Main Building', block: 'A', floor: '1', room_type: 'classroom', capacity: 60, status: 'available', resources: ['projector', 'ac', 'wifi'] },
  { id: 'r2', name: 'Room 204', building: 'Main Building', block: 'A', floor: '2', room_type: 'classroom', capacity: 40, status: 'occupied', resources: ['projector', 'ac', 'wifi'] },
  { id: 'r3', name: 'Room 304', building: 'B Block', block: 'B', floor: '3', room_type: 'classroom', capacity: 80, status: 'maintenance', resources: ['projector', 'ac', 'wifi'] },
  { id: 'r4', name: 'Lab 1 - CS', building: 'C Block', block: 'C', floor: '1', room_type: 'lab', capacity: 30, status: 'available', resources: ['computers', 'ac', 'wifi', 'projector'] },
  { id: 'r5', name: 'Lab 2 - Electronics', building: 'C Block', block: 'C', floor: '1', room_type: 'lab', capacity: 25, status: 'occupied', resources: ['workbenches', 'ac', 'wifi'] },
  { id: 'r6', name: 'Seminar Hall', building: 'Main Building', block: 'A', floor: '1', room_type: 'seminar_hall', capacity: 200, status: 'available', resources: ['projector', 'ac', 'wifi', 'mic'] },
  { id: 'r7', name: 'Lab 3 - Physics', building: 'C Block', block: 'C', floor: '2', room_type: 'lab', capacity: 35, status: 'available', resources: ['equipment', 'ac'] },
  { id: 'r8', name: 'Meeting Room 1', building: 'Admin Block', block: '', floor: '1', room_type: 'meeting_room', capacity: 12, status: 'reserved', resources: ['projector', 'ac', 'wifi', 'whiteboard'] },
];

export function getMockData(endpoint: string, options: any = {}) {
  const url = new URL(endpoint, 'http://localhost');
  const path = url.pathname;
  
  const method = options.method || 'GET';
  const body = options.body ? (typeof options.body === 'string' ? JSON.parse(options.body) : options.body) : null;

  // --- Incidents ---
  if (path.startsWith('/api/incidents')) {
    if (method === 'GET') {
      // Check if it's getting a specific incident by ID
      const parts = path.split('/');
      const id = parts[parts.length - 1];
      if (id && id !== 'incidents') {
        const incident = incidents.find(i => i.id === id);
        return incident || null;
      }

      const category = url.searchParams.get('category');
      const priority = url.searchParams.get('priority');
      const status = url.searchParams.get('status');
      
      let filtered = [...incidents];
      if (category) filtered = filtered.filter(i => i.category === category);
      if (priority) filtered = filtered.filter(i => i.severity === priority); // mapped priority to severity
      if (status) filtered = filtered.filter(i => i.status === status);
      
      return filtered;
    }
    if (method === 'POST') {
      const newInc = {
        id: `INC-${Math.floor(Math.random() * 10000)}`,
        ...body,
        severity: body.priority,
        status: 'open',
        reporter_id: 'demo-user',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      incidents = [newInc, ...incidents];
      return { id: newInc.id, message: 'Incident created', status: 'open' };
    }
    if (method === 'PATCH') {
      const parts = path.split('/');
      const id = parts[parts.length - 2]; // /api/incidents/:id/status
      const incidentIndex = incidents.findIndex(i => i.id === id);
      if (incidentIndex !== -1) {
        incidents[incidentIndex] = { ...incidents[incidentIndex], status: body.status, updated_at: new Date().toISOString() };
        return { success: true, status: body.status };
      }
      return { success: false, error: 'Not found' };
    }
  }

  // --- Rooms ---
  if (path.startsWith('/api/rooms')) {
    if (path.includes('/bookings') && method === 'POST') {
      return { id: `BKG-${Math.floor(Math.random() * 10000)}`, message: 'Booking request submitted', status: 'pending_approval' };
    }
    if (method === 'GET') {
      const status = url.searchParams.get('status');
      let filtered = [...rooms];
      if (status) filtered = filtered.filter(r => r.status === status);
      return filtered;
    }
  }

  // --- Chat ---
  if (path.startsWith('/api/chat') && method === 'POST') {
    const lastMessage = body?.messages?.[body.messages.length - 1]?.content || '';
    
    let responseText = "I'm NEXUS, your intelligent campus operations assistant. (Note: Running in Demo Mode with mock responses).";
    
    if (lastMessage.toLowerCase().includes('lab') || lastMessage.toLowerCase().includes('room')) {
       responseText = "I've checked the campus systems. Lab 1 - CS and Seminar Hall are currently available. Would you like me to book one for you?";
    } else if (lastMessage.toLowerCase().includes('report') || lastMessage.toLowerCase().includes('broken') || lastMessage.toLowerCase().includes('issue')) {
       responseText = "I can help you report that issue. Please provide a brief description and the location, and I'll create an incident report immediately.";
    }

    return {
      role: 'model',
      content: responseText
    };
  }

  return {};
}
