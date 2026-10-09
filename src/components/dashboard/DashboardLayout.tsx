import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  Send, 
  CreditCard, 
  HelpCircle, 
  History, 
  Settings, 
  LogOut,
  Landmark,
  Bell,
  Menu,
  X,
  User,
  Shield,
  ShieldCheck,
  Activity,
  Search,
  MessageSquare,
  Globe,
  Sun,
  Moon,
  Camera,
  Repeat,
  FileText,
  Heart, 
  Award,
  Briefcase, 
  PieChart, 
  Home, 
  ChevronRight,
  CircleDollarSign,
  Plus,
  ArrowRight,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn, MOCK_NOTIFICATIONS } from '@/src/lib/utils';
import { useStore } from '@/src/lib/store';
import { graphqlFetch, PROFILE_QUERY, NOTIFICATIONS_QUERY } from '@/src/lib/graphql';

function SupportChat({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState([
    { id: 1, role: 'support', text: 'Hello! Thank you for contacting Evermont International Support. How can we help you with your account or asset management today?', time: 'Just now' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = (e?: FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    const newMessage = { id: Date.now(), role: 'user', text: inputValue, time: 'Just now' };
    setMessages([...messages, newMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate response
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'support',
        text: 'Thank you for explaining your inquiry. Your request has been forwarded to our support representatives. We will respond right away. Please stay online.',
        time: 'Just now'
      }]);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-end p-4 sm:p-10 pointer-events-none">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto"
        onClick={onClose}
      />
      <motion.div 
        initial={{ opacity: 0, y: 100, scale: 0.9, x: 20 }}
        animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
        exit={{ opacity: 0, y: 100, scale: 0.9, x: 20 }}
        className="relative w-full max-w-lg h-[650px] max-h-[85vh] bg-app-card border border-gold/20 rounded-[2.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden pointer-events-auto"
      >
        <div className="p-8 border-b border-app-border bg-black flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gold/10 rounded-2xl flex items-center justify-center text-gold border border-gold/20">
                 <Shield size={24} />
              </div>
              <div>
                 <h3 className="text-xl font-display font-black text-white italic tracking-tighter leading-none">Customer Support</h3>
                 <p className="text-[9px] text-zinc-500 font-black uppercase tracking-[0.2em] mt-1">Secure Connection • Authenticated</p>
              </div>
           </div>
           <button 
             onClick={onClose}
             className="w-10 h-10 rounded-xl bg-app-bg border border-app-border flex items-center justify-center text-zinc-600 hover:text-white transition-colors"
           >
             <X size={20} />
           </button>
        </div>

        <div ref={scrollRef} className="flex-1 p-8 overflow-y-auto no-scrollbar space-y-6">
           {messages.map(msg => (
             <div key={msg.id} className={cn("flex gap-4", msg.role === 'user' ? "justify-end" : "")}>
                {msg.role === 'support' && (
                  <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center text-gold shrink-0 border border-white/5">
                     <Globe size={18} />
                  </div>
                )}
                <div className={cn(
                  "p-5 rounded-2xl max-w-[80%] border shadow-lg transition-all duration-300",
                  msg.role === 'support' 
                    ? "bg-zinc-900/50 border-white/5 rounded-tl-none text-zinc-300" 
                    : "bg-gold text-black border-gold/20 rounded-tr-none shadow-gold/10"
                )}>
                   <p className={cn("text-xs leading-relaxed", msg.role === 'user' ? "font-bold italic" : "font-medium")}>
                     {msg.text}
                   </p>
                   <p className={cn(
                     "text-[8px] font-black uppercase tracking-widest mt-3",
                     msg.role === 'support' ? "text-gold italic text-left" : "opacity-50 text-right"
                   )}>
                     {msg.role === 'support' ? 'Autonomous Assistant' : 'Henry David'} • {msg.time}
                   </p>
                </div>
                {msg.role === 'user' && (
                  <div className="w-10 h-10 bg-gold rounded-xl flex items-center justify-center text-black shrink-0 font-black text-[10px] italic">
                     HD
                  </div>
                )}
             </div>
           ))}

           {isTyping && (
             <div className="flex gap-4">
                <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center text-gold shrink-0 border border-white/5">
                   <ShieldCheck size={18} />
                </div>
                <div className="bg-zinc-900 border border-white/10 p-5 rounded-2xl rounded-tl-none max-w-[80%]">
                   <div className="flex gap-1 mb-1">
                      <span className="w-1 h-1 bg-gold rounded-full animate-bounce" />
                      <span className="w-1 h-1 bg-gold rounded-full animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1 h-1 bg-gold rounded-full animate-bounce [animation-delay:0.4s]" />
                   </div>
                   <p className="text-[10px] text-zinc-500 font-bold italic">Operator is responding...</p>
                </div>
             </div>
           )}
        </div>

        <form onSubmit={handleSend} className="p-8 bg-black/80 border-t border-app-border">
           <div className="relative flex items-center">
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type protocol inquiry..." 
                className="w-full bg-zinc-900 border border-white/5 rounded-2xl px-6 py-5 text-xs font-black uppercase tracking-widest text-app-text placeholder:text-zinc-700 focus:border-gold/50 outline-none transition-all pr-16"
              />
              <button 
                type="submit"
                className="absolute right-3 w-10 h-10 bg-gold rounded-xl flex items-center justify-center text-black shadow-lg shadow-gold/20 hover:scale-105 active:scale-95 transition-all"
              >
                 <Send size={18} strokeWidth={3} />
              </button>
           </div>
           <p className="text-center text-[8px] text-zinc-700 font-black uppercase tracking-[0.3em] mt-4">All conversations are secured via End-to-End Node Encryption</p>
        </form>
      </motion.div>
    </div>
  );
}

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState<any | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showSupportChat, setShowSupportChat] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

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

  const unreadCount = notifications.filter(n => n.unread || n.isRead === false).length;

  const handleDeleteNotification = (id: any) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    setNotificationToDelete(null);
  };

  const handleReadAll = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false, isRead: true })));
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        let res: any = null;
        try {
          res = await graphqlFetch(NOTIFICATIONS_QUERY);
        } catch (gqlErr) {
          console.warn("Dashboard notification query fetch fell back to mock data:", gqlErr);
          res = { notifications: MOCK_NOTIFICATIONS };
        }

        let profRes: any = null;
        try {
          profRes = await graphqlFetch(PROFILE_QUERY);
        } catch (gqlErr) {
          console.warn("Dashboard profile query fetch fell back to store or empty:", gqlErr);
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
            title: 'TOTAL TRANSFERS SUMMARY',
            message: `We have confirmed a total of $${(totalTransfers || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} USD transferred to other bank accounts.`,
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
        console.error("Dashboard notification core handler encountered error:", err);
      }
    };
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

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
  const theme = useStore(state => state.theme);
  const toggleTheme = useStore(state => state.toggleTheme);
  const fullName = useStore(state => state.fullName);
  const profilePic = useStore(state => state.profilePic);
  const setGraphQLUser = useStore(state => state.setGraphQLUser);
  const toast = useStore(state => state.toast);
  const hideToast = useStore(state => state.hideToast);

  const primaryBalance = useStore(state => state.primaryBalance);
  const secondaryBalance = useStore(state => state.secondaryBalance);
  const tertiaryBalance = useStore(state => state.tertiaryBalance);
  const isLockModalOpen = useStore(state => state.isLockModalOpen);
  const setLockModalOpen = useStore(state => state.setLockModalOpen);
  const hasNoMoney = primaryBalance === 0 && secondaryBalance === 0 && tertiaryBalance === 0;

  useEffect(() => {
    if (hasNoMoney && location.pathname !== '/dashboard' && location.pathname !== '/dashboard/deposit') {
      setLockModalOpen(true);
    }
  }, [hasNoMoney, location.pathname, setLockModalOpen]);

  const handleNavClick = (e: React.MouseEvent, path: string) => {
    if (hasNoMoney && path !== '/dashboard/deposit' && path !== '/dashboard') {
      e.preventDefault();
      setLockModalOpen(true);
    }
  };

  const handleCloseLockModal = () => {
    setLockModalOpen(false);
    if (location.pathname !== '/dashboard' && location.pathname !== '/dashboard/deposit') {
      navigate('/dashboard');
    }
  };

  const handleGoToDeposit = () => {
    setLockModalOpen(false);
    navigate('/dashboard/deposit');
  };

  useEffect(() => {
    if (toast?.show) {
      const timer = setTimeout(() => {
        hideToast();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast?.show, hideToast]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        
        let res;
        try {
          res = await graphqlFetch(PROFILE_QUERY);
        } catch (queryErr: any) {
          const errMsg = (queryErr.message || '').toLowerCase();
          if (errMsg.includes('non-nullable') || errMsg.includes('cannot return null')) {
            console.warn("Auto-healing database profile record due to non-nullable fields error...", queryErr);
            
            const emailKey = (localStorage.getItem('last_user_identifier') || '').toLowerCase();
            const storedFirst = emailKey ? localStorage.getItem(`user_first_${emailKey}`) : '';
            const storedLast = emailKey ? localStorage.getItem(`user_last_${emailKey}`) : '';
            const storedPhone = emailKey ? localStorage.getItem(`user_phone_${emailKey}`) : '';
            const storedUser = emailKey ? emailKey.split('@')[0] : '';
            
            const healFirst = storedFirst || 'Henry';
            const healLast = storedLast || 'David';
            const healPhone = storedPhone || '+1 (555) 019-2834';
            const healUser = storedUser || 'henrydavid';
            
            // Execute healing mutation directly with valid parameters to fix backend state
            const HEAL_MUTATION = `
              mutation HealProfile($input: UpdateProfileInput!) {
                updateProfile(input: $input) {
                  id
                }
              }
            `;
            try {
              await graphqlFetch(HEAL_MUTATION, {
                input: {
                  firstName: healFirst,
                  lastName: healLast,
                  userName: healUser,
                  phoneNumber: healPhone
                }
              });
              
              // Retry query
              res = await graphqlFetch(PROFILE_QUERY);
            } catch (healErr: any) {
              console.error("Auto-healing execution failed:", healErr);
              throw queryErr;
            }
          } else {
            throw queryErr;
          }
        }

        if (res && res.profile) {
          setGraphQLUser(res.profile);
        }
      } catch (err: any) {
        console.error("Dashboard profile synchronization failed:", err);
        const errMsg = (err?.message || '').toLowerCase();
        
        // ONLY log out if the error is explicitly an authentication issue.
        // Never log out on standard schema validation errors or missing non-nullable inputs.
        const isAuthError = errMsg.includes('unauthorized') || 
                            errMsg.includes('token') || 
                            errMsg.includes('jwt') || 
                            errMsg.includes('expired') || 
                            errMsg.includes('not authenticated') ||
                            errMsg.includes('invalid credentials');
                            
        if (isAuthError) {
          console.warn("Session unauthorized, logging out...");
          const logout = useStore.getState().logout;
          logout();
        }
      }
    };
    fetchProfile();
  }, [setGraphQLUser]);

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  const navItems = [
    { name: 'Home', icon: Home, path: '/dashboard' },
    { name: 'Deposit', icon: ArrowDownCircle, path: '/dashboard/deposit' },
    { name: 'Wire Transfer', icon: Repeat, path: '/dashboard/wire' },
    { name: 'Transactions', icon: History, path: '/dashboard/transactions' },
    { name: 'Charity', icon: Heart, path: '/dashboard/charity' },
    { name: 'Grants', icon: Award, path: '/dashboard/grants' },
    { name: 'Loans', icon: Briefcase, path: '/dashboard/loans' },
    // { name: 'Pay Bills', icon: CircleDollarSign, path: '/dashboard/bills' },
    // { name: 'Verification', icon: ShieldCheck, path: '/dashboard/verification' },
    { name: 'Profile', icon: User, path: '/dashboard/profile' },
  ];

  const bottomNavItems = [
    { name: 'Home', icon: Home, path: '/dashboard' },
    { name: 'Deposit', icon: ArrowDownCircle, path: '/dashboard/deposit' },
    { name: 'Transfers', icon: Repeat, path: '/dashboard/wire' },
    { name: 'History', icon: History, path: '/dashboard/transactions' },
    { name: 'Profile', icon: User, path: '/dashboard/profile' },
  ];

  return (
    <div className="min-h-screen bg-black text-white flex overflow-hidden font-sans">
      {/* Sidebar (Desktop) */}
      <aside className={cn(
        "hidden lg:flex flex-col w-56 xl:w-64 bg-black border-r border-gold/10 z-50 py-8 sticky top-0 h-screen",
      )}>
        <div className="px-8 mb-12 flex items-center gap-3">
          <div className="w-10 h-10 bg-gold rounded-lg flex items-center justify-center shadow-lg shadow-gold/20">
            <Landmark className="w-6 h-6 text-black" strokeWidth={3} />
          </div>
          <div>
            <span className="text-xl font-black tracking-tighter text-gold uppercase italic leading-none block">EVERMONT</span>
            <span className="text-[7px] text-zinc-500 font-bold tracking-[0.2em] uppercase block mt-1">INTERNATIONAL BANK</span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto no-scrollbar">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={(e) => handleNavClick(e, item.path)}
                end={item.path === '/dashboard'}
                className={({ isActive }) => cn(
                  "flex items-center justify-between px-5 py-3.5 rounded-xl transition-all duration-300 group",
                  isActive 
                    ? "bg-gold text-black shadow-lg shadow-gold/10 font-black italic" 
                    : "text-zinc-500 hover:text-gold hover:bg-gold/5 font-bold"
                )}
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-4">
                      <item.icon size={18} className="shrink-0" strokeWidth={isActive ? 3 : 2} />
                      <span className="text-[10px] uppercase tracking-widest">{item.name}</span>
                    </div>
                    {!isActive && <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />}
                  </>
                )}
              </NavLink>
            ))}
        </nav>

        <div className="mt-auto px-6 pt-6 border-t border-gold/5">
          <div className="flex items-center space-x-3 mb-8 p-3 bg-zinc-900/50 rounded-2xl border border-white/5">
            <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold border border-gold/20 overflow-hidden">
               {profilePic ? (
                 <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
               ) : (
                 <User size={20} strokeWidth={2.5} />
               )}
            </div>
            <div>
              <p className="text-[10px] font-black text-white uppercase italic tracking-tighter leading-none">{fullName}</p>
              <p className="text-[8px] text-gold font-black uppercase tracking-widest mt-1">Verified Member</p>
            </div>
          </div>
          <button
            onClick={() => {
              const logout = useStore.getState().logout;
              logout();
            }}
            className="flex items-center gap-3 px-3 text-[10px] text-zinc-600 hover:text-red-500 mb-4 transition-colors font-black uppercase tracking-widest italic w-full text-left"
          >
            <LogOut size={16} strokeWidth={2.5} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto bg-black no-scrollbar relative">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gold/5 blur-[200px] pointer-events-none" />
        
        {/* Topbar */}
        <header className="h-20 bg-black/80 backdrop-blur-xl border-b border-gold/5 px-4 sm:px-6 lg:px-6 xl:px-10 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4 lg:hidden">
            <div className="w-8 h-8 bg-gold rounded-md flex items-center justify-center">
              <Landmark size={18} className="text-black" strokeWidth={3} />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black text-gold italic tracking-tighter uppercase leading-none">EVERMONT</span>
              <span className="text-[6px] text-zinc-500 font-bold uppercase tracking-[0.2em]">INTERNATIONAL BANK</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3 xl:gap-4 px-4 xl:px-6 py-2.5 xl:py-3 bg-zinc-900/50 border border-white/5 rounded-2xl w-full max-w-xs xl:max-w-md 2xl:max-w-lg group focus-within:border-gold/50 transition-all relative overflow-visible shadow-2xl">
            <Search size={18} className="text-zinc-600 group-focus-within:text-gold" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="GLOBAL SEARCH PROTOCOL..." 
              className="bg-transparent border-none outline-none text-[10px] font-black uppercase tracking-widest text-white placeholder:text-zinc-700 w-full"
            />
            {searchQuery && (
              <div className="absolute top-full left-0 w-full mt-2 bg-zinc-950 border border-white/10 rounded-2xl p-2 shadow-[0_30px_60px_rgba(0,0,0,0.8)] z-50">
                 {SEARCH_SUGGESTIONS.length > 0 ? (
                   SEARCH_SUGGESTIONS.map((s, i) => (
                      <button 
                        key={i} 
                        onClick={() => {
                          if (hasNoMoney && s.path !== '/dashboard' && s.path !== '/dashboard/deposit') {
                            setLockModalOpen(true);
                            setSearchQuery('');
                            return;
                          }
                          navigate(s.path); 
                          setSearchQuery(''); 
                        }}
                        className="w-full text-left p-4 hover:bg-gold/10 rounded-xl transition-colors flex items-center justify-between group/s"
                      >
                         <span className="text-[10px] font-black text-zinc-500 group-hover/s:text-gold uppercase italic tracking-widest">{s.name}</span>
                         <ArrowRight size={14} className="text-zinc-800 group-hover/s:text-gold" />
                      </button>
                   ))
                 ) : (
                   <p className="p-4 text-[9px] font-black text-zinc-800 uppercase italic">No matches found</p>
                 )}
              </div>
           )}
          </div>

          <div className="flex items-center gap-4">
             {/* Notifications */}
             <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="w-12 h-12 rounded-xl bg-gold/5 border border-gold/10 flex items-center justify-center text-zinc-500 hover:text-gold transition-all relative group"
                >
                   <Bell size={22} strokeWidth={2.5} />
                   {unreadCount > 0 && (
                     <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-[10px] font-black rounded-full border-2 border-black flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                       {unreadCount > 9 ? '9+' : unreadCount}
                     </span>
                   )}
                </button>
             </div>

             <div className="w-px h-6 bg-gold/10 mx-2 hidden sm:block" />

             <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-gold flex items-center justify-center shadow-lg shadow-gold/10 overflow-hidden">
                   {profilePic ? (
                     <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                   ) : (
                     <span className="text-[10px] font-black text-black italic uppercase">
                       {fullName.split(' ').map(n => n[0]).join('')}
                     </span>
                   )}
                </div>
                <div className="hidden sm:block">
                   <p className="text-[9px] font-black text-white uppercase italic leading-none">{fullName}</p>
                   <p className="text-[7px] text-zinc-600 font-bold uppercase tracking-widest mt-1">ONLINE_NODE</p>
                </div>
             </div>
          </div>
        </header>
 
        {/* Page Content */}
        <div className="flex-1 pb-24 lg:pb-0">
          <Outlet />
        </div>

        {/* Bottom Navigation (Mobile) */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-20 bg-black/95 backdrop-blur-2xl border-t border-gold/10 flex items-center justify-around px-4 z-[60]">
          {bottomNavItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={(e) => handleNavClick(e, item.path)}
              end={item.path === '/dashboard'}
              className={({ isActive }) => cn(
                "flex flex-col items-center gap-1.5 py-1 transition-all",
                isActive ? "text-gold" : "text-zinc-600"
              )}
            >
              {({ isActive }) => (
                <>
                  <item.icon size={22} strokeWidth={isActive ? 3 : 2} />
                  <span className={cn(
                    "text-[7px] font-black uppercase tracking-[0.2em]",
                    isActive ? "opacity-100" : "opacity-60"
                  )}>{item.name}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Quick Actions (Floating on mobile) */}
        <div className="lg:hidden fixed bottom-24 right-6 z-[70]">
           <button 
             onClick={() => setIsSidebarOpen(!isSidebarOpen)}
             className="w-16 h-16 bg-gold text-black rounded-2xl flex items-center justify-center shadow-[0_20px_40px_rgba(212,175,55,0.4)] active:scale-95 transition-all"
           >
              {isSidebarOpen ? <X size={28} strokeWidth={3} /> : <Plus size={28} strokeWidth={3} />}
           </button>
           
           <AnimatePresence>
             {isSidebarOpen && (
               <>
                 <motion.div 
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   exit={{ opacity: 0 }}
                   className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[-1]"
                   onClick={() => setIsSidebarOpen(false)}
                 />
                 <motion.div 
                   initial={{ opacity: 0, scale: 0.9, y: 20 }}
                   animate={{ opacity: 1, scale: 1, y: 0 }}
                   exit={{ opacity: 0, scale: 0.9, y: 20 }}
                   className="absolute bottom-20 right-0 w-64 bg-zinc-950 border border-gold/20 rounded-[2.5rem] p-4 space-y-2 shadow-[0_50px_100px_rgba(0,0,0,1)]"
                 >
                    {[
                      // { name: 'Pay Bills', icon: CircleDollarSign, path: '/dashboard/bills' },
                      { name: 'Wire Transfer', icon: Repeat, path: '/dashboard/wire' },
                      { name: 'Charity Donation', icon: Heart, path: '/dashboard/charity' },
                      { name: 'Sovereign Grants', icon: Award, path: '/dashboard/grants' },
                      { name: 'Apply for Loan', icon: Briefcase, path: '/dashboard/loans' },
                      { name: 'Deposit Funds', icon: ArrowDownCircle, path: '/dashboard/deposit' },
                      // { name: 'Verification', icon: ShieldCheck, path: '/dashboard/verification' },
                    ].map((act, i) => (
                      <NavLink 
                        key={i} 
                        to={act.path}
                        onClick={(e) => {
                          setIsSidebarOpen(false);
                          handleNavClick(e, act.path);
                        }}
                        className="flex items-center gap-4 p-4 rounded-xl hover:bg-gold/10 transition-colors group"
                      >
                         <div className="w-10 h-10 bg-zinc-900 rounded-lg flex items-center justify-center text-zinc-500 group-hover:text-gold border border-white/5 transition-colors">
                            <act.icon size={20} />
                         </div>
                         <span className="text-[9px] font-black text-white hover:text-gold uppercase tracking-widest italic">{act.name}</span>
                      </NavLink>
                    ))}
                 </motion.div>
               </>
             )}
           </AnimatePresence>
        </div>

        {/* Global Notifications Panel */}
        <AnimatePresence>
          {showNotifications && (
            <div className="fixed inset-0 z-[100] pointer-events-none">
               <div className="absolute inset-0 bg-black/20 pointer-events-auto" onClick={() => setShowNotifications(false)} />
               <motion.div 
                 initial={{ opacity: 0, x: 20, y: -20, scale: 0.95 }}
                 animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                 exit={{ opacity: 0, x: 20, y: -20, scale: 0.95 }}
                 className="absolute top-20 right-4 sm:right-10 w-96 max-w-[calc(100vw-2rem)] bg-zinc-950 border border-gold/20 rounded-[2rem] shadow-[0_50px_100px_rgba(0,0,0,1)] overflow-hidden pointer-events-auto"
               >
                 <div className="p-6 bg-black border-b border-gold/5 flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-black text-gold uppercase tracking-[0.3em]">Notifications</h3>
                      <p className="text-[7px] text-zinc-600 font-black uppercase tracking-widest mt-1">System Version 4.0</p>
                    </div>
                    <button 
                      onClick={handleReadAll}
                      className="text-[8px] text-zinc-500 hover:text-gold font-black uppercase tracking-widest transition-colors"
                    >
                      Read All
                    </button>
                 </div>
                 <div className="max-h-[400px] overflow-y-auto no-scrollbar">
                    {notifications.length > 0 ? (
                      notifications.slice(0, 4).map(n => (
                        <div key={n.id} className="p-5 border-b border-white/5 hover:bg-gold/5 transition-colors group relative">
                           <div className="flex gap-4">
                              <div className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border",
                                n.type === 'success' ? "bg-green-500/10 border-green-500/20 text-green-500" : "bg-gold/10 border-gold/20 text-gold"
                              )}>
                                 <Shield size={18} />
                              </div>
                              <div className="flex-1 min-w-0">
                                 <p className="text-[10px] font-black text-white uppercase tracking-tight leading-tight truncate pr-8">{n.title}</p>
                                 <p className="text-[9px] text-zinc-500 mt-1 leading-relaxed font-medium line-clamp-2">{n.message}</p>
                                 <p className="text-[7px] text-zinc-700 mt-2 font-black uppercase tracking-widest">{getNotificationTime(n)}</p>
                              </div>
                           </div>
                           <button 
                            onClick={(e) => { e.stopPropagation(); setNotificationToDelete(n.id); }}
                            className="absolute top-5 right-5 p-2 text-zinc-800 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                           >
                             <X size={14} />
                           </button>
                        </div>
                      ))
                    ) : (
                      <div className="p-10 text-center">
                        <Bell size={32} className="mx-auto text-zinc-800 mb-4 opacity-20" />
                        <p className="text-[9px] font-black text-zinc-700 uppercase italic tracking-widest">No notifications available</p>
                      </div>
                    )}
                 </div>
                 {notifications.length > 0 && (
                   <button 
                    onClick={() => { setShowAllNotifications(true); setShowNotifications(false); }}
                    className="w-full p-5 bg-black border-t border-gold/5 text-center text-[9px] font-black text-gold uppercase tracking-[0.4em] italic hover:bg-gold/5 transition-all"
                   >
                     View All Notifications
                   </button>
                 )}
               </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* View All Notifications Modal */}
        <AnimatePresence>
          {showAllNotifications && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-10">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-md"
                onClick={() => setShowAllNotifications(false)}
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-2xl bg-zinc-950 border border-gold/20 rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,1)] flex flex-col overflow-hidden"
              >
                <div className="p-8 border-b border-gold/5 bg-black flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-display font-black text-white italic tracking-tighter uppercase">Alert Repository</h2>
                    <p className="text-[9px] text-gold font-black uppercase tracking-[0.2em] mt-1">Full Transactional History & Protocol Updates</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={handleReadAll}
                      className="whitespace-now80 px-6 py-3 bg-gold/5 border border-gold/10 rounded-xl text-[9px] font-black text-gold uppercase tracking-widest hover:bg-gold/10 transition-all"
                    >
                      READ ALL
                    </button>
                    <button 
                      onClick={() => setShowAllNotifications(false)}
                      className="w-12 h-12 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-500 hover:text-white transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto no-scrollbar p-4 sm:p-8 space-y-4 max-h-[60vh]">
                  {notifications.map(n => (
                    <motion.div 
                      layout
                      key={n.id} 
                      className="p-6 bg-zinc-900/30 border border-white/5 rounded-2xl hover:border-gold/20 transition-all group relative"
                    >
                      <div className="flex gap-6">
                        <div className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border",
                          n.type === 'success' ? "bg-green-500/10 border-green-500/20 text-green-500" : "bg-gold/10 border-gold/20 text-gold"
                        )}>
                          <Shield size={24} />
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <h4 className="text-[11px] font-black text-white uppercase tracking-widest">{n.title}</h4>
                            <span className="text-[8px] text-zinc-600 font-black uppercase tracking-widest">{getNotificationTime(n)}</span>
                          </div>
                          <p className="text-[10px] text-zinc-400 mt-2 leading-relaxed font-medium">
                            {n.message}
                          </p>
                        </div>
                        <button 
                          onClick={() => setNotificationToDelete(n.id)}
                          className="p-3 bg-red-500/5 hover:bg-red-500/10 rounded-xl text-zinc-700 hover:text-red-500 transition-all group/del shrink-0 self-start"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                  {notifications.length === 0 && (
                    <div className="py-20 text-center opacity-30">
                      <Bell size={64} className="mx-auto mb-6 text-gold" />
                      <p className="text-[12px] font-black uppercase tracking-[0.5em] italic">Archive Empty</p>
                    </div>
                  )}
                </div>

                <div className="p-8 bg-black/50 border-t border-gold/5 flex justify-center">
                  <p className="text-[8px] text-zinc-700 font-black uppercase tracking-[0.3em]">Protocol Log: Secure Session Active</p>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {notificationToDelete !== null && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative w-full max-w-sm bg-zinc-950 border border-red-500/20 rounded-[2rem] p-8 text-center shadow-[0_50px_100px_rgba(0,0,0,1)]"
              >
                <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 mx-auto mb-6 border border-red-500/20">
                  <X size={32} strokeWidth={3} />
                </div>
                <h3 className="text-lg font-display font-black text-white italic tracking-tighter uppercase mb-2">Delete Alert?</h3>
                <p className="text-[10px] text-zinc-500 font-medium leading-relaxed mb-8">
                  This protocol packet will be permanently purged from the local node. This action cannot be reversed.
                </p>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setNotificationToDelete(null)}
                    className="flex-1 py-4 bg-zinc-900 border border-white/5 rounded-xl text-[9px] font-black text-zinc-500 uppercase tracking-widest hover:bg-zinc-800 transition-colors"
                  >
                    CANCEL
                  </button>
                  <button 
                    onClick={() => handleDeleteNotification(notificationToDelete)}
                    className="flex-1 py-4 bg-red-600 rounded-xl text-[9px] font-black text-white uppercase tracking-widest hover:bg-red-500 transition-colors shadow-lg shadow-red-600/20"
                  >
                    PURGE DATA
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

         {/* Global Toast Notification */}
        <AnimatePresence>
          {toast?.show && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed bottom-24 right-6 left-6 md:left-auto md:w-96 z-[300]"
            >
              <div className={cn(
                "p-5 rounded-2xl border backdrop-blur-2xl shadow-2xl flex gap-4 items-start relative overflow-hidden bg-black/95",
                toast.type === 'success' ? "border-emerald-500/20 shadow-emerald-500/5 text-white" :
                toast.type === 'error' ? "border-red-500/20 shadow-red-500/5 text-white" :
                "border-gold/20 shadow-gold/5 text-white"
              )}>
                {/* Visual Status Indicator Icon */}
                <div className={cn(
                  "p-3 rounded-xl border shrink-0",
                  toast.type === 'success' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
                  toast.type === 'error' ? "bg-red-500/10 border-red-500/20 text-red-500" :
                  "bg-gold/10 border-gold/20 text-gold"
                )}>
                  {toast.type === 'success' && <CheckCircle2 size={18} />}
                  {toast.type === 'error' && <AlertCircle size={18} />}
                  {toast.type === 'info' && <ShieldCheck size={18} />}
                </div>

                <div className="flex-1 min-w-0 pr-4">
                  <span className="block text-[10px] font-black italic uppercase tracking-widest text-zinc-500">
                    {toast.title || (toast.type === 'success' ? "TRANSACTION SECURED" : toast.type === 'error' ? "PROTOCOL EXCEPTION" : "NODE BROADCAST")}
                  </span>
                  <p className="text-[11px] font-bold mt-1 text-zinc-300 leading-relaxed uppercase tracking-wider">{toast.message}</p>
                </div>

                <button 
                  onClick={hideToast}
                  className="absolute top-5 right-5 text-zinc-500 hover:text-white transition-colors"
                >
                  <X size={14} />
                </button>

                {/* Simulated Loading/Progress bar */}
                <motion.div 
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: 5, ease: 'linear' }}
                  className={cn(
                    "absolute bottom-0 left-0 h-[2px]",
                    toast.type === 'success' ? "bg-emerald-500" :
                    toast.type === 'error' ? "bg-red-500" :
                    "bg-gold"
                  )}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Premium Activation Guard Modal */}
        <AnimatePresence>
          {isLockModalOpen && (
            <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 sm:p-6 transition-all">
              {/* Dark Overlay with heavy blur */}
              <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 className="absolute inset-0 bg-black/95 backdrop-blur-xl"
                 onClick={handleCloseLockModal}
              />

              {/* Modal Box */}
              <motion.div 
                 initial={{ opacity: 0, scale: 0.95, y: 30 }}
                 animate={{ opacity: 1, scale: 1, y: 0 }}
                 exit={{ opacity: 0, scale: 0.95, y: 30 }}
                 transition={{ type: 'spring', damping: 25, stiffness: 180 }}
                 className="w-full max-w-xl bg-zinc-950 border border-gold/15 rounded-[3rem] sm:rounded-[4rem] overflow-hidden shadow-[0_50px_100px_rgba(212,175,55,0.08)] relative z-10 max-h-[90vh] flex flex-col"
              >
                 {/* Close Button */}
                 <button 
                   onClick={handleCloseLockModal}
                   className="absolute top-6 right-6 w-10 h-10 sm:w-12 sm:h-12 bg-white/5 rounded-2xl flex items-center justify-center text-zinc-500 hover:text-white transition-colors z-20"
                 >
                    <X size={20} />
                 </button>

                 {/* Content Scrollable Area */}
                 <div className="overflow-y-auto flex-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] p-8 sm:p-12 space-y-6 pt-14">
                    <div className="text-center space-y-3">
                       <span className="inline-block text-3xl sm:text-4xl animate-bounce">⭐</span>
                       <h3 className="text-xl sm:text-2xl font-display font-black text-white italic tracking-tighter uppercase">
                         Unlock Premium <span className="text-gold">Banking Standards</span>
                       </h3>
                       <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-gold/50 to-transparent mx-auto" />
                    </div>

                    <div className="space-y-4 text-center">
                       <p className="text-[11px] sm:text-xs text-zinc-300 font-bold uppercase tracking-wider leading-relaxed">
                         Welcome to a smarter way to bank. Your account is just one step away from full activation.
                       </p>
                       <p className="text-[10px] sm:text-[11px] text-zinc-500 font-medium leading-relaxed uppercase tracking-widest italic pt-1">
                         To access our premium banking services, please fund your wallet and activate your card. Once activated, you'll enjoy a secure, reliable, and seamless banking experience designed to meet modern financial needs.
                       </p>
                    </div>

                    {/* Features List */}
                    <div className="bg-black/50 border border-white/5 rounded-3xl p-6 space-y-3 text-left">
                       <p className="text-[9px] font-black tracking-widest text-gold uppercase italic">Experience Benefits:</p>
                       <ul className="space-y-2.5">
                          {[
                            "Faster and more secure transactions",
                            "Enhanced account security and protection",
                            "Instant access to premium financial services",
                            "Smooth deposits, withdrawals, and transfers",
                            "Exclusive features available only to activated accounts"
                          ].map((item, index) => (
                            <li key={index} className="flex items-start gap-3">
                               <span className="text-gold mt-0.5">•</span>
                               <span className="text-[9px] sm:text-[10px] font-bold text-zinc-400 uppercase tracking-wider leading-normal">
                                 {item}
                               </span>
                            </li>
                          ))}
                       </ul>
                    </div>

                    <div className="space-y-6 text-center pt-2">
                       <p className="text-[10px] sm:text-[11px] text-zinc-400 font-black uppercase tracking-widest leading-relaxed">
                         Fund your wallet today and activate your card to unlock the full power of your account.
                       </p>
                       
                       <p className="text-[8px] text-gold font-bold uppercase tracking-[0.3em] italic">
                         Your premium banking journey starts now.
                       </p>
                    </div>
                 </div>

                 {/* Modal Footer / Navigation Trigger */}
                 <div className="p-6 bg-black border-t border-white/5 text-center shrink-0">
                    <button
                      onClick={handleGoToDeposit}
                      className="w-full py-4.5 bg-gold hover:bg-white text-black font-black uppercase tracking-[0.2em] text-[10px] sm:text-[11px] italic rounded-2xl transition-all cursor-pointer shadow-lg active:scale-98 flex items-center justify-center gap-2 group"
                    >
                      <span>Fund Wallet & Activate Now</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                 </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
