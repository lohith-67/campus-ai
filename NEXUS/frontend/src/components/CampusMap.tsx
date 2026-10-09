import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Building2, Server, FlaskConical, BookOpen } from 'lucide-react';

const buildings = [
  { id: 'main', name: 'Main Admin', x: 50, y: 30, icon: Building2, status: 'normal', color: 'nexus-cyan', desc: 'Administrative operations running normally.' },
  { id: 'block-b', name: 'B Block', x: 20, y: 50, icon: Server, status: 'issue', color: 'nexus-amber', desc: '2 active IT maintenance requests.' },
  { id: 'block-c', name: 'C Block (Labs)', x: 75, y: 60, icon: FlaskConical, status: 'critical', color: 'nexus-red', desc: 'Critical equipment failure reported.' },
  { id: 'library', name: 'Library', x: 40, y: 80, icon: BookOpen, status: 'available', color: 'nexus-green', desc: 'High availability. 4 study rooms free.' },
];

export function CampusMap() {
  const [hoveredBuilding, setHoveredBuilding] = useState<string | null>(null);

  return (
    <div className="relative w-full aspect-video md:aspect-[2/1] bg-nexus-surface rounded-2xl border border-nexus-border overflow-hidden perspective-1000 flex items-center justify-center p-8">
      
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:40px_40px] pointer-events-none" />
      
      {/* Isometric Container */}
      <motion.div 
        className="relative w-full max-w-2xl aspect-video preserve-3d"
        initial={{ rotateX: 60, rotateZ: -45, y: 50, scale: 0.8, opacity: 0 }}
        animate={{ rotateX: 60, rotateZ: -45, y: 0, scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        {/* Base plane */}
        <div className="absolute inset-0 bg-nexus-surface-2/30 border border-nexus-cyan/20 rounded-3xl shadow-[0_0_50px_rgba(0,195,255,0.1)] backdrop-blur-sm" />
        
        {/* Buildings */}
        {buildings.map((b) => (
          <motion.div
            key={b.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group preserve-3d"
            style={{ left: `${b.x}%`, top: `${b.y}%` }}
            onMouseEnter={() => setHoveredBuilding(b.id)}
            onMouseLeave={() => setHoveredBuilding(null)}
            whileHover={{ translateZ: 20 }}
          >
            {/* Pulsing indicator */}
            <div className={`absolute -inset-8 bg-${b.color}/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse`} />

            {/* Building 3D Block representation */}
            <div className={`relative w-16 h-16 md:w-20 md:h-20 bg-nexus-surface border border-${b.color}/40 rounded-xl flex items-center justify-center shadow-lg transition-colors group-hover:bg-${b.color}/10 group-hover:border-${b.color}`}>
              <b.icon className={`w-8 h-8 text-${b.color} group-hover:text-white transition-colors`} />
            </div>

          </motion.div>
        ))}
      </motion.div>

      {/* Floating Info Panels (2D overlay) */}
      <AnimatePresence>
        {hoveredBuilding && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 glass px-6 py-4 rounded-2xl border-nexus-cyan/30 flex flex-col items-center text-center max-w-sm pointer-events-none"
          >
            {(() => {
              const b = buildings.find(x => x.id === hoveredBuilding)!;
              return (
                <>
                  <h3 className="text-sm font-bold text-nexus-text flex items-center gap-2">
                    <b.icon className={`w-4 h-4 text-${b.color}`} />
                    {b.name}
                  </h3>
                  <p className="text-xs text-nexus-text-secondary mt-1">{b.desc}</p>
                </>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
