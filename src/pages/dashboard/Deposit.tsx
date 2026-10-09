import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowDownCircle, 
  Copy, 
  CheckCircle2, 
  ChevronRight, 
  ShieldCheck, 
  Upload, 
  Clock, 
  Bitcoin, 
  Wallet, 
  Smartphone, 
  Landmark,
  ArrowLeft,
  AlertCircle,
  FileImage,
  Activity,
  ArrowRight
} from 'lucide-react';
import { useStore } from '@/src/lib/store';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/src/lib/utils';
import { graphqlFetch, CREATE_DEPOSIT_MUTATION } from '@/src/lib/graphql';

type DepositMethod = {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  category: 'Crypto' | 'Digital Wallets' | 'Local';
  instructions: {
    label: string;
    value: string;
    copyable?: boolean;
  }[];
};

const DEPOSIT_METHODS: DepositMethod[] = [
  {
    id: 'btc',
    name: 'Bitcoin (BTC)',
    icon: Bitcoin,
    description: 'Protocol-level decentralized asset transfer',
    category: 'Crypto',
    instructions: [
      { label: 'Network', value: 'BITCOIN' },
      { label: 'BTC Wallet Address', value: '1NRincYAdC9xa8AxWEaApubFVZTsQWc1N5', copyable: true },
      { label: 'Expected Confirmation', value: '2 blocks' }
    ]
  },
  {
    id: 'eth',
    name: 'Ethereum (ETH)',
    icon: Activity,
    description: 'Global smart contract settlement',
    category: 'Crypto',
    instructions: [
      { label: 'Network', value: 'ERC-20' },
      { label: 'ETH Wallet Address', value: '0x3f04ea4dc4221c607d50b28f50fc4bffcfdb4c98', copyable: true }
    ]
  },
  {
    id: 'cashapp',
    name: 'CashApp',
    icon: Smartphone,
    description: 'Instant mobile P2P settlement',
    category: 'Digital Wallets',
    instructions: [
      { label: 'Method', value: 'BITCOIN DEPOSIT' },
      { label: 'BTC Wallet Address', value: '1NRincYAdC9xa8AxWEaApubFVZTsQWc1N5', copyable: true },
      { label: 'Note Requirement', value: 'Account Initialization' }
    ]
  }
];

