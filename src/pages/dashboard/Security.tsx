import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  Lock, 
  Smartphone, 
  Key, 
  Eye, 
  EyeOff, 
  Globe, 
  Fingerprint,
  ChevronRight,
  ShieldCheck,
  ShieldAlert,
  History,
  AlertTriangle,
  RefreshCw,
  Zap,
  Activity,
  UserCheck,
  Cpu,
  Monitor
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

export default function SecurityDashboard() {
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [securityScore, setSecurityScore] = useState(94);

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 pb-24 space-y-16">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/[0.02] blur-[150px] pointer-events-none rounded-full" />

      {/* Header & Score Section */}
      <div className="flex flex-col lg:flex-row items-center lg:items-end justify-between gap-12 border-b border-white/5 pb-16">
        <div className="space-y-4">
           <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[8px] font-black uppercase text-emerald-500 tracking-[0.3em] italic">
                 Node Intelligence: High
              </span>
           </div>
          <h1 className="text-4xl lg:text-6xl font-display font-black text-white italic tracking-tighter leading-none uppercase">
            SECURITY / <span className="text-gold">VAULT</span>
          </h1>
          <p className="text-zinc-600 font-bold uppercase tracking-[0.4em] text-[10px] mt-2 italic">
            Monitor and configure high-level encryption matrices and access protocols.
          </p>
        </div>
        
        <div className="bg-zinc-950 border border-white/5 rounded-[2.5rem] p-8 lg:p-10 flex items-center gap-10 shadow-2xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-4 text-gold/5 group-hover:text-gold transition-colors duration-1000">
              <Activity size={40} />
           </div>
           <div className="relative">
              <svg className="w-24 h-24 transform -rotate-90">
                 <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-zinc-900" />
                 <motion.circle 
                    cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" 
                    strokeDasharray={251.2}
                    initial={{ strokeDashoffset: 251.2 }}
                    animate={{ strokeDashoffset: 251.2 - (251.2 * securityScore) / 100 }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    className="text-gold" 
                 />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                 <span className="text-2xl font-display font-black text-white italic">{securityScore}%</span>
              </div>
           </div>
           <div>
              <p className="text-[10px] font-black uppercase text-zinc-600 tracking-widest mb-1">PROTECTION_SCORE</p>
              <p className="text-sm font-black text-white uppercase italic tracking-tighter">VAULT_HARDENED</p>
           </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
         {/* Core hardening Controls */}
         <div className="lg:col-span-2 space-y-12">
            <section className="bg-zinc-950 border border-white/5 rounded-[3rem] p-10 lg:p-14 shadow-2xl space-y-12 relative overflow-hidden">
               <div className="absolute top-0 left-0 p-8 text-white/[0.02] pointer-events-none">
                  <Shield size={120} />
               </div>
               <h3 className="text-2xl font-display font-black text-white italic tracking-tighter uppercase mb-2 flex items-center gap-4">
                  <div className="w-1.5 h-6 bg-gold" /> ACCESS HARDENING
               </h3>

               <div className="space-y-8">
                  {/* MFA Toggle */}
                  <div className="flex items-center justify-between p-8 bg-black border border-white/5 rounded-[2rem] group hover:border-gold/30 transition-all">
                     <div className="flex items-center gap-8">
                        <div className={cn(
                           "w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all",
                           mfaEnabled ? "bg-gold text-black" : "bg-zinc-900 text-zinc-700"
                        )}>
                           <Smartphone size={28} strokeWidth={2.5} />
                        </div>
                        <div>
                           <h4 className="text-lg font-black text-white uppercase italic tracking-tighter mb-1">MULTI-FACTOR UPLINK</h4>
                           <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest italic leading-relaxed">
                              Secondary authentication layer via encrypted signal receiver.
                           </p>
                        </div>
                     </div>
                     <div 
                        onClick={() => setMfaEnabled(!mfaEnabled)}
                        className={cn(
                           "w-16 h-8 rounded-full relative p-1 cursor-pointer transition-all duration-500",
                           mfaEnabled ? "bg-gold" : "bg-zinc-900 shadow-inner border border-white/5"
                        )}
                     >
                        <motion.div 
                           animate={{ x: mfaEnabled ? 32 : 0 }}
                           className={cn("w-6 h-6 rounded-full shadow-lg", mfaEnabled ? "bg-black" : "bg-zinc-800")} 
                        />
                     </div>
                  </div>

                  {/* Password Modification */}
                  <div className="flex items-center justify-between p-8 bg-black border border-white/5 rounded-[2rem] group hover:border-gold/30 transition-all">
                     <div className="flex items-center gap-8">
                        <div className="w-16 h-16 bg-zinc-900 border border-white/10 text-zinc-700 rounded-[1.5rem] flex items-center justify-center group-hover:bg-gold group-hover:text-black transition-all">
                           <Key size={28} strokeWidth={2.5} />
                        </div>
                        <div>
                           <h4 className="text-lg font-black text-white uppercase italic tracking-tighter mb-1">PASSWORD ROTATION</h4>
                           <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest italic leading-relaxed">
                              Cycle your high-entropy passphrase regularly.
                           </p>
                        </div>
                     </div>
                     <button className="px-6 py-3 bg-zinc-900 text-zinc-400 group-hover:text-gold text-[9px] font-black uppercase tracking-widest italic rounded-xl border border-white/5 group-hover:border-gold/30 transition-all">
                        INITIATE_CYCLE
                     </button>
                  </div>
               </div>
            </section>

            {/* Session Intelligence */}
            <section className="bg-zinc-950 border border-white/5 rounded-[3rem] p-10 lg:p-14 shadow-2xl relative overflow-hidden">
               <h3 className="text-2xl font-display font-black text-white italic tracking-tighter uppercase mb-12 flex items-center gap-4">
                  <div className="w-1.5 h-6 bg-gold" /> SESSION AUDIT TRAIL
               </h3>
               
               <div className="space-y-6">
                  {[
                    { device: 'iPhone 15 Pro Max', location: 'London, UK', ip: '142.190.11.23', time: 'Active Now', icon: Smartphone, active: true },
                    { device: 'MacBook Pro 16', location: 'Zurich, CH', ip: '192.162.1.18', time: '2 hours ago', icon: Monitor, active: false },
                    { device: 'Chrome Terminal', location: 'Singapore, SG', ip: '210.12.115.4', time: 'Yesterday', icon: Globe, active: false }
                  ].map((session, idx) => (
                    <div key={idx} className="flex items-center justify-between p-8 bg-black border border-white/5 rounded-[2rem] group hover:border-gold/20 transition-all">
                       <div className="flex items-center gap-6">
                          <div className={cn(
                             "w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-700",
                             session.active ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]" : "bg-zinc-900 border-white/5 text-zinc-600"
                          )}>
                             <session.icon size={24} />
                          </div>
                          <div>
                             <div className="flex items-center gap-3">
                                <h4 className="text-sm font-black text-white uppercase italic tracking-widest">{session.device}</h4>
                                {session.active && <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,1)]" />}
                             </div>
                             <p className="text-[10px] text-zinc-700 font-bold uppercase tracking-widest mt-1">
                                {session.location} • {session.ip}
                             </p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest italic mb-2">{session.time}</p>
                          {!session.active && (
                             <button className="text-[8px] font-black text-red-500 uppercase tracking-widest italic hover:underline">TERMINATE_NODE</button>
                          )}
                       </div>
                    </div>
                  ))}
               </div>
               
               <div className="pt-10 mt-10 border-t border-white/5 flex justify-center">
                  <button className="text-[10px] font-black text-zinc-700 hover:text-white uppercase tracking-[0.4em] italic transition-colors">
                     PURGE ALL REMOTE SESSIONS
                  </button>
               </div>
            </section>
         </div>

         {/* Emergency & Status */}
         <div className="space-y-12">
            <div className="bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-500/20 rounded-[3rem] p-10 lg:p-12 shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 text-red-500/10 group-hover:scale-125 transition-transform duration-1000">
                  <ShieldAlert size={80} />
               </div>
               <div className="space-y-8 relative z-10">
                  <div className="w-16 h-16 bg-red-500 text-white rounded-2xl flex items-center justify-center shadow-[0_15px_30px_rgba(239,68,68,0.3)]">
                     <ShieldAlert size={32} strokeWidth={2.5} />
                  </div>
                  <div className="space-y-4">
                     <h3 className="text-2xl font-display font-black text-white italic tracking-tighter uppercase">PROTOCOL LOCKDOWN</h3>
                     <p className="text-red-500/60 text-[10px] font-black uppercase tracking-widest leading-relaxed italic">
                        INSTANTLY FREEZE ALL LEDGERS AND TERMINATE ALL UPLINKS. ONLY USE IN CRITICAL COMPROMISE.
                     </p>
                  </div>
                  <button className="w-full py-6 bg-red-500 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.5em] italic shadow-2xl hover:scale-105 transition-all">
                     ACTIVATE_GRID_KILL
                  </button>
               </div>
            </div>

            <div className="bg-zinc-950 border border-white/5 rounded-[3rem] p-10 lg:p-12 shadow-2xl space-y-12">
               <h3 className="text-xl font-display font-black text-white italic tracking-tighter uppercase flex items-center gap-4">
                  <div className="w-1.5 h-6 bg-gold" /> SYSTEM INTEGRITY
               </h3>
               
               <div className="space-y-8">
                  {[
                    { label: 'E2E Encryption', status: 'ACTIVE', icon: Lock, color: 'text-emerald-500' },
                    { label: 'Quantum Shield', status: 'SYNCHRONIZED', icon: Cpu, color: 'text-emerald-500' },
                    { label: 'Global Node Sync', status: '100% NOMINAL', icon: RefreshCw, color: 'text-gold' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between group">
                       <div className="flex items-center gap-5">
                          <item.icon size={18} className="text-zinc-800 group-hover:text-gold transition-colors" />
                          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest italic group-hover:text-zinc-300 transition-colors">{item.label}</span>
                       </div>
                       <span className={cn("text-[9px] font-black uppercase tracking-widest italic", item.color)}>{item.status}</span>
                    </div>
                  ))}
               </div>

               <div className="pt-8 border-t border-white/5">
                  <p className="text-[8px] text-zinc-800 font-black uppercase tracking-[0.3em] scroll-mx-12 italic leading-relaxed">
                     BY ACCESSING THE SECURITY VAULT, YOU ACKNOWLEDGE THE EVERMONT INTERNATIONAL SOVEREIGN BINDING AGREEMENT V3.1.
                  </p>
               </div>
            </div>

            <div className="bg-gold p-10 rounded-[3rem] shadow-[0_20px_50px_rgba(212,175,55,0.2)] group cursor-pointer hover:scale-[1.02] transition-all relative overflow-hidden">
               <div className="absolute -top-10 -right-10 w-40 h-40 bg-black/5 blur-[50px] rounded-full" />
               <div className="w-14 h-14 bg-black text-gold rounded-xl flex items-center justify-center mb-8">
                  <Zap size={24} />
               </div>
               <h4 className="text-xl font-display font-black text-black italic tracking-tighter uppercase mb-2">VULNERABILITY SCAN</h4>
               <p className="text-black/60 text-[9px] font-black uppercase tracking-widest italic mb-6 leading-relaxed">
                  RUN DEEP-NODE SCAN TO DETECT LATENT THREATS.
               </p>
               <div className="flex items-center gap-3 text-black font-black text-[10px] uppercase tracking-widest">
                  RUN_DIAGNOSTICS <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-700" />
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

