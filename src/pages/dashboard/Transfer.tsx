import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  Users, 
  ShieldCheck, 
  Plus, 
  Landmark,
  Zap,
  ArrowRight,
  Search,
  CheckCircle2,
  Globe,
  ArrowLeft,
  DollarSign,
  Activity
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useStore } from '@/src/lib/store';
import { useNavigate } from 'react-router-dom';

const BENEFICIARIES = [
  { id: 1, name: 'Juliana Draper', account: '...4820', bank: 'Draper Wealth GMBH', initial: 'JD' },
  { id: 2, name: 'Marcus Sterling', account: '...1192', bank: 'Nova Crypto Node', initial: 'MS' },
  { id: 3, name: 'Klaus Bauer', account: '...9903', bank: 'Swiss Alpine Credit', initial: 'KB' },
  { id: 4, name: 'The Round Table', account: '...0044', bank: 'Sovereign Holding', initial: 'TR' }
];

export default function Transfer() {
  const [transferType, setTransferType] = useState<'domestic' | 'international'>('domestic');
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<number | null>(null);
  const [amount, setAmount] = useState('');
  const [narrative, setNarrative] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { transfer, balance, totalBalance, showToast } = useStore();
  const navigate = useNavigate();

  // Use totalBalance if available, or fall back to balance
  const actualBalance = totalBalance > 0 ? totalBalance : balance;

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;
    
    if (Number(amount) > actualBalance) {
      showToast("Insufficient liquidity for this settlement sequence.", "error", "LIQUIDITY DEFICIT");
      return;
    }

    setIsProcessing(true);
    
    // Simulate protocol processing
    setTimeout(() => {
      const recipientName = selectedBeneficiary 
        ? BENEFICIARIES.find(b => b.id === selectedBeneficiary)?.name || 'External Node'
        : 'External Node';
      
      transfer(Number(amount), recipientName, transferType === 'domestic' ? 'Transfer' : 'Wire');
      showToast(`Transfer of $${Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })} to ${recipientName} has been performed successfully.`, 'success', 'FUNDS TRANSFERRED');
      setIsProcessing(false);
      setIsSuccess(true);
    }, 1500); // Also shortened simulator timeout for faster response
  };

  if (isSuccess) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl w-full bg-zinc-950 border border-gold/20 rounded-[3rem] p-16 text-center shadow-[0_50px_100px_rgba(0,0,0,1)] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] pointer-events-none" />
          <div className="w-32 h-32 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-10 shadow-[0_0_50px_rgba(16,185,129,0.1)] relative z-10">
             <CheckCircle2 size={64} strokeWidth={2.5} className="animate-in zoom-in duration-500" />
          </div>
          <h2 className="text-4xl font-display font-black text-white italic tracking-tighter mb-6 uppercase">SETTLEMENT <span className="text-emerald-500">COMPLETE</span></h2>
          <p className="text-zinc-600 mb-12 font-bold uppercase text-[10px] tracking-[0.3em] leading-relaxed max-w-sm mx-auto">
            A LIQUIDITY PACKET OF <span className="text-white italic">$ {Number(amount).toLocaleString()}</span> HAS BEEN BROADCAST AND CONFIRMED BY THE NETWORK.
          </p>
          <div className="grid gap-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className="w-full bg-gold text-black py-6 rounded-2xl text-[11px] font-black uppercase tracking-[0.4em] italic shadow-2xl hover:scale-[1.02] transition-all"
            >
              RETURN TO DASHBOARD
            </button>
            <button 
              onClick={() => setIsSuccess(false)}
              className="w-full bg-zinc-900 text-zinc-500 py-6 rounded-2xl text-[11px] font-black uppercase tracking-[0.4em] italic"
            >
              NEW SETTLEMENT
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-1000 pb-20">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 border-b border-white/5 pb-10">
        <div className="space-y-4">
           <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-gold/10 border border-gold/20 rounded-full text-[8px] font-black uppercase text-gold tracking-[0.3em] italic">
                 Protocol: Asset Migration
              </span>
           </div>
          <h1 className="text-4xl lg:text-6xl font-display font-black text-white italic tracking-tighter leading-none uppercase">
            PAY / <span className="text-gold">MOVE</span>
          </h1>
          <p className="text-zinc-600 font-bold uppercase tracking-[0.3em] text-[10px] mt-2 italic">
            Securely migrate assets across global banking corridors.
          </p>
        </div>
        
        <div className="flex p-1.5 bg-zinc-950 border border-white/5 rounded-3xl group shadow-2xl">
           <button 
             onClick={() => setTransferType('domestic')}
             className={cn(
               "px-10 py-4 rounded-[1.25rem] text-[10px] font-black uppercase tracking-widest transition-all duration-500 flex items-center gap-3",
               transferType === 'domestic' ? "bg-gold text-black italic shadow-xl shadow-gold/10" : "text-zinc-600 hover:text-white"
             )}
           >
             <Landmark size={16} /> Domestic Protocol
           </button>
           <button 
             onClick={() => setTransferType('international')}
             className={cn(
               "px-10 py-4 rounded-[1.25rem] text-[10px] font-black uppercase tracking-widest transition-all duration-500 flex items-center gap-3",
               transferType === 'international' ? "bg-gold text-black italic shadow-xl shadow-gold/10" : "text-zinc-600 hover:text-white"
             )}
           >
             <Globe size={16} /> Global Settlement
           </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 items-start">
         <form onSubmit={handleTransfer} className="space-y-10">
            {/* Beneficiary Selection */}
            <div className="bg-zinc-950 border border-white/5 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 text-gold/5 pointer-events-none">
                  <Users size={64} />
               </div>
               <div className="flex justify-between items-center mb-10">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 italic">Select Recipient Node</h3>
                  <button type="button" className="text-[9px] font-black uppercase tracking-widest text-gold hover:underline">Manage Network</button>
               </div>
               
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {BENEFICIARIES.map(b => (
                    <div 
                      key={b.id}
                      onClick={() => setSelectedBeneficiary(b.id)}
                      className={cn(
                        "p-6 rounded-[2rem] border flex flex-col items-center gap-4 cursor-pointer transition-all duration-500 text-center",
                        selectedBeneficiary === b.id 
                          ? "bg-gold/5 border-gold shadow-2xl shadow-gold/5 scale-[1.02]" 
                          : "bg-black border-white/5 hover:border-gold/20"
                      )}
                    >
                        <div className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center font-display font-black italic text-sm transition-all duration-500",
                          selectedBeneficiary === b.id ? "bg-gold text-black" : "bg-zinc-900 text-zinc-600"
                        )}>
                          {b.initial}
                        </div>
                        <p className={cn(
                          "text-[9px] font-black uppercase tracking-widest leading-tight truncate w-full",
                          selectedBeneficiary === b.id ? "text-gold" : "text-zinc-400"
                        )}>{b.name}</p>
                    </div>
                  ))}
                  <div className="p-6 rounded-[2rem] border border-dashed border-white/10 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-gold/50 hover:bg-gold/5 group transition-all duration-500">
                     <div className="w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center text-zinc-700 group-hover:text-gold transition-colors">
                        <Plus size={20} strokeWidth={3} />
                     </div>
                     <p className="text-[9px] font-black uppercase text-center text-zinc-700 group-hover:text-gold tracking-widest">Add Node</p>
                  </div>
               </div>
            </div>

            {/* Transfer Details */}
            <div className="bg-zinc-950 border border-white/5 rounded-[3rem] p-10 shadow-2xl space-y-10">
               <div className="grid md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                     <label className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-600 ml-1 italic">Settlement Amount</label>
                     <div className="bg-black border border-white/5 rounded-3xl p-6 flex items-center focus-within:border-gold transition-all duration-500 group">
                        <DollarSign size={24} className="text-zinc-800 group-focus-within:text-gold transition-all" strokeWidth={3} />
                        <input 
                           type="number" required
                           value={amount}
                           onChange={e => setAmount(e.target.value)}
                           className="bg-transparent border-none outline-none text-4xl font-display font-black text-white italic w-full pl-3 placeholder:text-zinc-900"
                           placeholder="0.00"
                        />
                     </div>
                  </div>
                  <div className="space-y-4">
                     <label className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-600 ml-1 italic">Protocol Priority</label>
                     <div className="bg-black border border-white/5 rounded-3xl p-6 flex items-center focus-within:border-gold transition-all duration-500">
                        <select className="bg-transparent border-none outline-none text-[10px] font-black uppercase tracking-[0.2em] text-white w-full appearance-none cursor-pointer italic">
                           <option>Standard Latency</option>
                           <option>Sovereign Express (Flash)</option>
                           <option>Institutional Scheduled</option>
                        </select>
                        <Zap size={18} className="text-zinc-800" strokeWidth={3} />
                     </div>
                  </div>
               </div>

               {transferType === 'international' && (
                  <div className="grid md:grid-cols-2 gap-10 animate-in slide-in-from-top-4 duration-500">
                     <div className="space-y-4">
                        <label className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-600 ml-1 italic">IBAN / Recipient Code</label>
                        <input 
                           type="text" required
                           placeholder="GB88 TNXO 00..."
                           className="w-full bg-black border border-white/5 rounded-2xl px-6 py-5 text-xs font-black uppercase tracking-widest text-zinc-300 outline-none focus:border-gold transition-all italic"
                        />
                     </div>
                     <div className="space-y-4">
                        <label className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-600 ml-1 italic">SWIFT / BIC Protocol</label>
                        <input 
                           type="text" required
                           placeholder="TNXOGB22..."
                           className="w-full bg-black border border-white/5 rounded-2xl px-6 py-5 text-xs font-black uppercase tracking-widest text-zinc-300 outline-none focus:border-gold transition-all italic"
                        />
                     </div>
                  </div>
               )}

               <div className="space-y-4">
                  <label className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-600 ml-1 italic">Settlement Narrative</label>
                  <input 
                    type="text"
                    value={narrative}
                    onChange={e => setNarrative(e.target.value)}
                    placeholder="Reference code or note..."
                    className="w-full bg-black border border-white/5 px-6 py-6 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-300 outline-none focus:border-gold transition-all italic placeholder:text-zinc-800"
                  />
               </div>

               <button 
                  type="submit"
                  disabled={isProcessing}
                  className={cn(
                    "w-full py-8 text-[11px] font-black uppercase tracking-[0.5em] italic transition-all duration-500 shadow-2xl group flex items-center justify-center gap-4 rounded-[2rem]",
                    isProcessing ? "bg-zinc-800 text-zinc-600 cursor-wait" : "bg-gold text-black shadow-gold/20 hover:scale-[1.01] active:scale-[0.98]"
                  )}
               >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-zinc-600 border-t-gold rounded-full animate-spin" />
                      PROCESSING PROTOCOL...
                    </>
                  ) : (
                    <>
                      EXECUTE SETTLEMENT <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform" />
                    </>
                  )}
               </button>
            </div>
         </form>

         {/* Sidebar: Security & Info */}
         <div className="space-y-10 lg:sticky lg:top-32">
            <section className="bg-zinc-950 border border-gold/10 rounded-[3rem] p-12 shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-[100px] pointer-events-none group-hover:bg-gold/10 transition-colors" />
               <h3 className="text-xl font-display font-black text-white italic tracking-tighter mb-10 flex items-center gap-4">
                 <ShieldCheck size={28} className="text-gold" /> SECURITY PROTOCOL
               </h3>
               <div className="space-y-6">
                  <div className="p-6 bg-black border border-white/5 rounded-3xl flex gap-5 group/item transition-all hover:bg-gold/5">
                     <Zap className="text-gold shrink-0 group-hover:scale-110 transition-transform" size={24} />
                     <p className="text-[10px] font-bold text-zinc-500 leading-relaxed uppercase tracking-widest italic">
                        <span className="text-white font-black">Synchronous Settlement</span> is active. P2P transfers are verified across all nodes in under 2 packets.
                     </p>
                  </div>
                  <div className="p-6 bg-black border border-white/5 rounded-3xl flex gap-5 group/item transition-all hover:bg-gold/5">
                     <Globe className="text-zinc-600 shrink-0 group-hover:text-gold transition-colors" size={24} />
                     <p className="text-[10px] font-bold text-zinc-500 leading-relaxed uppercase tracking-widest italic">
                        Cross-border corridors utilize Evermont International Swift-Link connectivity for instant FX conversion.
                     </p>
                  </div>
               </div>
            </section>

            <div className="bg-zinc-950 border border-white/5 rounded-[3rem] p-12 space-y-8 shadow-2xl">
               <div className="space-y-6">
                  <div className="flex justify-between items-center">
                     <span className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-700 italic">Inter-Node Latency</span>
                     <span className="text-gold text-[10px] font-black italic tracking-tighter">0.12ms</span>
                  </div>
                  <div className="flex justify-between items-center">
                     <span className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-700 italic">Settlement Fee</span>
                     <span className="text-white text-[10px] font-black italic tracking-tighter">$ 0.00</span>
                  </div>
               </div>
               <div className="pt-8 border-t border-white/5 flex flex-col gap-2">
                  <p className="text-[8px] text-zinc-800 font-black uppercase italic tracking-[0.5em] text-center">Status Signature</p>
                  <p className="text-xs font-mono font-black text-emerald-500 text-center tracking-tighter">SIG_SOVEREIGN_AUTH_PENDING</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

