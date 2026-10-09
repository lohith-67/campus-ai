/**
 * NEXUS Landing Page
 * Section 11: Visually impressive hero with campus-tech aesthetic.
 */

import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import {
  Cpu,
  Zap,
  Shield,
  BarChart3,
  MessageSquareText,
  Building2,
} from 'lucide-react';
import { CampusMap } from '@/components/CampusMap';

const features = [
  {
    icon: MessageSquareText,
    title: 'Natural Language',
    desc: 'Tell NEXUS what you need in plain language.',
  },
  {
    icon: Cpu,
    title: 'AI-Powered',
    desc: 'Gemini understands, classifies, and acts.',
  },
  {
    icon: Building2,
    title: 'Campus-Wide',
    desc: 'Classrooms, labs, maintenance — all connected.',
  },
  {
    icon: BarChart3,
    title: 'Real-Time Insights',
    desc: 'Live analytics and operational intelligence.',
  },
  {
    icon: Shield,
    title: 'Secure & Verified',
    desc: 'Role-based access with audit trails.',
  },
  {
    icon: Zap,
    title: 'Instant Action',
    desc: 'Automated workflows with human oversight.',
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-nexus-bg nexus-grid overflow-hidden relative">
      {/* Ambient glow orbs */}
      <div className="absolute top-[-200px] left-[-100px] w-[500px] h-[500px] rounded-full bg-nexus-cyan/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-200px] right-[-100px] w-[600px] h-[600px] rounded-full bg-nexus-violet/5 blur-[120px] pointer-events-none" />

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 lg:px-12 py-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-nexus-cyan to-nexus-blue flex items-center justify-center">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-nexus-text">
            NEXUS
          </span>
        </div>
        <button
          onClick={() => navigate(user ? '/dashboard' : '/login')}
          className="px-5 py-2.5 text-sm font-medium rounded-xl bg-nexus-surface-2 border border-nexus-border text-nexus-text hover:border-nexus-cyan/50 hover:bg-nexus-surface-3 transition-all duration-300 focus-visible:outline-2 focus-visible:outline-nexus-cyan"
          aria-label={user ? 'Go to dashboard' : 'Sign in'}
        >
          {user ? 'Dashboard' : 'Sign In'}
        </button>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-16 pb-24 lg:pt-28 lg:pb-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full border border-nexus-border bg-nexus-surface/60 text-xs font-medium text-nexus-text-secondary">
            <span className="w-2 h-2 rounded-full bg-nexus-green pulse-dot" />
            Intelligent Campus Operations
          </div>

          {/* Title */}
          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-extrabold tracking-tight mb-6">
            <span className="text-gradient-cyan">NEXUS</span>
          </h1>

          <p className="text-lg sm:text-xl lg:text-2xl text-nexus-text-secondary max-w-2xl mx-auto mb-4 font-light">
            Connect. Understand. Act.
          </p>

          <p className="text-sm sm:text-base text-nexus-text-muted max-w-xl mx-auto mb-12">
            The intelligence layer of your campus — one interface to report issues,
            find resources, ask questions, and drive operations.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate(user ? '/dashboard' : '/login')}
              className="group relative px-8 py-3.5 rounded-2xl font-semibold text-white bg-gradient-to-r from-nexus-cyan to-nexus-blue hover:shadow-lg hover:shadow-nexus-cyan/20 transition-all duration-300 focus-visible:outline-2 focus-visible:outline-nexus-cyan"
              aria-label="Enter NEXUS platform"
            >
              Enter NEXUS
              <span className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
            <a
              href="#features"
              className="px-8 py-3.5 rounded-2xl font-medium text-nexus-text-secondary border border-nexus-border hover:border-nexus-cyan/40 hover:text-nexus-text transition-all duration-300"
            >
              Explore Campus Intelligence
            </a>
          </div>
        </motion.div>

        {/* Animated Campus Nodes – stylized campus visualization */}
        <motion.div
          className="relative mt-20 lg:mt-28 w-full max-w-5xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <CampusMap />
        </motion.div>
      </main>

      {/* Features Section */}
      <section
        id="features"
        className="relative z-10 max-w-6xl mx-auto px-6 pb-24"
      >
        <motion.h2
          className="text-2xl lg:text-3xl font-bold text-center mb-12 text-nexus-text"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          One Platform. Every Campus Operation.
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="glass rounded-2xl p-6 hover:border-nexus-cyan/30 transition-all duration-300 group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="w-10 h-10 rounded-xl bg-nexus-surface-3 flex items-center justify-center mb-4 group-hover:bg-nexus-cyan/10 transition-colors duration-300">
                <f.icon className="w-5 h-5 text-nexus-cyan" />
              </div>
              <h3 className="font-semibold text-nexus-text mb-1">{f.title}</h3>
              <p className="text-sm text-nexus-text-secondary">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-nexus-border py-8 text-center text-xs text-nexus-text-muted">
        <p>NEXUS — Intelligent Campus Operations Platform</p>
      </footer>
    </div>
  );
}

// ── Campus Node Component ────────────────────────────────────────────

function CampusNode({
  label,
  x,
  y,
  size = 'sm',
  color = 'cyan',
  delay = 0,
}: {
  label: string;
  x: string;
  y: string;
  size?: 'sm' | 'lg';
  color?: string;
  delay?: number;
}) {
  const colorMap: Record<string, string> = {
    cyan: 'bg-nexus-cyan/20 border-nexus-cyan/40 text-nexus-cyan',
    blue: 'bg-nexus-blue/20 border-nexus-blue/40 text-nexus-blue',
    violet: 'bg-nexus-violet/20 border-nexus-violet/40 text-nexus-violet',
    teal: 'bg-nexus-teal/20 border-nexus-teal/40 text-nexus-teal',
    amber: 'bg-nexus-amber/20 border-nexus-amber/40 text-nexus-amber',
    green: 'bg-nexus-green/20 border-nexus-green/40 text-nexus-green',
  };

  return (
    <motion.div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: x, top: y }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5 }}
    >
      <div
        className={`
          flex items-center justify-center rounded-full border
          animate-float
          ${colorMap[color] ?? colorMap.cyan}
          ${size === 'lg' ? 'w-20 h-20 text-xs font-bold' : 'w-14 h-14 text-[10px] font-medium'}
        `}
        style={{
          animationDelay: `${delay * 1000}ms`,
          backdropFilter: 'blur(8px)',
        }}
      >
        <span className="text-center leading-tight px-1">{label}</span>
      </div>
    </motion.div>
  );
}
