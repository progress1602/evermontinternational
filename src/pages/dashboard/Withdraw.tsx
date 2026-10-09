import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowUpCircle, 
  Landmark, 
  Bitcoin, 
  ShieldCheck, 
  ChevronRight, 
  Clock, 
  ArrowRight, 
  ArrowLeft,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  DollarSign,
  Activity
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useStore } from '@/src/lib/store';
import { useNavigate } from 'react-router-dom';

type WithdrawalMethod = {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  category: 'Crypto' | 'Digital Wallets' | 'Local';
  processingTime: string;
  requirements: string[];
};

const WITHDRAWAL_METHODS: WithdrawalMethod[] = [
  {
    id: 'btc',
    name: 'Bitcoin (BTC)',
    icon: Bitcoin,
    description: 'Protocol-level decentralized asset exit',
    category: 'Crypto',
    processingTime: 'Instant • 10m',
    requirements: ['Recipient BTC Address']
  },
  {
    id: 'usdt',
    name: 'Tether (USDT)',
    icon: (props) => (
      <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" x2="12" y1="2" y2="22" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    description: 'Global dollar-asset liquidation',
    category: 'Crypto',
    processingTime: 'Instant • 5m',
    requirements: ['ERC20/TRC20 Address']
  },
  {
    id: 'cashapp',
    name: 'CashApp',
    icon: Smartphone,
    description: 'Rapid mobile fiat settlement',
    category: 'Digital Wallets',
    processingTime: 'Instant',
    requirements: ['Cashtag ($)']
  },
  {
    id: 'paypal',
    name: 'PayPal',
    icon: Wallet, // Placeholder if no dedicated icon
    description: 'Standard digital wallet corridor',
    category: 'Digital Wallets',
    processingTime: '1-2 Hours',
    requirements: ['Recipient Email Address']
  },
  {
    id: 'skrill',
    name: 'Skrill',
    icon: Smartphone,
    description: 'Specialized digital banking exit',
    category: 'Digital Wallets',
    processingTime: '2-4 Hours',
    requirements: ['Recipient Email Address']
  },
  {
    id: 'wire',
    name: 'Bank Wire (ACH/SEPA)',
    icon: Landmark,
    description: 'Sovereign institutional settlement',
    category: 'Local',
    processingTime: '24-48 Hours',
    requirements: ['Full Bank Details', 'Routing/IBAN']
  }
];

function Wallet(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" /><path d="M3 5v14a2 2 0 0 0 2 2h16v-5" /><path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
    </svg>
  );
}

