import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Smartphone, 
  MapPin, 
  Mail, 
  Globe, 
  DollarSign, 
  Languages, 
  Moon, 
  Sun,
  Camera,
  ShieldCheck,
  ChevronRight,
  Bell,
  Trash2,
  Calendar,
  Cpu,
  Layers,
  Zap,
  Save,
  RotateCcw
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useStore } from '@/src/lib/store';
import { CountrySelect, StateSelect } from '@/src/components/ui/CountrySelect';

export default function Settings() {
  const { theme, toggleTheme, fullName, country, state, updateUser } = useStore();
  const email = "a.sokolov@sovereign.node"; 
  const [currency, setCurrency] = useState('USD');
  const [language, setLanguage] = useState('English (US)');

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 pb-24 space-y-16">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gold/5 blur-[100px] pointer-events-none rounded-full" />

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 border-b border-white/5 pb-10">
        <div className="space-y-4">
           <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-gold/10 border border-gold/20 rounded-full text-[8px] font-black uppercase text-gold tracking-[0.3em] italic">
                 Protocol: Node Config
              </span>
           </div>
          <h1 className="text-4xl lg:text-6xl font-display font-black text-white italic tracking-tighter leading-none uppercase">
            SYSTEM / <span className="text-gold">CONFIG</span>
          </h1>
          <p className="text-zinc-600 font-bold uppercase tracking-[0.4em] text-[10px] mt-2 italic">
            Configure sovereign parameters and interface synchronization protocols.
          </p>
        </div>
        
        <div className="flex items-center gap-4 w-full lg:w-auto">
           <button className="flex-1 lg:flex-none flex items-center justify-center gap-3 px-8 py-5 bg-zinc-950 border border-white/5 rounded-2xl text-[9px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-all shadow-2xl italic group">
              <RotateCcw size={16} className="group-hover:rotate-180 transition-transform duration-700" /> RESET_LOG
           </button>
           <button className="flex-1 lg:flex-none flex items-center justify-center gap-3 px-8 py-5 bg-gold text-black rounded-2xl text-[9px] font-black uppercase tracking-widest italic shadow-2xl hover:scale-105 transition-all">
              <Save size={16} strokeWidth={3} /> COMMIT_ENTITY
           </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
         {/* Identity Cluster */}
         <div className="lg:col-span-2 space-y-12">
            <section className="bg-zinc-950 border border-white/5 rounded-[3rem] p-10 lg:p-14 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-10 text-white/[0.02] pointer-events-none">
                  <User size={120} />
               </div>
               <h3 className="text-2xl font-display font-black text-white italic tracking-tighter uppercase mb-12 flex items-center gap-4">
                  <div className="w-1.5 h-6 bg-gold" /> IDENTITY CLUSTER
               </h3>
               
               <div className="grid md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-zinc-800 uppercase tracking-[0.4em] ml-2 italic">Master Alia Sequence</label>
                     <div className="relative group">
                        <User className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-800 group-focus-within:text-gold transition-colors" size={18} />
                        <input defaultValue={fullName} className="w-full bg-black border border-white/10 rounded-2x p-7 pl-16 text-[10px] font-black text-white uppercase italic tracking-widest outline-none focus:border-gold transition-all" />
                     </div>
                  </div>
                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-zinc-800 uppercase tracking-[0.4em] ml-2 italic">Corridor Uplink (Email)</label>
                     <div className="relative group">
                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-800 group-focus-within:text-gold transition-colors" size={18} />
                        <input defaultValue={email} className="w-full bg-black border border-white/10 rounded-2xl p-7 pl-16 text-[10px] font-black text-white uppercase italic tracking-widest outline-none focus:border-gold transition-all" />
                     </div>
                  </div>
                  <CountrySelect 
                     label="Node Jurisdiction (Country)"
                     value={country}
                     onChange={(val) => updateUser({ country: val })}
                  />
                  <StateSelect 
                     label="Jurisdiction State"
                     country={country}
                     value={state}
                     onChange={(val) => updateUser({ state: val })}
                  />
                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-zinc-800 uppercase tracking-[0.4em] ml-2 italic">Comms Frequency (Phone)</label>
                     <div className="relative group">
                        <Smartphone className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-800 group-focus-within:text-gold transition-colors" size={18} />
                        <input defaultValue="+1 (555) 001-9284" className="w-full bg-black border border-white/10 rounded-2xl p-7 pl-16 text-[10px] font-black text-white uppercase italic tracking-widest outline-none focus:border-gold transition-all" />
                     </div>
                  </div>
               </div>
            </section>

            {/* Interface Settings */}
            <section className="bg-zinc-950 border border-white/5 rounded-[3rem] p-10 lg:p-14 shadow-2xl space-y-12">
               <h3 className="text-2xl font-display font-black text-white italic tracking-tighter uppercase mb-12 flex items-center gap-4">
                  <div className="w-1.5 h-6 bg-gold" /> INTERFACE PROTOCOLS
               </h3>

               <div className="grid md:grid-cols-2 gap-8">
                  <div className="p-8 bg-black border border-white/5 rounded-[2.5rem] flex items-center justify-between group hover:border-gold/20 transition-all">
                     <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-zinc-900 border border-white/5 text-zinc-700 rounded-2xl flex items-center justify-center group-hover:bg-gold group-hover:text-black transition-all">
                           <DollarSign size={24} />
                        </div>
                        <div>
                           <p className="text-[10px] font-black text-white uppercase italic tracking-widest">Base Ledger</p>
                           <p className="text-[8px] text-zinc-800 font-black uppercase tracking-widest mt-1">Currency standard</p>
                        </div>
                     </div>
                     <select 
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="bg-zinc-950 border-none text-[10px] font-black text-gold outline-none uppercase tracking-widest cursor-pointer hover:underline"
                     >
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                        <option value="CHF">CHF</option>
                     </select>
                  </div>

                  <div className="p-8 bg-black border border-white/5 rounded-[2.5rem] flex items-center justify-between group hover:border-gold/20 transition-all">
                     <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-zinc-900 border border-white/5 text-zinc-700 rounded-2xl flex items-center justify-center group-hover:bg-gold group-hover:text-black transition-all">
                           <Languages size={24} />
                        </div>
                        <div>
                           <p className="text-[10px] font-black text-white uppercase italic tracking-widest">Linguistics</p>
                           <p className="text-[8px] text-zinc-800 font-black uppercase tracking-widest mt-1">System language</p>
                        </div>
                     </div>
                     <button className="text-[9px] font-black text-gold uppercase tracking-widest hover:underline italic">MODIFY_LANG</button>
                  </div>

                  <div className="p-8 bg-black border border-white/5 rounded-[2.5rem] flex items-center justify-between group hover:border-gold/20 transition-all">
                     <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-zinc-900 border border-white/5 text-zinc-700 rounded-2xl flex items-center justify-center group-hover:bg-gold group-hover:text-black transition-all">
                           {theme === 'dark' ? <Moon size={24} /> : <Sun size={24} />}
                        </div>
                        <div>
                           <p className="text-[10px] font-black text-white uppercase italic tracking-widest">Chroma Node</p>
                           <p className="text-[8px] text-zinc-800 font-black uppercase tracking-widest mt-1">UI Visual Mode</p>
                        </div>
                     </div>
                     <div className="flex bg-zinc-900 border border-white/5 p-1 rounded-xl">
                        <button 
                          onClick={() => theme === 'dark' && toggleTheme()}
                          className={cn("px-4 py-2 rounded-lg text-[8px] font-black uppercase transition-all", theme === 'light' ? 'bg-gold text-black' : 'text-zinc-700')}
                        >
                          Light
                        </button>
                        <button 
                          onClick={() => theme === 'light' && toggleTheme()}
                          className={cn("px-4 py-2 rounded-lg text-[8px] font-black uppercase transition-all", theme === 'dark' ? 'bg-black text-white' : 'text-zinc-700')}
                        >
                          Dark
                        </button>
                     </div>
                  </div>

                  <div className="p-8 bg-black border border-white/5 rounded-[2.5rem] flex items-center justify-between group hover:border-gold/20 transition-all">
                     <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-zinc-900 border border-white/5 text-zinc-700 rounded-2xl flex items-center justify-center group-hover:bg-gold group-hover:text-black transition-all">
                           <Bell size={24} />
                        </div>
                        <div>
                           <p className="text-[10px] font-black text-white uppercase italic tracking-widest">Signal Hub</p>
                           <p className="text-[8px] text-zinc-800 font-black uppercase tracking-widest mt-1">App Notifications</p>
                        </div>
                     </div>
                     <button className="text-[9px] font-black text-gold uppercase tracking-widest hover:underline italic">CONFIG_SIG</button>
                  </div>
               </div>
            </section>
         </div>

         {/* Side Parameters */}
         <div className="space-y-12">
            <div className="bg-zinc-950 border border-white/5 rounded-[3rem] p-10 lg:p-12 shadow-2xl space-y-10 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 text-white/[0.02] pointer-events-none">
                  <Cpu size={80} />
               </div>
               <h3 className="text-xl font-display font-black text-white italic tracking-tighter uppercase flex items-center gap-4">
                  <div className="w-1.5 h-6 bg-gold" /> NODE STATUS
               </h3>
               
               <div className="space-y-6">
                  {[
                    { label: 'Latency Map', status: 'OPTIMIZED', color: 'text-emerald-500' },
                    { label: 'Archive Sync', status: 'COMPLETE', color: 'text-emerald-500' },
                    { label: 'Identity Grid', status: 'STABLE', color: 'text-emerald-500' }
                  ].map((stat, i) => (
                    <div key={i} className="flex justify-between items-center group">
                       <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest group-hover:text-zinc-400 transition-colors">{stat.label}</span>
                       <span className={cn("text-[9px] font-black uppercase tracking-widest italic", stat.color)}>{stat.status}</span>
                    </div>
                  ))}
               </div>
            </div>

            <div className="bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-500/20 rounded-[3rem] p-10 lg:p-12 shadow-2xl space-y-8 group">
               <div className="w-14 h-14 bg-red-500 text-white rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                  <Trash2 size={28} />
               </div>
               <div>
                  <h4 className="text-lg font-black text-white uppercase italic tracking-tighter">ERASURE PROTOCOL</h4>
                  <p className="text-[9px] text-red-500/60 font-black uppercase tracking-widest mt-4 leading-relaxed italic">
                     PERMANENTLY DESTRUCT SOVEREIGN IDENTITY AND ALL ARCHIVAL NODES. 
                  </p>
               </div>
               <button className="w-full py-5 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl text-[9px] font-black uppercase tracking-widest italic hover:bg-red-500 hover:text-white transition-all">
                  INITIALIZE_ERASURE
               </button>
            </div>

            <div className="bg-zinc-950 border border-white/5 rounded-[3rem] p-10 lg:p-12 shadow-2xl flex flex-col items-center justify-center text-center space-y-4">
               <Layers size={40} className="text-zinc-900" strokeWidth={1} />
               <p className="text-[8px] text-zinc-800 font-black uppercase tracking-[0.4em] italic leading-relaxed">
                  SYSTEM VERSION 3.1.0-ALPHAV <br /> SOVEREIGN BUILD 9284-EX
               </p>
            </div>
         </div>
      </div>
    </div>
  );
}

