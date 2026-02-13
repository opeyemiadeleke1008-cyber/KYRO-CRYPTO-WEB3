import React from 'react'
import { Menu, X } from 'lucide-react'

const UserNavbar = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className='bg-[#0B0E14] border-b border-white/5 flex items-center justify-end px-4 py-3 md:hidden fixed top-0 right-0 left-0 z-50'>
      <div className="flex items-center gap-3">
        <button
          onClick={toggleMobileMenu}
          className="p-2 rounded-lg bg-white/5 hover:bg-orange-500 hover:text-black transition-all text-gray-400"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <div className="flex items-center gap-2">
          <img src="/img/kyrologo.png" alt="Kyro" className="w-6 h-6 object-contain" />
          <span className="font-black italic tracking-tighter text-lg text-white">KYRO</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full border border-white/10 overflow-hidden bg-black flex items-center justify-center">
          <span className="text-gray-400 text-xs font-bold">U</span>
        </div>
      </div>
    </div>
  )
}

export default UserNavbar