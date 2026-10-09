import React from 'react';
import { motion } from 'motion/react';
import { 
  Landmark, 
  TrendingUp, 
  Plus,
  ArrowUpRight,
  ShieldCheck,
  History,
  CreditCard,
  Wallet,
  Activity
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useStore } from '@/src/lib/store';
import { Link } from 'react-router-dom';

export default function Accounts() {
  const { accounts, memberSince, currency } = useStore();

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-gold/10 pb-12">
        <div>
           <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-gold/10 border border-gold/20 rounded-full text-[8px] font-black uppercase text-gold tracking-[0.3em] italic">
                 Global Sovereign Node
              </span>
           </div>
          <h1 className="text-4xl sm:text-5xl font-display font-black text-white italic tracking-tighter leading-none">
            ASSET <span className="text-gold uppercase">INVENTORY</span>
          </h1>
          <div className="flex items-center gap-6 mt-6">
             <div className="flex flex-col">
                <span className="text-zinc-600 font-black uppercase tracking-widest text-[8px]">Member Since</span>
                <span className="text-white font-black uppercase tracking-tighter text-xs italic">{memberSince}</span>
             </div>
             <div className="w-px h-8 bg-gold/10" />
             <div className="flex flex-col">
                <span className="text-zinc-600 font-black uppercase tracking-widest text-[8px]">Protocol Status</span>
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_10px_#10B981]" />
                   <span className="text-emerald-500 font-black uppercase tracking-tighter text-xs italic">Active Protocol</span>
                </div>
             </div>
          </div>
        </div>
        <button className="bg-gold text-black px-10 py-5 rounded-2xl flex items-center justify-center gap-4 w-full md:w-auto text-[11px] font-black uppercase tracking-[0.3em] italic shadow-[0_20px_50px_rgba(212,175,55,0.2)] hover:scale-105 active:scale-95 transition-all">
          <Plus size={18} strokeWidth={3} /> INITIALIZE NEW NODE
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {accounts.map((acc, i) => (
          <motion.div
            key={acc.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-zinc-950 border border-gold/10 rounded-[2.5rem] p-8 group hover:border-gold/30 transition-all cursor-pointer relative overflow-hidden shadow-2xl"
          >
            <div className="absolute top-0 right-0 p-8 text-[9px] font-black font-mono text-zinc-800 uppercase tracking-widest italic">{acc.id}</div>
            
            <div className="flex flex-col h-full space-y-10 relative z-10">
               <div className="flex items-center gap-5">
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center border transition-transform group-hover:scale-110 duration-500",
                    acc.type === 'Credit' ? 'bg-zinc-900 border-white/5 text-zinc-500' : 'bg-gold/10 border-gold/20 text-gold shadow-[0_0_30px_rgba(212,175,55,0.1)]'
                  )}>
                     {acc.type === 'Credit' ? <CreditCard size={24} /> : <Landmark size={24} />}
                  </div>
                  <div>
                    <h3 className="text-xl font-display font-black text-white italic tracking-tighter group-hover:text-gold transition-colors block leading-tight">{acc.name}</h3>
                    <p className="text-zinc-600 text-[9px] uppercase font-black tracking-widest mt-1">Sovereign {acc.type} Protocol</p>
                  </div>
               </div>

               <div>
                  <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] mb-3 italic">Liquidity Balance</p>
                  <div className="flex items-baseline gap-3 flex-wrap">
                     <p className="text-4xl sm:text-5xl font-display font-black text-white italic tracking-tighter">
                        {acc.balance.toLocaleString('en-US', { style: 'currency', currency: currency })}
                     </p>
                     <p className="text-[10px] font-black flex items-center gap-1.5 text-emerald-500 bg-emerald-500/5 px-2 py-0.5 rounded-full border border-emerald-500/10 italic">
                        +0.00% <Activity size={10} strokeWidth={3} />
                     </p>
                  </div>
               </div>

               <div className="pt-8 border-t border-white/5 flex justify-between items-center">
                  <Link to={`/dashboard/transactions`} className="text-[10px] font-black text-zinc-500 uppercase tracking-widest hover:text-gold transition-colors flex items-center gap-2 italic">
                    <History size={14} strokeWidth={3} /> Protocol History
                  </Link>
                  <Link to="/dashboard/transfer" className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-zinc-500 hover:text-gold hover:border-gold/50 border border-white/5 transition-all shadow-lg group/btn overflow-hidden">
                    <ArrowUpRight size={22} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                  </Link>
               </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Asset Analytics */}
        <section className="bg-zinc-950 border border-gold/10 rounded-[3rem] p-12 shadow-2xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-[100px] pointer-events-none group-hover:bg-gold/10 transition-colors" />
           <h3 className="text-2xl font-display font-black text-white italic tracking-tighter mb-12 flex items-center gap-5">
             <ShieldCheck size={32} className="text-gold" /> ASSET ALLOCATION PROTOCOL
           </h3>
           <div className="space-y-10">
              {[
                { label: 'FIAT RESERVES (USD/EUR)', val: 92, color: 'bg-gold' },
                { label: 'SOVEREIGN EQUITY', val: 5, color: 'bg-zinc-700' },
                { label: 'TRANSITIONAL LIQUIDITY', val: 3, color: 'bg-zinc-900' }
              ].map((item, i) => (
                <div key={i} className="space-y-4">
                   <div className="flex justify-between items-end">
                      <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] italic">{item.label}</p>
                      <p className="text-xs font-black text-white italic tracking-tighter">{item.val}%</p>
                   </div>
                   <div className="w-full h-2.5 bg-black border border-white/5 rounded-full overflow-hidden p-0.5">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${item.val}%` }}
                        transition={{ delay: 0.5 + (i * 0.2), duration: 1.5, ease: "circOut" }}
                        className={cn("h-full rounded-full shadow-[0_0_20px_rgba(212,175,55,0.4)]", item.color)} 
                      />
                   </div>
                </div>
              ))}
           </div>
        </section>

        {/* Node Distribution */}
        <section className="bg-zinc-950 border border-gold/10 rounded-[3rem] p-12 shadow-2xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] pointer-events-none" />
           <h3 className="text-2xl font-display font-black text-white italic tracking-tighter mb-12 flex items-center gap-5">
             <TrendingUp size={32} className="text-gold" /> GLOBAL NODE STATUS
           </h3>
           <div className="grid grid-cols-2 gap-6">
              {[
                { pair: 'USD • EXCHANGE', rate: '1.00', status: 'Optimal' },
                { pair: 'EUR • CORRIDOR', rate: '0.92', status: 'Online' },
                { pair: 'GBP • SETTLEMENT', rate: '0.78', status: 'Online' },
                { pair: 'CHF • PRIVATE', rate: '0.96', status: 'Vault' }
              ].map((node, i) => (
                <div key={i} className="p-6 bg-black border border-white/5 rounded-3xl hover:border-gold/20 transition-all group/node shadow-sm">
                   <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest mb-2 italic">{node.pair}</p>
                   <div className="flex justify-between items-end">
                      <p className="text-2xl font-display font-black text-white italic tracking-tighter group-hover/node:text-gold transition-colors">{node.rate}</p>
                      <div className="flex items-center gap-2 mb-1.5">
                         <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse" />
                         <span className="text-[8px] text-zinc-700 font-black uppercase tracking-widest">{node.status}</span>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </section>
      </div>
    </div>
  );
}

