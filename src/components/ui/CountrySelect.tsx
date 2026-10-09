import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Check, Search, Globe } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { COUNTRIES_DATA } from '@/src/lib/countries';

interface CountrySelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  label?: string;
}

export function CountrySelect({ value, onChange, disabled, className, label }: CountrySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedCountry = COUNTRIES_DATA.find(c => c.name === value) || COUNTRIES_DATA[0];

  const filteredCountries = COUNTRIES_DATA.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={cn("space-y-2 relative", className)} ref={containerRef}>
      {label && <label className="text-[10px] font-black text-zinc-800 uppercase tracking-widest ml-2 italic">{label}</label>}
      
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={cn(
          "w-full bg-zinc-950 border border-white/10 rounded-2xl p-6 text-[11px] font-black text-white uppercase italic tracking-widest outline-none transition-all flex items-center justify-between",
          isOpen ? "border-gold ring-1 ring-gold/20" : "hover:border-white/20",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <div className="flex items-center gap-3">
          <img 
            src={`https://flagcdn.com/w40/${selectedCountry.code.toLowerCase()}.png`} 
            alt={selectedCountry.name}
            className="w-5 h-3.5 object-cover rounded-sm shadow-sm"
          />
          <span>{selectedCountry.name}</span>
        </div>
        <ChevronDown size={14} className={cn("text-zinc-600 transition-transform", isOpen && "rotate-180")} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute z-50 mt-2 w-full bg-zinc-900 border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden"
          >
            <div className="p-3 border-b border-white/5 bg-black/20 flex items-center gap-3">
              <Search size={14} className="text-zinc-600" />
              <input 
                autoFocus
                placeholder="Search country..."
                className="bg-transparent border-none outline-none text-[10px] font-bold text-white uppercase italic tracking-widest w-full"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            
            <div className="max-h-60 overflow-y-auto custom-scrollbar p-2">
              {filteredCountries.map((c) => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => {
                    onChange(c.name);
                    setIsOpen(false);
                    setSearch('');
                  }}
                  className={cn(
                    "w-full flex items-center justify-between p-3 rounded-xl transition-all group",
                    value === c.name ? "bg-gold/10" : "hover:bg-white/5"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <img 
                      src={`https://flagcdn.com/w40/${c.code.toLowerCase()}.png`} 
                      alt={c.name}
                      className="w-5 h-3.5 object-cover rounded-sm shadow-sm grayscale group-hover:grayscale-0 transition-all"
                    />
                    <span className={cn(
                      "text-[10px] font-black uppercase tracking-widest italic transition-colors",
                      value === c.name ? "text-gold" : "text-zinc-500 group-hover:text-white"
                    )}>
                      {c.name}
                    </span>
                  </div>
                  {value === c.name && <Check size={14} className="text-gold" />}
                </button>
              ))}
              {filteredCountries.length === 0 && (
                <div className="p-4 text-center text-[9px] font-black text-zinc-700 uppercase italic tracking-widest">
                  No nodes found
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface StateSelectProps {
  value: string;
  country: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  label?: string;
}

export function StateSelect({ value, country, onChange, disabled, className, label }: StateSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedCountry = COUNTRIES_DATA.find(c => 
    c.name.trim().toLowerCase() === (country || '').trim().toLowerCase()
  ) || COUNTRIES_DATA[0];
  const states = selectedCountry?.states || [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={cn("space-y-2 relative", className)} ref={containerRef}>
      {label && <label className="text-[10px] font-black text-zinc-800 uppercase tracking-widest ml-2 italic">{label}</label>}
      
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={cn(
          "w-full bg-zinc-950 border border-white/10 rounded-2xl p-6 text-[11px] font-black text-white uppercase italic tracking-widest outline-none transition-all flex items-center justify-between",
          isOpen ? "border-gold ring-1 ring-gold/20" : "hover:border-white/20",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <span className={value ? "text-white" : "text-zinc-600"}>{value || 'SELECT STATE'}</span>
        <ChevronDown size={14} className={cn("text-zinc-600 transition-transform", isOpen && "rotate-180")} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute z-50 mt-2 w-full bg-zinc-900 border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden"
          >
            <div className="max-h-60 overflow-y-auto custom-scrollbar p-2">
              {states.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    onChange(s);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center justify-between p-3 rounded-xl transition-all group",
                    value === s ? "bg-gold/10" : "hover:bg-white/5"
                  )}
                >
                  <span className={cn(
                    "text-[10px] font-black uppercase tracking-widest italic transition-colors",
                    value === s ? "text-gold" : "text-zinc-500 group-hover:text-white"
                  )}>
                    {s}
                  </span>
                  {value === s && <Check size={14} className="text-gold" />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
