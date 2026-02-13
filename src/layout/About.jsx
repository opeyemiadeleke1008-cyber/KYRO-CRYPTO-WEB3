import React from "react";
import { Globe, Users, Coins, Zap, Shield, BarChart3, TrendingUp, Sparkles, Flame } from "lucide-react";

const About = () => {
  return (
    <section className="box-border bg-black py-20">
      {/* Stats Section */}
      <div className="text-white grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 bg-linear-to-tl from-black to-[#15393b]/40 p-6 w-[90%] mx-auto rounded-3xl border border-white/10 my-6 gap-8 shadow-2xl shadow-orange-500/5">
        <div className="lg:border-r border-white/10 md:pb-0 pb-4 pr-5 group">
          <Globe className="text-orange-500 mb-2 opacity-70 group-hover:opacity-100 transition-opacity" size={20} />
          <h2 className="font-bold text-3xl tracking-tighter italic">200 +</h2>
          <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400">Countries covered</p>
        </div>
        <div className="lg:border-r border-white/10 md:pb-0 pb-4 pr-5 group">
          <Users className="text-orange-500 mb-2 opacity-70 group-hover:opacity-100 transition-opacity" size={20} />
          <h2 className="font-bold text-3xl tracking-tighter italic">30 Million</h2>
          <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400">Global investors</p>
        </div>
        <div className="lg:border-r border-white/10 md:pb-0 pb-4 pr-5 group">
          <Coins className="text-orange-500 mb-2 opacity-70 group-hover:opacity-100 transition-opacity" size={20} />
          <h2 className="font-bold text-3xl tracking-tighter italic">700 +</h2>
          <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400">Coins listed</p> 
        </div>
        <div className="group">
          <BarChart3 className="text-orange-500 mb-2 opacity-70 group-hover:opacity-100 transition-opacity" size={20} />
          <h2 className="font-bold text-3xl tracking-tighter italic">$1.32 Billion</h2>
          <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400">24h Trading volume</p>
        </div>
      </div>
      
      {/* Effortless Cloud Mining */}
      <div className="my-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
            <h2 className="font-bold text-4xl md:text-5xl mb-4 italic text-white tracking-tighter">
                Effortless <span className="text-orange-500">Cloud Mining</span>
            </h2>
            <p className="text-sm md:w-[60%] w-full mx-auto text-gray-400 leading-relaxed uppercase tracking-widest">
                Start mining cryptocurrencies instantly without expensive hardware, electricity costs, or technical expertise.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          <div className="bg-[#0B0E14] border border-white/10 p-8 rounded-3xl hover:border-orange-500/50 transition-all group">
            <Zap className="text-orange-500 mb-6 group-hover:scale-110 transition-transform" size={32} />
            <h3 className="font-bold text-xl text-white mb-3">Cloud Mining</h3>
            <p className="text-sm text-gray-400 leading-relaxed">Mine Bitcoin and Ethereum without hardware hassles or noisy setups.</p>
          </div>
          <div className="bg-[#0B0E14] border border-white/10 p-8 rounded-3xl hover:border-orange-500/50 transition-all group">
            <Sparkles className="text-orange-500 mb-6 group-hover:scale-110 transition-transform" size={32} />
            <h3 className="font-bold text-xl text-white mb-3">Daily Payouts</h3>
            <p className="text-sm text-gray-400 leading-relaxed">Receive rewards daily. Track your growth in real-time on your Kyro dashboard.</p>
          </div>
          <div className="bg-[#0B0E14] border border-white/10 p-8 rounded-3xl hover:border-orange-500/50 transition-all group">
            <Shield className="text-orange-500 mb-6 group-hover:scale-110 transition-transform" size={32} />
            <h3 className="font-bold text-xl text-white mb-3">Flexible Plans</h3>
            <p className="text-sm text-gray-400 leading-relaxed">Choose from various hash-power options tailored to your investment goals.</p>
          </div>
        </div>
      </div>

      {/* Crypto Market Today */}
      <div className="text-white mt-12 px-6 max-w-7xl mx-auto">
        <h2 className="font-bold text-4xl mb-12 text-center italic tracking-tighter">Market <span className="text-orange-500">Snapshot</span></h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Hot List */}
          <div className="bg-[#0B0E14] border border-white/5 rounded-3xl p-6 group hover:bg-white/[0.02] transition-colors">
            <div className="flex items-center gap-2 mb-6">
                <Flame size={16} className="text-orange-500 animate-pulse" />
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Hot List</p>
            </div>
            <div className="space-y-4">
                {[["BTC", "$43,256.78"], ["ETH", "$2,845.32"], ["BNB", "$325.67"]].map(([coin, price]) => (
                    <div className="flex justify-between items-center p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10 cursor-default">
                        <span className="font-bold text-sm tracking-widest">{coin}</span>
                        <span className="font-mono text-sm text-orange-500">{price}</span>
                    </div>
                ))}
            </div>
          </div>

          {/* New Coin */}
          <div className="bg-[#0B0E14] border border-white/5 rounded-3xl p-6 group hover:bg-white/[0.02] transition-colors">
            <div className="flex items-center gap-2 mb-6">
                <Sparkles size={16} className="text-orange-500" />
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">New Listings</p>
            </div>
            <div className="space-y-4">
                {[["RBTC", "0.0000"], ["SOC", "0.0000"], ["LOGX", "0.0000"]].map(([coin, price]) => (
                    <div className="flex justify-between items-center p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10 cursor-default">
                        <span className="font-bold text-sm tracking-widest">{coin}</span>
                        <span className="font-mono text-sm text-orange-500">${price}</span>
                    </div>
                ))}
            </div>
          </div>

          {/* Top Gainers */}
          <div className="bg-[#0B0E14] border border-white/5 rounded-3xl p-6 group hover:bg-white/[0.02] transition-colors">
            <div className="flex items-center gap-2 mb-6">
                <TrendingUp size={16} className="text-green-500" />
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Top Gainers</p>
            </div>
            <div className="space-y-4">
                {[["BCH", "+12.4%"], ["MINA", "+8.2%"], ["ZEC", "+5.1%"]].map(([coin, gain]) => (
                    <div className="flex justify-between items-center p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10 cursor-default">
                        <span className="font-bold text-sm tracking-widest">{coin}</span>
                        <span className="font-mono text-sm text-green-500">{gain}</span>
                    </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;