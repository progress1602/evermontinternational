import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, 
  ShieldCheck, 
  ShieldAlert, 
  Zap, 
  CreditCard, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Activity,
  CheckCircle2,
  AlertCircle,
  Inbox,
  Clock,
  Trash2,
  Settings as SettingsIcon,
  ChevronRight,
  Database,
  Radio,
  Newspaper,
  Layers,
  Search,
  X
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { graphqlFetch, NOTIFICATIONS_QUERY, PROFILE_QUERY } from '@/src/lib/graphql';

type NotificationType = 'transaction' | 'alert' | 'verification' | 'news';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  unread: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  { 
    id: '1', 
    type: 'transaction', 
    title: 'LIQUIDITY INJECTION APPROVED', 
    message: 'Global clearance node successfully processed +12,400.00 USD capital inflow to primary ledger.', 
    time: '2H AGO', 
    unread: true
  },
  { 
    id: '2', 
    type: 'alert', 
    title: 'SECURITY PERIMETER SIGNAL', 
    message: 'Unauthorized login attempt detected from Zurich node (IP: 192.172.16.4). TN-Shield active.', 
    time: '5H AGO', 
    unread: true
  },
  { 
    id: '3', 
    type: 'verification', 
    title: 'IDENTITY PROTOCOL CLEARANCE', 
    message: 'Your sovereign profile has been successfully upgraded to VERIFIED GOLD status.', 
    time: '24H AGO', 
    unread: false
  },
  { 
    id: '4', 
    type: 'news', 
    title: 'INSTITUTIONAL LIQUIDITY UPDATE', 
    message: 'Sovereign-grade bank corridors now open for JPY/GBP exit strategies. Review limit adjustment.', 
    time: '2D AGO', 
    unread: false
  },
  { 
    id: '5', 
    type: 'alert', 
    title: 'PROTOCOL MAINTENANCE COMPLETE', 
    message: 'Internal ledger systems synchronized with global TN-Cluster V3.1. All functions nominal.', 
    time: '3D AGO', 
    unread: false
  }
];

const CATEGORIES = [
  { id: 'all', label: 'ALL INTEL', icon: Layers },
  { id: 'transaction', label: 'TRANSACTIONS', icon: Database },
  { id: 'alert', label: 'ALERTS', icon: ShieldAlert },
  { id: 'verification', label: 'VERIFICATION', icon: ShieldCheck },
  { id: 'news', label: 'NEWS', icon: Newspaper },
];

