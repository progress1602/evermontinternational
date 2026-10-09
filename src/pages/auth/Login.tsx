import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Landmark, ArrowRight, Eye, EyeOff, ShieldCheck, Mail, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { useStore } from '@/src/lib/store';
import { cn } from '@/src/lib/utils';
import { graphqlFetch, LOGIN_MUTATION } from '@/src/lib/graphql';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const setAuthenticated = useStore(state => state.setAuthenticated);
  const setGraphQLUser = useStore(state => state.setGraphQLUser);
  const updateUser = useStore(state => state.updateUser);

  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('CONVERGING SECURE LINK...');
  const [formError, setFormError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isServerWarming, setIsServerWarming] = useState(false);

  // Floating Premium Toast States
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success'
  });

  // Pre-warm the backend node immediately when login screen mounts to avoid Render cold starts
  useEffect(() => {
    let isMounted = true;
    const timeout = setTimeout(() => {
      if (isMounted) {
        setIsServerWarming(true);
      }
    }, 1800);

    fetch('https://manual-bank.onrender.com/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: '{ __schema { queryType { name } } }' })
    })
    .then(() => {
      clearTimeout(timeout);
      if (isMounted) {
        setIsServerWarming(false);
      }
    })
    .catch(() => {
      // Allow graceful failure if offline or error
    });

    return () => {
      isMounted = false;
      clearTimeout(timeout);
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoadingStatus('CONVERGING SECURE LINK...');
    setFormError('');
    setSuccessMsg('');
    setToast(prev => ({ ...prev, show: false }));

    // Dynamically cycle through server warming/logging messages to keep connection feel highly responsive
    const statuses = [
      'ESTABLISHING HANDSHAKE PROTOCOL...',
      'AWAKENING PRIVATE SECURE SATELLITE CORE... (~30s if idle)',
      'ESTABLISHING SHIELDED END-TO-END CRYPTO-LINK...',
      'DECRYPTING HARDENED SECURE VAULT GATEWAY...',
      'AUTHENTICATING ACCESS CREDENTIALS...',
      'VERIFYING UPLINK MASTER ACCESS SIGNATURE...'
    ];
    let idx = 0;
    const statusInterval = setInterval(() => {
      setLoadingStatus(statuses[idx % statuses.length]);
      idx++;
    }, 4500);

    try {
      const data = await graphqlFetch(LOGIN_MUTATION, {
        input: {
          emailOrUsername,
          password
        }
      });

      clearInterval(statusInterval);

      if (data && data.login) {
        const { success, message, token, user } = data.login;
        if (success) {
          localStorage.setItem('token', token);
          localStorage.setItem('last_user_identifier', user.email);
          
          const finalSuccessMsg = message || "LOGIN PROTOCOL VERIFIED. PREPARING SECURITY PORTAL.";
          setSuccessMsg(finalSuccessMsg);
          setToast({
            show: true,
            message: finalSuccessMsg,
            type: 'success'
          });

          // Attempt to find PIN from localStorage of local browser session registration
          const matchedPin = localStorage.getItem(`user_pin_${user.username.toLowerCase()}`) || 
                             localStorage.getItem(`user_pin_${user.email.toLowerCase()}`) || 
                             '0000';

          setGraphQLUser(user);
          // Set isPinVerified: false so the user can see and type their security access PIN
          updateUser({ pin: matchedPin, isAuthenticated: true, isPinVerified: false });

          setTimeout(() => {
            navigate('/auth/pin-entry');
          }, 2500);
        } else {
          const finalErrMsg = message || "ACCESS CREDENTIALS REJECTED BY SOVEREIGN MAIN.";
          setFormError(finalErrMsg);
          setToast({
            show: true,
            message: finalErrMsg,
            type: 'error'
          });
        }
      } else {
        const finalErrMsg = "Identity core rejected authentication queries.";
        setFormError(finalErrMsg);
        setToast({
          show: true,
          message: finalErrMsg,
          type: 'error'
        });
      }
    } catch (err: any) {
      clearInterval(statusInterval);
      const finalErrMsg = err.message || "UPLINK CONNECTION HANDSHAKE TIMEOUT.";
      setFormError(finalErrMsg);
      setToast({
        show: true,
        message: finalErrMsg,
        type: 'error'
      });
    } finally {
      clearInterval(statusInterval);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-black selection:bg-gold selection:text-black font-sans">
      {/* Brand Side */}
      <div className="hidden md:flex md:w-1/2 bg-black p-20 flex-col justify-between relative overflow-hidden border-r border-zinc-900/50">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_rgba(255,191,0,0.1),transparent_70%)]" />
          <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,_rgba(255,191,0,0.05),transparent_60%)]" />
        </div>
        
        <Link to="/" className="flex items-center gap-3 relative z-10 group">
          <div className="bg-gold p-1.5 rounded-lg shadow-[0_0_15px_rgba(255,191,0,0.3)]">
             <Landmark className="w-8 h-8 text-black" strokeWidth={2.5} />
          </div>
          <span className="text-2xl font-display font-black text-white tracking-tight uppercase">Evermont International</span>
        </Link>

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-6xl font-display font-black text-white mb-8 leading-tight">
              Premium <br />
              <span className="text-gold italic">Access.</span>
            </h2>
            <p className="text-zinc-400 text-lg leading-relaxed max-w-sm font-medium">
              Enter the secure gateway to your premium financial ecosystem. Total control, unparalleled trust.
            </p>
          </motion.div>
        </div>

        <div className="relative z-10 flex items-center gap-4 text-zinc-600 text-xs font-bold uppercase tracking-widest">
           <ShieldCheck className="text-gold w-5 h-5" />
           Bank-Level Protection Active
        </div>
      </div>

      {/* Form Side */}
      <div className="flex-1 flex flex-col justify-center px-8 lg:px-24 bg-black">
        <div className="max-w-md w-full mx-auto">
          <div className="mb-12 block md:hidden text-center">
            <Link to="/" className="flex items-center justify-center gap-3">
              <Landmark className="w-10 h-10 text-gold" strokeWidth={2.5} />
              <span className="text-3xl font-display font-black text-white tracking-tight">Evermont International</span>
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
             <h1 className="text-4xl font-display font-black text-white mb-2">Welcome Back</h1>
             <p className="text-zinc-500 mb-10 font-semibold tracking-tight">Enter your credentials to access your account</p>

             {isServerWarming && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-8 p-5 bg-gold/5 border border-gold/25 rounded-2xl flex gap-4 items-center shadow-[0_10px_30px_rgba(212,175,55,0.05)]"
                >
                  <div className="w-9 h-9 rounded-xl bg-gold/10 border border-gold/20 text-gold flex items-center justify-center shrink-0 animate-pulse">
                     <Lock size={16} />
                  </div>
                  <div>
                    <span className="text-[8px] font-black uppercase text-gold tracking-widest block mb-1">SOVEREIGN DATABASE AWAKENING</span>
                    <span className="text-zinc-400 text-[9.5px] uppercase font-black tracking-widest leading-relaxed block">
                      Our secure database node is spinning up. First operation will take ~30 seconds.
                    </span>
                  </div>
                </motion.div>
             )}

             {formError && (
                <div id="login-error" className="mb-6 p-4 bg-red-950/25 border border-red-500/30 rounded-2xl text-red-500 text-[10px] font-black uppercase tracking-widest text-center italic">
                   [ SYSTEM ALERT ]: {formError}
                </div>
             )}
             {successMsg && (
                <div id="login-success" className="mb-6 p-4 bg-emerald-950/25 border border-emerald-500/30 rounded-2xl text-emerald-400 text-[10px] font-black uppercase tracking-widest text-center italic">
                   [ ACCESS GRANTED ]: {successMsg}
                </div>
             )}

             <form className="space-y-8" onSubmit={handleLogin}>
                <div className="space-y-3">
                   <label className="block text-xs font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Email or Username</label>
                   <div className="relative group">
                      <input 
                        type="text" 
                        required
                        disabled={loading}
                        value={emailOrUsername}
                        onChange={(e) => setEmailOrUsername(e.target.value)}
                        placeholder="your@email.com or username" 
                        className="w-full px-6 py-5 bg-zinc-950 border border-zinc-900 rounded-2xl outline-none focus:border-gold focus:ring-4 focus:ring-gold/5 transition-all text-sm font-bold text-white placeholder:text-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <Mail size={18} className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-gold transition-colors" />
                   </div>
                </div>

                <div className="space-y-3">
                   <div className="flex justify-between items-center ml-1">
                      <label className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">Password</label>
                      <button type="button" className="text-[10px] font-black uppercase tracking-widest text-gold hover:text-white transition-colors">Forgot Password?</button>
                   </div>
                   <div className="relative group">
                      <input 
                        type={showPassword ? "text" : "password"} 
                        required
                        disabled={loading}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••" 
                        className="w-full px-6 py-5 bg-zinc-950 border border-zinc-900 rounded-2xl outline-none focus:border-gold focus:ring-4 focus:ring-gold/5 transition-all text-sm font-bold tracking-[0.3em] text-white placeholder:text-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <button 
                        type="button" 
                        className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-700 hover:text-gold transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                         {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                   </div>
                </div>

                <div className="pt-4">
                   <button 
                     type="submit" 
                     disabled={loading}
                     className={cn(
                       "w-full py-5 text-[10px] sm:text-xs uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-2",
                       loading 
                         ? "bg-zinc-850/80 text-gold font-bold cursor-not-allowed shadow-none rounded-2xl border border-gold/10"
                         : "sleek-button-gold shadow-gold/20"
                     )}
                   >
                      {loading ? (
                        <div className="flex items-center gap-3 animate-pulse">
                          <span className="w-2 h-2 rounded-full bg-gold animate-ping shrink-0" />
                          <span>{loadingStatus}</span>
                        </div>
                      ) : "Login Account"} 
                      {!loading && <ArrowRight size={18} className="ml-1" />}
                   </button>
                </div>
             </form>

             <div className="mt-12 text-center">
                <p className="text-zinc-500 font-semibold tracking-tight">
                   Don't have an account? <Link to="/auth/register" className="text-gold font-black hover:underline underline-offset-4">Open One Now</Link>
                </p>
             </div>
          </motion.div>
        </div>
      </div>

      {/* Premium Floating Sovereign Toast */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            className="fixed top-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4"
          >
            <div className={cn(
              "p-5 rounded-2xl border backdrop-blur-xl flex gap-4 items-center shadow-2xl relative overflow-hidden",
              toast.type === 'success' 
                ? "bg-zinc-950/90 border-gold/40 shadow-[0_15px_40px_rgba(212,175,55,0.25)]" 
                : "bg-zinc-950/90 border-red-500/40 shadow-[0_15px_40px_rgba(239,68,68,0.2)]"
            )}>
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border",
                toast.type === 'success' 
                  ? "bg-gold/10 border-gold/20 text-gold" 
                  : "bg-red-500/10 border-red-500/25 text-red-500"
              )}>
                {toast.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
              </div>
              
              <div className="flex-1">
                <span className={cn(
                  "text-[8px] font-black uppercase tracking-[0.25em] block mb-0.5",
                  toast.type === 'success' ? "text-gold" : "text-red-500"
                )}>
                  {toast.type === 'success' ? "ACCESS AUTHENTICATED" : "CONNECTION ERROR"}
                </span>
                <span className="text-white text-[10px] font-black tracking-widest block uppercase leading-snug">
                  {toast.message}
                </span>
              </div>
              
              <button 
                type="button"
                onClick={() => setToast(prev => ({ ...prev, show: false }))}
                className="text-zinc-600 hover:text-white transition-colors text-[9px] font-black uppercase tracking-widest shrink-0"
              >
                DISMISS
              </button>

              {/* Countdown track bar */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-zinc-900 pointer-events-none">
                <motion.div 
                  initial={{ width: '100%' }}
                  animate={{ width: 0 }}
                  transition={{ duration: toast.type === 'success' ? 2.5 : 3.5, ease: 'linear' }}
                  className={cn(
                    "h-full",
                    toast.type === 'success' ? "bg-gold" : "bg-red-500"
                  )}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
