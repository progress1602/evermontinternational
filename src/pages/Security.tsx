import React from 'react';
import { motion } from 'motion/react';
import { 
  Shield, Lock, Fingerprint, Eye, 
  Smartphone, Bell, ShieldCheck, Landmark
} from 'lucide-react';
import PublicNavbar from '@/src/components/PublicNavbar';
import PublicFooter from '@/src/components/PublicFooter';

const securityFeatures = [
  { icon: Lock, title: 'Encrypted Transactions', desc: 'Every byte of financial data is wrapped in AES-256 military-grade encryption.' },
  { icon: Shield, title: 'Two-Factor Authentication', desc: 'Multi-tiered identity verification required for every high-value movement.' },
  { icon: Eye, title: 'Fraud Detection', desc: 'AI-driven neural networks monitoring your vault for anomalies 24/7.' },
  { icon: Landmark, title: 'Account Monitoring', desc: 'Continuous institutional-grade oversight of all network nodes.' },
  { icon: ShieldCheck, title: 'Safe Withdrawals', desc: 'Secure corridor protocols ensure funds arrive exactly where they should.' },
  { icon: Bell, title: 'Login Alerts', desc: 'Instant biometric pings for every unauthorized or new location access attempt.' }
];

export default function Security() {
  return (
    <div className="min-h-screen bg-black font-sans">
      <PublicNavbar />
      
      {/* Hero Section */}
      <section className="bg-black pt-48 pb-32 px-6 overflow-hidden relative">
        <div className="absolute inset-0 overflow-hidden">
           <motion.div 
             animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
             transition={{ duration: 10, repeat: Infinity }}
             className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border-[50px] border-gold/10 rounded-full"
           />
        </div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-24 h-24 bg-gold/10 rounded-3xl flex items-center justify-center text-gold mx-auto mb-12 shadow-[0_0_50px_rgba(212,175,55,0.2)]"
          >
            <Shield size={48} strokeWidth={2.5} />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-8xl font-display font-black text-white mb-8 italic"
          >
            Bank-Level <span className="text-gold">Protection</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-zinc-500 text-lg md:text-xl max-w-2xl mx-auto font-medium"
          >
            Trust is our primary currency. Our security architecture is designed to be mathematically absolute.
          </motion.p>
        </div>
      </section>

      {/* Sections */}
      <section className="py-32 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {securityFeatures.map((f, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="p-12 bg-zinc-950 rounded-[2.5rem] border border-zinc-900 group hover:bg-zinc-900 hover:shadow-2xl transition-all duration-500"
              >
                <div className="w-16 h-16 bg-black border border-zinc-900 rounded-2xl flex items-center justify-center text-gold mb-8 group-hover:scale-110 transition-transform">
                  <f.icon size={32} />
                </div>
                <h3 className="text-2xl font-display font-black text-white mb-4">{f.title}</h3>
                <p className="text-zinc-500 leading-relaxed font-medium">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Stats */}
      <section className="py-24 bg-gold px-6">
        <div className="max-w-7xl mx-auto text-center">
           <motion.div
             initial={{ opacity: 0, scale: 0.95 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             className="space-y-6"
           >
              <h2 className="text-6xl md:text-9xl font-display font-black text-black">99.9%</h2>
              <p className="text-black/60 font-black uppercase tracking-[0.4em] text-sm md:text-xl italic">Safe Transactions Globally</p>
           </motion.div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
