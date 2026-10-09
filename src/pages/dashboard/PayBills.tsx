import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CreditCard, 
  ShieldCheck, 
  Banknote, 
  Zap, 
  GraduationCap, 
  Smartphone, 
  Globe, 
  FileText,
  ChevronRight,
  Info,
  Search,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Activity
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useStore } from '@/src/lib/store';
import { useNavigate } from 'react-router-dom';

const BILL_CATEGORIES = [
  { id: 1, name: 'Credit Cards', icon: CreditCard, color: 'bg-blue-600', popular: ['Chase Sovereign', 'Amex Global', 'Gold Node Card'] },
  { id: 2, name: 'Insurance', icon: ShieldCheck, color: 'bg-emerald-600', popular: ['Nova Guard', 'Cyber Shield', 'Health Node'] },
  { id: 3, name: 'Loans', icon: Banknote, color: 'bg-orange-600', popular: ['Asset Mortgage', 'Node Expansion Loan', 'Liquidity Bridge'] },
  { id: 4, name: 'Utilities', icon: Zap, color: 'bg-purple-600', popular: ['Global Power', 'Hydro Node', 'Terra Energy'] },
  { id: 5, name: 'Education', icon: GraduationCap, color: 'bg-indigo-600', popular: ['Sovereign Academy', 'Tech Node University'] },
  { id: 6, name: 'Mobile & Data', icon: Smartphone, color: 'bg-pink-600', popular: ['Global Link', 'Node Signal', 'Orbit Data'] },
  { id: 7, name: 'Internet & TV', icon: Globe, color: 'bg-cyan-600', popular: ['Fiber Protocol', 'Sovereign Stream', 'Node Cast'] },
  { id: 8, name: 'Taxes & Fines', icon: FileText, color: 'bg-red-600', popular: ['Global Tax Node', 'Sovereign Duties'] }
];

