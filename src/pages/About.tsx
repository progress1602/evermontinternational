import React from 'react';
import { motion } from 'motion/react';
import { 
  Users, Target, Rocket, Globe, 
  Zap, Star, Landmark, ChevronRight
} from 'lucide-react';
import PublicNavbar from '@/src/components/PublicNavbar';
import PublicFooter from '@/src/components/PublicFooter';

const team = [
  { name: 'Alexander Sterling', role: 'CEO & Founder', image: '/api/placeholder/400/400' },
  { name: 'Sarah Chen', role: 'Chief of Operations', image: '/api/placeholder/400/400' },
  { name: 'Marcus V.', role: 'Head of Support', image: '/api/placeholder/400/400' }
];

export default function About() {
  return (
    <div className="min-h-screen bg-black font-sans">
      <PublicNavbar />
      
      {/* Hero Section */}
      <section className="bg-black pt-48 pb-32 px-6 overflow-hidden relative">
        <div className="absolute inset-0 bg-black" />
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-5xl md:text-8xl font-display font-black text-white leading-tight mb-8 italic"
          >
            Redefining <br />
            <span className="text-gold">Banking Simplicity</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-zinc-500 text-lg md:text-xl max-w-2xl font-medium"
          >
            A legacy built on trust, innovation, and the pursuit of absolute financial transparency for every global citizen.
          </motion.p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-display font-black text-white mb-8">Our Story</h2>
            <p className="text-zinc-500 text-lg leading-relaxed mb-6 font-medium">
              Evermont International Bank was founded with a single mission: to dismantle the friction of traditional banking and replace it with a clinical, ultra-efficient digital ecosystem.
            </p>
            <p className="text-zinc-500 text-lg leading-relaxed font-medium">
              What started as a boutique private vaulting service in Switzerland has evolved into a global powerhouse, serving over 50,000 customers who demand nothing less than perfection.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-zinc-950 border border-zinc-900 rounded-[3rem] p-12 aspect-square flex items-center justify-center relative overflow-hidden"
          >
             <Landmark className="text-gold/5 w-full h-full absolute" />
             <div className="text-center relative z-10">
                <p className="text-8xl font-display font-black text-white">2026</p>
                <p className="text-gold font-black uppercase tracking-[0.4em] mt-4">The New Standard</p>
             </div>
          </motion.div>
        </div>
      </section>

      {/* Why Evermont International */}
      <section className="py-32 bg-zinc-950 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
             <h2 className="text-4xl md:text-5xl font-display font-black text-white">Why Evermont International</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Target, title: 'Our Mission', desc: 'To empower financial sovereignty through advanced biometrics and zero-latency protocols.' },
              { icon: Globe, title: 'Global Presence', desc: 'Operating across 14 international hubs to ensure constant liquidity access.' },
              { icon: Rocket, title: 'Innovation Driven', desc: 'Continuously refining our architecture to stay ahead of the digital curve.' }
            ].map((item, i) => (
              <div key={i} className="bg-black p-12 rounded-[2.5rem] border border-zinc-900 shadow-sm">
                <div className="w-16 h-16 bg-zinc-950 rounded-2xl flex items-center justify-center text-gold mb-8">
                  <item.icon size={32} />
                </div>
                <h3 className="text-2xl font-display font-black text-white mb-4">{item.title}</h3>
                <p className="text-zinc-500 leading-relaxed font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-display font-black text-white">Leadership Team</h2>
            <p className="text-zinc-500 mt-4 font-semibold uppercase tracking-widest text-xs italic">The Minds Behind the Machines</p>
        </div>
        <div className="grid md:grid-cols-3 gap-12">
          {team.map((person, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group"
            >
              <div className="aspect-square bg-zinc-950 border border-zinc-900 rounded-[2.5rem] overflow-hidden mb-8 grayscale hover:grayscale-0 transition-all duration-700">
                <img src={person.image} alt={person.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              </div>
              <h4 className="text-2xl font-display font-black text-white">{person.name}</h4>
              <p className="text-gold font-bold uppercase tracking-widest text-xs mt-2">{person.role}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
