import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, ChevronRight, Loader2, Bot, CheckCircle2 } from 'lucide-react';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

interface GuidedRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function GuidedRequestModal({ isOpen, onClose, onSuccess }: GuidedRequestModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ title: '', description: '', location: '', image: null as string | null });
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleNext = () => {
    if (step === 3) {
      handleAiAnalysis();
    } else {
      setStep(s => s + 1);
    }
  };

  const handleAiAnalysis = async () => {
    setIsProcessing(true);
    setStep(4);
    try {
      // Send to our backend chat which handles tools, but here we just need structured extraction
      // For demo mode, we simulate AI analysis locally based on input
      await new Promise(r => setTimeout(r, 1500));
      
      const analysis = {
        category: formData.description.toLowerCase().includes('wifi') ? 'it_network' : 'maintenance',
        severity: formData.description.toLowerCase().includes('urgent') ? 'high' : 'medium',
        confidence: 'High',
        reason: 'Based on the description provided, this relates to standard campus operations.'
      };
      setAiAnalysis(analysis);
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async () => {
    setIsProcessing(true);
    try {
      await api.post('/api/incidents/', {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        category: aiAnalysis?.category || 'maintenance',
        priority: aiAnalysis?.severity || 'medium',
      });
      toast.success('Incident reported successfully!');
      onSuccess();
    } catch (err) {
      console.error(err);
      toast.error('Failed to report incident.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setFormData(p => ({ ...p, image: ev.target?.result as string }));
    reader.readAsDataURL(file);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg glass rounded-2xl overflow-hidden shadow-2xl border border-nexus-border flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-nexus-border">
          <h2 className="font-bold text-nexus-text flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-nexus-cyan/20 text-nexus-cyan flex items-center justify-center text-xs">{step}</span>
            {step === 1 ? 'What do you need?' : step === 2 ? 'Where is it?' : step === 3 ? 'Optional Evidence' : step === 4 ? 'AI Analysis' : 'Confirm'}
          </h2>
          <button onClick={onClose} className="text-nexus-text-muted hover:text-nexus-text"><X className="w-5 h-5" /></button>
        </div>

        {/* Content */}
        <div className="p-6 min-h-[300px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <div>
                  <label className="block text-sm text-nexus-text-secondary mb-2">Short summary</label>
                  <input autoFocus type="text" value={formData.title} onChange={e => setFormData(p => ({...p, title: e.target.value}))} className="w-full bg-nexus-surface-2 border border-nexus-border rounded-xl px-4 py-3 text-nexus-text focus:outline-none focus:border-nexus-cyan/50" placeholder="e.g. Projector not working" />
                </div>
                <div>
                  <label className="block text-sm text-nexus-text-secondary mb-2">Detailed description</label>
                  <textarea rows={3} value={formData.description} onChange={e => setFormData(p => ({...p, description: e.target.value}))} className="w-full bg-nexus-surface-2 border border-nexus-border rounded-xl px-4 py-3 text-nexus-text focus:outline-none focus:border-nexus-cyan/50 resize-none" placeholder="Provide more details..." />
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <label className="block text-sm text-nexus-text-secondary mb-2">Specific location or landmark</label>
                <input autoFocus type="text" value={formData.location} onChange={e => setFormData(p => ({...p, location: e.target.value}))} className="w-full bg-nexus-surface-2 border border-nexus-border rounded-xl px-4 py-3 text-nexus-text focus:outline-none focus:border-nexus-cyan/50" placeholder="e.g. B Block, Room 204" />
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col items-center justify-center">
                {formData.image ? (
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-nexus-cyan/30">
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                    <button onClick={() => setFormData(p => ({...p, image: null}))} className="absolute top-2 right-2 bg-black/60 p-2 rounded-full text-white"><X className="w-4 h-4" /></button>
                  </div>
                ) : (
                  <div onClick={() => fileInputRef.current?.click()} className="w-full aspect-video rounded-xl border-2 border-dashed border-nexus-border hover:border-nexus-cyan/50 bg-nexus-surface-2 flex flex-col items-center justify-center text-nexus-text-muted cursor-pointer transition-colors">
                    <Upload className="w-8 h-8 mb-3 text-nexus-cyan/50" />
                    <span className="text-sm font-medium text-nexus-text">Click to upload image</span>
                    <span className="text-xs mt-1">JPG, PNG up to 5MB</span>
                  </div>
                )}
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-full justify-center">
                {isProcessing ? (
                  <div className="flex flex-col items-center justify-center text-nexus-cyan gap-4">
                    <Loader2 className="w-8 h-8 animate-spin" />
                    <p className="text-sm animate-pulse">NEXUS AI is analyzing your request...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 bg-nexus-cyan/10 p-4 rounded-xl border border-nexus-cyan/20">
                      <Bot className="w-5 h-5 text-nexus-cyan" />
                      <p className="text-sm text-nexus-text leading-relaxed">I've analyzed your report. Here's what I understood and how I'll route it:</p>
                    </div>
                    <div className="bg-nexus-surface-2 p-4 rounded-xl border border-nexus-border space-y-3 text-sm">
                      <div className="flex justify-between"><span className="text-nexus-text-secondary">Category:</span> <span className="font-medium text-nexus-cyan">{aiAnalysis?.category.toUpperCase()}</span></div>
                      <div className="flex justify-between"><span className="text-nexus-text-secondary">Severity:</span> <span className="font-medium text-nexus-amber">{aiAnalysis?.severity.toUpperCase()}</span></div>
                      <div className="flex justify-between"><span className="text-nexus-text-secondary">Confidence:</span> <span className="font-medium text-nexus-green">{aiAnalysis?.confidence}</span></div>
                      <div className="pt-2 border-t border-nexus-border"><p className="text-xs text-nexus-text-secondary">{aiAnalysis?.reason}</p></div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-nexus-border flex justify-between bg-nexus-surface">
          <button 
            onClick={() => step > 1 ? setStep(s => s - 1) : onClose()} 
            disabled={isProcessing}
            className="px-4 py-2 text-sm text-nexus-text-muted hover:text-nexus-text transition-colors"
          >
            {step === 1 ? 'Cancel' : 'Back'}
          </button>
          
          <button 
            onClick={step === 4 && !isProcessing ? handleSubmit : handleNext}
            disabled={isProcessing || (step === 1 && !formData.title) || (step === 2 && !formData.location)}
            className="flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-nexus-cyan to-nexus-blue hover:shadow-lg disabled:opacity-50"
          >
            {step === 4 ? 'Confirm & Submit' : 'Next'}
            {step !== 4 && <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