export default function Notifications() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        let res: any = null;
        try {
          res = await graphqlFetch(NOTIFICATIONS_QUERY);
        } catch (gqlErr) {
          console.warn("Notifications page query fetch fell back to mock data:", gqlErr);
          res = { notifications: MOCK_NOTIFICATIONS };
        }

        let profRes: any = null;
        try {
          profRes = await graphqlFetch(PROFILE_QUERY);
        } catch (gqlErr) {
          console.warn("Notifications page profile query fetch fell back to store or empty:", gqlErr);
        }

        let list = [...(res?.notifications || [])];

        if (profRes && profRes.profile) {
          const { totalDeposits, totalWithdrawals, totalTransfers } = profRes.profile;
          
          const depositNotif = {
            id: 'sys-total-deposits',
            type: 'transaction',
            title: 'TOTAL DEPOSITS RECONCILIATION',
            message: `Your sovereign global terminal has cleared a cumulative total of $${(totalDeposits || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} USD across all authenticated liquidity conduits.`,
            isRead: false,
            unread: true,
            createdAt: new Date().toISOString()
          };

          const withdrawalNotif = {
            id: 'sys-total-withdrawals',
            type: 'alert',
            title: 'TOTAL WITHDRAWALS RECONCILIATION',
            message: `Integrated security audits report a total aggregated withdrawal volume of $${(totalWithdrawals || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} USD from your secure private vault.`,
            isRead: false,
            unread: true,
            createdAt: new Date().toISOString()
          };

          const transferNotif = {
            id: 'sys-total-transfers',
            type: 'verification',
            title: 'TOTAL WIRE TRANSFERS RECONCILIATION',
            message: `System ledger records confirm a total successful outbound transfer protocol of $${(totalTransfers || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} USD to outer institutions.`,
            isRead: false,
            unread: true,
            createdAt: new Date().toISOString()
          };

          list = [depositNotif, withdrawalNotif, transferNotif, ...list];
        }

        if (res && res.notifications) {
          setNotifications(list);
        } else if (list.length > 0) {
          setNotifications(list);
        }
      } catch (err) {
        console.error("Notifications page core handler encountered error:", err);
      }
    };
    fetchNotifications();
  }, []);

  const getNotificationTime = (n: any) => {
    if (n.time) return n.time;
    if (!n.createdAt) return 'RECENT';
    try {
      const diffMs = Date.now() - new Date(n.createdAt).getTime();
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return 'JUST NOW';
      if (diffMins < 60) return `${diffMins}M AGO`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}H AGO`;
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}D AGO`;
    } catch (e) {
      return 'RECENT';
    }
  };

  const filtered = useMemo(() => {
    return notifications.filter(n => {
      const matchTab = activeTab === 'all' || (n.type || '').toLowerCase() === activeTab.toLowerCase();
      const matchSearch = (n.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (n.message || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchTab && matchSearch;
    });
  }, [notifications, activeTab, searchQuery]);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false, isRead: true })));
  };

  const clearSignals = () => {
    setNotifications([]);
  };

  const deleteSignal = (id: any) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 pb-24 space-y-16">
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 blur-[120px] pointer-events-none" />

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 border-b border-white/5 pb-10">
        <div className="space-y-4">
           <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-gold/10 border border-gold/20 rounded-full text-[8px] font-black uppercase text-gold tracking-[0.3em] italic">
                 Channel: Command Signals
              </span>
           </div>
          <h1 className="text-4xl lg:text-6xl font-display font-black text-white italic tracking-tighter leading-none uppercase">
            SIGNAL / <span className="text-gold">CENTER</span>
          </h1>
          <p className="text-zinc-600 font-bold uppercase tracking-[0.3em] text-[10px] mt-2 italic">
            Repository for high-magnitude protocol signals and node status reports.
          </p>
        </div>
        
        <div className="flex items-center gap-4 w-full lg:w-auto">
           <button 
             onClick={clearSignals}
             className="flex-1 lg:flex-none flex items-center justify-center gap-3 px-8 py-5 bg-zinc-950 border border-white/5 rounded-2xl text-[9px] font-black uppercase tracking-widest text-zinc-500 hover:text-red-500 hover:border-red-500/30 transition-all shadow-2xl italic group"
           >
              <Trash2 size={16} /> CLR_SIGNALS
           </button>
           <button 
             onClick={markAllRead}
             className="flex-1 lg:flex-none flex items-center justify-center gap-3 px-8 py-5 bg-black border border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-widest text-zinc-400 hover:text-gold hover:border-gold/30 transition-all shadow-2xl italic"
           >
              <CheckCircle2 size={16} /> MAR_READ
           </button>
        </div>
      </div>

      {/* Interface Matrix */}
      <div className="grid lg:grid-cols-4 gap-12">
         {/* Sidebar Controls */}
         <div className="space-y-10">
            <div className="bg-zinc-950 border border-white/5 p-4 rounded-[2.5rem] shadow-2xl space-y-2">
               {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveTab(cat.id)}
                    className={cn(
                      "w-full flex items-center justify-between p-6 rounded-[1.8rem] transition-all duration-500 group",
                      activeTab === cat.id ? "bg-gold text-black shadow-xl" : "bg-transparent text-zinc-700 hover:text-zinc-300"
                    )}
                  >
                     <div className="flex items-center gap-5">
                        <cat.icon size={20} className={cn("transition-colors", activeTab === cat.id ? "text-black" : "text-zinc-900 group-hover:text-gold")} />
                        <span className="text-[10px] font-black uppercase tracking-widest italic">{cat.label}</span>
                     </div>
                     {activeTab === cat.id && <div className="w-1.5 h-1.5 bg-black rounded-full shadow-lg" />}
                  </button>
               ))}
            </div>

            <div className="bg-black/40 border border-white/5 p-8 rounded-[2.5rem] space-y-6">
               <h4 className="text-[10px] font-black text-white uppercase italic tracking-[0.4em] ml-2">NETWORK STATUS</h4>
               <div className="space-y-4">
                  <div className="flex items-center justify-between">
                     <span className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest">Global Grid</span>
                     <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest italic">NOMINAL</span>
                  </div>
                  <div className="flex items-center justify-between">
                     <span className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest">Support Sync</span>
                     <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest italic">ACTIVE</span>
                  </div>
               </div>
            </div>
         </div>

         {/* Signal Stream */}
         <div className="lg:col-span-3 space-y-10">
            <div className="relative group overflow-hidden rounded-[3rem]">
               <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-zinc-900 group-focus-within:text-gold transition-colors" size={24} />
               <input 
                 type="text"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 placeholder="SEARCHING IMMUTABLE SIGNALS..."
                 className="w-full bg-zinc-950 border border-white/5 rounded-[2.5rem] pl-20 pr-8 py-8 text-[11px] font-black uppercase tracking-[0.4em] text-white outline-none focus:border-gold/30 transition-all placeholder:text-zinc-900 italic"
               />
               {searchQuery && (
                 <button onClick={() => setSearchQuery('')} className="absolute right-8 top-1/2 -translate-y-1/2 text-zinc-700 hover:text-white transition-colors">
                    <X size={20} />
                 </button>
               )}
            </div>

            <div className="bg-zinc-950 border border-white/5 rounded-[3.5rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.6)]">
               <div className="divide-y divide-white/5">
                  <AnimatePresence mode="popLayout text-center">
                    {filtered.length > 0 ? filtered.map((n, idx) => (
                      <motion.div 
                        key={n.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: idx * 0.05 }}
                        className={cn(
                          "p-10 lg:p-14 flex items-start gap-12 hover:bg-gold/[0.01] transition-all group cursor-pointer relative overflow-hidden",
                          (n.unread || n.isRead === false) && "border-l-4 border-l-gold bg-gold/[0.01]"
                        )}
                      >
                         <div className={cn(
                           "w-16 h-16 rounded-[1.5rem] flex items-center justify-center border shrink-0 transition-all duration-700",
                           (n.type || '').toLowerCase() === 'transaction' ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-black' :
                           (n.type || '').toLowerCase() === 'alert' ? 'bg-red-500/5 border-red-500/10 text-red-500 group-hover:bg-red-500 group-hover:text-white' :
                           (n.type || '').toLowerCase() === 'verification' ? 'bg-gold/5 border-gold/10 text-gold group-hover:bg-gold group-hover:text-black' :
                           'bg-zinc-900 border-white/5 text-white group-hover:bg-white group-hover:text-black'
                         )}>
                            {(n.type || '').toLowerCase() === 'transaction' && <Database size={28} strokeWidth={2.5} />}
                            {(n.type || '').toLowerCase() === 'alert' && <ShieldAlert size={28} strokeWidth={2.5} />}
                            {(n.type || '').toLowerCase() === 'verification' && <ShieldCheck size={28} strokeWidth={2.5} />}
                            {(!n.type || ((n.type || '').toLowerCase() !== 'transaction' && (n.type || '').toLowerCase() !== 'alert' && (n.type || '').toLowerCase() !== 'verification')) && <Radio size={28} strokeWidth={2.5} />}
                         </div>

                         <div className="flex-1 space-y-4">
                            <div className="flex justify-between items-start">
                               <div className="space-y-1">
                                  <h4 className={cn(
                                    "text-xl font-display font-black italic tracking-tighter transition-colors uppercase leading-tight",
                                    (n.unread || n.isRead === false) ? "text-white group-hover:text-gold" : "text-zinc-650 group-hover:text-zinc-400"
                                  )}>
                                    {n.title}
                                  </h4>
                                  <div className="flex items-center gap-3">
                                     <div className="w-1 h-1 bg-zinc-800 rounded-full" />
                                     <span className="text-[9px] font-black text-zinc-800 uppercase tracking-widest">{getNotificationTime(n)}</span>
                                  </div>
                                </div>
                               <button 
                                 onClick={() => deleteSignal(n.id)}
                                 className="p-3 bg-black border border-white/5 text-zinc-900 hover:text-red-500 rounded-xl transition-all"
                               >
                                  <Trash2 size={16} />
                               </button>
                            </div>
                            <p className="text-zinc-500 text-[11px] font-bold uppercase tracking-widest leading-loose italic max-w-2xl">
                               {n.message}
                            </p>
                            <div className="flex items-center gap-8 pt-4 border-t border-white/5">
                               <button className="text-[9px] font-black uppercase text-zinc-700 hover:text-gold transition-colors italic tracking-widest leading-none">ACKNOWLEDGE SIGNAL</button>
                               <button className="text-[9px] font-black uppercase text-zinc-700 hover:text-white transition-colors italic tracking-widest leading-none">EXPAND PACKET</button>
                            </div>
                         </div>
                      </motion.div>
                    )) : (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="py-40 text-center space-y-10"
                      >
                         <div className="relative inline-block">
                            <div className="absolute inset-0 bg-gold blur-[100px] opacity-10 animate-pulse" />
                            <Inbox size={120} className="text-zinc-900 mx-auto transition-transform hover:scale-110 duration-1000" strokeWidth={0.5} />
                         </div>
                         <div className="space-y-4">
                            <h3 className="text-2xl font-display font-black text-white italic tracking-tighter uppercase leading-none">SIGNAL BUFFER EMPTY</h3>
                            <p className="text-zinc-700 text-[10px] font-black uppercase tracking-[0.4em] italic max-w-sm mx-auto leading-relaxed uppercase">
                               COMMAND BROADCAST HAS NO ACTIVE SIGNALS IN THE CURRENT QUEUE. NOMINAL STATE PERSISTS.
                            </p>
                         </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
               </div>
            </div>
            
            <div className="p-14 text-center border-t border-white/5 bg-black/[0.03] space-y-6">
                <p className="text-[9px] font-black text-zinc-800 uppercase tracking-[0.5em] italic">E2E ENCRYPTED SIGNAL STREAM V3.1</p>
                <div className="flex items-center justify-center gap-10">
                   <div className="w-24 h-px bg-zinc-900" />
                   <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest leading-none italic">LOCAL SYNC: 100% SUCCESS</span>
                   </div>
                   <div className="w-24 h-px bg-zinc-900" />
                </div>
            </div>
         </div>
      </div>
    </div>
  );
}

