import React from 'react';
import { motion } from 'motion/react';
import { 
  Zap, Wallet, ArrowUpRight, CreditCard, 
  ShieldCheck, Headphones, History, Lock,
  ArrowRight, Landmark
} from 'lucide-react';
import { Link } from 'react-router-dom';
import PublicNavbar from '@/src/components/PublicNavbar';
import PublicFooter from '@/src/components/PublicFooter';

const features = [
  { icon: Zap, title: 'Instant Transfers', desc: 'Settle transactions globally in milliseconds. No more waiting for business days.' },
  { icon: Wallet, title: 'Wallet Funding', desc: 'Multiple funding options including bank transfers, cards, and digital assets.' },
  { icon: ArrowUpRight, title: 'Seamless Withdrawals', desc: 'Access your liquid assets anywhere in the world at institutional rates.' },
  { icon: CreditCard, title: 'Premium Cards', desc: 'Luxury virtual and physical cards designed for the world’s most elite users.' },
  { icon: ShieldCheck, title: 'Admin Approval Security', desc: 'Secure multi-tier approval for high-value transactions to prevent unauthorized moves.' },
  { icon: Headphones, title: '24/7 Premium Support', desc: 'Direct access to institutional banking experts available at a moment’s notice.' },
  { icon: History, title: 'Transaction History', desc: 'Deep analytics and absolute transparency for every movement in your vault.' },
  { icon: Lock, title: 'Notification Alerts', desc: 'Real-time biometric and digital pings for every security-critical event.' },
];

export default function Features() {
  return (
    <div className="min-h-screen bg-black font-sans text-white">
      <PublicNavbar />
      
      {/* Hero Section */}
      <section className="bg-black pt-40 pb-24 px-6 overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,191,0,0.05),transparent_70%)]" />
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-display font-black text-white mb-8"
          >
            Smart Banking <span className="text-gold italic">Features</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-zinc-500 text-lg md:text-xl max-w-2xl mx-auto"
          >
            Everything you need to bank smarter. A clinical suite of tools for the modern financial sovereign.
          </motion.p>
        </div>
      </section>

      {/* Grid Cards */}
      <section className="py-32 px-6 bg-zinc-950">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="p-10 rounded-[2.5rem] border border-zinc-900 bg-black shadow-sm hover:shadow-gold/5 hover:border-gold/20 transition-all duration-500 group"
              >
                <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center text-gold mb-8 group-hover:bg-gold group-hover:text-black transition-all">
                  <f.icon size={32} />
                </div>
                <h3 className="text-2xl font-display font-black mb-4 text-white">{f.title}</h3>
                <p className="text-zinc-500 leading-relaxed font-medium">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             className="bg-gold rounded-[3rem] p-16 md:p-24 text-center relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-12 opacity-10 scale-150 transform -rotate-12 group-hover:opacity-20 transition-opacity">
              <Landmark size={200} />
            </div>
            <h2 className="text-4xl md:text-6xl font-display font-black text-black mb-10 relative z-10">
              Open Your Evermont International <br /> Account Today
            </h2>
            <Link to="/auth/register" className="relative z-10 inline-flex items-center gap-3 bg-black text-white px-12 py-6 rounded-2xl font-black text-xl hover:scale-105 transition-transform">
              Get Started <ArrowRight size={24} />
            </Link>
          </motion.div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
