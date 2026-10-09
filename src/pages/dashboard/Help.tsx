import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  HelpCircle, 
  Search, 
  MessageSquare, 
  Zap, 
  ShieldAlert, 
  CreditCard,
  ChevronRight,
  Headphones,
  Mail,
  Send,
  CheckCircle2,
  Info
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useNavigate } from 'react-router-dom';

const HELP_CATEGORIES = [
  {
    id: 1,
    title: 'General Inquiry',
    desc: 'Basic node protocols and onboarding.',
    icon: HelpCircle,
    color: 'bg-blue-600'
  },
  {
    id: 2,
    title: 'Technical Support',
    desc: 'Anomalies and signal interference.',
    icon: Zap,
    color: 'bg-emerald-600'
  },
  {
    id: 3,
    title: 'Security Reports',
    desc: 'Breach alerts and node recovery.',
    icon: ShieldAlert,
    color: 'bg-red-600'
  },
  {
    id: 4,
    title: 'Billing & Liquidity',
    desc: 'Settlement issues and fee audits.',
    icon: CreditCard,
    color: 'bg-gold'
  }
];

export default function Help() {
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message) return;
    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      setMessage('');
    }, 3000);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 space-y-12 pb-24 text-white">
      {/* Header */}
      <div className="space-y-4 text-center">
         <h1 className="text-4xl lg:text-6xl font-display font-black text-white italic tracking-tighter leading-none uppercase">
          HELP <span className="text-gold">CENTER</span>
        </h1>
        <p className="text-zinc-600 font-bold uppercase tracking-[0.3em] text-[10px] mt-2 italic">
          Authorized node support and technical gateway.
        </p>
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 gap-6">
        {HELP_CATEGORIES.map((cat, idx) => (
          <motion.button
            key={cat.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            className="group flex items-start gap-6 bg-zinc-950 border border-white/5 rounded-[3rem] p-8 text-left hover:border-gold/30 transition-all shadow-2xl"
          >
            <div className={cn(
              "w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-xl group-hover:scale-110 transition-transform",
              cat.color === 'bg-gold' ? 'bg-gold text-black' : cat.color + ' text-white'
            )}>
              <cat.icon size={32} />
            </div>
            <div className="space-y-2">
               <h3 className="text-xl font-display font-black text-white italic tracking-tighter uppercase leading-none group-hover:text-gold transition-colors">
                 {cat.title}
               </h3>
               <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-relaxed italic">
                 {cat.desc}
               </p>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Support Form */}
      <div className="bg-zinc-950 border border-white/5 rounded-[4rem] p-10 lg:p-14 space-y-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 text-gold/5 pointer-events-none">
          <MessageSquare size={160} />
        </div>
        
        <div className="space-y-2 relative z-10">
          <h3 className="text-3xl font-display font-black text-white italic tracking-tighter uppercase leading-none">Broadcast <span className="text-gold">Packet</span></h3>
          <p className="text-zinc-600 font-bold uppercase tracking-[0.3em] text-[10px] italic">Direct uplink to the support council</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
          <div className="space-y-4">
             <label className="text-[10px] font-black text-zinc-800 uppercase tracking-widest ml-2 italic">Select Category *</label>
             <div className="relative">
                <select className="w-full bg-black border border-white/10 rounded-2xl p-6 text-[11px] font-black text-white uppercase italic tracking-widest outline-none focus:border-gold appearance-none">
                   {HELP_CATEGORIES.map(c => <option key={c.id}>{c.title}</option>)}
                </select>
                <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-600 rotate-90" size={18} />
             </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-zinc-800 uppercase tracking-widest ml-2 italic">Message Detail *</label>
            <textarea 
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="DESCRIBE THE PROTOCOL BLOCKAGE..." 
              className="w-full bg-black border border-white/10 rounded-3xl p-8 text-[11px] font-black text-white uppercase italic tracking-widest outline-none focus:border-gold transition-all resize-none" 
            />
          </div>

          <button 
            type="submit"
            disabled={isSent || !message}
            className={cn(
              "w-full h-24 rounded-3xl text-[11px] font-black uppercase tracking-[0.5em] italic transition-all group flex items-center justify-center gap-4 disabled:opacity-30",
              isSent ? "bg-zinc-800 text-gold" : "bg-gold text-black shadow-2xl hover:scale-[1.02] active:scale-95"
            )}
          >
            {isSent ? (
              <>Packet Sent <CheckCircle2 size={24} /></>
            ) : (
              <>Initialize Broadcast <Send size={22} className="group-hover:translate-x-1" /></>
            )}
          </button>
        </form>

        <div className="pt-10 border-t border-white/5 grid sm:grid-cols-2 gap-8 relative z-10">
           <div className="flex items-center gap-4 text-zinc-600">
              <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center border border-white/5">
                 <Headphones size={20} />
              </div>
              <div>
                 <p className="text-[8px] font-black uppercase tracking-widest">Voice Support</p>
                 <p className="text-[10px] font-black text-white">+1 (800) TRUST-NOVA</p>
              </div>
           </div>
           <div className="flex items-center gap-4 text-zinc-600">
              <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center border border-white/5">
                 <Mail size={20} />
              </div>
              <div>
                 <p className="text-[8px] font-black uppercase tracking-widest">Email Ledger</p>
                 <p className="text-[10px] font-black text-white">SUPPORT@EVERMONTINTERNATIONAL.COM</p>
              </div>
           </div>
        </div>
      </div>

      <p className="text-center text-[7px] text-zinc-900 font-black uppercase tracking-[0.8em] italic">
        EVERMONT INTERNATIONAL SECURE SUPPORT GATEWAY V1.0
      </p>
    </div>
  );
}
