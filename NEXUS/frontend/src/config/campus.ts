/**
 * Campus configuration — customizable per college.
 * Section 33 of the prompt: keep college-specific info configurable.
 */

export const campusConfig = {
  college: {
    name: 'National Institute of Technology',
    shortName: 'NIT',
    campusName: 'Main Campus',
    logo: '/nexus-logo.svg',
  },

  buildings: [
    {
      id: 'main',
      name: 'Main Building',
      shortName: 'Main',
      floors: 4,
      blocks: ['A'],
    },
    {
      id: 'b-block',
      name: 'B Block',
      shortName: 'B Block',
      floors: 4,
      blocks: ['B'],
    },
    {
      id: 'c-block',
      name: 'C Block',
      shortName: 'C Block',
      floors: 3,
      blocks: ['C'],
    },
    {
      id: 'library',
      name: 'Central Library',
      shortName: 'Library',
      floors: 3,
      blocks: [],
    },
    {
      id: 'admin',
      name: 'Admin Block',
      shortName: 'Admin',
      floors: 2,
      blocks: [],
    },
    {
      id: 'workshop',
      name: 'Workshop Complex',
      shortName: 'Workshop',
      floors: 2,
      blocks: [],
    },
  ],

  landmarks: [
    'Main Gate',
    'Library Entrance',
    'Canteen',
    'Auditorium',
    'Sports Ground',
    'Parking Area',
    'Garden',
    'Workshop',
    'Hostel Block',
  ],

  departments: [
    { id: 'cse', name: 'Computer Science & Engineering' },
    { id: 'ece', name: 'Electronics & Communication' },
    { id: 'eee', name: 'Electrical & Electronics' },
    { id: 'mech', name: 'Mechanical Engineering' },
    { id: 'civil', name: 'Civil Engineering' },
    { id: 'admin', name: 'Administration' },
    { id: 'facilities', name: 'Facilities & Maintenance' },
    { id: 'library', name: 'Library Services' },
    { id: 'security', name: 'Campus Security' },
  ],

  categories: [
    {
      id: 'maintenance',
      label: 'Maintenance & Infrastructure',
      icon: 'Wrench',
      color: '#f59e0b',
    },
    {
      id: 'classroom',
      label: 'Classroom / Lab / Resources',
      icon: 'GraduationCap',
      color: '#3b82f6',
    },
    {
      id: 'academic',
      label: 'Academic / Administrative',
      icon: 'BookOpen',
      color: '#8b5cf6',
    },
    {
      id: 'campus_info',
      label: 'Campus Information',
      icon: 'Info',
      color: '#06d6f2',
    },
    {
      id: 'safety',
      label: 'Safety & Accessibility',
      icon: 'ShieldAlert',
      color: '#ef4444',
    },
    {
      id: 'energy',
      label: 'Energy / Resource Efficiency',
      icon: 'Zap',
      color: '#22c55e',
    },
  ],

  severityLevels: [
    { id: 'low', label: 'Low', color: '#22c55e' },
    { id: 'medium', label: 'Medium', color: '#f59e0b' },
    { id: 'high', label: 'High', color: '#ef4444' },
    { id: 'critical', label: 'Critical', color: '#dc2626' },
  ],

  statusFlow: [
    'reported',
    'ai_analyzed',
    'assigned',
    'in_progress',
    'resolved',
    'closed',
  ] as const,

  branding: {
    primary: '#06d6f2',
    secondary: '#8b5cf6',
    accent: '#3b82f6',
  },
};

export type IncidentStatus = (typeof campusConfig.statusFlow)[number];
