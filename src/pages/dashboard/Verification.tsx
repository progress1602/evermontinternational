import React, { useState, useRef, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  Upload, 
  CheckCircle2,
  ChevronRight,
  Info,
  Clock,
  ArrowRight,
  Scan,
  CreditCard,
  FileText,
  X
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useNavigate } from 'react-router-dom';

export default function Verification() {
  const [step, setStep] = useState(1);
  const [docType, setDocType] = useState('Passport');
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);
  const [ssn, setSsn] = useState('');
  const navigate = useNavigate();

  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, side: 'front' | 'back') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (side === 'front') setFrontImage(reader.result as string);
        else setBackImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (side: 'front' | 'back') => {
    if (side === 'front') setFrontImage(null);
    else setBackImage(null);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 space-y-10 pb-24 text-white">
      {/* Header */}
      <div className="space-y-4 text-center">
         <h1 className="text-4xl lg:text-6xl font-display font-black text-white italic tracking-tighter leading-none uppercase">
          PROTOCOL <span className="text-gold">VERIFICATION</span>
        </h1>
        <p className="text-zinc-600 font-bold uppercase tracking-[0.3em] text-[10px] mt-2 italic">
          Authorize your sovereign identity for full node access.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-10"
          >
            {/* Info Warning */}
            <div className="bg-[#FFFFCC] p-8 border border-amber-200 rounded-[2.5rem] flex gap-6 items-start">
              <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                <Info className="text-amber-600" size={24} strokeWidth={2.5} />
              </div>
              <div className="space-y-2">
                 <h4 className="text-[11px] font-black text-amber-900 uppercase tracking-widest italic">Identity Clearance Required</h4>
                 <p className="text-[10px] font-bold text-amber-800/80 leading-relaxed uppercase tracking-tight italic">
                  To unlock high-magnitude liquidity and premium node features, you must undergo a sovereign identity audit. Please provide clear scans of your official documentation.
                 </p>
              </div>
            </div>

            {/* Document Type Selector */}
            <div className="flex gap-4 p-2 bg-zinc-950 border border-white/5 rounded-3xl">
              {['Passport', "Driver's License"].map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setDocType(type);
                    setFrontImage(null);
                    setBackImage(null);
                  }}
                  className={cn(
                    "flex-1 py-6 rounded-2xl text-[10px] font-black uppercase tracking-widest italic transition-all",
                    docType === type ? "bg-gold text-black shadow-lg" : "text-zinc-500 hover:text-white"
                  )}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Upload Grids */}
            <div className="grid sm:grid-cols-2 gap-8">
              <div className="space-y-6">
                <label className="text-[10px] font-black text-zinc-800 uppercase tracking-widest ml-2 italic">Front of {docType} *</label>
                <input 
                  type="file" 
                  ref={frontInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'front')}
                />
                <div 
                  onClick={() => frontInputRef.current?.click()}
                  className={cn(
                    "aspect-[1.58/1] bg-zinc-950 border-2 border-dashed rounded-[3rem] flex flex-col items-center justify-center gap-4 group cursor-pointer transition-all relative overflow-hidden",
                    frontImage ? "border-gold" : "border-white/10 hover:border-gold"
                  )}
                >
                   {frontImage ? (
                     <>
                       <img src={frontImage} alt="Front" className="w-full h-full object-contain p-2" />
                       <button 
                        onClick={(e) => { e.stopPropagation(); removeImage('front'); }}
                        className="absolute top-4 right-4 w-8 h-8 bg-black/80 rounded-full flex items-center justify-center text-red-500 hover:bg-black transition-colors"
                       >
                         <X size={16} />
                       </button>
                     </>
                   ) : (
                     <>
                       <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                       <div className="w-16 h-16 bg-black border border-white/5 rounded-2xl flex items-center justify-center text-zinc-800 group-hover:text-gold transition-colors relative z-10">
                          <Upload size={32} />
                       </div>
                       <p className="text-[9px] font-black text-zinc-900 group-hover:text-gold uppercase tracking-widest italic relative z-10">Click to Upload Front Scan</p>
                     </>
                   )}
                </div>
              </div>
              <div className="space-y-6">
                <label className="text-[10px] font-black text-zinc-800 uppercase tracking-widest ml-2 italic">Back of {docType} *</label>
                <input 
                  type="file" 
                  ref={backInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'back')}
                />
                <div 
                   onClick={() => backInputRef.current?.click()}
                   className={cn(
                    "aspect-[1.58/1] bg-zinc-950 border-2 border-dashed rounded-[3rem] flex flex-col items-center justify-center gap-4 group cursor-pointer transition-all relative overflow-hidden",
                    backImage ? "border-gold" : "border-white/10 hover:border-gold"
                  )}
                >
                   {backImage ? (
                     <>
                       <img src={backImage} alt="Back" className="w-full h-full object-contain p-2" />
                       <button 
                        onClick={(e) => { e.stopPropagation(); removeImage('back'); }}
                        className="absolute top-4 right-4 w-8 h-8 bg-black/80 rounded-full flex items-center justify-center text-red-500 hover:bg-black transition-colors"
                       >
                         <X size={16} />
                       </button>
                     </>
                   ) : (
                     <>
                       <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                       <div className="w-16 h-16 bg-black border border-white/5 rounded-2xl flex items-center justify-center text-zinc-800 group-hover:text-gold transition-colors relative z-10">
                          <Upload size={32} />
                       </div>
                       <p className="text-[9px] font-black text-zinc-900 group-hover:text-gold uppercase tracking-widest italic relative z-10">Click to Upload Back Scan</p>
                     </>
                   )}
                </div>
              </div>
            </div>

            <button 
              onClick={() => setStep(2)}
              disabled={!frontImage || !backImage}
              className={cn(
                "w-full h-24 rounded-[2.5rem] text-[11px] font-black uppercase tracking-[0.5em] italic transition-all flex items-center justify-center gap-4 group",
                frontImage && backImage 
                  ? "bg-zinc-950 border border-white/10 text-white hover:bg-gold hover:text-black" 
                  : "bg-zinc-900 border border-white/5 text-zinc-700 cursor-not-allowed opacity-50"
              )}
            >
              Continue to Step 2 <ChevronRight size={18} className="group-hover:translate-x-1" />
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-10"
          >
            <div className="bg-zinc-950 border border-white/5 rounded-[3.5rem] p-10 lg:p-14 space-y-10 shadow-2xl">
              <div className="space-y-2">
                <h3 className="text-2xl font-display font-black text-white italic tracking-tighter uppercase leading-none">Fiscal <span className="text-gold">Identity</span></h3>
                <p className="text-zinc-600 font-bold uppercase tracking-[0.3em] text-[10px] italic">Final step of the clearance protocol</p>
              </div>

              <div className="space-y-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-zinc-800 uppercase tracking-widest ml-2 italic">SSN / TIN Protocol Number *</label>
                  <div className="relative group">
                    <ShieldCheck className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-800 group-focus-within:text-gold transition-colors" size={24} />
                    <input 
                      placeholder="000-00-0000" 
                      value={ssn}
                      onChange={(e) => setSsn(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-2xl p-7 pl-16 text-xl font-display font-black text-white uppercase italic tracking-widest outline-none focus:border-gold transition-all" 
                    />
                  </div>
                </div>

                <div className="p-8 bg-black border border-white/5 rounded-[2rem] flex gap-4">
                  <Scan className="text-gold shrink-0" size={24} />
                  <p className="text-[9px] font-black text-zinc-500 leading-relaxed uppercase tracking-widest italic">
                    By submitting this data, you authorize a one-time soft node lookup to verify your sovereign standing. This will not affect your credit score protocol.
                  </p>
                </div>
              </div>

              <button 
                onClick={() => setStep(3)}
                disabled={!ssn}
                className={cn(
                  "w-full h-24 rounded-3xl text-[11px] font-black uppercase tracking-[0.5em] italic shadow-[0_20px_50px_rgba(212,175,55,0.25)] transition-all group flex items-center justify-center gap-4",
                  ssn 
                    ? "bg-gold text-black hover:scale-105 active:scale-95" 
                    : "bg-zinc-900 text-zinc-700 cursor-not-allowed"
                )}
              >
                Submit for Approval <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform" />
              </button>

              <button 
                onClick={() => setStep(1)}
                className="w-full text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em] italic hover:text-white transition-colors"
              >
                Go Back to Step 1
              </button>
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
                <CheckCircle2 size={200} />
             </div>
             
             <div className="relative inline-block">
                <div className="absolute inset-0 bg-emerald-500 blur-[80px] opacity-20" />
                <div className="w-40 h-40 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500 relative z-10 mx-auto">
                   <Clock size={80} strokeWidth={2.5} className="animate-pulse" />
                </div>
             </div>

             <div className="space-y-6 relative z-10">
                <h3 className="text-4xl lg:text-6xl font-display font-black text-white italic tracking-tighter uppercase leading-none">IDENTITY <span className="text-emerald-500">AUDIT</span></h3>
                <p className="text-zinc-600 font-bold max-w-lg mx-auto text-[10px] uppercase leading-loose tracking-widest italic">
                  Your identity packets have been broadcast to the central audit node. Typical clearance cycles range from 12-24 hours. You will receive an encrypted notification once authorized.
                </p>
             </div>

             <div className="p-10 bg-black border border-white/5 rounded-[2.5rem] flex flex-col gap-3 max-w-sm mx-auto relative z-10 text-center">
                <p className="text-[9px] text-zinc-800 font-black uppercase tracking-[0.5em] italic">Verification ID</p>
                <p className="text-xl font-display font-black text-gold uppercase tracking-tighter">#ID-AUDIT-{Math.floor(Math.random()*1000000)}</p>
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
