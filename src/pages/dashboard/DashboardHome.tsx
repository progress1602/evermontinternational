import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, 
  Wallet, 
  DollarSign, 
  Calendar, 
  ShieldCheck, 
  Plus,
  ChevronRight,
  Info,
  X,
  CreditCard,
  ArrowRight,
  ArrowDownCircle,
  CircleDollarSign,
  Repeat,
  Briefcase,
  FileText,
  Clock,
  Search,
  Heart,
  RotateCw,
  Award
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useStore } from '@/src/lib/store';
import { Link, useNavigate } from 'react-router-dom';
import { CountrySelect, StateSelect } from '@/src/components/ui/CountrySelect';
import { COUNTRIES_DATA } from '@/src/lib/countries';
import { graphqlFetch, PROFILE_QUERY } from '@/src/lib/graphql';

const ACCOUNTS = [
  { id: 0, title: 'Primary Sovereign Account', color: 'bg-[#15415f]' },
  { id: 1, title: 'Tertiary Investment Account', color: 'bg-[#1a666e]' },
  { id: 2, title: 'Secondary Reserve Account', color: 'bg-[#3d3e42]' },
];

export default function DashboardHome() {
  const { 
    balance, 
    primaryBalance, 
    tertiaryBalance, 
    secondaryBalance, 
    cardActivation, 
    updateCardActivation,
    showToast,
    setGraphQLUser,
    setLockModalOpen
  } = useStore();
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [activeCardIdx, setActiveCardIdx] = useState<number | null>(null);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();

  const getBalanceAmount = (idx: number) => {
    if (idx === 0) return primaryBalance;
    if (idx === 1) return tertiaryBalance;
    if (idx === 2) return secondaryBalance;
    return 0;
  };

  const handleRefreshProfile = async () => {
    setIsRefreshing(true);
    try {
      const res = await graphqlFetch(PROFILE_QUERY);
      if (res && res.profile) {
        setGraphQLUser(res.profile);
        showToast("Account balances refreshed.", "success", "SYNC_SUCCESS");
      } else {
        throw new Error("Invalid response received as profile update is empty.");
      }
    } catch (err: any) {
      console.error("Failed to refresh balances:", err);
      showToast("Could not refresh account balances.", "error", "SYNC_ERROR");
    } finally {
      setIsRefreshing(false);
    }
  };

  const getAccountBalanceDisplay = (idx: number) => {
    let amt = 0;
    if (idx === 0) amt = primaryBalance;
    else if (idx === 1) amt = tertiaryBalance;
    else if (idx === 2) amt = secondaryBalance;
    
    const parts = amt.toFixed(2).split('.');
    return { whole: Number(parts[0]).toLocaleString(), decimal: parts[1] };
  };

  const [countdowns, setCountdowns] = useState<{ [key: number]: number }>({});

  const [cardFormData, setCardFormData] = useState({
    fullName: 'FULL NAME',
    address: '',
    city: '',
    country: 'United States',
    state: 'New York',
    zip: '',
    dob: ''
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      const newCountdowns: { [key: number]: number } = {};
      
      ACCOUNTS.forEach((acc) => {
        const activation = cardActivation[acc.id];
        if (activation.status === 'pending' && activation.requestedAt) {
          const elapsed = (now - activation.requestedAt) / 1000;
          const remaining = Math.max(0, 1200 - elapsed); // 20 mins = 1200 seconds
          if (remaining === 0) {
            updateCardActivation(acc.id, { status: 'idle', requestedAt: null });
          } else {
            newCountdowns[acc.id] = remaining;
          }
        }
      });
      setCountdowns(newCountdowns);
    }, 1000);

    return () => clearInterval(timer);
  }, [cardActivation, updateCardActivation]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleActivate = (idx: number) => {
    const hasNoMoney = primaryBalance === 0 && secondaryBalance === 0 && tertiaryBalance === 0;
    if (hasNoMoney) {
      setLockModalOpen(true);
      return;
    }
    if (cardActivation[idx].status !== 'idle') return;
    setActiveCardIdx(idx);
    setShowActivateModal(true);
  };

  const handleFinalizeActivation = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeCardIdx === null) return;
    updateCardActivation(activeCardIdx, { status: 'pending', requestedAt: Date.now() });
    setShowActivateModal(false);
    setShowDepositModal(true);
  };

  const SEARCH_SUGGESTIONS = [
    { name: 'Wire Transfer', path: '/dashboard/wire' },
    // { name: 'Pay Bills', path: '/dashboard/bills' },
    { name: 'Profile Settings', path: '/dashboard/profile' },
    { name: 'Transaction History', path: '/dashboard/transactions' },
    { name: 'Loan Application', path: '/dashboard/loans' },
    { name: 'Tax Refund', path: '/dashboard/tax-refund' },
    { name: 'Charity Donation', path: '/dashboard/charity' },
    { name: 'Sovereign Grants', path: '/dashboard/grants' },
    // { name: 'Identity Verification', path: '/dashboard/verification' },
  ].filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-10 pb-24 px-4 sm:px-0">
      {/* Top Bar */}
      <div className="bg-black border border-white/5 rounded-[2rem] p-6 lg:p-8 flex justify-between items-center shadow-2xl relative overflow-visible">
        <div className="flex items-center gap-4">
           <div className="w-10 h-10 bg-gold rounded-xl flex items-center justify-center text-black shadow-[0_0_20px_rgba(212,175,55,0.3)]">
              <span className="font-black text-xl italic">E</span>
           </div>
           <div>
              <h2 className="text-sm font-black text-white italic tracking-tighter uppercase leading-none">Evermont <span className="text-gold">International Bank</span></h2>
              <p className="text-[7px] text-zinc-600 font-bold uppercase tracking-[0.4em] mt-1 italic">Secure Node Gateway</p>
           </div>
        </div>

        {/* Global Search Interface */}
        <div className="hidden md:flex flex-1 max-w-md mx-10 relative group">
           <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-gold transition-colors" />
           <input 
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             placeholder="Search Protocol..." 
             className="w-full bg-zinc-950 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-[10px] font-black text-white uppercase italic tracking-widest outline-none focus:border-gold/30 transition-all"
           />
           {searchQuery && (
              <div className="absolute top-full left-0 w-full mt-2 bg-zinc-950 border border-white/10 rounded-2xl p-2 shadow-2xl z-50">
                 {SEARCH_SUGGESTIONS.length > 0 ? (
                   SEARCH_SUGGESTIONS.map((s, i) => (
                      <button 
                        key={i} 
                        onClick={() => navigate(s.path)}
                        className="w-full text-left p-4 hover:bg-gold/10 rounded-xl transition-colors flex items-center justify-between group"
                      >
                         <span className="text-[10px] font-black text-zinc-500 group-hover:text-gold uppercase italic tracking-widest">{s.name}</span>
                         <ArrowRight size={14} className="text-zinc-800 group-hover:text-gold" />
                      </button>
                   ))
                 ) : (
                   <p className="p-4 text-[9px] font-black text-zinc-800 uppercase italic">No matches found</p>
                 )}
              </div>
           )}
        </div>

        <div className="flex items-center gap-3">
           <button 
             onClick={handleRefreshProfile}
             disabled={isRefreshing}
             className="flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-950 border border-white/5 hover:border-gold/30 rounded-xl text-[9px] font-black uppercase tracking-widest text-zinc-400 hover:text-gold transition-all cursor-pointer shadow-lg active:scale-95 disabled:opacity-50"
             title="Refresh balances"
           >
             <RotateCw size={12} className={cn("text-gold", isRefreshing && "animate-spin")} />
             <span>{isRefreshing ? 'Loading' : 'Refresh'}</span>
           </button>

           <div className="hidden sm:block text-right">
              <p className="text-[8px] font-black text-zinc-650 uppercase tracking-widest italic leading-none">Node Sync</p>
              <p className="text-[10px] font-black text-white font-mono uppercase italic mt-1 bg-white/5 px-2 py-0.5 rounded border border-white/5">ACTIVE_77</p>
           </div>
        </div>
      </div>

      {/* Specific Account Cards Grid (Inspired by the user's image) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ACCOUNTS.map((account, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className={cn(
              "p-8 sm:p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group border border-white/5 h-full flex flex-col justify-between min-h-[320px]",
              account.color
            )}
          >
            <div className="relative z-10 space-y-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="text-[10px] sm:text-[12px] font-black text-white/70 uppercase tracking-widest italic">{account.title}</h3>
                  <div className="flex items-start">
                    <span className="text-3xl sm:text-4xl font-display font-black text-white italic mt-1">$</span>
                    <span className="text-6xl sm:text-7xl lg:text-8xl font-display font-black text-white italic tracking-tighter leading-none mx-1">{getAccountBalanceDisplay(idx).whole}</span>
                    <div className="flex flex-col mt-2">
                      <span className="text-xl sm:text-2xl font-display font-black text-white italic leading-none">{getAccountBalanceDisplay(idx).decimal}</span>
                    </div>
                  </div>
                  <p className="text-[9px] sm:text-[10px] font-bold text-white/50 uppercase tracking-[0.2em] italic">Available Balance</p>
                </div>
                {cardActivation[idx].status === 'pending' && (
                  <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-xl flex items-center gap-2 border border-white/10">
                     <Clock size={14} className="text-gold animate-pulse" />
                     <span className="text-[10px] font-black text-gold italic">{formatTime(countdowns[idx] || 0)}</span>
                  </div>
                )}
              </div>

              {getBalanceAmount(idx) === 0 && (
                <div className="pt-4 flex items-center gap-3">
                  <button 
                    onClick={() => handleActivate(idx)}
                    disabled={cardActivation[idx].status !== 'idle'}
                    className={cn(
                      "inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-[10px] sm:text-[11px] font-black uppercase tracking-widest italic transition-all group",
                      cardActivation[idx].status === 'idle'
                        ? "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-black shadow-xl"
                        : "bg-black/50 border border-white/5 text-zinc-500 cursor-not-allowed"
                    )}
                  >
                    <CreditCard size={18} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" /> 
                    {cardActivation[idx].status === 'idle' ? 'Activate Card' : 'Pending Approval'}
                  </button>
                </div>
              )}
            </div>

            {/* Subtle Texture Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent pointer-events-none" />
          </motion.div>
        ))}
      </div>

      {/* Quick Actions Grid */}
      <div className="space-y-4">
        <h4 className="text-[10px] font-black text-zinc-800 uppercase tracking-[0.6em] ml-4 pt-4 italic">Protocol Shortcuts</h4>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            // { name: 'Pay Bills', icon: CircleDollarSign, path: '/dashboard/bills', color: 'bg-emerald-600/10 text-emerald-500' },
            { name: 'Wire Transfer', icon: Repeat, path: '/dashboard/wire', color: 'bg-blue-600/10 text-blue-500' },
            { name: 'Sovereign Grants', icon: Award, path: '/dashboard/grants', color: 'bg-gold/10 text-gold' },
            { name: 'Loans', icon: Briefcase, path: '/dashboard/loans', color: 'bg-orange-600/10 text-orange-500' },
            { name: 'Charity', icon: Heart, path: '/dashboard/charity', color: 'bg-red-600/10 text-red-500' },
          ].filter(Boolean).map((action, idx) => (
            <Link
              key={idx}
              to={action.path}
              onClick={(e) => {
                const hasNoMoney = primaryBalance === 0 && secondaryBalance === 0 && tertiaryBalance === 0;
                if (hasNoMoney) {
                  e.preventDefault();
                  setLockModalOpen(true);
                }
              }}
              className="flex flex-col items-center justify-center p-6 sm:p-14 bg-zinc-950 border border-white/5 rounded-[3rem] group hover:border-gold/30 transition-all hover:-translate-y-1 shadow-2xl"
            >
              <div className={cn("w-14 h-14 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 shadow-xl", action.color)}>
                  <action.icon size={32} strokeWidth={2.5} className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>
              <span className="text-[9px] sm:text-[11px] font-black text-white uppercase tracking-widest italic text-center whitespace-nowrap">{action.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Account Info Cards (Vertical Stack) */}
      <div className="space-y-4">
        {[
          { label: 'Savings Account', value: 'Primary Sovereign', icon: Wallet, color: 'bg-emerald-600/10 text-emerald-500' },
          { label: 'Currency Protocol', value: 'USD - United States Dollar', icon: DollarSign, color: 'bg-gold/10 text-gold' },
          { label: 'Member Since', value: 'May 2026', icon: Calendar, color: 'bg-blue-600/10 text-blue-500' },
          { label: 'Node Status', value: 'Active / Verified', icon: ShieldCheck, color: 'bg-emerald-600/10 text-emerald-500' }
        ].map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex items-center justify-between p-8 bg-zinc-950 border border-white/5 rounded-[2.5rem] group hover:border-gold/20 transition-all hover:-translate-y-1 shadow-xl"
          >
            <div className="flex items-center gap-6">
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center border border-white/5 shadow-2xl", item.color)}>
                 <item.icon size={28} strokeWidth={2.5} />
              </div>
              <div className="space-y-1">
                 <p className="text-[8px] font-black text-zinc-700 uppercase tracking-widest italic leading-none">{item.label}</p>
                 <p className="text-sm font-black text-white uppercase italic tracking-widest">{item.value}</p>
              </div>
            </div>
            <ChevronRight className="text-zinc-900 group-hover:text-gold transition-colors" size={24} />
          </motion.div>
        ))}
      </div>

      {/* Activate Your Card Modal */}
      <AnimatePresence>
        {showActivateModal && activeCardIdx !== null && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="absolute inset-0 bg-black/95 backdrop-blur-2xl"
               onClick={() => setShowActivateModal(false)}
            />
            <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95, y: 20 }}
               className="w-full max-w-2xl bg-zinc-950 border border-white/5 rounded-[3rem] sm:rounded-[4rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,1)] relative z-10 max-h-[90vh] flex flex-col"
            >
               {/* Modal Header */}
               <div className="p-8 sm:p-10 flex justify-between items-center border-b border-white/5 shrink-0">
                  <h3 className="text-2xl sm:text-3xl font-display font-black text-white italic tracking-tighter uppercase whitespace-nowrap">Activate <span className="text-gold">Card</span></h3>
                  <button 
                    onClick={() => setShowActivateModal(false)}
                    className="w-10 h-10 sm:w-12 sm:h-12 bg-white/5 rounded-2xl flex items-center justify-center text-zinc-500 hover:text-white transition-colors"
                  >
                     <X size={24} />
                  </button>
               </div>

               {/* Content Scrollable Area */}
               <div className="overflow-y-auto flex-1 custom-scrollbar">
                  {/* Notice Banner */}
                  <div className="bg-[#FFFFCC] p-6 lg:p-8 flex gap-4 sm:gap-6 items-start border-b border-amber-200">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-100 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-amber-200">
                      <Info className="text-amber-600" size={24} strokeWidth={2.5} />
                    </div>
                    <p className="text-[10px] sm:text-[11px] font-bold text-amber-900 leading-relaxed uppercase tracking-tight italic">
                      Notice: A Deposit of <span className="font-black text-amber-600">${cardActivation[activeCardIdx].depositAmount}</span> will be required before card approval.
                    </p>
                  </div>

                   {/* Form Fields */}
                  <form className="p-8 sm:p-14 space-y-8 sm:space-y-10" onSubmit={handleFinalizeActivation}>
                    <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
                       <div className="col-span-full space-y-3">
                          <label className="text-[10px] font-black text-zinc-800 uppercase tracking-widest ml-2 italic">Full Name on Card *</label>
                          <input 
                            value={cardFormData.fullName}
                            onChange={(e) => setCardFormData({...cardFormData, fullName: e.target.value})}
                            className="w-full bg-black border border-white/10 rounded-2xl p-5 sm:p-6 text-[10px] font-black text-white uppercase italic tracking-widest outline-none focus:border-gold transition-all" required 
                          />
                       </div>
                       <div className="col-span-full space-y-3">
                          <label className="text-[10px] font-black text-zinc-800 uppercase tracking-widest ml-2 italic">Residential Address *</label>
                          <input 
                            placeholder="STREET ADDRESS" 
                            className="w-full bg-black border border-white/10 rounded-2xl p-5 sm:p-6 text-[10px] font-black text-white uppercase italic tracking-widest outline-none focus:border-gold transition-all" 
                            required 
                            value={cardFormData.address}
                            onChange={(e) => setCardFormData({...cardFormData, address: e.target.value})}
                          />
                       </div>
                       
                       <CountrySelect 
                         label="Country *"
                         value={cardFormData.country}
                         onChange={(val) => {
                            const countryObj = COUNTRIES_DATA.find((c: any) => c.name === val);
                            setCardFormData({
                               ...cardFormData, 
                               country: val,
                               state: countryObj?.states[0] || ''
                            });
                         }}
                       />

                       <StateSelect 
                        label="State / Province *"
                        country={cardFormData.country}
                        value={cardFormData.state}
                        onChange={(val) => setCardFormData({...cardFormData, state: val})}
                       />

                       <div className="space-y-3">
                          <label className="text-[10px] font-black text-zinc-800 uppercase tracking-widest ml-2 italic">City *</label>
                          <input 
                            placeholder="CITY" 
                            className="w-full bg-black border border-white/10 rounded-2xl p-5 sm:p-6 text-[10px] font-black text-white uppercase italic tracking-widest outline-none focus:border-gold transition-all" 
                            required 
                            value={cardFormData.city}
                            onChange={(e) => setCardFormData({...cardFormData, city: e.target.value})}
                          />
                       </div>
                       <div className="space-y-3">
                          <label className="text-[10px] font-black text-zinc-800 uppercase tracking-widest ml-2 italic">ZIP Code *</label>
                          <input 
                            placeholder="00000" 
                            className="w-full bg-black border border-white/10 rounded-2xl p-5 sm:p-6 text-[10px] font-black text-white uppercase italic tracking-widest outline-none focus:border-gold transition-all" 
                            required 
                            value={cardFormData.zip}
                            onChange={(e) => setCardFormData({...cardFormData, zip: e.target.value})}
                          />
                       </div>
                       <div className="col-span-full space-y-3">
                          <label className="text-[10px] font-black text-zinc-800 uppercase tracking-widest ml-2 italic">Date of Birth *</label>
                          <input 
                            type="date" 
                            className="w-full bg-black border border-white/10 rounded-2xl p-5 sm:p-6 text-[10px] font-black text-white uppercase italic tracking-widest outline-none focus:border-gold transition-all" 
                            required 
                            value={cardFormData.dob}
                            onChange={(e) => setCardFormData({...cardFormData, dob: e.target.value})}
                          />
                       </div>
                    </div>

                    <button className="w-full h-20 sm:h-24 bg-gold text-black rounded-[2rem] text-[11px] font-black uppercase tracking-[0.5em] italic shadow-2xl hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-4">
                      Initialize Activation <ArrowRight size={24} />
                    </button>
                  </form>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Post-Activation Deposit Required Modal */}
      <AnimatePresence>
        {showDepositModal && activeCardIdx !== null && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="absolute inset-0 bg-black/98 backdrop-blur-3xl"
            />
            <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 30 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 30 }}
               className="w-full max-w-lg bg-zinc-950 border border-white/5 rounded-[4rem] p-12 text-center space-y-10 shadow-[0_100px_200px_rgba(0,0,0,1)] relative z-10 overflow-hidden"
            >
               <div className="absolute top-0 right-0 p-12 text-gold/5 pointer-events-none">
                  <DollarSign size={160} />
               </div>
               
               <div className="relative inline-block mx-auto">
                  <div className="absolute inset-0 bg-gold blur-[80px] opacity-20" />
                  <div className="w-32 h-32 bg-gold/10 border border-gold/20 rounded-full flex items-center justify-center text-gold relative z-10">
                     <Clock size={60} strokeWidth={2.5} className="animate-pulse" />
                  </div>
               </div>

               <div className="space-y-6 relative z-10">
                  <h3 className="text-3xl font-display font-black text-white italic tracking-tighter uppercase leading-none">DEPOSIT <span className="text-gold">REQUIRED</span></h3>
                  <div className="bg-black/60 border border-white/5 p-8 rounded-[2rem] space-y-2">
                     <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.5em] italic">Protocol Amount</p>
                     <p className="text-6xl font-display font-black text-gold italic">${cardActivation[activeCardIdx].depositAmount}</p>
                  </div>
                  <p className="text-[10px] font-bold text-zinc-500 leading-loose uppercase tracking-[0.2em] italic max-w-sm mx-auto">
                    Please make your deposit within <span className="text-white font-black">20 minutes</span> of card activation to avoid protocol reversal.
                  </p>
               </div>

               <div className="pt-4 flex flex-col gap-4 relative z-10">
                  <button 
                    onClick={() => { setShowDepositModal(false); navigate('/dashboard/deposit'); }}
                    className="bg-gold text-black w-full py-7 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.5em] italic shadow-2xl hover:scale-105 transition-all"
                  >
                     Go to Deposit
                  </button>
                  <button 
                    onClick={() => setShowDepositModal(false)}
                    className="text-zinc-700 hover:text-white text-[9px] font-black uppercase tracking-widest italic transition-colors"
                  >
                     I will pay later
                  </button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
