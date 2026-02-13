import { MoveUpRight } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';
import MobileNavbar from './MobileNavbar';

const Header = () => {
  return (
    <section className='m-0 p-0 box-border bg-black/80 backdrop-blur-lg md:flex items-center justify-between px-6 py-3 sticky top-0 z-100 border-b border-white/5 hidden'>
      
      {/* Logo Section */}
      <Link to="/" className='flex items-center gap-2 group cursor-pointer'>
        <div className='relative'>
           <img src="/img/kyrologo.png" alt="kyro logo" className='w-10 h-10 object-contain relative z-10'/>
           <div className='absolute inset-0 bg-orange-500/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity'></div>
        </div>
        <p className='text-2xl font-black text-white italic tracking-tighter uppercase'>Kyro</p>
      </Link>

      {/* Desktop Navigation */}
      <nav className='items-center gap-8 font-bold text-[10px] uppercase tracking-[0.2em] text-gray-400 hidden md:flex'>
        <Link to="/aboutpage" className='hover:text-orange-500 transition-colors cursor-pointer'>About</Link>
        <Link to="/features" className='hover:text-orange-500 transition-colors cursor-pointer'>Features</Link>
        <Link to="/testimonials" className='hover:text-orange-500 transition-colors cursor-pointer'>Testimonials</Link>
        <Link to="/membership" className='hover:text-orange-500 transition-colors cursor-pointer'>Membership</Link>
      </nav>

      {/* Mobile Navbar Logic (Hamburger appears via this component) */}
      {/* <MobileNavbar /> */}

      {/* Action Button (Desktop Only) */}
      <div className='hidden md:block'>
        <Link to="/signup">
          <button className='group flex items-center gap-2 font-bold text-white text-[10px] uppercase tracking-widest hover:border-black hover:border-b duration-300 cursor-pointer italic'>
            Get Started
            <span className='group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform'>
              <MoveUpRight size={14} strokeWidth={3}/>
            </span>
          </button>
        </Link>
      </div>
    </section>
  )
}

export default Header;