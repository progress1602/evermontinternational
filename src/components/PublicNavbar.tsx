import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Landmark, Lock } from 'lucide-react';

export default function PublicNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'HOME', path: '/' },
    { name: 'ABOUT US', path: '/about' },
    { name: 'SERVICES', path: '/features' },
    { name: 'ACCOUNTS', path: '/cards' },
    { name: 'LOANS', path: '/#loans' },
    { name: 'INVESTMENTS', path: '/#investments' },
    { name: 'CONTACT', path: '/contact' },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'py-3 bg-black/95 backdrop-blur-xl border-b border-white/5 shadow-2xl' : 'py-4 lg:py-5 bg-black/40 backdrop-blur-sm'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 flex items-center justify-between gap-3 lg:gap-4 xl:gap-8">
        <Link to="/" className="flex items-center gap-2.5 xl:gap-3 group shrink-0">
          <div className="bg-gold p-1.5 xl:p-2 rounded-xl shadow-[0_0_20px_rgba(212,175,55,0.45)] flex items-center justify-center transition-transform group-hover:scale-105 shrink-0">
             <Landmark className="w-4 h-4 xl:w-5 xl:h-5 text-black" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm sm:text-base lg:text-[13px] xl:text-[15px] 2xl:text-xl font-display font-black tracking-normal sm:tracking-wider lg:tracking-wider xl:tracking-widest text-[#FFF] leading-none uppercase whitespace-nowrap">
              EVERMONT <span className="text-gold">INTERNATIONAL BANK</span>
            </span>
            <span className="hidden sm:block text-[6px] xl:text-[7px] text-zinc-400 font-bold tracking-[0.18em] xl:tracking-[0.25em] uppercase mt-1 whitespace-nowrap">
              Strong Today. Stronger Tomorrow.
            </span>
          </div>
        </Link>

        {/* Desktop & Laptop Nav */}
        <div className="hidden lg:flex items-center gap-2 xl:gap-4 2xl:gap-7 text-[9px] xl:text-[10px] 2xl:text-[11px] font-black uppercase tracking-[0.08em] xl:tracking-[0.12em] 2xl:tracking-[0.15em] shrink-0">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`transition-colors duration-300 relative py-1.5 px-1 xl:px-1.5 whitespace-nowrap ${
                location.pathname === link.path ? 'text-gold' : 'text-zinc-300 hover:text-white'
              }`}
            >
              {link.name}
              {location.pathname === link.path && (
                <motion.div 
                  layoutId="activePublicNavLine"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold rounded-full" 
                />
              )}
            </Link>
          ))}
        </div>

        {/* Desktop & Laptop Actions */}
        <div className="hidden md:flex items-center shrink-0">
          <Link 
            to="/auth/login" 
            className="px-3.5 py-2 lg:px-4 lg:py-2.5 xl:px-6 xl:py-3 bg-gold hover:bg-white text-black font-black uppercase tracking-[0.1em] xl:tracking-[0.15em] text-[9px] xl:text-[10px] italic rounded-lg transition-all duration-300 shadow-lg shadow-gold/20 flex items-center gap-1.5 xl:gap-2 hover:scale-105 whitespace-nowrap"
          >
            <Lock size={12} className="stroke-[2.5]" />
            <span>ONLINE BANKING</span>
          </Link>
        </div>

        {/* Mobile & Tablet Toggle */}
        <button 
          className="lg:hidden text-white p-1.5 rounded-lg hover:bg-white/5 transition-colors focus:outline-none" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle Navigation Menu"
        >
          {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden absolute top-full left-0 w-full bg-black/95 backdrop-blur-2xl border-b border-white/10 p-8 space-y-8 shadow-2xl max-h-[85vh] overflow-y-auto"
          >
            <div className="flex flex-col gap-6 text-[10px] font-black uppercase tracking-widest text-center">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`py-1 transition-colors ${location.pathname === link.path ? 'text-gold' : 'text-zinc-300 hover:text-white'}`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <div className="flex flex-col gap-4 pt-2 border-t border-white/5">
              <Link 
                to="/auth/login" 
                onClick={() => setIsMenuOpen(false)} 
                className="w-full py-4 text-center bg-gold text-black rounded-lg font-black uppercase tracking-widest text-[10px] italic flex items-center justify-center gap-2 hover:bg-white transition-colors"
              >
                <Lock size={12} className="stroke-[2.5]" />
                <span>ONLINE BANKING</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
