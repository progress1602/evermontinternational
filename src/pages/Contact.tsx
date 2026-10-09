import React from 'react';
import { motion } from 'motion/react';
import { 
  Mail, Phone, MapPin, Clock, 
  Send, Landmark
} from 'lucide-react';
import PublicNavbar from '@/src/components/PublicNavbar';
import PublicFooter from '@/src/components/PublicFooter';

export default function Contact() {
  return (
    <div className="min-h-screen bg-black font-sans">
      <PublicNavbar />
      
      {/* Hero Section */}
      <section className="bg-black pt-48 pb-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-8xl font-display font-black text-white leading-tight mb-8"
          >
            We’re Here <br /> <span className="text-gold italic">To Help</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-zinc-500 text-lg md:text-xl max-w-2xl mx-auto font-medium"
          >
            Institutional support available 24/7. Connect with our experts for immediate financial assistance.
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-32 px-6 max-w-7xl mx-auto bg-black">
        <div className="grid lg:grid-cols-2 gap-24 items-start">
          {/* Left Side: Contact Details */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <div className="space-y-6">
               <h2 className="text-4xl font-display font-black text-white">Contact Details</h2>
               <p className="text-zinc-500 font-medium">Reach out via any channel. Our global node cluster ensures you’re always connected.</p>
            </div>

            <div className="space-y-8">
               {[
                 { icon: Mail, label: 'Email', value: 'support@evermontinternational.bank', sub: '24/7 Digital response' },
                 { icon: Phone, label: 'Phone', value: '+41 (0) 44 204 8888', sub: 'Priority voice channel' },
                 { icon: MapPin, label: 'Office', value: 'Bahnhofstrasse 45, 8001 Zurich', sub: 'Swiss operational hub' },
                 { icon: Clock, label: 'Support Hours', value: '24/7/365', sub: 'Absolute availability' }
               ].map((item, i) => (
                 <div key={i} className="flex gap-6 items-start group">
                   <div className="w-14 h-14 bg-zinc-950 border border-zinc-900 rounded-2xl flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-black transition-all duration-300 shrink-0">
                     <item.icon size={26} />
                   </div>
                   <div>
                     <p className="text-zinc-400 text-xs font-black uppercase tracking-widest mb-1">{item.label}</p>
                     <p className="text-xl font-display font-black text-white">{item.value}</p>
                     <p className="text-zinc-500 text-sm font-semibold">{item.sub}</p>
                   </div>
                 </div>
               ))}
            </div>
          </motion.div>

          {/* Right Side: Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-zinc-950 p-10 md:p-16 rounded-[3rem] shadow-[0_30px_60px_rgba(0,0,0,0.5)] border border-zinc-900"
          >
            <form className="space-y-8">
               <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Full Name</label>
                  <input 
                    type="text" 
                    placeholder="Alexander Sterling" 
                    className="w-full px-6 py-4 bg-black border border-zinc-900 rounded-xl outline-none focus:border-gold transition-all text-sm font-bold text-white placeholder:text-zinc-800"
                  />
               </div>
               <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Email Address</label>
                  <input 
                    type="email" 
                    placeholder="sterling@protocol.net" 
                    className="w-full px-6 py-4 bg-black border border-zinc-900 rounded-xl outline-none focus:border-gold transition-all text-sm font-bold text-white placeholder:text-zinc-800"
                  />
               </div>
               <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Subject</label>
                  <input 
                    type="text" 
                    placeholder="Vault Provisioning Query" 
                    className="w-full px-6 py-4 bg-black border border-zinc-900 rounded-xl outline-none focus:border-gold transition-all text-sm font-bold text-white placeholder:text-zinc-800"
                  />
               </div>
               <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Message</label>
                  <textarea 
                    rows={4}
                    placeholder="Enter your inquiry protocol..." 
                    className="w-full px-6 py-4 bg-black border border-zinc-900 rounded-xl outline-none focus:border-gold transition-all text-sm font-bold resize-none text-white placeholder:text-zinc-800"
                  />
               </div>
               <button className="sleek-button-gold w-full py-5 text-lg shadow-xl shadow-gold/20">
                  Send Message <Send size={20} className="ml-2" />
               </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto h-[400px] overflow-hidden bg-black">
         <div className="w-full h-full bg-zinc-950 rounded-[3rem] animate-pulse flex items-center justify-center text-zinc-600 font-bold border border-zinc-900 italic">
            [ Interactive Global Node Map - Loading Infrastructure ]
         </div>
      </section>

      <PublicFooter />
    </div>
  );
}
