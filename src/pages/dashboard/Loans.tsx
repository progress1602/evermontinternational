import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  Home, 
  Heart, 
  User, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft, 
  DollarSign, 
  Calendar, 
  Percent, 
  CheckCircle2, 
  Info, 
  Clock, 
  Briefcase, 
  ChevronRight,
  X,
  FileText,
  RotateCw
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useStore } from '@/src/lib/store';
import { useNavigate } from 'react-router-dom';
import { graphqlFetch, APPLY_FOR_LOAN_MUTATION, MY_LOANS_QUERY } from '@/src/lib/graphql';

const LOAN_PLANS = [
  {
    id: 1,
    name: 'Personal Loan',
    rate: '5.5% APR',
    tenure: '12 - 60 Months',
    range: '$1,000 - $50,000',
    icon: User
  },
  {
    id: 2,
    name: 'Business Loan',
    rate: '4.2% APR',
    tenure: '24 - 120 Months',
    range: '$50,000 - $500,000',
    icon: Briefcase
  },
  {
    id: 3,
    name: 'Home Loan',
    rate: '3.5% APR',
    tenure: '120 - 360 Months',
    range: '$100,000 - $2,000,000',
    icon: Home
  },
  {
    id: 4,
    name: 'Car Loan',
    rate: '4.8% APR',
    tenure: '12 - 84 Months',
    range: '$5,000 - $100,000',
    icon: Building2
  }
];