function DollarSignIcon(props: any) {
  return (
    <svg 
      {...props} 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <line x1="12" x2="12" y1="2" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

export default function Deposit() {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<DepositMethod | null>(null);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [isCopied, setIsCopied] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [submitError, setSubmitError] = useState('');
  const deposit = useStore(state => state.deposit);
  const showToast = useStore(state => state.showToast);
  const navigate = useNavigate();

  const compressImage = (file: File, maxWidth = 600, maxHeight = 600, quality = 0.6): Promise<File> => {
    return new Promise((resolve) => {
      if (!file.type.startsWith('image/')) {
        resolve(file);
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            canvas.toBlob((blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now()
                });
                resolve(compressedFile);
              } else {
                resolve(file);
              }
            }, 'image/jpeg', quality);
          } else {
            resolve(file);
          }
        };
        img.onerror = () => resolve(file);
        img.src = event.target?.result as string;
      };
      reader.onerror = () => resolve(file);
      reader.readAsDataURL(file);
    });
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const fallbackBase64 = () => new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(file);
    });

    const uploadPromise = async (): Promise<string> => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'preset_unsigned');
      formData.append('api_key', 'Om6jzyVgLO4CrAJMaDYaWO-mlEo');
      const res = await fetch(`https://api.cloudinary.com/v1_1/progresshenry/image/upload`, {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        if (data.secure_url) {
          return data.secure_url;
        }
      }
      throw new Error("Failed Cloudinary response status");
    };

    try {
      const result = await Promise.race([
        uploadPromise(),
        new Promise<never>((_, reject) => setTimeout(() => reject(new Error("Cloudinary timeout reached")), 3500))
      ]);
      return result;
    } catch (err) {
      console.warn("Cloudinary upload failed or exceeded threshold, utilizing zero-latency compressed base64 fallback:", err);
      return await fallbackBase64();
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(id);
    setTimeout(() => setIsCopied(null), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !proofFile || !selectedMethod) return;

    setSubmitting(true);
    setSubmitError('');
    setUploadProgress('Compressing and packaging proof asset...');

    try {
      const compressedFile = await compressImage(proofFile);
      setUploadProgress('Uploading proof to secure Cloudinary storage...');
      const proofUrl = await uploadToCloudinary(compressedFile);
      setUploadProgress('Broadcasting secure deposit transaction to blockchain nodes...');

      const input = {
        amount: Number(amount),
        paymentMethod: selectedMethod.name,
        proofOfPayment: proofUrl
      };

      const res = await graphqlFetch(CREATE_DEPOSIT_MUTATION, { input });
      console.log("CreateDeposit reaction success:", res);

      deposit(Number(amount), selectedMethod.name, 'Pending');
      showToast(`Deposit of $${Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })} has been logged. Validation protocol in progress.`, 'success', 'DEPOSIT PACKET ENCRYPTED');
      setStep(3);
    } catch (err: any) {
      console.error("Deposit submission error:", err);
      setSubmitError(err.message || 'Verification connection failed. Please retry.');
    } finally {
      setSubmitting(false);
      setUploadProgress('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-[100px] pointer-events-none" />

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-12"
          >
            <div className="text-center sm:text-left space-y-4">
               <div className="inline-flex items-center gap-3 px-4 py-2 bg-gold/10 border border-gold/20 rounded-full text-[9px] font-black uppercase text-gold tracking-widest italic">
                  <Activity size={14} /> Node Refill Protocol
               </div>
               <h1 className="text-4xl lg:text-6xl font-display font-black text-white italic tracking-tighter leading-none uppercase">
                  Add <span className="text-gold">Liquidity</span>
               </h1>
               <p className="text-zinc-600 font-bold tracking-tight text-xs max-w-lg">Inject fresh assets into your sovereign ecosystem using our global settlement network.</p>
            </div>

            <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 items-start">
               {/* Left: Amount & Category Selector */}
               <div className="space-y-10">
                  <div className="bg-zinc-950 border border-white/5 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-6 text-gold/10 pointer-events-none">
                        <DollarSignIcon className="size-32" />
                     </div>
                     <label className="block text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 mb-6 italic">Liquidity Amount (USD)</label>
                     <div className="relative">
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 text-5xl font-display font-black text-zinc-800 italic">$</span>
                        <input 
                           type="number"
                           value={amount}
                           onChange={e => setAmount(e.target.value)}
                           className="w-full bg-transparent border-none outline-none text-6xl font-display font-black text-white italic tracking-tighter placeholder:text-zinc-900 pl-10"
                           placeholder="0.00"
                        />
                     </div>
                  </div>

                  <div className="space-y-4">
                     <span className="block text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 ml-4 mb-6">Settlement Protocol</span>
                     <div className="grid grid-cols-1 gap-4">
                        {DEPOSIT_METHODS.map((m) => (
                           <button
                              key={m.id}
                              onClick={() => setSelectedMethod(m)}
                              className={cn(
                                 "w-full p-6 bg-zinc-950 border rounded-3xl flex items-center justify-between group transition-all duration-500 text-left",
                                 selectedMethod?.id === m.id ? "border-gold bg-gold/5 shadow-2xl shadow-gold/5" : "border-white/5 hover:border-gold/20"
                              )}
                           >
                              <div className="flex items-center gap-5">
                                 <div className={cn(
                                    "w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-500",
                                    selectedMethod?.id === m.id ? "bg-gold text-black border-gold" : "bg-app-bg border-white/5 text-zinc-600"
                                 )}>
                                    <m.icon size={24} strokeWidth={2.5} />
                                 </div>
                                 <div>
                                    <h4 className={cn(
                                       "text-sm font-black uppercase italic tracking-tighter transition-all",
                                       selectedMethod?.id === m.id ? "text-gold" : "text-zinc-400 group-hover:text-white"
                                    )}>{m.name}</h4>
                                    <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest mt-1">{m.description}</p>
                                 </div>
                              </div>
                              <ChevronRight className={cn(
                                 "text-zinc-800 group-hover:text-gold group-hover:translate-x-1 transition-all",
                                 selectedMethod?.id === m.id && "text-gold opacity-100"
                              )} />
                           </button>
                        ))}
                     </div>
                  </div>
               </div>

               {/* Right: Info Box */}
               <div className="space-y-8 lg:sticky lg:top-32">
                  <div className="bg-gold/5 border border-gold/10 p-10 rounded-[3rem] relative overflow-hidden group">
                     <div className="absolute -top-10 -right-10 w-40 h-40 bg-gold/10 blur-[80px] group-hover:bg-gold/20 transition-all" />
                     <ShieldCheck className="text-gold mb-6" size={40} strokeWidth={2.5} />
                     <h3 className="text-xl font-display font-black text-white italic tracking-tighter mb-4">SECURE SETTLEMENT</h3>
                     <p className="text-zinc-500 font-bold leading-relaxed text-[11px] uppercase tracking-wider">
                        All incoming liquidity is verified via node validation. Funds are typically available within 5-15 packets (minutes) after proof submission.
                     </p>
                  </div>

                  <button 
                     disabled={!amount || !selectedMethod}
                     onClick={() => setStep(2)}
                     className="w-full bg-gold text-black py-8 rounded-[2rem] text-sm font-black uppercase tracking-[0.4em] italic shadow-[0_20px_50px_rgba(212,175,55,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed group"
                  >
                     GENERATE INSTRUCTIONS <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform" />
                  </button>
               </div>
            </div>
          </motion.div>
        )}

        {step === 2 && selectedMethod && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-12"
          >
            <button 
               onClick={() => setStep(1)}
               className="flex items-center gap-3 text-zinc-600 hover:text-gold transition-colors font-black text-[10px] uppercase tracking-[0.3em] group italic"
            >
               <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> BACK TO PROTOCOL SELECT
            </button>

            <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12">
               {/* Instructions */}
               <div className="space-y-8">
                  <div className="bg-zinc-950 border border-gold/10 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
                     <div className="flex items-center gap-5 mb-10">
                        <div className="w-16 h-16 bg-gold text-black rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.1)]">
                           <selectedMethod.icon size={32} strokeWidth={3} />
                        </div>
                        <div>
                           <h2 className="text-3xl font-display font-black text-white italic tracking-tighter leading-none uppercase">{selectedMethod.name}</h2>
                           <p className="text-zinc-600 text-[10px] uppercase font-black tracking-widest mt-2 italic">Settlement Instructions</p>
                        </div>
                     </div>

                     <div className="space-y-8">
                        {selectedMethod.instructions.map((ins, i) => (
                           <div key={i} className="space-y-3">
                              <label className="block text-[8px] font-black uppercase tracking-[0.4em] text-zinc-700 ml-1 italic">{ins.label}</label>
                              <div className="flex items-center gap-3 group/ins">
                                 <div className="flex-1 bg-black border border-white/5 rounded-2xl p-5 text-sm font-black text-zinc-300 tracking-tighter break-all">
                                    {ins.value}
                                 </div>
                                 {ins.copyable && (
                                    <button 
                                       onClick={() => handleCopy(ins.value, `${i}`)}
                                       className="w-14 h-14 bg-zinc-900 hover:bg-gold hover:text-black text-zinc-600 rounded-2xl flex items-center justify-center transition-all border border-white/5 shrink-0"
                                    >
                                       {isCopied === `${i}` ? <CheckCircle2 size={24} /> : <Copy size={24} />}
                                    </button>
                                 )}
                              </div>
                           </div>
                        ))}
                     </div>

                     <div className="mt-12 p-6 bg-amber-500/5 border border-amber-500/10 rounded-2xl flex items-start gap-4">
                        <AlertCircle className="text-amber-500 shrink-0" size={20} />
                        <p className="text-[10px] text-amber-500/80 font-bold italic leading-relaxed uppercase tracking-tight">
                           Ensure you are sending assets from a verified node. Incorrect network selection will result in permanent loss of sovereign assets.
                        </p>
                     </div>
                  </div>
               </div>

               {/* Proof Upload */}
               <form onSubmit={handleSubmit} className="space-y-10 lg:sticky lg:top-32">
                  <div className="bg-zinc-950 border border-white/5 p-10 rounded-[3rem] shadow-2xl space-y-8">
                     <div className="text-center space-y-2">
                        <h3 className="text-xl font-display font-black text-white italic tracking-tighter uppercase">UPLOAD PROOF</h3>
                        <p className="text-zinc-600 text-[9px] font-bold uppercase tracking-[0.3em]">Mandatory protocol verification</p>
                     </div>

                     <div className="relative group">
                        <input 
                           type="file" required 
                           onChange={e => setProofFile(e.target.files?.[0] || null)}
                           className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        />
                        <div className={cn(
                           "h-64 border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center gap-4 transition-all duration-500",
                           proofFile ? "bg-emerald-500/5 border-emerald-500/20" : "bg-black border-zinc-900 group-hover:border-gold/30"
                        )}>
                           <div className={cn(
                              "w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500",
                              proofFile ? "bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.2)]" : "bg-zinc-950 border border-white/5 text-zinc-700"
                           )}>
                              {proofFile ? <FileImage size={32} /> : <Upload size={32} />}
                           </div>
                           <div className="text-center space-y-2">
                              <p className={cn(
                                 "text-[11px] font-black uppercase tracking-widest px-8",
                                 proofFile ? "text-emerald-500" : "text-zinc-600"
                              )}>
                                 {proofFile ? proofFile.name : "DRAG OR CLICK TO UPLOAD PACKET"}
                              </p>
                              <p className="text-[8px] text-zinc-800 font-black tracking-widest uppercase">Max Size: 10MB • JPG, PNG, PDF</p>
                           </div>
                        </div>
                     </div>

                     <div className="p-6 bg-zinc-900/50 rounded-2xl border border-white/5 flex items-center gap-4">
                        <Clock className="text-gold shrink-0" size={20} />
                        <div>
                           <p className="text-[9px] text-white font-black uppercase italic leading-none">VERIFICATION TIME</p>
                           <p className="text-[8px] text-zinc-600 font-bold uppercase mt-1 tracking-widest">Protocol validation usually takes 2-5 minutes.</p>
                        </div>
                     </div>
                  </div>

                  {uploadProgress && (
                     <div className="p-5 bg-gold/5 border border-gold/10 rounded-2xl text-[10px] text-gold font-bold uppercase tracking-widest text-center animate-pulse">
                       {uploadProgress}
                     </div>
                  )}

                  {submitError && (
                     <div className="p-5 bg-red-500/5 border border-red-500/10 rounded-2xl text-[10px] text-red-500 font-bold uppercase tracking-widest text-center">
                       {submitError}
                     </div>
                  )}

                  <button 
                     type="submit" 
                     disabled={submitting}
                     className="w-full bg-emerald-500 text-black py-8 rounded-[2rem] text-sm font-black uppercase tracking-[0.4em] italic shadow-[0_20px_50px_rgba(16,185,129,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 group disabled:opacity-50 disabled:cursor-not-allowed"
                   >
                     {submitting ? "VERIFYING PROOF PACKET..." : "SUBMIT FOR SETTLEMENT"} 
                     {!submitting && <CheckCircle2 size={22} className="group-hover:scale-125 transition-transform" />}
                  </button>
               </form>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto space-y-12 text-center py-20"
          >
            <div className="relative inline-block">
               <div className="absolute inset-0 bg-gold blur-[60px] opacity-20 animate-pulse" />
               <div className="w-32 h-32 bg-gold/10 border border-gold/20 rounded-full flex items-center justify-center text-gold relative z-10 mx-auto group">
                  <Clock size={64} className="group-hover:rotate-12 transition-transform duration-700" strokeWidth={2.5} />
               </div>
            </div>

            <div className="space-y-6">
               <h2 className="text-4xl lg:text-6xl font-display font-black text-white italic tracking-tighter uppercase">PROTOCOL <span className="text-gold">PENDING</span></h2>
               <p className="text-zinc-600 font-bold max-w-lg mx-auto text-xs uppercase leading-loose tracking-widest">
                  Your liquidity injection of <span className="text-white font-black italic">$ {Number(amount).toLocaleString()}</span> has been broadcast to the network. Please remain patient while the autonomous technicians verify your proof packet.
               </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
               <button 
                  onClick={() => navigate('/dashboard')}
                  className="bg-gold text-black px-10 py-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] italic shadow-2xl hover:scale-105 transition-all w-full sm:w-auto"
               >
                  RETURN TO DASHBOARD
               </button>
               <button 
                  onClick={() => navigate('/dashboard/transactions')}
                  className="bg-zinc-950 text-white border border-white/10 px-10 py-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] italic hover:bg-zinc-900 transition-all w-full sm:w-auto"
               >
                  VIEW PACKET LOGS
               </button>
            </div>

            <div className="pt-20">
               <div className="flex items-center gap-4 justify-center text-[8px] text-zinc-800 font-black uppercase tracking-[0.5em] italic">
                  <div className="w-12 h-px bg-zinc-800" />
                  EVERMONT INTERNATIONAL SECURE SETTLEMENT
                  <div className="w-12 h-px bg-zinc-800" />
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

