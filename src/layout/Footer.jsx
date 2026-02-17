import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Send, MoveUpRight } from 'lucide-react'; // Added MoveUpRight

const Footer = () => {
  return (
    <footer className="bg-black text-white pt-20 pb-10 border-t border-white/10 font-sans">
      <div className="w-[90%] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        
        {/* Brand Column */}
        <div className="space-y-6">
          <div className="flex items-center">
            <img src="/img/kyrologo.png" alt="kyro logo" className="w-10 h-10 object-contain"/>
            <p className="text-2xl font-bold ml-2 tracking-tight">Kyro</p>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
            Leading the evolution of decentralized finance. Trade, mine, and grow your digital wealth on the world's most secure platform.
          </p>
          <div className="flex gap-4">
            {[Twitter, Linkedin, Facebook, Send].map((Icon, index) => (
              <Icon 
                key={index} 
                size={20} 
                className="text-gray-400 hover:text-orange-500 cursor-pointer transition-all duration-300 transform hover:-translate-y-1" 
              />
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-bold mb-6 text-lg">Platform</h4>
          <ul className="space-y-4 text-gray-400 text-sm">
            {["Spot Trading", "Cloud Mining", "Kyro Card", "Institutional"].map((item) => (
              <li key={item} className="hover:text-orange-500 cursor-pointer transition-colors duration-200">
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="font-bold mb-6 text-lg">Support</h4>
          <ul className="space-y-4 text-gray-400 text-sm">
            {["Help Center", "API Documentation", "Fees & Limits", "Security Center"].map((item) => (
              <li key={item} className="hover:text-orange-500 cursor-pointer transition-colors duration-200">
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="font-bold mb-6 text-lg">Stay Updated</h4>
          <p className="text-gray-400 text-sm mb-4">Subscribe to our terminal for market insights.</p>
          <div className="relative group">
            <input 
              type="email" 
              placeholder="Email address" 
              className="w-full bg-white/5 border border-white/10 rounded-full px-5 py-3 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-sm"
            />
            <button className="absolute right-2 top-1.5 bg-orange-500 text-black p-2 rounded-full hover:bg-orange-600 transition-transform active:scale-95 cursor-pointer">
              <MoveUpRight size={16} strokeWidth={3} />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="w-[90%] mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] md:text-xs text-gray-500 uppercase tracking-widest">
        <p>© 2026 Kyro Global Ltd. All rights reserved.</p>
        <div className="flex gap-6 md:gap-8">
          <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link to="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
          <Link to="/admin-dashboard" className="hover:text-white transition-colors">Cookie Policy</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;