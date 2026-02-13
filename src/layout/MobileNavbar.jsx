import React, { useState } from "react";
import { Menu, X, ChevronRight, LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";

const MobileNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "About", path: "/aboutpage" },
    { name: "Features", path: "/features" },
    { name: "Testimonials", path: "/testimonials" },
    { name: "Membership", path: "/membership" },
  ];

  return (
    <nav className="fixed top-0 w-full z-100 bg-black/80 backdrop-blur-md border-b border-white/5 px-6 py-4 md:hidden">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="r">
            <img src="/public/img/kyrologo.png" alt="kyro logo" className='w-12.5 h-12.5 object-contain' />
          </div>
          <span className="text-white font-bold tracking-tighter text-xl italic">KYRO</span>
        </Link>

        {/* Hamburger Icon */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="text-white p-2 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Slide-out Menu Overlay */}
      <div 
        className={`fixed inset-0 top-[65px] bg-black/95 backdrop-blur-xl transition-all duration-300 ease-in-out ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div className="flex flex-col p-8 space-y-6 bg-black/90">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-orange-500 mb-4">Navigation Terminal</p>
          
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className="flex justify-between items-center text-2xl font-bold text-white group hover:text-orange-500 transition-colors"
            >
              {link.name}
              <ChevronRight className="text-orange-500 opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0" />
            </Link>
          ))}

          <div className="pt-10 mt-10 border-t border-white/10 space-y-4">
             <Link 
              to="/signup" 
              onClick={() => setIsOpen(false)}
              className="block w-full text-center bg-orange-500 text-black py-4 rounded-xl font-bold uppercase tracking-widest text-xs"
             >
              Get Started
             </Link>
             <Link 
              to="/signup" 
              onClick={() => setIsOpen(false)}
              className="block w-full text-center border border-white/10 text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs"
             >
              Login
             </Link>
          </div>

          <div className="absolute bottom-10 left-8 text-gray-600 text-[10px] font-mono tracking-widest">
            KYRO PROTOCOL v2.0.26
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MobileNavbar;