export default function Withdraw() {
  const [step, setStep] = useState(1);
  const [selectedMethod, setSelectedMethod] = useState<WithdrawalMethod | null>(null);
  const [amount, setAmount] = useState('');
  const [receiverInfo, setReceiverInfo] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { balance, totalBalance, withdraw, showToast } = useStore();
  const navigate = useNavigate();

  // Use totalBalance if available, or fall back to balance
  const actualBalance = totalBalance > 0 ? totalBalance : balance;

  const handleWithdrawRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !selectedMethod || !receiverInfo) return;
    
    if (Number(amount) > actualBalance) {
      showToast("Insufficient liquidity in your current sovereign node.", "error", "LIQUIDITY DEFICIT");
      return;
    }

    setIsProcessing(true);
    
    // Simulate protocol validation
    setTimeout(() => {
      withdraw(Number(amount), selectedMethod.name, receiverInfo);
      showToast(`Withdrawal of $${Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })} initiated. Validation protocol in progress.`, 'success', 'WITHDRAWAL INITIALIZED');
      setIsProcessing(false);
      setStep(3);
    }, 2000); // Also shortened from 3s to 2s to make it load/respond faster!
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-6 pb-24">
      <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-[100px] pointer-events-none" />

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 border-b border-white/5 pb-10 mb-12">
        <div className="space-y-4">
           <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-gold/10 border border-gold/20 rounded-full text-[8px] font-black uppercase text-gold tracking-[0.3em] italic">
                 Protocol: Liquidity Exit
              </span>
           </div>
          <h1 className="text-4xl lg:text-6xl font-display font-black text-white italic tracking-tighter leading-none uppercase">
            WITHDRAW / <span className="text-gold">EXIT</span>
          </h1>
          <p className="text-zinc-600 font-bold uppercase tracking-[0.3em] text-[10px] mt-2 italic">
            Liquidate assets from your sovereign node to an external protocol.
          </p>
        </div>
        
        <div className="bg-zinc-950 border border-white/5 p-6 rounded-3xl flex flex-col items-end shadow-2xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-4 text-gold/5 pointer-events-none">
              <Activity size={40} />
           </div>
           <p className="text-[9px] text-zinc-700 font-black uppercase tracking-[0.4em] mb-2 italic">Available Liquidity</p>
           <p className="text-2xl font-display font-black text-white italic tracking-tighter">$ {actualBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid lg:grid-cols-2 gap-6"
          >
            {WITHDRAWAL_METHODS.map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  setSelectedMethod(m);
                  setStep(2);
                }}
                className="bg-zinc-950 border border-white/5 rounded-[2.5rem] p-8 flex flex-col sm:flex-row items-center justify-between gap-8 transition-all duration-500 hover:border-gold/30 hover:bg-gold/[0.02] text-left group shadow-2xl"
              >
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-black border border-white/10 rounded-2xl flex items-center justify-center text-zinc-600 group-hover:text-gold group-hover:border-gold/30 transition-all duration-500">
                    <m.icon size={32} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-xl font-display font-black text-white italic tracking-tighter uppercase leading-none group-hover:text-gold transition-colors">{m.name}</h3>
                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mt-2 italic">{m.description}</p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 border-t sm:border-t-0 sm:border-l border-white/5 pt-6 sm:pt-0 sm:pl-8 w-full sm:w-auto">
                    <p className="text-[9px] text-zinc-800 font-black uppercase tracking-widest leading-none italic">Latency</p>
                    <p className="text-xs font-black text-white italic tracking-tighter">{m.processingTime}</p>
                </div>
              </button>
            ))}
          </motion.div>
        )}

        {step === 2 && selectedMethod && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid lg:grid-cols-[1.2fr_1fr] gap-12 max-w-6xl mx-auto"
          >
             <div className="space-y-10">
                <button 
                   onClick={() => setStep(1)}
                   className="flex items-center gap-3 text-zinc-600 hover:text-gold transition-colors font-black text-[10px] uppercase tracking-[0.3em] group italic"
                >
                   <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> BACK TO PROTOCOL SELECT
                </button>

                <form onSubmit={handleWithdrawRequest} className="bg-zinc-950 border border-white/5 rounded-[3rem] p-12 shadow-[0_50px_100px_rgba(0,0,0,0.5)] space-y-12 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-10 text-gold/5 pointer-events-none">
                      <selectedMethod.icon size={128} />
                   </div>
                   
                   <div className="flex items-center gap-6 pb-10 border-b border-white/5">
                      <div className="w-20 h-20 bg-gold text-black rounded-3xl flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.2)]">
                         <selectedMethod.icon size={40} strokeWidth={3} />
                      </div>
                      <div>
                         <h2 className="text-3xl font-display font-black text-white italic tracking-tighter uppercase leading-none">{selectedMethod.name}</h2>
                         <p className="text-zinc-600 text-[10px] uppercase font-black tracking-widest mt-2">{selectedMethod.processingTime} SETTLEMENT WINDOW</p>
                      </div>
                   </div>

                   <div className="grid gap-12">
                      <div className="space-y-6">
                         <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 ml-1 italic leading-none">Liquidation Amount</label>
                         <div className="bg-black border border-white/5 rounded-[2rem] p-8 flex items-center focus-within:border-gold transition-all duration-500 group">
                            <DollarSign size={32} className="text-zinc-800 group-focus-within:text-gold transition-all" strokeWidth={3} />
                            <input 
                              type="number" required
                              value={amount}
                              onChange={(e) => setAmount(e.target.value)}
                              placeholder="0.00" 
                              className="bg-transparent border-none outline-none text-5xl font-display font-black text-white italic w-full pl-4 placeholder:text-zinc-900"
                            />
                         </div>
                         <div className="flex justify-between items-center px-4">
                            <p className="text-[10px] font-black uppercase text-zinc-800 italic">Global Reserve Limit</p>
                            <p className="text-xs font-black text-gold italic">$ {actualBalance.toLocaleString()}</p>
                         </div>
                      </div>

                      <div className="space-y-6">
                         <label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 ml-1 italic leading-none">Destination Node Address / Info</label>
                         <input 
                           type="text" required
                           value={receiverInfo}
                           onChange={(e) => setReceiverInfo(e.target.value)}
                           placeholder={selectedMethod.requirements[0]}
                           className="w-full bg-black border border-white/5 px-8 py-7 rounded-2xl text-[11px] font-black uppercase tracking-widest text-zinc-300 outline-none focus:border-gold transition-all italic placeholder:text-zinc-800"
                         />
                         <p className="text-[8px] text-zinc-700 font-bold uppercase tracking-[0.2em] italic ml-1">
                            Ensure destination is {selectedMethod.category}-compatible to prevent permanent asset loss.
                         </p>
                      </div>
                   </div>

                   <button 
                     type="submit"
                     disabled={isProcessing || !amount || !receiverInfo}
                     className={cn(
                        "w-full py-8 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.5em] italic transition-all duration-500 shadow-2xl flex items-center justify-center gap-4",
                        isProcessing ? "bg-zinc-800 text-zinc-600 cursor-wait" : "bg-gold text-black shadow-gold/20 hover:scale-[1.01] active:scale-[0.98]"
                     )}
                   >
                     {isProcessing ? (
                       <>
                         <div className="w-5 h-5 border-2 border-zinc-600 border-t-gold rounded-full animate-spin" />
                         VALDIATING PACKETS...
                       </>
                     ) : (
                       <>
                         INITIALIZE LIQUIDATION <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform" />
                       </>
                     )}
                   </button>
                </form>
             </div>

             <div className="space-y-10 lg:sticky lg:top-32">
                <div className="bg-zinc-950 border border-gold/10 rounded-[3rem] p-12 shadow-2xl relative overflow-hidden group">
                   <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-[100px] pointer-events-none group-hover:bg-gold/10 transition-colors" />
                   <h3 className="text-xl font-display font-black text-white italic tracking-tighter mb-10 flex items-center gap-4">
                     <ShieldCheck size={28} className="text-gold" /> EXIT PROTOCOL
                   </h3>
                   <div className="space-y-6">
                      <div className="p-6 bg-black border border-white/5 rounded-3xl flex gap-5 group/item transition-all hover:bg-gold/5">
                         <Clock className="text-gold shrink-0 group-hover:scale-110 transition-transform" size={24} />
                         <p className="text-[10px] font-bold text-zinc-500 leading-relaxed uppercase tracking-widest italic">
                            All exits are subject to <span className="text-white font-black italic">Sovereign Validation</span> to prevent illicit node drainage.
                         </p>
                      </div>
                      <div className="p-6 bg-black border border-white/5 rounded-3xl flex gap-5 group/item transition-all hover:bg-gold/5">
                         <AlertTriangle className="text-amber-500 shrink-0 group-hover:scale-110 transition-transform" size={24} />
                         <p className="text-[10px] font-bold text-zinc-500 leading-relaxed uppercase tracking-widest italic">
                            Withdrawals over $50,000 may require enhanced Multi-Sig confirmation from the central node.
                         </p>
                      </div>
                   </div>
                </div>

                <div className="bg-zinc-950 border border-white/5 rounded-[3rem] p-12 space-y-8 shadow-2xl">
                   <div className="space-y-6">
                      <div className="flex justify-between items-center">
                         <span className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-700 italic">Settlement Gas</span>
                         <span className="text-gold text-[10px] font-black italic tracking-tighter">0.00%</span>
                      </div>
                      <div className="flex justify-between items-center">
                         <span className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-700 italic">Protocol Network</span>
                         <span className="text-white text-[10px] font-black italic tracking-tighter uppercase">{selectedMethod.category}</span>
                      </div>
                   </div>
                   <div className="pt-8 border-t border-white/5 flex flex-col gap-2">
                        <p className="text-[8px] text-zinc-800 font-black uppercase italic tracking-[0.5em] text-center">Protocol Code</p>
                        <p className="text-xs font-mono font-black text-emerald-500 text-center tracking-tighter uppercase whitespace-pre">EXIT_AUTH_VALID_{selectedMethod.id.toUpperCase()}</p>
                   </div>
                </div>
             </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto text-center py-20 space-y-12"
          >
             <div className="relative inline-block">
                <div className="absolute inset-0 bg-emerald-500 blur-[80px] opacity-20 animate-pulse" />
                <div className="w-32 h-32 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500 relative z-10 mx-auto group">
                   <ShieldCheck size={64} className="group-hover:scale-110 transition-transform duration-700" strokeWidth={2.5} />
                </div>
             </div>

             <div className="space-y-6">
                <h3 className="text-4xl lg:text-6xl font-display font-black text-white italic tracking-tighter uppercase">EXIT <span className="text-emerald-500">INITIALIZED</span></h3>
                <p className="text-zinc-600 font-bold max-w-lg mx-auto text-[10px] uppercase leading-loose tracking-widest italic">
                  Your liquidation request of <span className="text-white font-black italic">$ {Number(amount).toLocaleString()}</span> has been authorized. Assets are currently migrating through the global exit coridors.
                </p>
             </div>

             <div className="p-8 bg-zinc-950 border border-white/5 rounded-[2rem] flex flex-col gap-3 shadow-inner max-w-sm mx-auto">
                <p className="text-[9px] text-zinc-800 font-black uppercase tracking-[0.5em] italic">Protocol Signature</p>
                <p className="text-sm font-mono font-black text-gold uppercase tracking-tighter">#TNX-EXIT-{Math.floor(Math.random()*1000000)}</p>
             </div>

             <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="bg-gold text-black px-12 py-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] italic shadow-2xl hover:scale-105 transition-all w-full sm:w-auto"
                >
                   RETURN TO DASHBOARD
                </button>
                <button 
                   onClick={() => navigate('/dashboard/transactions')}
                   className="bg-zinc-950 text-white border border-white/10 px-12 py-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] italic hover:bg-zinc-900 transition-all w-full sm:w-auto"
                >
                   VIEW LEDGER
                </button>
             </div>

             <div className="pt-20">
                <div className="flex items-center gap-4 justify-center text-[7px] text-zinc-900 font-black uppercase tracking-[0.6em] italic">
                   <div className="w-16 h-px bg-zinc-900" />
                   EVERMONT INTERNATIONAL SECURE EXIT PROTOCOL
                   <div className="w-16 h-px bg-zinc-900" />
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