export default function PayBills() {
  const { balance, totalBalance, withdraw, showToast } = useStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<typeof BILL_CATEGORIES[0] | null>(null);
  const [selectedBiller, setSelectedBiller] = useState('');
  const [amount, setAmount] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Use totalBalance if available, or fall back to balance
  const actualBalance = totalBalance > 0 ? totalBalance : balance;

  const lowBalance = actualBalance < Number(amount);

  const handlePay = () => {
    if (!amount || !selectedBiller || !accountNumber || lowBalance) return;
    setIsProcessing(true);
    setTimeout(() => {
      withdraw(Number(amount), `Bill: ${selectedBiller}`, 'Completed');
      showToast(`Bill payment of $${Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })} to ${selectedBiller} has been settled successfully.`, 'success', 'BILL SETTLEMENT COMPLETED');
      setIsProcessing(false);
      setStep(3);
    }, 1500);
  };

  const inputClasses = "w-full bg-black border border-white/10 rounded-2xl p-6 text-[11px] font-black text-white uppercase italic tracking-widest outline-none focus:border-gold transition-all";
  const labelClasses = "text-[9px] font-black text-zinc-800 uppercase tracking-widest ml-2 mb-2 block italic";

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 space-y-12 pb-32">
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div 
            key="categories"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-12"
          >
            {/* Header */}
            <div className="space-y-4 text-center">
              <h1 className="text-4xl lg:text-7xl font-display font-black text-white italic tracking-tighter leading-none uppercase">
                PAY <span className="text-gold">BILLS</span>
              </h1>
              <p className="text-zinc-600 font-bold uppercase tracking-[0.4em] text-[10px] italic">
                Authorized Node Settlement Protocol
              </p>
            </div>

            {/* Search */}
            <div className="relative group max-w-xl mx-auto">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-800 group-focus-within:text-gold transition-colors" size={24} />
               <input 
                 placeholder="SEARCH BILLERS OR NODES..." 
                 className="w-full bg-zinc-950 border border-white/5 rounded-[2rem] p-8 pl-16 text-[11px] font-black text-white uppercase italic tracking-widest outline-none focus:border-gold/30 transition-all shadow-2xl" 
               />
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {BILL_CATEGORIES.map((cat, idx) => (
                <motion.button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setStep(2);
                  }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group flex flex-col items-center justify-center bg-zinc-950 border border-white/5 rounded-[2.5rem] sm:rounded-[3rem] p-6 sm:p-8 aspect-square hover:border-gold/30 transition-all shadow-2xl hover:-translate-y-2 relative overflow-hidden"
                >
                  <div className={cn(
                    "w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center text-white mb-4 sm:mb-6 shadow-xl group-hover:scale-110 transition-transform relative z-10 shrink-0",
                    cat.color
                  )}>
                    <cat.icon size={28} className="sm:w-[32px] sm:h-[32px]" />
                  </div>
                  <h3 className="text-[8px] sm:text-[10px] font-black text-zinc-400 uppercase tracking-widest text-center group-hover:text-white transition-colors italic relative z-10 leading-tight">
                    {cat.name}
                  </h3>
                </motion.button>
              ))}
            </div>

            {/* Info Box */}
            <div className="bg-[#FFFFCC] p-10 border border-amber-200 rounded-[4rem] flex flex-col md:flex-row gap-8 items-center text-center md:text-left">
               <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 shrink-0 shadow-lg">
                  <Activity size={32} strokeWidth={2.5} />
               </div>
               <div className="space-y-2">
                  <h4 className="text-[11px] font-black text-amber-900 uppercase tracking-widest italic leading-none">Global Node Settlement</h4>
                  <p className="text-[10px] font-bold text-amber-800/80 leading-relaxed uppercase tracking-tight italic">
                     Your accounts are protected by the Evermont International Sovereign Protocol. All bill payments are broadcast to the global ledger for instant verification and settlement.
                  </p>
               </div>
            </div>
          </motion.div>
        )}

        {step === 2 && selectedCategory && (
          <motion.div 
            key="payment-form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-12"
          >
             <button 
                onClick={() => setStep(1)}
                className="flex items-center gap-3 text-zinc-600 hover:text-gold transition-colors font-black text-[10px] uppercase tracking-[0.3em] group italic"
             >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> BACK TO CATEGORIES
             </button>

             <div className="bg-zinc-950 border border-white/5 rounded-[4rem] p-10 lg:p-14 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 text-gold/5 pointer-events-none">
                  <selectedCategory.icon size={160} />
                </div>
                
                <div className="space-y-10 relative z-10">
                   <div className="space-y-2">
                      <h2 className="text-3xl font-display font-black text-white italic tracking-tighter uppercase leading-none">SETTLE <span className="text-gold">{selectedCategory.name}</span></h2>
                      <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.3em] italic">Authorized Payment Protocol</p>
                   </div>

                   <div className="space-y-8">
                      <div className="space-y-4">
                         <label className={labelClasses}>Select Biller Node *</label>
                         <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {selectedCategory.popular.map(biller => (
                              <button 
                                key={biller}
                                onClick={() => setSelectedBiller(biller)}
                                className={cn(
                                  "p-4 rounded-xl text-[10px] font-black uppercase tracking-widest italic border transition-all",
                                  selectedBiller === biller ? "bg-gold text-black border-gold shadow-lg" : "bg-black border-white/5 text-zinc-500 hover:border-gold/30 hover:text-white"
                                )}
                              >
                                {biller}
                              </button>
                            ))}
                         </div>
                         <input 
                           placeholder="OR TYPE CUSTOM BILLER NAME..." 
                           className={inputClasses}
                           onChange={e => setSelectedBiller(e.target.value)}
                           value={selectedBiller && !selectedCategory.popular.includes(selectedBiller) ? selectedBiller : ''}
                         />
                      </div>

                      <div className="grid sm:grid-cols-2 gap-8">
                        <div className="space-y-2">
                           <label className={labelClasses}>Account / Reference Number *</label>
                           <input 
                             placeholder="0000000000" 
                             className={inputClasses} 
                             value={accountNumber}
                             onChange={e => setAccountNumber(e.target.value)}
                           />
                        </div>
                        <div className="space-y-2">
                           <label className={labelClasses}>Settlement Amount (USD) *</label>
                           <input 
                             placeholder="0.00" 
                             type="number"
                             className={inputClasses} 
                             value={amount}
                             onChange={e => setAmount(e.target.value)}
                           />
                        </div>
                      </div>

                      <div className="flex justify-between items-center p-6 bg-black border border-white/5 rounded-3xl">
                         <div>
                            <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest italic">Node Balance</p>
                            <p className="text-xl font-display font-black text-gold italic">${actualBalance.toLocaleString()}</p>
                         </div>
                         <div className="text-right">
                            <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest italic">Fee Protocol</p>
                            <p className="text-xl font-display font-black text-white italic">$0.00</p>
                         </div>
                      </div>

                      {lowBalance && Number(amount) > 0 && (
                        <div className="bg-[#FFFFCC] p-6 border border-amber-200 rounded-[2rem] flex gap-4 items-start animate-in fade-in slide-in-from-top-4 duration-500">
                          <div className="space-y-1">
                            <p className="text-[10px] font-black text-amber-900 leading-relaxed uppercase tracking-tight italic">
                              INSUFFICIENT NODES LIQUIDITY. Please deposit funds or adjust the settlement amount.
                            </p>
                          </div>
                        </div>
                      )}

                      <button 
                         onClick={handlePay}
                         disabled={isProcessing || !amount || !selectedBiller || !accountNumber || lowBalance}
                         className="w-full h-24 bg-gold text-black rounded-[2.5rem] text-[11px] font-black uppercase tracking-[0.5em] italic shadow-[0_20px_50px_rgba(212,175,55,0.25)] hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-4 disabled:opacity-30 group"
                      >
                         {isProcessing ? 'PROCESSING PACKETS...' : <>INITIALIZE SETTLEMENT <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform" /></>}
                      </button>
                   </div>
                </div>
             </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div 
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-zinc-950 border border-white/5 rounded-[4rem] p-16 text-center space-y-12 shadow-2xl relative overflow-hidden"
          >
             <div className="absolute top-0 right-0 p-12 text-emerald-500/5 pointer-events-none">
                <CheckCircle2 size={240} />
             </div>
             
             <div className="relative inline-block">
                <div className="absolute inset-0 bg-emerald-500 blur-[80px] opacity-20" />
                <div className="w-40 h-40 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500 relative z-10 mx-auto">
                   <CheckCircle2 size={80} strokeWidth={2.5} />
                </div>
             </div>

             <div className="space-y-6 relative z-10">
                <h3 className="text-4xl lg:text-7xl font-display font-black text-white italic tracking-tighter uppercase leading-none">BILL <span className="text-emerald-500">SETTLED</span></h3>
                <p className="text-zinc-600 font-bold max-w-lg mx-auto text-[10px] uppercase leading-loose tracking-widest italic">
                  The protocol has been verified. A total of <span className="text-white">${amount}</span> has been debited and broadcast to <span className="text-white">{selectedBiller}</span>. Settlement packet ID #BILL-{Math.floor(Math.random()*1000000)} logged to ledger.
                </p>
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