export default function Loans() {
  const showToast = useStore(state => state.showToast);
  const [selectedPlan, setSelectedPlan] = useState(LOAN_PLANS[0]);
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState('');
  const [durationMonths, setDurationMonths] = useState(12);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [loans, setLoans] = useState<any[]>([]);
  const [loadingLoans, setLoadingLoans] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const navigate = useNavigate();

  const fetchMyLoans = async () => {
    setLoadingLoans(true);
    try {
      const res = await graphqlFetch(MY_LOANS_QUERY);
      setLoans(res?.myLoans || []);
    } catch (err: any) {
      console.error("Failed to load loan applications:", err);
      showToast("Unable to fetch your active loans.", "error", "SYNC_ERROR");
    } finally {
      setLoadingLoans(false);
    }
  };

  const handleOpenHistory = () => {
    setShowHistoryModal(true);
    fetchMyLoans();
  };

  const handleSubmit = async () => {
    if (!amount) return;
    setSubmitting(true);
    setSubmitError('');

    try {
      const input = {
        loanAmount: Number(amount),
        durationMonths: Number(durationMonths)
      };

      await graphqlFetch(APPLY_FOR_LOAN_MUTATION, { input });
      showToast(`Loan application of $${Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })} has been received and queued for audit verification.`, 'success', 'LOAN APPLICATION FILED');
      setStep(2);
    } catch (err: any) {
      console.error("Apply for loan error:", err);
      setSubmitError(err.message || 'Audit validation error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 space-y-10 pb-24">
      {/* Header */}
      <div className="space-y-4 text-center">
         <h1 className="text-4xl lg:text-6xl font-display font-black text-white italic tracking-tighter leading-none uppercase">
          LOAN <span className="text-gold">APPLICATION</span>
        </h1>
        <p className="text-zinc-600 font-bold uppercase tracking-[0.3em] text-[10px] mt-2 italic">
          Select a plan and initialize your liquidity request.
        </p>
        <div className="flex justify-center pt-2">
          <button
            onClick={handleOpenHistory}
            className="flex items-center gap-2 px-6 py-3 bg-zinc-950 border border-white/5 hover:border-gold/30 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-gold transition-all cursor-pointer shadow-lg active:scale-95"
          >
            <Clock size={12} className="text-gold" />
            My Active Applications
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div 
            key="plans"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-10"
          >
            <div className="grid sm:grid-cols-2 gap-6">
              {LOAN_PLANS.map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan)}
                  className={cn(
                    "p-8 rounded-[3rem] text-left transition-all duration-500 border relative overflow-hidden group",
                    selectedPlan.id === plan.id 
                      ? "bg-zinc-950 border-gold shadow-2xl scale-[1.02]" 
                      : "bg-zinc-950/50 border-white/5 hover:border-white/10"
                  )}
                >
                  <div className="absolute top-0 right-0 p-6 text-gold/5 pointer-events-none group-hover:text-gold/10 transition-colors">
                    <plan.icon size={80} />
                  </div>
                  
                  <div className="space-y-6 relative z-10">
                    <div className="w-16 h-16 bg-black border border-white/10 rounded-2xl flex items-center justify-center text-gold">
                      <plan.icon size={32} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-display font-black text-white italic tracking-tighter uppercase leading-none">{plan.name}</h3>
                      <p className="text-[10px] font-black text-gold uppercase tracking-[0.2em] mt-2 italic">{plan.rate}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-6">
                      <div>
                        <p className="text-[8px] text-zinc-600 font-black uppercase italic tracking-widest mb-1">Tenure</p>
                        <p className="text-[10px] font-black text-white italic">{plan.tenure}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[8px] text-zinc-600 font-black uppercase italic tracking-widest mb-1">Range</p>
                        <p className="text-[10px] font-black text-white italic">{plan.range}</p>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="bg-zinc-950 border border-white/5 rounded-[3rem] p-10 lg:p-14 space-y-10 shadow-2xl">
              <div className="space-y-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-zinc-800 uppercase tracking-widest ml-2 italic">Requested Amount *</label>
                  <div className="relative group">
                    <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-800 group-focus-within:text-gold transition-colors" size={24} />
                    <input 
                      placeholder="0.00" 
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-2xl p-7 pl-16 text-3xl font-display font-black text-white uppercase italic tracking-tighter outline-none focus:border-gold transition-all" 
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-zinc-800 uppercase tracking-widest ml-2 italic">Repayment Period (Months) *</label>
                  <div className="relative">
                    <select 
                      value={durationMonths}
                      onChange={(e) => setDurationMonths(Number(e.target.value))}
                      className="w-full bg-black border border-white/10 rounded-2xl p-6 text-[11px] font-black text-white uppercase italic tracking-widest outline-none focus:border-gold appearance-none"
                    >
                      <option value={12}>12 MONTHS</option>
                      <option value={24}>24 MONTHS</option>
                      <option value={36}>36 MONTHS</option>
                      <option value={48}>48 MONTHS</option>
                      <option value={60}>60 MONTHS</option>
                    </select>
                    <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-600 rotate-90" size={18} />
                  </div>
                </div>
              </div>

              <div className="bg-[#FFFFCC] p-8 border border-amber-200 rounded-[2.5rem] flex gap-4">
                <Info className="text-amber-600 shrink-0" size={24} />
                <p className="text-[11px] font-bold text-amber-900 leading-relaxed uppercase tracking-tight italic">
                  LOAN APPROVAL IS SUBJECT TO CREDIT AUDIT AND SOVEREIGN RISK ASSESSMENT. ADDITIONAL DOCUMENTATION MAY BE REQUIRED AFTER SUBMISSION.
                </p>
              </div>

              {submitError && (
                <div className="p-5 bg-red-500/5 border border-red-500/10 rounded-2xl text-[10px] text-red-500 font-bold uppercase tracking-widest text-center">
                  {submitError}
                </div>
              )}

              <button 
                onClick={handleSubmit}
                disabled={submitting || !amount}
                className="w-full h-24 bg-gold text-black rounded-3xl text-[11px] font-black uppercase tracking-[0.5em] italic shadow-[0_20px_50px_rgba(212,175,55,0.25)] hover:scale-105 active:scale-95 transition-all group flex items-center justify-center gap-4 disabled:opacity-30 disabled:grayscale"
              >
                {submitting ? "Processing Application..." : "Submit Application"} 
                {!submitting && <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform" />}
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-zinc-950 border border-white/5 rounded-[4rem] p-16 text-center space-y-12 shadow-2xl relative overflow-hidden"
          >
             <div className="absolute top-0 right-0 p-12 text-emerald-500/5 pointer-events-none animate-pulse">
                <CheckCircle2 size={200} />
             </div>
             
             <div className="relative inline-block">
                <div className="absolute inset-0 bg-emerald-500 blur-[80px] opacity-20" />
                <div className="w-40 h-40 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500 relative z-10 mx-auto">
                   <Clock size={80} strokeWidth={2.5} className="animate-pulse" />
                </div>
             </div>

             <div className="space-y-6 relative z-10">
                <h3 className="text-4xl lg:text-6xl font-display font-black text-white italic tracking-tighter uppercase leading-none">APPLICATION <span className="text-emerald-500">PENDING</span></h3>
                <p className="text-zinc-600 font-bold max-w-lg mx-auto text-[10px] uppercase leading-loose tracking-widest italic">
                  Your loan application for <span className="text-white font-black italic">${Number(amount).toLocaleString()}</span> has been submitted for review. An advisor will review your account profile and contact you within 24-48 hours.
                </p>
             </div>

             <div className="p-10 bg-black border border-white/5 rounded-[2.5rem] flex flex-col gap-3 max-w-sm mx-auto relative z-10">
                <p className="text-[9px] text-zinc-800 font-black uppercase tracking-[0.5em] italic">Reference ID</p>
                <p className="text-xl font-display font-black text-gold uppercase tracking-tighter">#LN-AUDIT-{Math.floor(Math.random()*1000000)}</p>
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

      {/* Loan History Modal Overlay */}
      <AnimatePresence>
        {showHistoryModal && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-md"
              onClick={() => setShowHistoryModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="relative w-full max-w-2xl h-[550px] bg-zinc-950 border border-gold/20 rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden text-white"
            >
              {/* Modal Header */}
              <div className="p-8 border-b border-white/5 bg-black flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gold/10 border border-gold/20 rounded-xl flex items-center justify-center text-gold">
                    <FileText size={18} />
                  </div>
                  <div>
                    <h3 className="text-lg font-display font-black text-white italic tracking-tighter uppercase leading-none">My Loans</h3>
                    <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mt-1">Loan History Tracker</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={fetchMyLoans}
                    disabled={loadingLoans}
                    className="p-3 bg-zinc-900 border border-white/5 text-zinc-400 hover:text-gold rounded-xl hover:border-gold/20 transition-all cursor-pointer disabled:opacity-50"
                    title="Refresh Ledger"
                  >
                    <RotateCw size={14} className={cn(loadingLoans && "animate-spin")} />
                  </button>
                  <button 
                    onClick={() => setShowHistoryModal(false)}
                    className="p-3 bg-zinc-900 border border-white/5 text-zinc-400 hover:text-white rounded-xl hover:border-white/20 transition-all cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-8 space-y-4">
                {loadingLoans ? (
                  <div className="h-full flex flex-col items-center justify-center space-y-4">
                    <div className="w-12 h-12 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
                    <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest italic animate-pulse">Loading loans...</p>
                  </div>
                ) : loans.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-6">
                    <div className="w-16 h-16 bg-zinc-900/50 border border-white/5 rounded-2xl flex items-center justify-center text-zinc-750">
                      <Clock size={32} />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-black text-white uppercase tracking-wider">No Active Allocations</h4>
                      <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest max-w-sm mx-auto leading-relaxed italic">
                        No active or pending loans found.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {loans.map((loan) => {
                      const isPending = loan.status?.toLowerCase() === 'pending' || !loan.status;
                      const isApproved = loan.status?.toLowerCase() === 'approved';

                      return (
                        <div 
                          key={loan.id}
                          className="bg-black/40 border border-white/5 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-white/10 transition-all group"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/5 border border-white/5 rounded-xl flex items-center justify-center text-zinc-400 group-hover:text-gold group-hover:border-gold/10 transition-colors">
                              <Building2 size={20} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-xs font-black text-white uppercase tracking-wider">Personal Loan</h4>
                                <span className="text-[8px] font-mono text-zinc-600">ID: #{loan.id?.substring(0, 8).toUpperCase()}</span>
                              </div>
                              <div className="flex gap-4 items-center mt-1.5">
                                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-tight italic">
                                  Term: {loan.durationMonths} Months
                                </span>
                                <span className="w-1.5 h-1.5 bg-zinc-800 rounded-full" />
                                <span className="text-[10px] font-bold text-gold uppercase tracking-tight italic">
                                  {loan.interestRate || '4.5%'} APR
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 border-white/5 pt-4 sm:pt-0">
                            <div className="text-left sm:text-right">
                              <p className="text-[8px] text-zinc-650 font-black uppercase italic tracking-widest mb-0.5">Loan Amount</p>
                              <p className="text-sm font-display font-black text-white tracking-tight">
                                ${Number(loan.loanAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                              </p>
                            </div>

                            <span className={cn(
                              "px-3.5 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest border text-center min-w-[110px]",
                              isPending ? "bg-amber-500/10 border-amber-500/30 text-amber-550" :
                              isApproved ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" :
                              "bg-red-500/10 border-red-500/30 text-red-500"
                            )}>
                              {loan.status || 'UNDER REVIEW'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-6 bg-black border-t border-white/5 text-center">
                <p className="text-[8px] text-zinc-700 font-bold uppercase tracking-widest italic">
                  SECURE BANKING WITH COMPREHENSIVE ASSET PROTECTION
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
