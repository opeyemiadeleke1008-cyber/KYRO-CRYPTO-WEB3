import React, { useState, useMemo } from "react";
import { 
  Search, ArrowUpRight, ArrowDownRight, Filter, Globe, 
  Zap, Activity, X, Wallet, ChevronRight 
} from "lucide-react";
import Aside from "../layout/Aside";
import UserNavbar from "../components/UserNavbar";

const UserMarket = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // State for Filtering
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  // --- NEW: STATE FOR TRADE PANEL ---
  const [selectedAsset, setSelectedAsset] = useState(null);

  const marketData = useMemo(() => [
    { name: "Bitcoin", symbol: "BTC", price: 64321.00, change: "+2.4%", status: "pos", cap: "$1.2T", category: "Layer 1" },
    { name: "Ethereum", symbol: "ETH", price: 3412.50, change: "-0.8%", status: "neg", cap: "$410.2B", category: "Layer 1" },
    { name: "Solana", symbol: "SOL", price: 145.22, change: "+14.2%", status: "pos", cap: "$64.5B", category: "Layer 1" },
    { name: "Uniswap", symbol: "UNI", price: 7.45, change: "+3.1%", status: "pos", cap: "$4.8B", category: "DeFi" },
    { name: "Aave", symbol: "AAVE", price: 88.12, change: "-1.3%", status: "neg", cap: "$1.2B", category: "DeFi" },
    { name: "Chainlink", symbol: "LINK", price: 18.45, change: "+5.1%", status: "pos", cap: "$10.8B", category: "DeFi" },
    { name: "Arbitrum", symbol: "ARB", price: 1.12, change: "-2.3%", status: "neg", cap: "$2.8B", category: "Layer 2" },
  ], []);

  const filteredAssets = useMemo(() => {
    return marketData.filter((asset) => {
      const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            asset.symbol.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === "All" || asset.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [marketData, searchQuery, activeCategory]);

  return (
    <div className="flex h-screen bg-black text-white font-sans overflow-hidden relative">
      <UserNavbar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
      <Aside isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

      <main className="flex-1 overflow-y-auto bg-black p-4 md:p-8 scrollbar-hidden">
        
        {/* Ticker remains same */}
        <div className="mb-6 overflow-hidden bg-orange-500/5 border-y border-orange-500/10 py-2">
          <div className="flex whitespace-nowrap animate-marquee items-center gap-8">
            {marketData.map((coin) => (
              <TickerItem key={coin.symbol} symbol={coin.symbol} price={coin.price.toLocaleString()} change={coin.change} />
            ))}
          </div>
        </div>

        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight uppercase italic text-orange-500">Market Trends</h2>
            <p className="text-gray-500 text-[10px] uppercase tracking-widest mt-1 flex items-center gap-2">
              <Activity size={10} className="text-orange-500 animate-pulse" />
              Live Orderbook Active
            </p>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Pair..."
                className="w-full bg-[#0B0E14] border border-white/10 rounded-xl py-2 pl-10 pr-4 text-[10px] outline-none focus:border-orange-500/50 transition-all uppercase tracking-widest text-white"
              />
            </div>
          </div>
        </header>

        {/* Intelligence Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <InfoCard title="Fear & Greed" value="72" sub="Extreme Greed" color="text-teal-500" icon={<Zap size={16}/>} />
          <InfoCard title="Top Gainer" value="SOL" sub="+14.22%" color="text-teal-500" icon={<ArrowUpRight size={16}/>} />
          <InfoCard title="Volume 24h" value="$84.2B" sub="Institutional Flow" color="text-orange-500" icon={<Globe size={16}/>} />
          <InfoCard title="Market Status" value="BULL" sub="High Volatility" color="text-teal-500" icon={<Activity size={16}/>} />
        </div>

        {/* Table Section */}
        <div className="bg-[#0B0E14] border border-white/5 rounded-4xl p-6 mb-10 overflow-hidden shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold uppercase tracking-widest">Live Assets Stream</h3>
            <div className="flex gap-2 p-1 bg-black/40 rounded-xl border border-white/5">
              {["All", "DeFi", "Layer 1"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 text-[10px] font-bold rounded-lg uppercase transition-all cursor-pointer ${
                    activeCategory === cat ? "bg-orange-500 text-black" : "text-gray-500 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-separate border-spacing-y-2">
              <thead>
                <tr className="text-gray-500 uppercase text-[10px] tracking-widest">
                  <th className="pb-4 pl-4">Asset</th>
                  <th className="pb-4">Price</th>
                  <th className="pb-4">24h Change</th>
                  <th className="pb-4">Market Cap</th>
                  <th className="pb-4 text-right pr-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssets.map((asset) => (
                  <MarketRow 
                    key={asset.symbol} 
                    {...asset} 
                    price={`$${asset.price.toLocaleString()}`}
                    onTrade={() => setSelectedAsset(asset)} // PASSING TRIGGER
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* --- QUICK TRADE DRAWER --- */}
      {selectedAsset && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-60"
            onClick={() => setSelectedAsset(null)}
          />
          {/* Drawer */}
          <div className="fixed top-0 right-0 h-full w-full max-w-md bg-[#0B0E14] border-l border-white/10 z-70 p-8 shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500 font-black italic">
                  {selectedAsset.symbol[0]}
                </div>
                <div>
                  <h3 className="font-black text-xl italic uppercase tracking-tighter">{selectedAsset.name}</h3>
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-[0.2em]">{selectedAsset.symbol} / USD</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedAsset(null)}
                className="p-2 hover:bg-white/5 rounded-full transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Stats Card */}
              <div className="bg-black/40 rounded-3xl p-5 border border-white/5">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Current Price</p>
                    <p className="text-3xl font-mono font-bold">${selectedAsset.price.toLocaleString()}</p>
                  </div>
                  <div className={`text-xs font-bold font-mono px-2 py-1 rounded-lg ${selectedAsset.status === 'pos' ? 'bg-teal-500/10 text-teal-500' : 'bg-red-500/10 text-red-500'}`}>
                    {selectedAsset.change}
                  </div>
                </div>
              </div>

              {/* Trade Inputs */}
              <div className="space-y-4">
                <div className="bg-black/40 rounded-2xl p-4 border border-white/5">
                  <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase mb-2">
                    <span>Order Type</span>
                    <span className="text-orange-500">Market</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold italic">Amount</span>
                    <input 
                      type="number" 
                      placeholder="0.00" 
                      className="bg-transparent text-right font-mono text-xl outline-none w-1/2"
                    />
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <button className="flex-1 py-4 bg-teal-500 hover:bg-teal-400 text-black font-black uppercase italic rounded-2xl transition-all shadow-lg shadow-teal-500/10 cursor-pointer">
                    Buy {selectedAsset.symbol}
                  </button>
                  <button className="flex-1 py-4 bg-red-500 hover:bg-red-400 text-white font-black uppercase italic rounded-2xl transition-all shadow-lg shadow-red-500/10 cursor-pointer">
                    Sell {selectedAsset.symbol}
                  </button>
                </div>
              </div>

              {/* Balance Section */}
              <div className="pt-6 border-t border-white/5">
                <div className="flex justify-between items-center text-[10px] font-bold text-gray-500 uppercase">
                  <span className="flex items-center gap-2"><Wallet size={12} /> Available Balance</span>
                  <span className="text-white">$0</span>
                </div>
              </div>
            </div>

            <div className="absolute bottom-8 left-8 right-8 text-center">
               <p className="text-[9px] text-gray-600 uppercase tracking-widest leading-loose">
                 Terminal Execution Protocol V2.1 // Secure Node Connected
               </p>
            </div>
          </div>
        </>
      )}

      {/* Style for animation */}
      <style>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { display: flex; animation: marquee 30s linear infinite; width: max-content; }
        .animate-marquee:hover { animation-play-state: paused; }
      `}</style>
    </div>
  );
};

/* --- UPDATED MARKET ROW --- */
const MarketRow = ({ name, symbol, price, change, status, cap, onTrade }) => (
  <tr className="group bg-white/2 hover:bg-white/5 transition-all">
    <td className="py-4 pl-4 rounded-l-2xl border-y border-l border-white/5">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center font-bold text-orange-500 text-[10px]">
          {symbol[0]}
        </div>
        <div>
          <p className="font-bold">{name}</p>
          <p className="text-[10px] text-gray-500 uppercase">{symbol}</p>
        </div>
      </div>
    </td>
    <td className="py-4 border-y border-white/5 font-mono text-[11px]">{price}</td>
    <td className={`py-4 border-y border-white/5 font-mono text-[11px] ${status === 'pos' ? 'text-teal-500' : 'text-red-500'}`}>
      <div className="flex items-center gap-1">
        {status === 'pos' ? <ArrowUpRight size={12}/> : <ArrowDownRight size={12}/>}
        {change}
      </div>
    </td>
    <td className="py-4 border-y border-white/5 text-gray-400 font-mono text-[11px]">{cap}</td>
    <td className="py-4 pr-4 text-right rounded-r-2xl border-y border-r border-white/5">
      {/* TRIGGERING THE ONTRADE PROP */}
      <button 
        onClick={onTrade}
        className="px-4 py-1.5 bg-white/5 hover:bg-orange-500 hover:text-black transition-all rounded-lg text-[10px] font-black uppercase italic cursor-pointer group-hover:scale-105"
      >
        Trade
      </button>
    </td>
  </tr>
);

/* ... InfoCard and TickerItem remain the same ... */
const TickerItem = ({ symbol, price, change }) => (
  <div className="flex items-center gap-2 px-4 border-r border-white/5">
    <span className="font-bold text-[10px] italic">{symbol}</span>
    <span className="font-mono text-[10px]">${price}</span>
    <span className={`text-[9px] font-bold ${change.startsWith('+') ? 'text-teal-500' : 'text-red-500'}`}>{change}</span>
  </div>
);

const InfoCard = ({ title, value, sub, color, icon }) => (
  <div className="bg-[#0B0E14] border border-white/5 p-5 rounded-3xl hover:border-white/10 transition-colors">
    <div className="flex justify-between items-center mb-2">
      <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">{title}</p>
      <div className={`${color}`}>{icon}</div>
    </div>
    <h3 className="text-2xl font-black italic">{value}</h3>
    <p className={`text-[9px] uppercase font-bold ${color} mt-1 tracking-tighter`}>{sub}</p>
  </div>
);

export default UserMarket;