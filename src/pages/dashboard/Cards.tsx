import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CreditCard, 
  Lock, 
  ShieldCheck, 
  Plus, 
  ArrowRight,
  Landmark,
  Eye,
  EyeOff,
  History,
  Info,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useStore } from '@/src/lib/store';

const SAMPLE_CARDS = [
  {
    id: 1,
    name: 'Physical Visa Platinum',
    number: '**** **** **** 4242',
    expiry: '12/28',
    type: 'Physical',
    brand: 'Visa',
    color: 'from-zinc-900 via-zinc-800 to-black',
    status: 'Active'
  },
  {
    id: 2,
    name: 'Virtual Mastercard',
    number: '**** **** **** 8888',
    expiry: '05/27',
    type: 'Virtual',
    brand: 'Mastercard',
    color: 'from-blue-900 via-blue-800 to-black',
    status: 'Active'
  },
  {
    id: 3,
    name: 'Business Gold Card',
    number: '**** **** **** 1001',
    expiry: '08/29',
    type: 'Business',
    brand: 'Visa',
    color: 'from-gold/40 via-gold/10 to-black',
    status: 'Frozen'
  }
];

export default function Cards() {
  const [cards, setCards] = useState(SAMPLE_CARDS);
  const [showNumbers, setShowNumbers] = useState(false);

  const toggleFreeze = (id: number) => {
    setCards(prev => prev.map(c => 
      c.id === id ? { ...c, status: c.status === 'Active' ? 'Frozen' : 'Active' } : c
    ));
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 space-y-12 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-10">
        <div className="space-y-4">
          <h1 className="text-4xl lg:text-6xl font-display font-black text-white italic tracking-tighter leading-none uppercase">
            MY <span className="text-gold">CARDS</span>
          </h1>
          <p className="text-zinc-600 font-bold uppercase tracking-[0.3em] text-[10px] mt-2 italic">
            Manage your physical and digital protocol identifiers.
          </p>
        </div>
        <button className="px-8 py-4 bg-gold text-black rounded-2xl text-[10px] font-black uppercase tracking-widest italic hover:scale-105 transition-all shadow-xl flex items-center gap-2">
          <Plus size={16} strokeWidth={3} /> Request New Card
        </button>
      </div>

      {/* Cards List */}
      <div className="space-y-10">
        {cards.map((card, idx) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex flex-col lg:flex-row gap-10 bg-zinc-950 border border-white/5 rounded-[3.5rem] p-8 lg:p-12 shadow-2xl items-center"
          >
            {/* Visual Card Section */}
            <div className={cn(
              "w-full lg:w-[400px] aspect-[1.58/1] rounded-[2rem] p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden group border border-white/10 shrink-0 bg-gradient-to-br",
              card.color
            )}>
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Landmark size={120} />
              </div>
              
              <div className="flex justify-between items-start relative z-10">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-widest italic">{card.type} PROTOTYPE</p>
                  <h4 className="text-lg font-display font-black text-white italic truncate pr-8">{card.name}</h4>
                </div>
                <div className="w-12 h-10 bg-white/10 rounded-lg flex items-center justify-center text-white/20 italic font-black text-[10px]">
                  {card.brand}
                </div>
              </div>

              <div className="space-y-6 relative z-10">
                <div>
                   <p className="text-2xl font-mono font-black text-white tracking-[0.2em] mb-2">
                      {showNumbers ? card.number.replace(/\*/g, '•') : card.number}
                   </p>
                   <div className="flex gap-8">
                     <div>
                        <p className="text-[8px] text-white/30 font-black uppercase tracking-widest italic mb-0.5">Expiry</p>
                        <p className="text-xs font-black text-white italic">{card.expiry}</p>
                     </div>
                     <div>
                        <p className="text-[8px] text-white/30 font-black uppercase tracking-widest italic mb-0.5">Status</p>
                        <p className={cn(
                          "text-xs font-black italic",
                          card.status === 'Active' ? "text-emerald-400" : "text-red-500"
                        )}>{card.status.toUpperCase()}</p>
                     </div>
                   </div>
                </div>
              </div>

              {card.status === 'Frozen' && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white gap-4 group-hover:backdrop-blur-0 transition-all duration-700">
                   <Lock size={40} className="text-red-500" />
                   <p className="text-[10px] font-black uppercase tracking-[0.5em] italic">Frozen</p>
                </div>
              )}
            </div>

            {/* Controls Section */}
            <div className="flex-1 w-full grid sm:grid-cols-2 lg:grid-cols-1 gap-4">
              <button 
                onClick={() => toggleFreeze(card.id)}
                className={cn(
                  "flex items-center justify-between p-6 rounded-2xl border transition-all group",
                  card.status === 'Active' 
                    ? "bg-zinc-900 border-white/5 hover:border-red-500/20 text-zinc-500 hover:text-red-500" 
                    : "bg-emerald-600/10 border-emerald-500/20 text-emerald-500"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-black/40 rounded-xl flex items-center justify-center">
                    {card.status === 'Active' ? <Lock size={20} /> : <ShieldCheck size={20} />}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest italic">{card.status === 'Active' ? 'Freeze Card' : 'Unfreeze Card'}</span>
                </div>
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <button 
                onClick={() => setShowNumbers(!showNumbers)}
                className="flex items-center justify-between p-6 bg-zinc-900 border border-white/5 rounded-2xl text-zinc-500 hover:text-gold hover:border-gold/20 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-black/40 rounded-xl flex items-center justify-center">
                    {showNumbers ? <EyeOff size={20} /> : <Eye size={20} />}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest italic">{showNumbers ? 'Hide Details' : 'Show Details'}</span>
                </div>
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <button className="flex items-center justify-between p-6 bg-zinc-900 border border-white/5 rounded-2xl text-zinc-500 hover:text-white hover:border-white/10 transition-all group lg:hidden">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-black/40 rounded-xl flex items-center justify-center">
                    <History size={20} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest italic">History</span>
                </div>
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Info Warning */}
      <div className="bg-[#FFFFCC] p-8 border border-amber-200 rounded-[2.5rem] flex gap-4">
        <Info className="text-amber-600 shrink-0" size={24} />
        <p className="text-[11px] font-bold text-amber-900 leading-relaxed uppercase tracking-tight italic">
          If your physical card is lost or stolen, please freeze it immediately and initialize a new issuance sequence from the help center. Standard shipping protocols apply to all physical identifiers.
        </p>
      </div>
    </div>
  );
}
