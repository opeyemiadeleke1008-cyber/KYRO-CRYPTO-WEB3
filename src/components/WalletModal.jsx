import React from "react";
import { X, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const WalletModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const wallets = [
    { name: "MetaMask", icon: "🦊", status: "Detected" },
    { name: "Phantom", icon: "👻", status: "Detected" },
    { name: "WalletConnect", icon: "🌐", status: "" },
    { name: "Coinbase Wallet", icon: "🔵", status: "" },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
        onClick={onClose} 
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-[380px] bg-[#0B0E14] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <h3 className="font-bold uppercase tracking-[0.1em] text-white">Connect Wallet</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-2">
          {wallets.map((wallet) => (
            <button
              key={wallet.name}
              className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-orange-500/50 transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{wallet.icon}</span>
                <span className="font-bold text-sm text-gray-200 group-hover:text-white">{wallet.name}</span>
              </div>
              {wallet.status && (
                <span className="text-[10px] bg-orange-500/10 text-orange-500 px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter">
                  {wallet.status}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="p-6 bg-black/40 text-center">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest leading-relaxed">
            By connecting, you agree to the <br /> 
            <span className="text-orange-500 cursor-pointer hover:underline"><Link to="/terms-of-service">Terms of Service</Link></span> and <span className="text-orange-500 cursor-pointer hover:underline"><Link to="/privacy-policy">Privacy Policy</Link></span>
          </p>
          <div className="mt-4 flex justify-center items-center gap-1 text-[10px] text-gray-400 cursor-pointer hover:text-white transition-colors">
            <ExternalLink size={10} />
            <span>I don't have a wallet</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletModal;