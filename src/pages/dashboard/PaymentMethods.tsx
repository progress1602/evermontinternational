import React from 'react';
import { motion } from 'motion/react';
import { 
  CreditCard, 
  Bitcoin, 
  Smartphone, 
  Landmark, 
  ShieldCheck, 
  Globe, 
  Zap,
  Lock,
  ArrowUpRight,
  Wallet
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

type MethodDetail = {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  speed: string;
  limit: string;
  color: string;
};

const METHODS: MethodDetail[] = [
  {
    id: 'crypto',
    name: 'BLOCKCHAIN LIQUIDITY',
    icon: Bitcoin,
    description: 'Instant settlement via BTC, ETH, and USDT ERC20/TRC20 protocols.',
    speed: 'INSTANT • 24/7',
    limit: 'UNLIMITED',
    color: 'amber'
  },
  {
    id: 'wallets',
    name: 'DIGITAL WALLET CORRIDORS',
    icon: Smartphone,
    description: 'Rapid asset migration via Skrill, PayPal, CashApp, and Neteller.',
    speed: '0 - 2 HOURS',
    limit: '$100,000 / TNX',
    color: 'emerald'
  },
  {
    id: 'wire',
    name: 'GLOBAL SWIFT WIRE',
    icon: Landmark,
    description: 'Sovereign-grade bank corridors for institutional liquidity transfers.',
    speed: '24 - 72 HOURS',
    limit: '$5,000,000 / DAY',
    color: 'blue'
  },
  {
    id: 'wise',
    name: 'WISE / CROSS-BORDER',
    icon: Globe,
    description: 'Optimized multi-currency exit protocols for low-latency global settlement.',
    speed: '4 - 24 HOURS',
    limit: '$500,000 / TNX',
    color: 'gold'
  }
];

export default function PaymentMethods() {
  return (
    <div className="max-w-6xl mx-auto py-12 px-6 pb-24">
      <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-[100px] pointer-events-none" />

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 border-b border-white/5 pb-10 mb-16">
        <div className="space-y-4">
           <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-gold/10 border border-gold/20 rounded-full text-[8px] font-black uppercase text-gold tracking-[0.3em] italic">
                 Protocol: Asset Entry/Exit
              </span>
           </div>
          <h1 className="text-4xl lg:text-6xl font-display font-black text-white italic tracking-tighter leading-none uppercase">
            PAYMENT <span className="text-gold">PROTOCOLS</span>
          </h1>
          <p className="text-zinc-600 font-bold uppercase tracking-[0.3em] text-[10px] mt-2 italic">
            Authorized corridors for liquidity migration and node fueling.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
         {METHODS.map((m, i) => (
           <motion.div
             key={m.id}
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: i * 0.1 }}
             className="bg-zinc-950 border border-white/5 rounded-[3rem] p-10 relative overflow-hidden group hover:border-gold/20 transition-all duration-500 shadow-2xl"
           >
              <div className="absolute top-0 right-0 p-8 text-white/[0.02] group-hover:text-gold/5 transition-colors">
                 <m.icon size={120} strokeWidth={1} />
              </div>

              <div className="flex items-start justify-between mb-12 relative z-10">
                 <div className="w-16 h-16 bg-black border border-white/10 rounded-2xl flex items-center justify-center text-zinc-600 group-hover:text-gold group-hover:border-gold/30 transition-all duration-500">
                   <m.icon size={28} strokeWidth={2.5} />
                 </div>
                 <div className="p-3 bg-zinc-900 border border-white/5 rounded-xl flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest italic leading-none">Status: Operational</span>
                 </div>
              </div>

              <div className="space-y-6 relative z-10 mb-12">
                 <h3 className="text-2xl font-display font-black text-white italic tracking-tighter uppercase leading-none group-hover:text-gold transition-colors">{m.name}</h3>
                 <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest leading-loose italic max-w-sm">{m.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-6 relative z-10 border-t border-white/5 pt-10">
                 <div>
                    <p className="text-[8px] text-zinc-800 font-black uppercase italic tracking-widest mb-1">Settlement Speed</p>
                    <p className="text-sm font-black text-white italic tracking-tighter">{m.speed}</p>
                 </div>
                 <div>
                    <p className="text-[8px] text-zinc-800 font-black uppercase italic tracking-widest mb-1">TNX Capability</p>
                    <p className="text-sm font-black text-white italic tracking-tighter">{m.limit}</p>
                 </div>
              </div>
           </motion.div>
         ))}
      </div>

      <div className="mt-20 pt-20 border-t border-white/5">
         <div className="bg-gradient-to-r from-zinc-950 to-black border border-white/5 rounded-[4rem] p-12 lg:p-20 flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 blur-[120px] pointer-events-none" />
            
            <div className="space-y-8 max-w-xl relative z-10">
               <h3 className="text-3xl lg:text-5xl font-display font-black text-white italic tracking-tighter uppercase leading-[0.9]">
                  ENCRYPTED <span className="text-gold">MIGRATION</span> PROTOCOLS
               </h3>
               <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.3em] leading-loose italic">
                  All liquidity corridors are protected by <span className="text-white">Quantum-Resistant Encryption</span> and <span className="text-white text-[10px] font-black uppercase italic">ISO-NODE-20022</span> regulatory compliance frameworks.
               </p>
               <div className="flex gap-4">
                  <div className="flex items-center gap-2 px-4 py-2 bg-black border border-white/10 rounded-lg">
                     <Lock size={12} className="text-gold" />
                     <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest italic leading-none">AES-256 SECURED</span>
                  </div>
                   <div className="flex items-center gap-2 px-4 py-2 bg-black border border-white/10 rounded-lg">
                     <ShieldCheck size={12} className="text-emerald-500" />
                     <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest italic leading-none">TN-V2 VERIFIED</span>
                  </div>
               </div>
            </div>

            <div className="w-full lg:w-auto relative z-10">
               <div className="bg-gold text-black p-10 rounded-[3rem] shadow-[0_30px_70px_rgba(212,175,55,0.3)] space-y-8 min-w-[320px]">
                  <div className="w-16 h-16 bg-black text-gold rounded-2xl flex items-center justify-center">
                     <Lock size={32} strokeWidth={3} />
                  </div>
                  <div className="space-y-2">
                     <p className="text-[10px] font-black tracking-[0.4em] uppercase opacity-60 italic leading-none">Security Node</p>
                     <h4 className="text-2xl font-display font-black uppercase italic tracking-tighter leading-none">EVERMONT INTERNATIONAL SHIELD</h4>
                  </div>
                  <p className="text-[9px] font-bold uppercase tracking-widest leading-relaxed">
                     ZERO-KNOWLEDGE PROOFS ENSURE TRANSFERS REMAIN PRIVATE AND UNTRACEABLE TO EXTERNAL ACTORS.
                  </p>
                  <button className="w-full bg-black text-white py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] italic hover:scale-105 transition-transform flex items-center justify-center gap-3">
                     SECURITY AUDIT <ArrowUpRight size={18} />
                  </button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
