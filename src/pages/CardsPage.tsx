import React from 'react';
import { motion } from 'motion/react';
import { 
  CreditCard, Shield, Zap, Lock, 
  ArrowRight, Landmark, ShoppingBag, 
  Globe, Briefcase, Settings
} from 'lucide-react';
import PublicNavbar from '@/src/components/PublicNavbar';
import PublicFooter from '@/src/components/PublicFooter';

const cardTypes = [
  {
    title: 'Virtual Card',
    desc: 'For ultra-secure online shopping and subscriptions.',
    icon: ShoppingBag,
    features: ['Instant generation', 'One-time use options', 'Biometric auth']
  },
  {
    title: 'Physical Card',
    desc: 'Crafted from premium black steel for worldwide ATM & Online use.',
    icon: Globe,
    features: ['Contactless tech', 'Global ATM priority', 'Luxury weight']
  },
  {
    title: 'Business Card',
    desc: 'Total capital control for companies and high-growth startups.',
    icon: Briefcase,
    features: ['Expense tracking', 'Team spending limits', 'API integration']
  }
];

export default function CardsPage() {
  return (
    <div className="min-h-screen bg-black font-sans text-white">
      <PublicNavbar />
      
      {/* Hero Section */}
      <section className="bg-black pt-32 md:pt-48 pb-20 md:pb-32 px-6 overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(212,175,55,0.05)_0%,_transparent_70%)]" />
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 lg:gap-24 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-center lg:text-left"
          >
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-black text-white leading-tight mb-8">
              Premium Cards for <br />
              <span className="text-gold">Global Payments</span>
            </h1>
            <p className="text-zinc-500 text-base md:text-xl max-w-xl mx-auto lg:mx-0 mb-10 font-medium">
              Designed for the modern elite. Achieve absolute liquidity with our suite of luxury financial instruments.
            </p>
            <div className="flex justify-center lg:justify-start gap-6">
              <button className="bg-gold text-black px-10 py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-xl shadow-gold/20">
                Request Access
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: -5 }}
            transition={{ duration: 1 }}
            className="flex justify-center"
          >
             {/* The Card Mockup - Made Responsive */}
             <div className="w-full max-w-[450px] aspect-[1.6/1] bg-gradient-to-br from-[#1a1a1a] to-black rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-10 shadow-[0_50px_100px_rgba(0,0,0,0.8)] border border-white/5 relative overflow-hidden group">
                {/* Logo Moved Up */}
                <div className="absolute top-6 right-6 md:top-10 md:right-10 flex flex-col items-end gap-1 opacity-40">
                   <Landmark className="text-gold w-6 h-6 md:w-10 md:h-10" />
                   <span className="text-[6px] md:text-[8px] font-black tracking-widest text-white leading-none">EVERMONT</span>
                </div>

                <div className="h-full flex flex-col justify-between">
                   <div className="w-12 h-9 md:w-16 md:h-12 bg-gradient-to-br from-gold/40 to-gold/10 rounded-lg border border-gold/30" />
                   <div className="space-y-4 md:space-y-6">
                      <p className="text-white font-mono text-lg md:text-2xl tracking-[0.2em]">4242 8842 0000 1204</p>
                      <div className="flex justify-between items-end">
                         <div>
                            <p className="text-zinc-600 text-[8px] md:text-[10px] font-bold tracking-widest uppercase mb-1">CARD HOLDER</p>
                            <p className="text-white text-xs md:text-base font-bold uppercase truncate max-w-[120px] md:max-w-none">EVERMONT ELITE</p>
                         </div>
                         <div className="text-right">
                            <p className="text-zinc-600 text-[8px] md:text-[10px] font-bold tracking-widest uppercase mb-1">EXPIRY</p>
                            <p className="text-white text-xs md:text-base font-bold">12/30</p>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </motion.div>
        </div>
      </section>

      {/* Card Types */}
      <section className="py-20 md:py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {cardTypes.map((card, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-zinc-900/40 border border-white/5 p-8 md:p-12 rounded-[2rem] md:rounded-[2.5rem] flex flex-col items-center text-center group hover:bg-gold/5 transition-all duration-500"
              >
                <div className="w-16 h-16 md:w-20 md:h-20 bg-zinc-900 border border-white/10 rounded-2xl md:rounded-3xl flex items-center justify-center text-gold mb-8 md:mb-10 shadow-xl group-hover:bg-gold group-hover:text-black transition-all duration-500">
                  <card.icon size={32} className="md:w-9 md:h-9" />
                </div>
                <h3 className="text-2xl md:text-3xl font-display font-black mb-4 text-white group-hover:text-gold transition-colors">{card.title}</h3>
                <p className="text-zinc-500 mb-8 font-medium text-sm md:text-base">{card.desc}</p>
                <ul className="space-y-4 text-left w-full">
                  {card.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-xs md:text-sm font-black uppercase tracking-widest text-zinc-400 group-hover:text-gold/60 transition-colors">
                      <div className="w-1.5 h-1.5 bg-gold rounded-full" /> {feat}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 md:py-32 bg-black text-white px-6 relative overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-display font-black mb-16 md:mb-24">Card Intelligence</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              { icon: Lock, title: 'Freeze Instantly', desc: 'One-tap card lock for absolute peace of mind.' },
              { icon: Shield, title: 'Secure Payments', desc: 'Military-grade encryption for every tap and click.' },
              { icon: Settings, title: 'Spending Limits', desc: 'Set granular controls over your daily cash movement.' },
              { icon: Zap, title: 'Card Controls', desc: 'Enable or disable specific transaction types instantly.' }
            ].map((f, i) => (
              <div key={i} className="p-8 border border-white/5 bg-zinc-900/20 rounded-3xl hover:border-gold/30 hover:bg-gold/[0.02] transition-all group">
                <f.icon className="text-gold mx-auto mb-6 group-hover:scale-110 transition-transform" size={28} />
                <h4 className="text-lg md:text-xl font-display font-black mb-4 uppercase tracking-widest group-hover:text-gold transition-colors">{f.title}</h4>
                <p className="text-zinc-500 text-sm leading-relaxed font-medium">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
