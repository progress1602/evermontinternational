import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Calendar,
  ChevronDown,
  History,
  Info,
  Clock,
  LayoutGrid,
  Filter,
  Plus,
  Loader2
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useStore } from '@/src/lib/store';
import { graphqlFetch, MY_TRANSACTIONS_QUERY, PROFILE_QUERY } from '@/src/lib/graphql';

export default function Transactions() {
  const { balance } = useStore();
  const [activeTab, setActiveTab] = useState('All');
  const [history, setHistory] = useState<any[]>([]);
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const loadTransactions = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const res = await graphqlFetch(MY_TRANSACTIONS_QUERY);
      if (res && res.myTransactions) {
        setHistory(res.myTransactions);
      }
      const profRes = await graphqlFetch(PROFILE_QUERY);
      if (profRes && profRes.profile) {
        setProfileData(profRes.profile);
      }
    } catch (err: any) {
      console.error("Failed to load transactions:", err);
      setErrorMsg(err.message || "Unable to retrieve transaction ledger.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const totalDeposits = profileData?.totalDeposits ?? 0;
  const totalWithdrawals = profileData?.totalWithdrawals ?? 0;
  const totalTransfers = profileData?.totalTransfers ?? 0;

  const filteredHistory = history.filter(tx => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Deposits') return tx.transactionType?.toLowerCase().includes('deposit') || tx.direction === 'IN';
    if (activeTab === 'Withdrawals') return tx.transactionType?.toLowerCase().includes('withdraw') || tx.direction === 'OUT';
    if (activeTab === 'Transfers') return tx.transactionType?.toLowerCase().includes('transfer');
    if (activeTab === 'Payments') return tx.transactionType?.toLowerCase().includes('payment');
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 space-y-10 pb-24">
      {/* Top Summary Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-650/40 border border-emerald-500/20 bg-zinc-950 p-8 rounded-[2.5rem] shadow-xl text-white space-y-4"
        >
          <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center">
            <ArrowDownLeft size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-60 italic">Total Deposits</p>
            <h2 className="text-4xl font-display font-black italic tracking-tighter leading-none">
              ${totalDeposits.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-orange-650/40 border border-orange-500/20 bg-zinc-950 p-8 rounded-[2.5rem] shadow-xl text-white space-y-4"
        >
          <div className="w-12 h-12 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-2xl flex items-center justify-center">
            <ArrowUpRight size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-60 italic">Total Withdrawals</p>
            <h2 className="text-4xl font-display font-black italic tracking-tighter leading-none">
              ${totalWithdrawals.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-blue-650/40 border border-blue-500/20 bg-zinc-950 p-8 rounded-[2.5rem] shadow-xl text-white space-y-4"
        >
          <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center">
            <FileText size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-60 italic">Total Transfers</p>
            <h2 className="text-4xl font-display font-black italic tracking-tighter leading-none">
              ${totalTransfers.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
          </div>
        </motion.div>
      </div>

      {/* Filter Section */}
      <div className="bg-zinc-950 border border-white/5 rounded-[3rem] p-8 space-y-8 shadow-2xl">
        <div className="flex flex-wrap gap-3">
          {['All', 'Deposits', 'Withdrawals', 'Transfers', 'Payments'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all italic",
                activeTab === tab ? "bg-gold text-black shadow-[0_4px_20px_rgba(212,175,55,0.25)]" : "bg-zinc-900 text-zinc-500 hover:text-white"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="bg-zinc-950 border border-white/5 rounded-[3rem] p-24 text-center space-y-4 shadow-2xl decoration-none">
          <Loader2 className="animate-spin text-gold mx-auto w-10 h-10" />
          <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.4em] italic">SYNCHRONIZING SECURE LEDGER...</p>
        </div>
      ) : errorMsg ? (
        <div className="bg-zinc-950 border border-white/5 rounded-[3rem] p-24 text-center space-y-4 shadow-2xl">
          <p className="text-red-500 text-sm font-black uppercase tracking-widest">UPLINK SYNCHRONIZATION ERROR</p>
          <p className="text-zinc-650 text-[10px] font-bold uppercase tracking-widest max-w-md mx-auto">{errorMsg}</p>
          <div className="pt-6">
            <button 
              onClick={loadTransactions}
              className="px-8 py-4 bg-zinc-900 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-white hover:bg-gold hover:text-black transition-all"
            >
              Retry Protocol
            </button>
          </div>
        </div>
      ) : filteredHistory.length > 0 ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center px-4">
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-650 italic">TRANSACTIONS FOUND</span>
            <button 
              onClick={loadTransactions}
              className="text-[9px] font-black text-gold hover:underline uppercase tracking-widest"
            >
              Refresh
            </button>
          </div>
          <div className="space-y-3">
            {filteredHistory.map((tx) => (
              <motion.div 
                key={tx.id} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 bg-zinc-950 border border-white/5 rounded-[1.8rem] flex items-center justify-between hover:border-gold/20 transition-all shadow-xl"
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center border shrink-0",
                    tx.direction === 'IN' || tx.transactionType?.toLowerCase().includes('deposit')
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                      : "bg-orange-500/10 border-orange-500/20 text-orange-400"
                  )}>
                    {tx.direction === 'IN' || tx.transactionType?.toLowerCase().includes('deposit') ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                  </div>
                  <div>
                    <p className="text-white text-[12px] font-black uppercase tracking-widest leading-tight">
                      {tx.description || `${tx.transactionType} to ${tx.recipientName || 'External Account'}`}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className="text-[7.5px] font-mono font-bold text-zinc-500 uppercase tracking-widest">ID: {tx.transactionId || tx.id}</span>
                      <span className="text-zinc-700 font-bold">•</span>
                      <span className="text-[7.5px] font-mono font-bold text-zinc-500 text-gold/60">REF: {tx.reference || 'N/A'}</span>
                      <span className="text-zinc-700 font-bold">•</span>
                      <span className="text-[7.5px] font-mono font-bold text-zinc-500">{new Date(tx.createdAt || tx.processedAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right space-y-1.5 shrink-0 ml-4">
                  <p className={cn(
                    "text-sm sm:text-base font-black italic tracking-tight font-display",
                    tx.direction === 'IN' || tx.transactionType?.toLowerCase().includes('deposit') ? "text-emerald-400" : "text-white"
                  )}>
                    {tx.direction === 'IN' || tx.transactionType?.toLowerCase().includes('deposit') ? '+' : '-'}${Number(tx.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <span className={cn(
                    "inline-block px-2.5 py-1 rounded-lg text-[7px] font-black uppercase tracking-widest border",
                    tx.status?.toLowerCase() === 'approved' || tx.status?.toLowerCase() === 'completed' || tx.status?.toLowerCase() === 'success'
                      ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-400"
                      : tx.status?.toLowerCase() === 'pending'
                      ? "bg-amber-950/40 border-amber-500/30 text-amber-400"
                      : "bg-red-950/40 border-red-500/30 text-red-400"
                  )}>
                    {tx.status || 'PENDING'}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        /* Main Area: Empty State */
        <div className="bg-zinc-950 border border-white/5 rounded-[2.5rem] sm:rounded-[3rem] p-12 sm:p-24 text-center space-y-8 shadow-2xl overflow-hidden">
           <div className="relative inline-block">
              <div className="absolute inset-0 bg-gold/10 blur-[80px] rounded-full" />
              <History size={100} className="text-zinc-900 mx-auto transition-transform hover:scale-110 duration-1000 relative z-10 sm:w-[120px] sm:h-[120px]" strokeWidth={0.5} />
           </div>
           <div className="space-y-4 relative z-10">
              <h3 className="text-xl sm:text-2xl font-display font-black text-white italic tracking-tighter uppercase leading-none">No transactions found...</h3>
              <p className="text-zinc-700 text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.4em] italic max-w-sm mx-auto leading-relaxed">
                 Current audit query returned null records for the selected date range. Please adjust filters or initialize a new migration sequence.
              </p>
           </div>
           <div className="pt-10">
              <button 
                onClick={loadTransactions}
                className="px-10 py-5 bg-zinc-900 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-all italic"
              >
                 Refresh Ledger
              </button>
           </div>
        </div>
      )}
    </div>
  );
}
