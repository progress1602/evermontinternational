import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { Landmark, ArrowRight, ShieldCheck, User, Mail, Lock, Phone, Globe, Briefcase, DollarSign, Wallet, Hash, ChevronDown, CheckCircle2, AlertCircle } from 'lucide-react';
import { useStore } from '@/src/lib/store';
import { COUNTRIES_DATA } from '@/src/lib/countries';
import { CountrySelect, StateSelect } from '@/src/components/ui/CountrySelect';
import { graphqlFetch, REGISTER_MUTATION } from '@/src/lib/graphql';

export default function Register() {
  const navigate = useNavigate();
  const updateUser = useStore(state => state.updateUser);
  const setGraphQLUser = useStore(state => state.setGraphQLUser);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    username: '',
    password: '',
    confirmPassword: '',
    pin: '',
    occupation: '',
    ssn: '',
    country: 'United States',
    state: 'New York',
    currency: 'USD',
    accountType: 'Savings/Checking'
  });

  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('PROVISIONING COLD STORAGE KEYS...');
  const [formError, setFormError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isServerWarming, setIsServerWarming] = useState(false);

  // Floating Premium Toast States
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success'
  });

  // Pre-warm backend immediately when register page mounts
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
      // Allow graceful timeout response
    });

    return () => {
      isMounted = false;
      clearTimeout(timeout);
    };
  }, []);

  const handleCountryChange = (countryName: string) => {
    const countryObj = COUNTRIES_DATA.find(c => c.name === countryName);
    if (countryObj) {
      setFormData({
        ...formData,
        country: countryName,
        currency: countryObj.currency,
        state: countryObj.states[0] || ''
      });
    }
  };

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match the protocol encryption.";
    }
    
    if (formData.pin.length !== 4) {
      newErrors.pin = "PIN must be exactly 4 digits.";
    }

    const ssnDigits = formData.ssn.replace(/\D/g, '');
    if (ssnDigits.length !== 9) {
      newErrors.ssn = "SSN must contain exactly 9 digits.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setLoadingStatus('PROVISIONING COLD STORAGE KEYS...');
    setFormError('');
    setSuccessMsg('');
    setToast(prev => ({ ...prev, show: false }));

    const statuses = [
      'PROVISIONING COMPLIANCE AUDITING CHANNELS...',
      'AWAKENING PRIVATE SECURE SATELLITE CORE... (~30s if idle)',
      'INITIALIZING SOVEREIGN CREDENTIAL KEYPAD...',
      'ESTABLISHING SHIELDED END-TO-END CRYPTO-LINK...',
      'REGISTERING ACCOUNT CORES...',
      'FINALIZING INITIAL PROTOCOLS...'
    ];
    let idx = 0;
    const statusInterval = setInterval(() => {
      setLoadingStatus(statuses[idx % statuses.length]);
      idx++;
    }, 4500);

    try {
      const data = await graphqlFetch(REGISTER_MUTATION, {
        input: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          username: formData.username,
          phoneNumber: formData.phone,
          occupation: formData.occupation,
          ssn: formData.ssn,
          country: formData.country,
          stateProvince: formData.state,
          currencyProtocol: formData.currency,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          accessPin: formData.pin,
        }
      });

      clearInterval(statusInterval);

      if (data && data.register) {
        const { success, message, token, user } = data.register;
        if (success) {
          // Store token in localStorage
          localStorage.setItem('token', token);
          localStorage.setItem('last_user_identifier', user.email);
          
          // Store registered pin in shared browser state so PIN entry stage can read it later
          localStorage.setItem(`user_pin_${formData.username.toLowerCase()}`, formData.pin);
          localStorage.setItem(`user_pin_${formData.email.toLowerCase()}`, formData.pin);
          localStorage.setItem('user_pin', formData.pin);
          
          const finalSuccessMsg = message || "ACCOUNT INITIALIZED successfully. PREPARING SECURITY PORTAL.";
          setSuccessMsg(finalSuccessMsg);
          setToast({
            show: true,
            message: finalSuccessMsg,
            type: 'success'
          });
          
          // Set in local storage / memory store
          setGraphQLUser(user);
          // Set isPinVerified: false so the user can enter their newly registered PIN
          updateUser({ pin: formData.pin, isAuthenticated: true, isPinVerified: false });

          setTimeout(() => {
            navigate('/auth/pin-entry');
          }, 2500);
        } else {
          const finalErrMsg = message || "REGISTRATION FAILURE. VERIFY SYSTEM PARAMETERS.";
          setFormError(finalErrMsg);
          setToast({
            show: true,
            message: finalErrMsg,
            type: 'error'
          });
        }
      } else {
        const finalErrMsg = "Sovereign link did not return valid response parameters.";
        setFormError(finalErrMsg);
        setToast({
          show: true,
          message: finalErrMsg,
          type: 'error'
        });
      }
    } catch (err: any) {
      clearInterval(statusInterval);
      const finalErrMsg = err.message || "UPLINK CONNECTION SYSTEM INTERRUPT.";
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

  const inputClasses = "w-full px-6 py-4 bg-zinc-950 border border-zinc-900 rounded-xl outline-none focus:border-gold transition-all text-[11px] font-black uppercase tracking-widest text-white placeholder:text-zinc-800";
  const labelClasses = "block text-[8px] font-black uppercase tracking-[0.3em] text-zinc-500 ml-1 mb-2.5";

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-black selection:bg-gold selection:text-black font-sans">
      {/* Brand Side */}
      <div className="hidden lg:flex lg:w-[35%] bg-black p-16 flex-col justify-between relative overflow-hidden border-r border-gold/10">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_rgba(212,175,55,0.08),transparent_70%)]" />
          <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,_rgba(212,175,55,0.05),transparent_60%)]" />
        </div>
        
        <Link to="/" className="flex items-center gap-4 relative z-10">
          <div className="bg-gold p-2 rounded-lg shadow-[0_0_20px_rgba(212,175,55,0.3)]">
             <Landmark className="w-8 h-8 text-black" strokeWidth={3} />
          </div>
          <div>
            <span className="text-2xl font-display font-black text-white tracking-tighter uppercase italic block leading-none">Evermont International</span>
            <span className="text-[7px] text-zinc-500 font-bold tracking-[0.4em] uppercase block mt-1">Bank</span>
          </div>
        </Link>

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-6xl font-display font-black text-white mb-10 leading-[1.1] tracking-tighter">
              BEYOND <br />
              <span className="text-gold italic">BANKING.</span>
            </h2>
            <div className="space-y-6">
               {[
                 "INSTANT GLOBAL LIQUIDITY",
                 "END-TO-END NODE ENCRYPTION",
                 "SOVEREIGN ASSET PROTECTION"
               ].map((benefit, i) => (
                  <div key={i} className="flex items-center gap-4 group">
                     <div className="w-8 h-8 bg-zinc-900 border border-gold/10 rounded-lg flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-black transition-all duration-300">
                       <ShieldCheck className="w-4 h-4" />
                     </div>
                     <span className="text-zinc-500 font-black tracking-widest text-[9px] uppercase">{benefit}</span>
                  </div>
               ))}
            </div>
          </motion.div>
        </div>

        <div className="relative z-10 flex items-center gap-4 text-zinc-700 text-[8px] font-black uppercase tracking-[0.3em] leading-relaxed italic">
           © 2026 EVERMONT INTERNATIONAL BANK <br />
           ALL RIGHTS RESERVED • SECURE PROTOCOL v1.0
        </div>
      </div>

      {/* Form Side */}
      <div className="flex-1 flex flex-col justify-start lg:h-screen overflow-y-auto no-scrollbar relative bg-black">
        <div className="max-w-3xl w-full mx-auto px-8 lg:px-24 py-16">
          <div className="mb-12 block lg:hidden text-center">
            <Link to="/" className="inline-flex items-center gap-3">
              <Landmark className="w-10 h-10 text-gold" strokeWidth={3} />
              <span className="text-3xl font-display font-black text-white tracking-tighter italic uppercase">Evermont International</span>
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
             <div className="mb-12">
                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-gold mb-3 block">Account Registration Phase</span>
                <h1 className="text-4xl lg:text-5xl font-display font-black text-white mb-4 italic tracking-tighter leading-none">JOIN THE NETWORK</h1>
                <p className="text-zinc-600 font-bold tracking-tight text-xs max-w-md">Complete the sovereign protocol to initialize your global banking terminal.</p>

                {isServerWarming && (
                   <motion.div 
                     initial={{ opacity: 0, scale: 0.95 }}
                     animate={{ opacity: 1, scale: 1 }}
                     className="mt-6 p-5 bg-gold/5 border border-gold/25 rounded-2xl flex gap-4 items-center shadow-[0_10px_30px_rgba(212,175,55,0.05)]"
                   >
                     <div className="w-9 h-9 rounded-xl bg-gold/10 border border-gold/20 text-gold flex items-center justify-center shrink-0 animate-pulse">
                        <Lock size={16} />
                     </div>
                     <div>
                       <span className="text-[8px] font-black uppercase text-gold tracking-widest block mb-1">SOVEREIGN DATABASE AWAKENING</span>
                       <span className="text-zinc-400 text-[9.5px] uppercase font-black tracking-widest leading-relaxed block">
                         Our secure database node is spinning up. First registration core query will take ~30 seconds.
                       </span>
                     </div>
                   </motion.div>
                )}
                
                {formError && (
                   <div id="register-error" className="mt-6 p-4 bg-red-950/25 border border-red-500/30 rounded-2xl text-red-500 text-[10px] font-black uppercase tracking-widest text-center italic">
                      [ SYSTEM ALERT ]: {formError}
                   </div>
                )}
                {successMsg && (
                   <div id="register-success" className="mt-6 p-4 bg-emerald-950/25 border border-emerald-500/30 rounded-2xl text-emerald-400 text-[10px] font-black uppercase tracking-widest text-center italic">
                      [ PROTOCOL SUCCESS ]: {successMsg}
                   </div>
                )}
             </div>

             <form className="space-y-10" onSubmit={handleRegister}>
                {/* Section 1: Personal Profile */}
                <div className="space-y-6">
                   <div className="flex items-center gap-4 mb-8">
                      <div className="h-px bg-gold/20 flex-1" />
                      <span className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500">Identity Profile</span>
                      <div className="h-px bg-gold/20 flex-1" />
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                         <label className={labelClasses}>First Name</label>
                         <div className="relative group">
                            <input 
                              type="text" required placeholder="ALEXANDER" 
                              className={inputClasses}
                              value={formData.firstName}
                              onChange={e => setFormData({...formData, firstName: e.target.value})}
                            />
                            <User size={16} className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-800 group-focus-within:text-gold transition-colors" />
                         </div>
                      </div>
                      <div>
                         <label className={labelClasses}>Last Name</label>
                         <div className="relative group">
                            <input 
                              type="text" required placeholder="ROTHSCHILD" 
                              className={inputClasses}
                              value={formData.lastName}
                              onChange={e => setFormData({...formData, lastName: e.target.value})}
                            />
                            <User size={16} className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-800 group-focus-within:text-gold transition-colors" />
                         </div>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                         <label className={labelClasses}>Email Address</label>
                         <div className="relative group">
                            <input 
                              type="email" required placeholder="ALEXANDER.ROTHSCHILD@PRIVATE-CLIENT.CH" 
                              className={inputClasses}
                              value={formData.email}
                              onChange={e => setFormData({...formData, email: e.target.value})}
                            />
                            <Mail size={16} className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-800 group-focus-within:text-gold transition-colors" />
                         </div>
                      </div>
                      <div>
                         <label className={labelClasses}>Phone Number</label>
                         <div className="relative group">
                            <input 
                              type="tel" required placeholder="+41 22 739 51 11" 
                              className={inputClasses}
                              value={formData.phone}
                              onChange={e => setFormData({...formData, phone: e.target.value})}
                            />
                            <Phone size={16} className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-800 group-focus-within:text-gold transition-colors" />
                         </div>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                         <label className={labelClasses}>Occupation</label>
                         <div className="relative group">
                            <input 
                              type="text" required placeholder="OFFSHORE TRUST MANAGER" 
                              className={inputClasses}
                              value={formData.occupation}
                              onChange={e => setFormData({...formData, occupation: e.target.value})}
                            />
                            <Briefcase size={16} className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-800 group-focus-within:text-gold transition-colors" />
                         </div>
                      </div>
                      <CountrySelect 
                        label="Country of Operation *"
                        value={formData.country}
                        onChange={handleCountryChange}
                      />
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <StateSelect 
                        label="State / Province *"
                        country={formData.country}
                        value={formData.state}
                        onChange={val => setFormData({...formData, state: val})}
                      />
                      <div>
                         <label className={labelClasses}>Social Security Number (SSN) *</label>
                         <div className="relative group">
                            <input 
                              type="text" required placeholder="000-00-0000" 
                              className={cn(inputClasses, errors.ssn && "border-red-500")}
                              value={formData.ssn}
                              onChange={e => setFormData({...formData, ssn: e.target.value})}
                            />
                            <Hash size={16} className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-800 group-focus-within:text-gold transition-colors" />
                         </div>
                         {errors.ssn && <p className="text-[8px] text-red-500 mt-2 font-black uppercase tracking-widest">{errors.ssn}</p>}
                      </div>
                   </div>
                </div>

                {/* Section 2: Account Config */}
                <div className="space-y-6">
                   <div className="flex items-center gap-4 mb-8">
                      <div className="h-px bg-gold/20 flex-1" />
                      <span className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500">Node Configuration</span>
                      <div className="h-px bg-gold/20 flex-1" />
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                         <label className={labelClasses}>Currency Protocol</label>
                         <div className="relative group">
                             <input 
                               readOnly
                               tabIndex={-1}
                               className={cn(inputClasses, "bg-zinc-950/50 cursor-not-allowed opacity-80")}
                               value={`${formData.currency} - ${COUNTRIES_DATA.find(c => c.currency === formData.currency)?.currencySymbol || ''}`}
                             />
                            <DollarSign size={16} className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-800 transition-colors pointer-events-none" />
                         </div>
                      </div>
                      <div>
                         <label className={labelClasses}>Account Tier</label>
                         <div className="relative group">
                            <select 
                              className={cn(inputClasses, "appearance-none bg-zinc-950")}
                              value={formData.accountType}
                              onChange={e => setFormData({...formData, accountType: e.target.value})}
                            >
                               <option value="Savings/Checking">PREMIUM SAVINGS/CHECKING</option>
                               <option value="Private Banking">SOVEREIGN PRIVATE BANKING</option>
                               <option value="Corporate">CORPORATE INFRASTRUCTURE</option>
                            </select>
                            <Wallet size={16} className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-800 transition-colors pointer-events-none" />
                         </div>
                      </div>
                   </div>
                </div>

                {/* Section 3: Credentials */}
                <div className="space-y-6">
                   <div className="flex items-center gap-4 mb-8">
                      <div className="h-px bg-gold/20 flex-1" />
                      <span className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500">Secure Access Credentials</span>
                      <div className="h-px bg-gold/20 flex-1" />
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                      <div>
                         <label className={labelClasses}>Username</label>
                         <div className="relative group">
                            <input 
                              type="text" required placeholder="AROTHSCHILD" 
                              className={inputClasses}
                              value={formData.username}
                              onChange={e => setFormData({...formData, username: e.target.value})}
                            />
                            <User size={16} className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-800 group-focus-within:text-gold transition-colors" />
                         </div>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                         <label className={labelClasses}>Secure Password</label>
                         <div className="relative group">
                            <input 
                              type="password" required placeholder="••••••••" 
                              className={inputClasses}
                              value={formData.password}
                              onChange={e => setFormData({...formData, password: e.target.value})}
                            />
                            <Lock size={16} className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-800 group-focus-within:text-gold transition-colors" />
                         </div>
                      </div>
                      <div>
                         <label className={labelClasses}>Confirm Password</label>
                         <div className="relative group">
                            <input 
                              type="password" required placeholder="••••••••" 
                              className={cn(inputClasses, errors.confirmPassword && "border-red-500")}
                              value={formData.confirmPassword}
                              onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                            />
                            <Lock size={16} className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-800 group-focus-within:text-gold transition-colors" />
                         </div>
                         {errors.confirmPassword && <p className="text-[8px] text-red-500 mt-2 font-black uppercase tracking-widest">{errors.confirmPassword}</p>}
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                      <div>
                         <label className={labelClasses}>Account Access PIN (4 Digits)</label>
                         <div className="relative group">
                            <input 
                              type="password" required placeholder="0000" 
                              maxLength={4}
                              className={cn(inputClasses, "tracking-[1em] text-center", errors.pin && "border-red-500")}
                              value={formData.pin}
                              onChange={e => setFormData({...formData, pin: e.target.value.replace(/\D/g, '')})}
                            />
                            <Hash size={16} className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-800 group-focus-within:text-gold transition-colors" />
                         </div>
                         {errors.pin && <p className="text-[8px] text-red-500 mt-2 font-black uppercase tracking-widest text-center">{errors.pin}</p>}
                      </div>
                   </div>
                </div>

                <div className="pt-10">
                   <p className="text-[9px] text-zinc-600 mb-10 px-1 font-bold leading-relaxed text-center uppercase tracking-widest italic">
                      BY CLICKING PROTOCOL INITIALIZATION, YOU ACKNOWLEDGE THE <span className="text-gold font-black underline underline-offset-4 cursor-pointer">SOVEREIGN TERMS</span> AND THE <span className="text-gold font-black underline underline-offset-4 cursor-pointer">SECURE NODE PRIVACY LOGIC</span>.
                   </p>
                   <button 
                     type="submit" 
                     disabled={loading}
                     className={cn(
                        "w-full py-6 rounded-2xl text-[11px] font-black uppercase tracking-[0.4em] italic shadow-[0_20px_50px_rgba(212,175,55,0.2)] transition-all flex items-center justify-center gap-3 group",
                        loading 
                          ? "bg-zinc-800 text-zinc-500 cursor-not-allowed shadow-none" 
                          : "bg-gold text-black hover:scale-[1.01] active:scale-[0.98]"
                     )}
                   >
                      {loading ? (
                        <div className="flex items-center gap-3 animate-pulse">
                          <span className="w-2.5 h-2.5 rounded-full bg-gold animate-ping shrink-0" />
                          <span>{loadingStatus}</span>
                        </div>
                      ) : "INITIALIZE ACCOUNT"} 
                      {!loading && <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />}
                   </button>
                </div>
             </form>

             <p className="text-center mt-16 text-zinc-600 text-[10px] font-black uppercase tracking-[0.2em] italic">
                ALREADY PART OF THE NETWORK? <Link to="/auth/login" className="text-gold hover:underline underline-offset-4 ml-1">CONNECT ACCOUNT</Link>
             </p>
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
                  {toast.type === 'success' ? "SYSTEM SECURED" : "ALERT SYSTEM"}
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
