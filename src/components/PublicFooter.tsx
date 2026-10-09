import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Landmark } from 'lucide-react';

export default function PublicFooter() {
  return (
    <footer className="py-24 bg-black text-white px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 mb-20">
           <div className="col-span-2">
              <Link to="/" className="flex items-center gap-3 mb-8 group">
                 <div className="bg-gold p-1.5 rounded-lg">
                    <Landmark className="w-8 h-8 text-black" strokeWidth={2.5} />
                 </div>
                 <span className="text-2xl font-display font-black tracking-tight text-white">Evermont International <span className="text-gold italic">Bank</span></span>
              </Link>
              <p className="text-zinc-500 text-[11px] leading-relaxed font-bold uppercase tracking-widest max-w-xs mb-8">
                Evermont International Bank is a modern digital bank built to give you secure, fast and reliable banking services.
              </p>
              <div className="flex gap-4">
                 {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                    <div key={i} className="w-8 h-8 bg-zinc-900/50 rounded-lg flex items-center justify-center text-zinc-500 hover:text-gold hover:bg-zinc-800 transition-all cursor-pointer">
                       <Icon size={16} />
                    </div>
                 ))}
              </div>
           </div>
           
           <div>
              <h5 className="text-[10px] font-black uppercase tracking-[0.2em] mb-8 text-white">Company</h5>
              <ul className="space-y-4 text-[10px] font-black uppercase tracking-widest text-zinc-600">
                 {['About Us', 'Careers', 'Blog', 'News'].map(item => (
                   <li key={item}><a href="#" className="hover:text-gold transition-colors">{item}</a></li>
                 ))}
              </ul>
           </div>
           
           <div>
              <h5 className="text-[10px] font-black uppercase tracking-[0.2em] mb-8 text-white">Banking</h5>
              <ul className="space-y-4 text-[10px] font-black uppercase tracking-widest text-zinc-600">
                 {['Personal', 'Business', 'Cards', 'Savings'].map(item => (
                   <li key={item}><a href="#" className="hover:text-gold transition-colors">{item}</a></li>
                 ))}
              </ul>
           </div>

           <div>
              <h5 className="text-[10px] font-black uppercase tracking-[0.2em] mb-8 text-white">Support</h5>
              <ul className="space-y-4 text-[10px] font-black uppercase tracking-widest text-zinc-600">
                 {['Help Center', 'Contact Us', 'FAQs', 'Live Chat'].map(item => (
                   <li key={item}><a href="#" className="hover:text-gold transition-colors">{item}</a></li>
                 ))}
              </ul>
           </div>

           <div>
              <h5 className="text-[10px] font-black uppercase tracking-[0.2em] mb-8 text-white">Legal</h5>
              <ul className="space-y-4 text-[10px] font-black uppercase tracking-widest text-zinc-600">
                 {['Privacy Policy', 'Terms of Service', 'Security', 'Compliance'].map(item => (
                   <li key={item}><a href="#" className="hover:text-gold transition-colors">{item}</a></li>
                 ))}
              </ul>
           </div>
        </div>
        
        <div className="text-center pt-8 border-t border-white/5">
           <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-700">© 2026 Evermont International Bank. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
