import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  ShieldCheck, 
  ArrowRight, 
  Info,
  Building,
  CheckCircle2,
  Clock,
  DollarSign
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useNavigate } from 'react-router-dom';

export default function TaxRefund() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 space-y-10 pb-24 text-white">
      {/* Header */}
      <div className="space-y-4 text-center">
         <h1 className="text-4xl lg:text-6xl font-display font-black text-white italic tracking-tighter leading-none uppercase">
          TAX <span className="text-gold">REFUND</span>
        </h1>
        <p className="text-zinc-600 font-bold uppercase tracking-[0.3em] text-[10px] mt-2 italic">
          Verify your fiscal identity to claim your refund.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div 
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-10"
          >
            {/* Balance Card */}
            <div className="bg-gradient-to-br from-zinc-900 to-black p-12 rounded-[3.5rem] border border-white/5 shadow-2xl relative overflow-hidden group text-center">
              <div className="absolute top-0 right-0 p-8 text-gold/5 pointer-events-none group-hover:text-gold/10 transition-colors">
                <Building size={160} />
              </div>
              <div className="relative z-10 space-y-4">
                <p className="text-[10px] font-black text-gold uppercase tracking-[0.4em] italic">Current Refund Balance</p>
                <h2 className="text-7xl font-display font-black text-white italic tracking-tighter leading-none">
                  $0.00
                </h2>
                <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest italic">Calculated based on your last node audit</p>
              </div>
            </div>

            {/* Info Warning */}
            <div className="bg-[#FFFFCC] p-8 border border-amber-200 rounded-[2.5rem] flex gap-6 items-start">
              <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                <Info className="text-amber-600" size={24} strokeWidth={2.5} />
              </div>
              <div className="space-y-2">
                 <h4 className="text-[11px] font-black text-amber-900 uppercase tracking-widest italic">Node Reclamation Protocols</h4>
                 <p className="text-[10px] font-bold text-amber-800/80 leading-relaxed uppercase tracking-tight italic">
                  Ensure all identity packets match official government records. Discrepancies may trigger a full node audit and delay your liquidity injection for 30-90 cycles.
                 </p>
              </div>
            </div>

            {/* Form */}
            <div className="bg-zinc-950 border border-white/5 rounded-[3.5rem] p-10 lg:p-14 space-y-10 shadow-2xl">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-zinc-800 uppercase tracking-widest ml-2 italic">Full Name on Tax File *</label>
                  <input 
                    placeholder="HENRY DAVID" 
                    className="w-full bg-black border border-white/10 rounded-2xl p-6 text-[11px] font-black text-white uppercase italic tracking-widest outline-none focus:border-gold transition-all" 
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-zinc-800 uppercase tracking-widest ml-2 italic">SSN / TAX IDENTIFIER *</label>
                  <input 
                    placeholder="000-00-0000" 
                    className="w-full bg-black border border-white/10 rounded-2xl p-6 text-[11px] font-black text-white uppercase italic tracking-widest outline-none focus:border-gold transition-all" 
                  />
                </div>
                <div className="col-span-full space-y-4">
                   <label className="text-[10px] font-black text-zinc-800 uppercase tracking-widest ml-2 italic">Mailing Address *</label>
                   <input 
                    placeholder="ENTER FULL ADDRESS..." 
                    className="w-full bg-black border border-white/10 rounded-2xl p-6 text-[11px] font-black text-white uppercase italic tracking-widest outline-none focus:border-gold transition-all" 
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-zinc-800 uppercase tracking-widest ml-2 italic">City *</label>
                  <input 
                    placeholder="CITY" 
                    className="w-full bg-black border border-white/10 rounded-2xl p-6 text-[11px] font-black text-white uppercase italic tracking-widest outline-none focus:border-gold transition-all" 
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-zinc-800 uppercase tracking-widest ml-2 italic">State *</label>
                  <input 
                    placeholder="STATE" 
                    className="w-full bg-black border border-white/10 rounded-2xl p-6 text-[11px] font-black text-white uppercase italic tracking-widest outline-none focus:border-gold transition-all" 
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-zinc-800 uppercase tracking-widest ml-2 italic">ZIP Code *</label>
                  <input 
                    placeholder="00000" 
                    className="w-full bg-black border border-white/10 rounded-2xl p-6 text-[11px] font-black text-white uppercase italic tracking-widest outline-none focus:border-gold transition-all" 
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-zinc-800 uppercase tracking-widest ml-2 italic">Tax Year *</label>
                  <select className="w-full bg-black border border-white/10 rounded-2xl p-6 text-[11px] font-black text-white uppercase italic tracking-widest outline-none focus:border-gold appearance-none">
                    <option>2025 PROTOCOL</option>
                    <option>2024 PROTOCOL</option>
                    <option>2023 PROTOCOL</option>
                  </select>
                </div>
              </div>

              <button 
                onClick={() => setStep(2)}
                className="w-full h-24 bg-gold text-black rounded-3xl text-[11px] font-black uppercase tracking-[0.5em] italic shadow-[0_20px_50px_rgba(212,175,55,0.25)] hover:scale-105 active:scale-95 transition-all group flex items-center justify-center gap-4 mt-8"
              >
                Process Tax Refund <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-zinc-950 border border-white/5 rounded-[4rem] p-16 text-center space-y-12 shadow-2xl relative overflow-hidden"
          >
             <div className="absolute top-0 right-0 p-12 text-emerald-500/5 pointer-events-none">
                <CheckCircle2 size={200} />
             </div>
             
             <div className="relative inline-block">
                <div className="absolute inset-0 bg-emerald-500 blur-[80px] opacity-20" />
                <div className="w-40 h-40 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500 relative z-10 mx-auto">
                   <Clock size={80} strokeWidth={2.5} className="animate-pulse" />
                </div>
             </div>

             <div className="space-y-6 relative z-10">
                <h3 className="text-4xl lg:text-6xl font-display font-black text-white italic tracking-tighter uppercase leading-none">REFUND <span className="text-emerald-500">PENDING</span></h3>
                <p className="text-zinc-600 font-bold max-w-lg mx-auto text-[10px] uppercase leading-loose tracking-widest italic">
                  Your tax refund request has been successfully submitted to the Treasury. Verification is now in progress. Normal processing takes 14-21 business days.
                </p>
             </div>

             <div className="p-10 bg-black border border-white/5 rounded-[2.5rem] flex flex-col gap-3 max-w-sm mx-auto relative z-10 text-center">
                <p className="text-[9px] text-zinc-800 font-black uppercase tracking-[0.5em] italic">Tracking ID</p>
                <p className="text-xl font-display font-black text-gold uppercase tracking-tighter">#TAX-SRC-{Math.floor(Math.random()*1000000)}</p>
             </div>

             <div className="pt-8 relative z-10">
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="bg-gold text-black px-16 py-8 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.4em] italic shadow-2xl hover:scale-105 transition-all w-full sm:w-auto"
                >
                   Return to Hub
                </button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
