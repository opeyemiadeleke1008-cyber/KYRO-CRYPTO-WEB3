import React, { useState } from "react";
import { 
  ArrowDown, Settings2, Info, RefreshCw, 
  ChevronDown, AlertCircle, Search, X, Check 
} from "lucide-react";
import Aside from "../layout/Aside";
import UserNavbar from "../components/UserNavbar";

const UserSwap = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- SWAP STATE ---
  const [sellToken, setSellToken] = useState({ symbol: "ETH", name: "Ethereum", color: "orange-500", balance: "1.24" });
  const [buyToken, setBuyToken] = useState({ symbol: "SOL", name: "Solana", color: "teal-500", balance: "0.00" });
  const [sellAmount, setSellAmount] = useState("");
  const [slippage, setSlippage] = useState("0.5");

  // --- MODAL STATE ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSide, setActiveSide] = useState("sell"); // 'sell' or 'buy'
  const [searchQuery, setSearchQuery] = useState("");

  const tokens = [
    { symbol: "BTC", name: "Bitcoin", color: "orange-600", balance: "0.02" },
    { symbol: "ETH", name: "Ethereum", color: "orange-500", balance: "1.24" },
    { symbol: "SOL", name: "Solana", color: "teal-500", balance: "45.0" },
    { symbol: "USDT", name: "Tether", color: "green-500", balance: "1,200" },
    { symbol: "LINK", name: "Chainlink", color: "blue-500", balance: "12.5" },
  ];

  const handleSelectToken = (token) => {
    if (activeSide === "sell") setSellToken(token);
    else setBuyToken(token);
    setIsModalOpen(false);
    setSearchQuery("");
  };

  const openModal = (side) => {
    setActiveSide(side);
    setIsModalOpen(true);
  };

  return (
    <div className="flex h-screen bg-black text-white font-sans overflow-hidden">
      <UserNavbar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
      <Aside isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

      <main className="flex-1 overflow-y-auto bg-black p-4 md:p-8 flex flex-col items-center">
        <header className="w-full max-w-lg mb-8">
          <h2 className="text-2xl font-bold tracking-tight uppercase italic text-orange-500 text-center text-glow">Protocol Swap</h2>
          <p className="text-gray-500 text-[10px] uppercase tracking-widest mt-1 text-center">Execute cross-chain transfers</p>
        </header>

        <div className="w-full max-w-lg">
          <div className="bg-[#0B0E14] border border-white/5 rounded-[2.5rem] p-6 shadow-2xl relative">
            
            {/* Sell Box */}
            <div className="bg-black/40 border border-white/5 rounded-3xl p-5 mb-2 transition-all">
              <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase mb-3">
                <span>You Sell</span>
                <span>Balance: {sellToken.balance}</span>
              </div>
              <div className="flex items-center gap-4">
                <input type="number" value={sellAmount} onChange={(e) => setSellAmount(e.target.value)} placeholder="0.0" className="bg-transparent text-3xl font-bold outline-none w-full" />
                <button onClick={() => openModal('sell')} className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-3 py-2 rounded-xl border border-white/5 cursor-pointer">
                  <div className={`w-6 h-6 rounded-full bg-${sellToken.color}/20 flex items-center justify-center text-${sellToken.color} font-bold text-[10px]`}>{sellToken.symbol[0]}</div>
                  <span className="font-bold text-sm italic">{sellToken.symbol}</span>
                  <ChevronDown size={14} className="text-gray-500" />
                </button>
              </div>
            </div>

            {/* Middle Switcher */}
            <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <button className="bg-[#0B0E14] border-4 border-black text-orange-500 p-3 rounded-2xl cursor-pointer hover:rotate-180 transition-transform duration-500">
                <ArrowDown size={20} strokeWidth={3} />
              </button>
            </div>

            {/* Buy Box */}
            <div className="bg-black/40 border border-white/5 rounded-3xl p-5 mt-2 transition-all">
              <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase mb-3">
                <span>You Buy</span>
                <span>Balance: {buyToken.balance}</span>
              </div>
              <div className="flex items-center gap-4">
                <input type="number" readOnly placeholder="0.0" className="bg-transparent text-3xl font-bold outline-none w-full text-gray-600" />
                <button onClick={() => openModal('buy')} className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-3 py-2 rounded-xl border border-white/5 cursor-pointer">
                  <div className={`w-6 h-6 rounded-full bg-${buyToken.color}/20 flex items-center justify-center text-${buyToken.color} font-bold text-[10px]`}>{buyToken.symbol[0]}</div>
                  <span className="font-bold text-sm italic">{buyToken.symbol}</span>
                  <ChevronDown size={14} className="text-gray-500" />
                </button>
              </div>
            </div>

            <button className="w-full mt-8 py-4 bg-orange-500 hover:bg-white text-black font-black uppercase italic rounded-2xl transition-all shadow-lg flex items-center justify-center gap-3 group cursor-pointer">
              Confirm Transaction
              <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
            </button>
          </div>
        </div>
      </main>

      {/* --- TOKEN SELECTOR MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          
          <div className="relative w-full max-w-md bg-[#0B0E14] border border-white/10 rounded-4xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h3 className="font-bold uppercase tracking-[0.2em] italic text-orange-500">Select Token</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white cursor-pointer"><X size={20} /></button>
            </div>

            {/* Search */}
            <div className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
                <input 
                  autoFocus
                  type="text" 
                  placeholder="Search name or symbol..." 
                  className="w-full bg-black/50 border border-white/5 rounded-2xl py-3 pl-10 pr-4 text-xs uppercase tracking-widest outline-none focus:border-orange-500/50 transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Token List */}
            <div className="max-h-[350px] overflow-y-auto p-2 space-y-1">
              {tokens
                .filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.symbol.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((token) => {
                  const isSelected = activeSide === 'sell' ? sellToken.symbol === token.symbol : buyToken.symbol === token.symbol;
                  return (
                    <button 
                      key={token.symbol}
                      onClick={() => handleSelectToken(token)}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all cursor-pointer group ${isSelected ? 'bg-orange-500/10' : 'hover:bg-white/5'}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full bg-${token.color}/20 flex items-center justify-center text-${token.color} font-black italic`}>
                          {token.symbol[0]}
                        </div>
                        <div className="text-left">
                          <p className="font-bold uppercase text-sm">{token.name}</p>
                          <p className="text-[10px] text-gray-500 font-mono">{token.symbol}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-mono">{token.balance}</p>
                        {isSelected && <Check size={14} className="text-orange-500 ml-auto mt-1" />}
                      </div>
                    </button>
                  );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSwap;