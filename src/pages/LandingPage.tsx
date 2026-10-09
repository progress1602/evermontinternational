import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, Smartphone, Globe, ArrowRight, Menu, X, Landmark, 
  Lock, Activity, ShieldCheck, Zap, TrendingUp, CreditCard, 
  CheckCircle2, Star, Users, ArrowUpRight, BarChart3, Fingerprint, 
  Wallet, Headphones, UserPlus, Mail, ArrowDownLeft, MessageSquare
} from 'lucide-react';

import PublicNavbar from '@/src/components/PublicNavbar';
import PublicFooter from '@/src/components/PublicFooter';

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    
    // Pre-warm the backend node immediately when LandingPage mounts to wake up Render container early
    fetch('https://manual-bank.onrender.com/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: '{ __schema { queryType { name } } }' })
    }).catch(() => {});

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-gold selection:text-black font-sans overflow-x-hidden">
      <PublicNavbar />

      {/* 1. HERO SECTION */}
      <section className="relative pt-36 pb-24 md:py-48 px-6 overflow-hidden bg-black">
        {/* Background image ONLY on desktop/tablet (md & lg screens) */}
        <div className="absolute inset-0 hidden md:block select-none pointer-events-none z-0">
          <img 
            src="https://res.cloudinary.com/progresshenry/image/upload/v1780873556/WhatsApp_Image_2026-06-07_at_10.08.55_PM_zvsozj.jpg" 
            alt="Evermont International Background Representative" 
            className="w-full h-full object-cover object-[center_35%]"
            referrerPolicy="no-referrer"
          />
          {/* Ambient fade layer: Extra dark on the left under text, ultra-clear on the right over Charlotte's face */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/75 to-transparent" />
        </div>

        {/* Fine background glow overlays */}
        <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-gold/5 rounded-full blur-[150px] pointer-events-none z-0" />
        <div className="absolute -bottom-10 left-[-10%] w-[400px] h-[400px] bg-gold/5 rounded-full blur-[120px] pointer-events-none z-0" />
        
        <div className="max-w-7xl mx-auto relative z-10 font-sans">
          <div className="grid lg:grid-cols-12 gap-16 lg:gap-12 items-center">
            {/* Left Content (Text and Action Call To Action) */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-7 xl:col-span-6 space-y-8"
            >
              <h1 className="text-4xl sm:text-5xl md:text-7xl xl:text-[5.2rem] font-display font-black leading-[1.08] tracking-tight text-white">
                Banking <br />
                <span className="text-gold">Excellence.</span> <br />
                Trusted Always.
              </h1>
              <p className="text-zinc-200 text-base md:text-lg lg:text-xl max-w-xl leading-relaxed font-semibold">
                We deliver secure, innovative and personalized banking solutions to help you achieve your goals and build a better future.
              </p>
              
              <div className="flex flex-wrap gap-5 pt-4">
                <Link to="/auth/register" className="bg-gold hover:bg-white text-black px-10 py-5 rounded-xl font-black uppercase tracking-[0.2em] text-[11px] transition-all flex items-center gap-3 shadow-xl shadow-gold/20 hover:scale-105 duration-300">
                  <span>DISCOVER MORE</span>
                  <ArrowRight size={14} className="stroke-[3]" />
                </Link>
              </div>

              {/* MOBILE ONLY STANDALONE GRID IMAGE (shown below writeup, only on < md views where the background image is hidden) */}
              <div className="block md:hidden mt-12">
                <div className="relative w-full max-w-[340px] mx-auto aspect-[4/5] rounded-[3rem] p-1 bg-gradient-to-b from-gold/30 via-white/10 to-transparent">
                  <div className="relative w-full h-full rounded-[2.8rem] overflow-hidden bg-zinc-950 shadow-[0_30px_80px_rgba(0,0,0,0.9)]">
                    <img 
                      src="https://res.cloudinary.com/progresshenry/image/upload/v1782325048/mobile_view_tpg0gw.jpg" 
                      alt="Charlotte Hayes - Evermont International Rep" 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-[center_35%]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>

                  {/* Branch Manager Badge (Clean, floating overlay) */}
                  <div className="absolute -top-6 -left-4 z-20 pointer-events-auto w-[180px]">
                    <div className="bg-black/95 backdrop-blur-md border border-white/10 rounded-2xl p-3 shadow-[0_20px_40px_rgba(0,0,0,0.85)] flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full border border-gold/40 flex items-center justify-center text-gold bg-gold/10 shrink-0 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                         <Users size={16} className="stroke-[2.5]" />
                      </div>
                      <div className="space-y-0.5">
                        <h5 className="text-[10px] font-black text-white uppercase tracking-wider leading-none">Charlotte Hayes</h5>
                        <p className="text-[7.5px] text-zinc-400 font-bold uppercase tracking-widest mt-1">Branch Manager</p>
                      </div>
                    </div>
                  </div>

                  {/* Float Quote / Testimonial Box with Comment Icon */}
                  <div className="absolute -bottom-6 -right-4 z-20 w-[200px] pointer-events-auto">
                    <div className="bg-black/95 backdrop-blur-md border border-white/10 rounded-2xl p-3.5 shadow-[0_20px_40px_rgba(0,0,0,0.85)] flex items-start gap-2.5">
                      <div className="w-8 h-8 rounded-full border border-gold/40 flex items-center justify-center text-gold bg-gold/10 shrink-0 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                         <MessageSquare size={14} className="stroke-[2.5]" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-zinc-200 text-[8px] font-semibold uppercase tracking-wider leading-relaxed">
                          "Our commitment is to your prosperity and security."
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* DESKTOP/TABLET Right Overlaid Elements floating precisely around Charlotte Hayes (Only shown on md & larger) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="hidden md:flex lg:col-span-5 xl:col-span-6 relative min-h-[380px] lg:min-h-[440px] flex-col justify-center items-center pointer-events-none"
            >
              {/* Branch Manager Badge (Clean, aligned right side of Charlotte) */}
              <div className="absolute top-[10%] right-4 sm:right-10 lg:right-6 xl:right-12 z-20 pointer-events-auto">
                <div className="bg-black/90 backdrop-blur-md border border-white/10 rounded-2xl p-4 sm:p-5 shadow-[0_30px_60px_rgba(0,0,0,0.85)] hover:scale-105 transition-transform duration-300 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full border-2 border-gold flex items-center justify-center text-gold bg-gold/10 shrink-0 shadow-[0_0_15px_rgba(212,175,55,0.35)]">
                     <Users size={22} className="stroke-[2.5]" />
                  </div>
                  <div className="space-y-0.5">
                    <h5 className="text-[13px] font-black text-white uppercase tracking-wider leading-none">Charlotte Hayes</h5>
                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-1">Branch Manager</p>
                  </div>
                </div>
              </div>

              {/* Float Quote / Testimonial Box with Comment Icon (Lower aligned right side of Charlotte) */}
              <div className="absolute bottom-[10%] right-4 sm:right-10 lg:right-6 xl:right-12 z-20 max-w-[320px] pointer-events-auto">
                <div className="bg-black/90 backdrop-blur-md border border-white/10 rounded-3xl p-5 sm:p-6 shadow-[0_30px_60px_rgba(0,0,0,0.85)] hover:scale-105 transition-transform duration-300 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full border-2 border-gold flex items-center justify-center text-gold bg-gold/10 shrink-0 shadow-[0_0_15px_rgba(212,175,55,0.35)]">
                     <MessageSquare size={22} className="stroke-[2.5]" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-zinc-200 text-xs sm:text-[13px] font-semibold uppercase tracking-wider leading-relaxed">
                      "Our commitment is to your prosperity and security."
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. CORE SERVICES BANNER */}
      <section className="bg-zinc-950 border-y border-white/5 relative z-20 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x lg:divide-white/10">
            {/* Secure Banking */}
            <div className="px-2 lg:px-8 flex items-start gap-5">
              <div className="w-16 h-16 rounded-full border-2 border-gold flex items-center justify-center text-gold shrink-0 bg-gold/10 shadow-[0_0_20px_rgba(212,175,55,0.25)]">
                 <Shield size={26} className="stroke-[2.5]" />
              </div>
              <div className="space-y-1">
                 <h4 className="text-[13px] sm:text-sm font-black uppercase tracking-wider text-white">Secure Banking</h4>
                 <p className="text-[11px] text-zinc-400 font-bold uppercase leading-relaxed">Advanced security to protect your money and personal data.</p>
              </div>
            </div>

            {/* Personalized Service */}
            <div className="px-2 lg:px-8 flex items-start gap-5">
              <div className="w-16 h-16 rounded-full border-2 border-gold flex items-center justify-center text-gold shrink-0 bg-gold/10 shadow-[0_0_20px_rgba(212,175,55,0.25)]">
                 <Users size={26} className="stroke-[2.5]" />
              </div>
              <div className="space-y-1">
                 <h4 className="text-[13px] sm:text-sm font-black uppercase tracking-wider text-white">Personalized Service</h4>
                 <p className="text-[11px] text-zinc-400 font-bold uppercase leading-relaxed font-sans">Solutions tailored to your unique financial needs.</p>
              </div>
            </div>

            {/* Grow Your Wealth */}
            <div className="px-2 lg:px-8 flex items-start gap-5">
              <div className="w-16 h-16 rounded-full border-2 border-gold flex items-center justify-center text-gold shrink-0 bg-gold/10 shadow-[0_0_20px_rgba(212,175,55,0.25)]">
                 <TrendingUp size={26} className="stroke-[2.5]" />
              </div>
              <div className="space-y-1">
                 <h4 className="text-[13px] sm:text-sm font-black uppercase tracking-wider text-white">Grow Your Wealth</h4>
                 <p className="text-[11px] text-zinc-400 font-bold uppercase leading-relaxed">Smart investment options to help you build and grow your wealth.</p>
              </div>
            </div>

            {/* 24/7 Support */}
            <div className="px-2 lg:px-8 flex items-start gap-5">
              <div className="w-16 h-16 rounded-full border-2 border-gold flex items-center justify-center text-gold shrink-0 bg-gold/10 shadow-[0_0_20px_rgba(212,175,55,0.25)] font-sans">
                 <Headphones size={26} className="stroke-[2.5]" />
              </div>
              <div className="space-y-1 font-sans">
                 <h4 className="text-[13px] sm:text-sm font-black uppercase tracking-wider text-white">24/7 Support</h4>
                 <p className="text-[11px] text-zinc-400 font-bold uppercase leading-relaxed font-sans">We're here for you anytime, anywhere you need us.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE SECTION */}
      <section className="py-24 md:py-32 px-6 bg-black overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(212,175,55,0.05)_0%,_transparent_70%)]" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 md:mb-20 relative">
            <h2 className="text-3xl md:text-5xl font-display font-black leading-tight text-white flex flex-col items-center gap-4 text-center">
              Our Core Banking Features
              <div className="w-16 h-1 bg-gold rounded-full shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              { icon: Zap, title: 'Instant Transfers', desc: 'Accelerated settlement across global nodes with zero latency.' },
              { icon: Wallet, title: 'Sovereign Wallet', desc: 'Secure management of diverse asset classes within a unified ledger.' },
              { icon: CreditCard, title: 'Premium Metal Cards', desc: 'Elite steel cards designed for high-limit international usage.' },
              { icon: ShieldCheck, title: 'Encrypted Security', desc: 'Multi-layer biometric and protocol-level asset protection.' },
              { icon: TrendingUp, title: 'Yield Growth', desc: 'Competitive interest models for sustained capital appreciation.' },
              { icon: Headphones, title: 'Concierge Support', desc: 'High-priority 24/7 access to dedicated banking specialists.' }
            ].map((f, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-zinc-900/40 p-8 md:p-10 border border-white/5 rounded-3xl hover:border-gold/30 hover:shadow-2xl hover:shadow-gold/5 transition-all duration-500 group text-center flex flex-col items-center"
              >
                <div className="w-14 h-14 md:w-16 md:h-16 bg-gold/5 rounded-2xl flex items-center justify-center text-gold mb-6 group-hover:scale-110 group-hover:bg-gold group-hover:text-black transition-all duration-500 shadow-lg">
                  <f.icon size={28} className="md:w-8 md:h-8" />
                </div>
                <h4 className="text-xl font-display font-black mb-4 text-white group-hover:text-gold transition-colors">{f.title}</h4>
                <p className="text-zinc-500 leading-relaxed text-sm font-medium">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4.5. ADVANCED ECOSYSTEM SECTION */}
      <section className="py-24 md:py-32 px-6 bg-[#050505] relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/10 to-transparent" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 md:gap-24 items-center">
            <motion.div {...fadeIn}>
              <h2 className="text-4xl md:text-6xl font-display font-black text-white leading-tight mb-8">
                Comprehensive <br /> <span className="text-gold italic">Global Solutions</span>
              </h2>
              <p className="text-zinc-400 text-lg mb-12 max-w-lg leading-relaxed">
                Beyond traditional banking, we offer an integrated ecosystem designed for the modern international citizen.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                 {[
                   { icon: Landmark, title: 'Smart Loans', desc: 'Flexible liquidity solutions with prioritized approval cycles.' },
                   { icon: Users, title: 'Charity Initatives', desc: 'Direct, transparent impact programs for global social betterment.' },
                   { icon: Shield, title: 'Bill Settlement', desc: 'Automated cross-border payment protocols for all utility networks.' },
                   { icon: Fingerprint, title: 'Elite Verification', desc: 'Sovereign identity validation for high-quota transactional access.' }
                 ].map((item, i) => (
                   <div key={i} className="space-y-4">
                      <div className="w-10 h-10 bg-gold rounded-lg flex items-center justify-center text-black">
                        <item.icon size={20} strokeWidth={2.5} />
                      </div>
                      <h4 className="text-sm font-black text-white uppercase tracking-widest">{item.title}</h4>
                      <p className="text-zinc-500 text-xs font-medium leading-relaxed">{item.desc}</p>
                   </div>
                 ))}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative p-1 bg-gradient-to-br from-gold/30 via-zinc-900 to-transparent rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.5)]"
            >
              <div className="bg-zinc-950 rounded-[2.9rem] p-8 md:p-12">
                 <div className="space-y-8">
                    <div className="flex items-center justify-between pb-8 border-b border-white/5">
                       <span className="text-xs font-black text-zinc-500 uppercase tracking-[0.3em]">Protocol Monitor</span>
                       <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    </div>
                    
                    <div className="space-y-6">
                       {[
                         { label: 'Loan Approval Odds', val: '98.4%', track: 'w-[98%]' },
                         { label: 'Network Verification Speed', val: '< 2.4s', track: 'w-[92%]' },
                         { label: 'Global Charity Reach', val: '142 Nodes', track: 'w-[85%]' },
                         { label: 'Bill Auto-Settlement', val: 'Synchronized', track: 'w-[100%]' }
                       ].map((stat, i) => (
                         <div key={i} className="space-y-3">
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-zinc-400">
                               <span>{stat.label}</span>
                               <span className="text-gold">{stat.val}</span>
                            </div>
                            <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
                               <div className={`h-full bg-gold rounded-full ${stat.track} opacity-50`} />
                            </div>
                         </div>
                       ))}
                    </div>

                    <div className="pt-8 flex justify-center">
                       <div className="flex items-center gap-2 px-6 py-3 bg-gold/5 border border-gold/20 rounded-xl">
                          <Activity size={14} className="text-gold" />
                          <span className="text-[9px] font-black text-gold uppercase tracking-[0.2em]">Live Sovereign Ledger Active</span>
                       </div>
                    </div>
                 </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. CARD SHOWCASE SECTION */}
      <section className="py-40 px-6 bg-black relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-10"
          >
             <div className="space-y-6">
                <h2 className="text-4xl md:text-6xl font-display font-black leading-tight text-white">
                  Premium Banking <br /> Cards <span className="text-gold">for You</span>
                </h2>
                <p className="text-zinc-500 text-lg leading-relaxed max-w-md font-medium">
                  Get a virtual card that works everywhere. Shop online, subscribe, and pay bills securely with Evermont International Bank cards.
                </p>
             </div>

             <div className="space-y-4 pt-4">
                {[
                  'Virtual Cards', 'Secure Online Payments', 
                  'International Ready', 'Freeze or Unfreeze Anytime'
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-5 h-5 bg-gold rounded-full flex items-center justify-center">
                       <CheckCircle2 size={14} className="text-black" strokeWidth={3} />
                    </div>
                    <span className="font-bold text-zinc-300 text-sm">{item}</span>
                  </div>
                ))}
             </div>

             <button className="bg-gold text-black px-12 py-4 rounded-lg font-black uppercase tracking-widest text-[11px] hover:scale-105 transition-all shadow-xl shadow-gold/20">
                Get Your Card
             </button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative flex justify-center items-center py-20"
          >
            {/* Realism Base */}
            <div className="absolute bottom-[20%] w-[400px] h-10 bg-gold/5 rounded-full blur-[60px]" />
            
            {/* The Arsenal Card */}
            <div className="relative z-10 w-full max-w-lg aspect-[1.58/1] bg-gradient-to-br from-[#1a1a1a] to-black rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-10 border border-white/5 shadow-[0_50px_100px_rgba(0,0,0,1)] group overflow-hidden">
               {/* Realistic Pattern Overlay */}
               <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />
               
               <div className="relative z-20 h-full flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3 transform -translate-y-2 md:-translate-y-4">
                       <div className="bg-gold p-1 md:p-1.5 rounded-lg shadow-lg">
                          <Landmark className="w-4 h-4 md:w-6 md:h-6 text-black" strokeWidth={2.5} />
                       </div>
                       <div className="flex flex-col">
                         <span className="text-[8px] md:text-[10px] font-black tracking-widest text-white leading-none">EVERMONT</span>
                         <span className="text-[6px] md:text-[7px] font-bold tracking-widest text-white leading-none">INTERNATIONAL</span>
                       </div>
                    </div>
                  </div>

                  <div>
                     {/* Gold Chip - Moved up slightly for better hierarchy */}
                     <div className="w-10 h-8 md:w-14 md:h-11 bg-gradient-to-br from-gold/40 to-gold/10 rounded-lg border border-gold/30 mb-4 md:mb-8 relative overflow-hidden">
                        <div className="absolute inset-0 grid grid-cols-3 grid-rows-2 opacity-30">
                           <div className="border-r border-b border-gold/50" />
                           <div className="border-r border-b border-gold/50" />
                           <div className="border-b border-gold/50" />
                           <div className="border-r border-gold/50" />
                           <div className="border-r border-gold/50" />
                        </div>
                     </div>
                     
                     <p className="text-white font-mono text-lg sm:text-2xl md:text-3xl tracking-[0.25em] mb-6 md:mb-8">4832 1234 5678 9021</p>
                     
                     <div className="flex justify-between items-end">
                        <div className="flex gap-4 md:gap-10">
                           <div>
                              <p className="text-zinc-600 text-[6px] md:text-[8px] font-black uppercase tracking-widest mb-1 md:mb-1.5">VALID THRU</p>
                              <p className="text-white text-[10px] md:text-sm font-bold tracking-widest">12/28</p>
                           </div>
                           <div>
                              <p className="text-zinc-600 text-[6px] md:text-[8px] font-black uppercase tracking-widest mb-1 md:mb-1.5">CARD HOLDER</p>
                              <p className="text-white text-[10px] md:text-sm font-bold tracking-widest uppercase truncate max-w-[80px] md:max-w-none">DAVID JOHNSON</p>
                           </div>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-display font-black text-xl md:text-3xl italic tracking-tighter leading-none">VISA</p>
                          <p className="text-gold text-[6px] md:text-[8px] font-black uppercase tracking-widest mt-1">DEBIT</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 6. HOW IT WORKS SECTION */}
      <section className="py-32 bg-black overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold/[0.02] to-transparent" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-3xl md:text-5xl font-display font-black text-white">How It Works</h2>
            <div className="w-16 h-1 bg-gold rounded-full mx-auto mt-4" />
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12">
            <div className="hidden md:block absolute top-10 left-[20%] right-[20%] h-px border-t-2 border-dashed border-white/10" />
            
            {[
              { icon: UserPlus, title: 'Open Account', desc: 'Create your free account in just a few minutes.', step: '1' },
              { icon: Wallet, title: 'Fund Wallet', desc: 'Add money to your wallet securely and instantly.', step: '2' },
              { icon: ArrowUpRight, title: 'Send & Withdraw', desc: 'Transfer, pay bills, or withdraw with complete ease.', step: '3' }
            ].map((step, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative z-10 flex flex-col items-center text-center group"
              >
                <div className="relative mb-8">
                   <div className="w-8 h-8 bg-gold text-black text-xs font-black rounded-full flex items-center justify-center absolute -top-2 -left-2 z-20 shadow-xl border border-black">
                     {step.step}
                   </div>
                   <div className="w-20 h-20 bg-zinc-900 border border-white/10 shadow-[0_0_30px_rgba(212,175,55,0.1)] rounded-2xl flex items-center justify-center text-white group-hover:bg-gold group-hover:text-black transition-all duration-500">
                     <step.icon size={32} />
                   </div>
                </div>
                <h4 className="text-xl font-display font-black text-white mb-3 group-hover:text-gold transition-colors">{step.title}</h4>
                <p className="text-zinc-500 text-[10px] max-w-[200px] leading-relaxed font-black uppercase tracking-[0.2em]">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. MOBILE APP SECTION */}
      <section className="py-40 px-6 bg-black overflow-hidden relative">
        <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-gold/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative flex justify-center lg:justify-start"
          >
             {/* Realistic Phone Mockups from the design */}
             <div className="relative w-full max-w-sm h-[480px] sm:h-[520px]">
                {/* Back phone - Dashboard view */}
                <div className="absolute top-0 left-0 w-[80%] h-full bg-black border-[7px] border-zinc-900 rounded-[2.8rem] shadow-2xl z-10 overflow-hidden transform -rotate-6">
                   <div className="relative p-5 pt-10 h-full bg-[#050505]">
                      <div className="flex justify-between items-center mb-6">
                         <div className="w-7 h-7 rounded-full bg-zinc-800" />
                         <Activity size={12} className="text-zinc-500" />
                      </div>
                      <div className="bg-zinc-900/50 p-5 rounded-2xl border border-white/5 mb-6">
                         <p className="text-[7px] text-zinc-500 uppercase font-black mb-1">Total Balance</p>
                         <p className="text-lg font-black text-white leading-none">$2,580,000.00</p>
                      </div>
                      <div className="grid grid-cols-4 gap-2 mb-6">
                        {[1,2,3,4].map(j => (
                          <div key={j} className="h-8 bg-zinc-900 rounded-lg" />
                        ))}
                      </div>
                      <div className="space-y-3">
                        {[1,2,3].map(j => (
                          <div key={j} className="h-10 bg-zinc-900/50 rounded-xl" />
                        ))}
                      </div>
                   </div>
                </div>

                {/* Front phone - Statistics view with Donut Chart */}
                <div className="absolute top-[12%] right-[-10%] w-[80%] h-full bg-black border-[7px] border-[#1a1a1a] rounded-[2.8rem] shadow-[0_40px_80px_rgba(0,0,0,0.8)] z-20 overflow-hidden transform rotate-6 scale-105 group">
                   {/* Gloss Effect */}
                   <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/5 to-transparent skew-y-[-20deg] pointer-events-none z-40" />
                   
                   <div className="relative p-5 pt-10 h-full bg-black">
                      {/* Notch */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-5 bg-black rounded-b-xl z-50" />
                      
                      <div className="text-center mb-8">
                         <p className="text-[12px] font-black text-white italic tracking-tighter">Statistics</p>
                      </div>

                      <div className="mb-8">
                         <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-4">Spending Overview</p>
                         <div className="relative w-32 h-32 mx-auto">
                            <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                               <circle cx="18" cy="18" r="16" fill="none" stroke="#111" strokeWidth="4" />
                               <circle cx="18" cy="18" r="16" fill="none" stroke="#D4AF37" strokeWidth="4" strokeDasharray="65, 100" strokeLinecap="round" />
                               <circle cx="18" cy="18" r="16" fill="none" stroke="#222" strokeWidth="4" strokeDasharray="15, 100" strokeDashoffset="-65" strokeLinecap="round" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                               <p className="text-[7px] text-zinc-500 uppercase font-black leading-none">TOTAL</p>
                               <p className="text-[10px] font-black text-white">$1,450,000</p>
                            </div>
                         </div>
                      </div>

                      <div className="space-y-3">
                         <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-2 px-1">Category</p>
                         {[
                            { name: 'Transfers', amt: '$600,000', color: 'bg-gold' },
                            { name: 'Shopping', amt: '$350,000', color: 'bg-zinc-700' },
                            { name: 'Bills', amt: '$300,000', color: 'bg-zinc-800' },
                            { name: 'Others', amt: '$200,000', color: 'bg-zinc-900' }
                         ].map(cat => (
                            <div key={cat.name} className="flex justify-between items-center px-4 py-3 bg-zinc-900/50 rounded-xl border border-white/5">
                               <div className="flex items-center gap-3">
                                  <div className={`w-2 h-2 rounded-full ${cat.color}`} />
                                  <span className="text-[9px] text-white font-black">{cat.name}</span>
                               </div>
                               <span className="text-[9px] text-zinc-500 font-bold">{cat.amt}</span>
                            </div>
                         ))}
                      </div>
                   </div>
                </div>
             </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-10"
          >
             <div className="space-y-6">
                <h2 className="text-3xl md:text-5xl font-display font-black text-white">Bank Anywhere, Anytime</h2>
                <p className="text-zinc-500 text-lg leading-relaxed font-medium">
                  Our mobile app gives you full control of your finances on the go. Fast, secure and reliable.
                </p>
             </div>

             <div className="space-y-4">
                {[
                  'Track your spending', 'Receive instant alerts', 
                  'Transfer funds quickly', 'Secure login & protection'
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 group">
                    <div className="w-5 h-5 bg-gold rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                       <CheckCircle2 size={12} className="text-black" strokeWidth={3} />
                    </div>
                    <span className="font-black text-white text-xs uppercase tracking-widest">{item}</span>
                  </div>
                ))}
             </div>

             <div className="flex gap-4 pt-4">
                <button className="bg-black text-white px-6 py-2.5 rounded-lg flex items-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-xl">
                   <div className="flex flex-col items-start leading-none">
                      <span className="text-[7px] uppercase font-bold text-zinc-500">Download on the</span>
                      <span className="text-xs font-black">App Store</span>
                   </div>
                </button>
                <button className="bg-black text-white px-6 py-2.5 rounded-lg flex items-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-xl">
                   <div className="flex flex-col items-start leading-none">
                      <span className="text-[7px] uppercase font-bold text-zinc-500">GET IT ON</span>
                      <span className="text-xs font-black">Google Play</span>
                   </div>
                </button>
             </div>
          </motion.div>
        </div>
      </section>

      {/* 8. TESTIMONIAL SECTION */}
      <section className="py-40 bg-black overflow-hidden px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-display font-black text-white">What Our Customers Say</h2>
            <div className="w-16 h-1 bg-gold rounded-full mx-auto mt-4" />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { quote: "Evermont International Bank has completely changed the way I bank. Fast, secure and reliable!", author: "Michael D.", delay: 0 },
              { quote: "The best digital bank I've used so far. Everything is just so smooth.", author: "Sarah J.", delay: 0.1 },
              { quote: "Customer support is amazing and withdrawals are always instant.", author: "James T.", delay: 0.2 },
            ].map((t, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: t.delay }}
                className="bg-[#0a0a0a] p-10 rounded-2xl border border-white/5 relative group hover:border-gold/20 transition-all duration-500"
              >
                <div className="text-gold/30 mb-8 transform -translate-x-2">
                   <svg width="48" height="48" viewBox="0 0 32 32" fill="currentColor">
                      <path d="M10 8c-3.314 0-6 2.686-6 6s2.686 6 6 6c.341 0 .67-.028.988-.083C10.518 22.316 8.441 24 6 24v2c4.418 0 8-3.582 8-8V10a2 2 0 0 0-2-2h-2zm14 0c-3.314 0-6 2.686-6 6s2.686 6 6 6c.341 0 .67-.028.988-.083C24.518 22.316 22.441 24 20 24v2c4.418 0 8-3.582 8-8V10a2 2 0 0 0-2-2h-2z" />
                   </svg>
                </div>
                <p className="text-zinc-400 text-[13px] font-medium leading-relaxed mb-10 italic">
                  "{t.quote}"
                </p>
                <div className="pt-6 border-t border-white/5">
                   <p className="font-black text-white text-xs uppercase tracking-widest mb-3">-- {t.author}</p>
                   <div className="flex gap-1 text-gold">
                      {[1,2,3,4,5].map(s => <Star key={s} size={10} fill="currentColor" />)}
                   </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 8.5. CTA SECTION */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gold rounded-[2rem] md:rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden group shadow-2xl shadow-gold/10"
          >
             <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 transform -rotate-12 group-hover:opacity-10 transition-opacity">
                <Landmark size={300} className="text-black" />
             </div>
             
             <div className="relative z-10 space-y-8 md:space-y-10">
                <h2 className="text-3xl md:text-6xl font-display font-black text-black leading-tight">
                  Ready to Join <br className="hidden md:block" /> Evermont International Bank?
                </h2>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/auth/register" className="bg-black text-white px-10 py-5 rounded-xl font-black text-lg md:text-xl hover:scale-105 transition-transform shadow-2xl">
                    Open Free Account
                  </Link>
                  <button className="bg-black/10 backdrop-blur-md border border-black/10 text-black px-10 py-5 rounded-xl font-black text-lg md:text-xl hover:bg-black hover:text-white transition-all">
                    Contact Support
                  </button>
                </div>
             </div>
          </motion.div>
        </div>
      </section>

      {/* 9. FINAL SECURITY ROW */}
      <section className="py-20 px-6 bg-[#050505] border-y border-white/5">
        <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
           {[
             { icon: Shield, title: 'Bank-Level Security', desc: 'Your data and money are protected with top encryption.' },
             { icon: Lock, title: 'Encrypted Transactions', desc: 'All transactions are 100% encrypted and secure.' },
             { icon: Activity, title: 'Fraud Monitoring', desc: 'We monitor every activity to prevent fraud.' },
             { icon: ShieldCheck, title: 'Safe & Reliable', desc: 'Millions trust us for their daily banking.' }
           ].map((item, i) => (
             <div key={i} className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-xl bg-gold/5 border border-gold/10 flex items-center justify-center text-gold shrink-0">
                   <item.icon size={20} />
                </div>
                <div>
                   <h4 className="text-xs font-black text-white uppercase tracking-widest mb-1">{item.title}</h4>
                   <p className="text-[10px] text-zinc-600 font-bold leading-relaxed">{item.desc}</p>
                </div>
             </div>
           ))}
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
