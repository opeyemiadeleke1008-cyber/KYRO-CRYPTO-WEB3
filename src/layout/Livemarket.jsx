import React, { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";

const Livemarket = () => {
  // Mock data that "updates" via useEffect
  const [prices, setPrices] = useState([
    { id: "BTC", name: "Bitcoin", price: 64230.50, change: +2.4, vol: "24.1B" },
    { id: "ETH", name: "Ethereum", price: 3450.12, change: -1.2, vol: "12.5B" },
    { id: "SOL", name: "Solana", price: 145.88, change: +5.7, vol: "4.2B" },
    { id: "BNB", name: "Binance", price: 580.45, change: +0.8, vol: "1.8B" },
  ]);

  // Simulate price flickers
  useEffect(() => {
    const interval = setInterval(() => {
      setPrices(current => current.map(coin => ({
        ...coin,
        price: coin.price + (Math.random() - 0.5) * 10
      })));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-black py-20 px-6 md:px-10">
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 text-orange-500 mb-2">
              <Activity size={16} className="animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Live Feed</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold italic text-white">Market <span className="text-orange-500">Pulse</span></h2>
          </div>
          <p className="text-gray-500 text-sm max-w-xs">
            Real-time execution prices across 200+ liquidity sources globally.
          </p>
        </div>

        {/* Market Table */}
        <div className="overflow-x-auto border border-white/10 rounded-3xl bg-[#0B0E14]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-[10px] uppercase tracking-widest text-gray-500">
                <th className="px-8 py-6 font-bold">Asset</th>
                <th className="px-8 py-6 font-bold">Price (USD)</th>
                <th className="px-8 py-6 font-bold">24h Change</th>
                <th className="px-8 py-6 font-bold">Volume</th>
                <th className="px-8 py-6 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-white">
              {prices.map((coin) => (
                <tr key={coin.id} className="border-b border-white/5 hover:bg-white/2 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 font-bold text-xs">
                        {coin.id[0]}
                      </div>
                      <div>
                        <div className="font-bold text-sm">{coin.name}</div>
                        <div className="text-[10px] text-gray-500">{coin.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 font-mono text-sm tabular-nums">
                    ${coin.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className={`px-8 py-6 text-sm font-bold ${coin.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                    <div className="flex items-center gap-1">
                      {coin.change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                      {coin.change > 0 ? `+${coin.change}` : coin.change}%
                    </div>
                  </td>
                  <td className="px-8 py-6 text-gray-400 text-sm font-mono">
                    {coin.vol}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="bg-white/5 hover:bg-orange-500 hover:text-black border border-white/10 hover:border-orange-500 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer">
                      Trade
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Ticker Tape Bottom */}
        <div className="mt-8 overflow-hidden whitespace-nowrap border-y border-white/5 py-4 relative animate-marquee">
          <div className="flex gap-8 items-center whitespace-nowrap">
             {[...prices, ...prices].map((coin, i) => (
               <div key={i} className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-tighter">
                 <span className="text-gray-500">{coin.id}/USDT</span>
                 <span className="text-white">${coin.price.toFixed(2)}</span>
                 <span className={coin.change >= 0 ? "text-green-500" : "text-red-500"}>
                   {coin.change >= 0 ? "▲" : "▼"} {Math.abs(coin.change)}%
                 </span>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Livemarket;